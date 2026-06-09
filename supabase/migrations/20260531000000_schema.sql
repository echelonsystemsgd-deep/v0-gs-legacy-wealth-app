-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost');
CREATE TYPE project_status AS ENUM ('Discovery', 'Design', 'Development', 'Revision', 'Complete');
CREATE TYPE booking_status AS ENUM ('Scheduled', 'Canceled', 'No Show', 'Completed');

-- 1. profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    post_code TEXT,
    city TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    is_suspended BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. leads
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    service_interested TEXT,
    notes TEXT,
    status lead_status DEFAULT 'New'::lead_status NOT NULL,
    source TEXT DEFAULT 'website' NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    description TEXT,
    service_type TEXT,
    status project_status DEFAULT 'Discovery'::project_status NOT NULL,
    start_date DATE,
    target_launch_date DATE,
    notes TEXT,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. project_assets
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

-- 5. portfolio_items
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

-- 6. testimonials
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

-- 7. website_content
CREATE TABLE public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 8. media_assets
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

-- 9. strategy_sessions
CREATE TABLE public.strategy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    calendly_event_id TEXT UNIQUE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status booking_status DEFAULT 'Scheduled'::booking_status NOT NULL,
    notes TEXT,
    outcomes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. login_history
CREATE TABLE public.login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    logged_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 11. activity_logs
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_leads_status_archived ON public.leads(status, is_archived);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_projects_status_archived ON public.projects(status, is_archived);
CREATE INDEX idx_portfolio_featured_archived ON public.portfolio_items(is_featured, is_archived);
CREATE INDEX idx_testimonials_featured_archived ON public.testimonials(is_featured, is_archived);
CREATE INDEX idx_strategy_sessions_date ON public.strategy_sessions(scheduled_at);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);

-- Automatic Date Updater Trigger Function
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Date Updater Trigger to Tables
CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER on_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER on_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER on_portfolio_items_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER on_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER on_website_content_updated BEFORE UPDATE ON public.website_content FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER on_strategy_sessions_updated BEFORE UPDATE ON public.strategy_sessions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Automatic User Profile Generator (Triggered on Auth User Create)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        first_name,
        last_name,
        role
    )
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        'user'::user_role -- Default role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
