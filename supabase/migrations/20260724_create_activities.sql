-- ============================================
-- CareerPilot AI — Phase 3: Activities Table Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- 1. Create the activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN (
    'profile_update',
    'login',
    'settings_change',
    'module_visit',
    'onboarding_complete',
    'password_change',
    'profile_setup'
  )),
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  metadata    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Index for efficient querying by user
CREATE INDEX IF NOT EXISTS idx_activities_user_id
  ON public.activities(user_id);

CREATE INDEX IF NOT EXISTS idx_activities_user_created
  ON public.activities(user_id, created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only access their own activities
CREATE POLICY "Users can view own activities"
  ON public.activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON public.activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Auto-cleanup: keep only the last 100 activities per user
--    (runs after each insert)
CREATE OR REPLACE FUNCTION public.cleanup_old_activities()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.activities
  WHERE id IN (
    SELECT id FROM public.activities
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    OFFSET 100
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_activity_cleanup
  AFTER INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_activities();
