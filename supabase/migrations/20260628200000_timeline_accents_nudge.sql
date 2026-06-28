-- Migration: Add fields for client portal micro-theming accents and action request due dates
ALTER TABLE projects ADD COLUMN IF NOT EXISTS theme_accent text DEFAULT 'gold';
ALTER TABLE project_action_requests ADD COLUMN IF NOT EXISTS due_date date;
