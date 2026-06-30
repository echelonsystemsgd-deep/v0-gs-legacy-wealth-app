-- Migration: Add audit lead fields to leads table for n8n intercept flow
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS source_page TEXT;
