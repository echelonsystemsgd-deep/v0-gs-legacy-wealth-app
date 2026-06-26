-- Add billing_type column to session_categories
ALTER TABLE public.session_categories ADD COLUMN IF NOT EXISTS billing_type TEXT DEFAULT 'one-time' NOT NULL CHECK (billing_type IN ('one-time', 'monthly'));

-- Update existing session categories to reflect correct billing_type
UPDATE public.session_categories SET billing_type = 'monthly' WHERE slug IN ('ascent-discovery-call', 'apex-strategy-session', 'sovereign-strategy-session');
