-- Migration: Add linkedin_url to leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
