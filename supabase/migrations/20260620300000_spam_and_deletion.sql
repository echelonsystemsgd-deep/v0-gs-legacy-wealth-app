-- Add 'Spam' to lead_status enum if it doesn't exist
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'Spam';
