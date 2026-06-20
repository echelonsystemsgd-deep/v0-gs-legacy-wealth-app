-- 1. Create session_categories table
CREATE TABLE IF NOT EXISTS public.session_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    duration_minutes INTEGER DEFAULT 30 NOT NULL,
    description TEXT,
    color_code TEXT DEFAULT '#D4AF37' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Add columns to strategy_sessions
ALTER TABLE public.strategy_sessions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.session_categories(id) ON DELETE SET NULL;
ALTER TABLE public.strategy_sessions ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Add columns to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. Add columns to leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS converted_client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 5. Enable RLS on session_categories
ALTER TABLE public.session_categories ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for session_categories
DROP POLICY IF EXISTS "Allow authenticated to read categories" ON public.session_categories;
CREATE POLICY "Allow authenticated to read categories" ON public.session_categories
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins manage categories" ON public.session_categories;
CREATE POLICY "Admins manage categories" ON public.session_categories
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. Add auto-updater trigger for session_categories
DROP TRIGGER IF EXISTS on_session_categories_updated ON public.session_categories;
CREATE TRIGGER on_session_categories_updated
    BEFORE UPDATE ON public.session_categories
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 8. Seed initial categories
INSERT INTO public.session_categories (name, slug, duration_minutes, description, color_code, is_active)
VALUES
    ('Strategy Session', 'strategy-session', 30, 'Initial high-level consulting and qualification call.', '#D4AF37', true),
    ('Technical Discovery', 'technical-discovery', 45, 'In-depth architecture planning and technical assessment.', '#6D28D9', true),
    ('Onboarding Consultation', 'onboarding-consultation', 60, 'Kickoff session for newly won clients.', '#10B981', true),
    ('Milestone Review', 'milestone-review', 30, 'Iterative layout and component reviews during design/dev.', '#3B82F6', true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    duration_minutes = EXCLUDED.duration_minutes,
    description = EXCLUDED.description,
    color_code = EXCLUDED.color_code,
    is_active = EXCLUDED.is_active;
