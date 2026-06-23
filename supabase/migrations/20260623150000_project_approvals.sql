-- Create project_approvals table
CREATE TABLE IF NOT EXISTS public.project_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    stage TEXT NOT NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    notes TEXT,
    UNIQUE(project_id, stage)
);

-- Enable RLS
ALTER TABLE public.project_approvals ENABLE ROW LEVEL SECURITY;

-- Select Policy: clients can view approvals associated with their project
DROP POLICY IF EXISTS "Clients can view own project approvals" ON public.project_approvals;
CREATE POLICY "Clients can view own project approvals" ON public.project_approvals
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_approvals.project_id AND p.client_id = auth.uid()
    ));

-- Insert Policy: clients can insert sign-offs for their own project
DROP POLICY IF EXISTS "Clients can insert own project approvals" ON public.project_approvals;
CREATE POLICY "Clients can insert own project approvals" ON public.project_approvals
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_approvals.project_id AND p.client_id = auth.uid()
        ) AND approved_by = auth.uid()
    );

-- Admin Policy: admins can manage all approvals
DROP POLICY IF EXISTS "Admins manage all project approvals" ON public.project_approvals;
CREATE POLICY "Admins manage all project approvals" ON public.project_approvals
    FOR ALL
    USING (public.is_admin());

-- Trigger function for stage sign-offs to notify client
CREATE OR REPLACE FUNCTION public.handle_new_project_approval()
RETURNS TRIGGER AS $$
DECLARE
    v_project_name TEXT;
    v_client_id UUID;
BEGIN
    SELECT project_name, client_id INTO v_project_name, v_client_id
    FROM public.projects
    WHERE id = NEW.project_id;

    IF v_client_id IS NOT NULL THEN
        INSERT INTO public.user_notifications (user_id, title, description, link)
        VALUES (
            v_client_id,
            'Phase Signed Off',
            'You have successfully signed off on the ' || NEW.stage || ' phase for project "' || v_project_name || '".',
            '/client'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_approval_inserted ON public.project_approvals;
CREATE TRIGGER on_project_approval_inserted
    AFTER INSERT ON public.project_approvals
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_project_approval();
