-- ============================================
-- CareerPilot AI — Phase 3: Enrich Profiles Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- Prerequisites: 20260708_create_profiles.sql must have been run first.
-- ============================================

-- 1. Add career-relevant columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS headline       TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS location       TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone          TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS website        TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin_url   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS github_url     TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS current_role   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS target_role    TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'entry',
  ADD COLUMN IF NOT EXISTS industry       TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS skills         TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS education      JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS career_goals   TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- 2. Create a function to compute profile completeness (0-100)
--    This runs as a trigger so the value is always up-to-date.
CREATE OR REPLACE FUNCTION public.compute_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
  total INTEGER := 10;  -- total fields we check
BEGIN
  -- Each field contributes 10 points (10 × 10 = 100)
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

-- 3. Attach the trigger (drop first if it already exists to be idempotent)
DROP TRIGGER IF EXISTS on_profile_completeness ON public.profiles;

CREATE TRIGGER on_profile_completeness
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.compute_profile_completeness();

-- 4. Backfill completeness for existing profiles
UPDATE public.profiles SET updated_at = now();
