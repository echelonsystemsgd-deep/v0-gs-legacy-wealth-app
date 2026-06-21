-- 1. Add client_id column, live_url, and preview_url to projects table referencing profiles
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- 2. Create project_updates table
CREATE TABLE IF NOT EXISTS public.project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Enable RLS on new tables
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. Set up updated_at triggers (if needed)
CREATE TRIGGER on_project_updates_updated BEFORE UPDATE ON public.project_updates
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 6. Define RLS Policies for projects (allow clients SELECT access)
DROP POLICY IF EXISTS "Clients can view own projects" ON public.projects;
CREATE POLICY "Clients can view own projects" ON public.projects
    FOR SELECT
    USING (client_id = auth.uid());

-- 7. Define RLS Policies for project_assets (allow clients SELECT and INSERT access)
DROP POLICY IF EXISTS "Clients can view own project assets" ON public.project_assets;
CREATE POLICY "Clients can view own project assets" ON public.project_assets
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_assets.project_id AND p.client_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Clients can upload project assets to own project" ON public.project_assets;
CREATE POLICY "Clients can upload project assets to own project" ON public.project_assets
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_assets.project_id AND p.client_id = auth.uid()
    ) AND uploaded_by = auth.uid());

-- 8. Define RLS Policies for project_updates
DROP POLICY IF EXISTS "Admins manage project updates" ON public.project_updates;
CREATE POLICY "Admins manage project updates" ON public.project_updates
    FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Clients can view own project updates" ON public.project_updates;
CREATE POLICY "Clients can view own project updates" ON public.project_updates
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_updates.project_id AND p.client_id = auth.uid()
    ));

-- 9. Define RLS Policies for messages
DROP POLICY IF EXISTS "Admins manage messages" ON public.messages;
CREATE POLICY "Admins manage messages" ON public.messages
    FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Clients can read own project messages" ON public.messages;
CREATE POLICY "Clients can read own project messages" ON public.messages
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = messages.project_id AND p.client_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Clients can send messages to own project" ON public.messages;
CREATE POLICY "Clients can send messages to own project" ON public.messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = messages.project_id AND p.client_id = auth.uid()
        ) AND sender_id = auth.uid()
    );
