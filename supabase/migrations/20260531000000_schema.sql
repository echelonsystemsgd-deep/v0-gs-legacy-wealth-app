-- ============================================================
-- GS Legacy Wealth AI — Core Database Schema
-- Migration: 20260531000000_schema.sql
-- ============================================================

-- -------------------------
-- ENUMS
-- -------------------------
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.lead_status AS ENUM ('New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost');
CREATE TYPE public.project_status AS ENUM ('Discovery', 'Design', 'Development', 'Revision', 'Complete');
CREATE TYPE public.booking_status AS ENUM ('Scheduled', 'Canceled', 'No Show', 'Completed');

-- -------------------------
-- PROFILES
-- -------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
    is_suspended BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- LEADS
-- -------------------------
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    service_interested TEXT,
    notes TEXT,
    status public.lead_status DEFAULT 'New'::public.lead_status NOT NULL,
    source TEXT DEFAULT 'website' NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- PROJECTS
-- -------------------------
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    description TEXT,
    service_type TEXT,
    status public.project_status DEFAULT 'Discovery'::public.project_status NOT NULL,
    start_date DATE,
    target_launch_date DATE,
    notes TEXT,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- PROJECT ASSETS
-- -------------------------
CREATE TABLE public.project_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- PORTFOLIO ITEMS
-- -------------------------
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    client_name TEXT,
    description TEXT,
    industry TEXT,
    website_link TEXT,
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- TESTIMONIALS
-- -------------------------
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    company TEXT,
    testimonial TEXT NOT NULL,
    profile_image TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- WEBSITE CONTENT
-- -------------------------
CREATE TABLE public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- -------------------------
-- MEDIA ASSETS
-- -------------------------
CREATE TABLE public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- STRATEGY SESSIONS
-- -------------------------
CREATE TABLE public.strategy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    calendly_event_id TEXT UNIQUE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status public.booking_status DEFAULT 'Scheduled'::public.booking_status NOT NULL,
    notes TEXT,
    outcomes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- LOGIN HISTORY
-- -------------------------
CREATE TABLE public.login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    logged_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- ACTIVITY LOGS
-- -------------------------
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------
-- INDEXES
-- -------------------------
CREATE INDEX idx_leads_status_archived ON public.leads(status, is_archived);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_projects_status_archived ON public.projects(status, is_archived);
CREATE INDEX idx_portfolio_featured_archived ON public.portfolio_items(is_featured, is_archived);
CREATE INDEX idx_testimonials_featured_archived ON public.testimonials(is_featured, is_archived);
CREATE INDEX idx_strategy_sessions_date ON public.strategy_sessions(scheduled_at);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);

-- -------------------------
-- TRIGGERS
-- -------------------------

-- Auto-create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        'user'::public.user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_portfolio_updated_at BEFORE UPDATE ON public.portfolio_items
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_sessions_updated_at BEFORE UPDATE ON public.strategy_sessions
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
