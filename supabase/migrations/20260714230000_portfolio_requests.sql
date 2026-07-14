-- Create public.portfolio_requests table
CREATE TABLE IF NOT EXISTS public.portfolio_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_name TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_requests ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (to keep it idempotent)
DROP POLICY IF EXISTS "Allow anonymous inserts to portfolio_requests" ON public.portfolio_requests;
DROP POLICY IF EXISTS "Allow admins full access to portfolio_requests" ON public.portfolio_requests;

-- RLS Policies
CREATE POLICY "Allow anonymous inserts to portfolio_requests"
    ON public.portfolio_requests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow admins full access to portfolio_requests"
    ON public.portfolio_requests FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_requests_email ON public.portfolio_requests(email);
CREATE INDEX IF NOT EXISTS idx_portfolio_requests_project ON public.portfolio_requests(project_name);
