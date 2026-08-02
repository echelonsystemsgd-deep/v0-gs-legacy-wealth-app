-- Migration: Add lead_type, source_url, and local_business_niche to public.leads table
-- Purpose: Distinguish between enterprise B2B leads and local business leads in Supabase & n8n pipeline

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_type TEXT DEFAULT 'enterprise' NOT NULL,
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS local_business_niche TEXT;

-- Performance index for filtering leads by audience type in admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads(lead_type);
