-- Admin Dashboard Redesign DB schema additions
ALTER TABLE projects ADD COLUMN IF NOT EXISTS importance_rank INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_type TEXT DEFAULT 'one_time';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS retainer_amount NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS one_time_fee NUMERIC DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS rev_share_percentage NUMERIC DEFAULT 0;
