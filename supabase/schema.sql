-- ========================================================
-- CareerPilot AI — Complete Database Schema & Migrations
-- Single Source of Truth for Supabase Project: career-pilot
-- (https://lhrxkbvofbyudbrniehc.supabase.co)
--
-- How to apply:
-- 1. Open Supabase Dashboard: https://supabase.com/dashboard/project/lhrxkbvofbyudbrniehc
-- 2. Go to "SQL Editor" -> "New Query"
-- 3. Paste this entire file and click "Run"
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- 1. PROFILES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT NOT NULL,
  full_name            TEXT DEFAULT '',
  avatar_url           TEXT DEFAULT '',
  headline             TEXT DEFAULT '',
  bio                  TEXT DEFAULT '',
  location             TEXT DEFAULT '',
  phone                TEXT DEFAULT '',
  website              TEXT DEFAULT '',
  linkedin_url         TEXT DEFAULT '',
  github_url           TEXT DEFAULT '',
  current_role         TEXT DEFAULT '',
  target_role          TEXT DEFAULT '',
  experience_level     TEXT DEFAULT 'entry',
  industry             TEXT DEFAULT '',
  skills               TEXT[] DEFAULT '{}',
  education            JSONB DEFAULT '[]'::jsonb,
  career_goals         TEXT DEFAULT '',
  profile_completeness INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at           TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies for Profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-compute profile completeness (0-100)
CREATE OR REPLACE FUNCTION public.compute_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  IF COALESCE(NEW.full_name, '') <> '' THEN score := score + 10; END IF;
  IF COALESCE(NEW.headline, '') <> '' THEN score := score + 10; END IF;
  IF COALESCE(NEW.location, '') <> '' THEN score := score + 10; END IF;
  IF COALESCE(NEW.current_role, '') <> '' THEN score := score + 10; END IF;
  IF COALESCE(NEW.target_role, '') <> '' THEN score := score + 10; END IF;
  IF COALESCE(NEW.industry, '') <> '' THEN score := score + 10; END IF;
  IF COALESCE(NEW.bio, '') <> '' THEN score := score + 10; END IF;
  IF array_length(NEW.skills, 1) IS NOT NULL AND array_length(NEW.skills, 1) > 0 THEN score := score + 10; END IF;
  IF NEW.education IS NOT NULL AND jsonb_array_length(NEW.education) > 0 THEN score := score + 10; END IF;
  IF COALESCE(NEW.career_goals, '') <> '' THEN score := score + 10; END IF;

  NEW.profile_completeness := score;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_completeness ON public.profiles;
CREATE TRIGGER on_profile_completeness
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.compute_profile_completeness();

-- Auto-create profile trigger on new auth user signup (Email or OAuth like Google)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    avatar_url = CASE WHEN profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE profiles.avatar_url END,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- 2. ACTIVITIES TABLE
-- ========================================================
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

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_created ON public.activities(user_id, created_at DESC);

-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Users can view own activities') THEN
    CREATE POLICY "Users can view own activities" ON public.activities FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activities' AND policyname = 'Users can insert own activities') THEN
    CREATE POLICY "Users can insert own activities" ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Auto-cleanup function to retain max 100 activities per user
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

DROP TRIGGER IF EXISTS on_activity_cleanup ON public.activities;
CREATE TRIGGER on_activity_cleanup
  AFTER INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_activities();
