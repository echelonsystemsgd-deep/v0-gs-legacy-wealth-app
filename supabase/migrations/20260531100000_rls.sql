-- ============================================================
-- GS Legacy Wealth AI — Row Level Security Policies
-- Migration: 20260531100000_rls.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'::public.user_role
          AND is_suspended = FALSE
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- -------------------------
-- PROFILES POLICIES
-- -------------------------
CREATE POLICY "Admins can read all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Users can read their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- -------------------------
-- LEADS POLICIES
-- -------------------------
CREATE POLICY "Admins full access to leads"
    ON public.leads FOR ALL
    USING (public.is_admin());

CREATE POLICY "Anon can insert leads (contact form)"
    ON public.leads FOR INSERT
    WITH CHECK (true);

-- -------------------------
-- PROJECTS POLICIES
-- -------------------------
CREATE POLICY "Admins full access to projects"
    ON public.projects FOR ALL
    USING (public.is_admin());

-- -------------------------
-- PROJECT ASSETS POLICIES
-- -------------------------
CREATE POLICY "Admins full access to project_assets"
    ON public.project_assets FOR ALL
    USING (public.is_admin());

-- -------------------------
-- PORTFOLIO POLICIES
-- -------------------------
CREATE POLICY "Admins full access to portfolio_items"
    ON public.portfolio_items FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can read non-archived portfolio items"
    ON public.portfolio_items FOR SELECT
    USING (is_archived = FALSE);

-- -------------------------
-- TESTIMONIALS POLICIES
-- -------------------------
CREATE POLICY "Admins full access to testimonials"
    ON public.testimonials FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can read non-archived testimonials"
    ON public.testimonials FOR SELECT
    USING (is_archived = FALSE);

-- -------------------------
-- WEBSITE CONTENT POLICIES
-- -------------------------
CREATE POLICY "Admins full access to website_content"
    ON public.website_content FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can read website_content"
    ON public.website_content FOR SELECT
    USING (true);

-- -------------------------
-- MEDIA ASSETS POLICIES
-- -------------------------
CREATE POLICY "Admins full access to media_assets"
    ON public.media_assets FOR ALL
    USING (public.is_admin());

-- -------------------------
-- STRATEGY SESSIONS POLICIES
-- -------------------------
CREATE POLICY "Admins full access to strategy_sessions"
    ON public.strategy_sessions FOR ALL
    USING (public.is_admin());

-- -------------------------
-- LOGIN HISTORY POLICIES
-- -------------------------
CREATE POLICY "Admins can read all login_history"
    ON public.login_history FOR ALL
    USING (public.is_admin());

-- -------------------------
-- ACTIVITY LOGS POLICIES
-- -------------------------
CREATE POLICY "Admins can read all activity_logs"
    ON public.activity_logs FOR ALL
    USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKET POLICIES
-- (Run AFTER creating buckets in Supabase dashboard)
-- ============================================================

-- Public buckets: portfolio, testimonials, branding, website-media
CREATE POLICY "Public read access to public buckets"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media'));

-- Admin write to public buckets
CREATE POLICY "Admins can write to public buckets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media')
        AND public.is_admin()
    );

CREATE POLICY "Admins can update/delete public bucket objects"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media')
        AND public.is_admin()
    );

CREATE POLICY "Admins can delete public bucket objects"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id IN ('portfolio', 'testimonials', 'branding', 'website-media')
        AND public.is_admin()
    );

-- Private bucket: project-assets
CREATE POLICY "Admins can access project-assets bucket"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'project-assets' AND public.is_admin());
