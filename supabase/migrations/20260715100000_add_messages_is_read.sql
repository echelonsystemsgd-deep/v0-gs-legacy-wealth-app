-- Add is_read column to messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE NOT NULL;

-- Backfill existing messages as read
UPDATE public.messages SET is_read = TRUE;
