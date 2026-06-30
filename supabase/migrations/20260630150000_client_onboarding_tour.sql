-- Add onboarding tour completion tracking column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_completed_tour BOOLEAN DEFAULT FALSE NOT NULL;
