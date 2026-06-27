-- 1. Create project_action_requests table
CREATE TABLE IF NOT EXISTS public.project_action_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'submitted', 'completed'
    client_response TEXT,
    submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.project_action_requests ENABLE ROW LEVEL SECURITY;

-- 3. Define RLS Policies
DROP POLICY IF EXISTS "Admins can manage action requests" ON public.project_action_requests;
CREATE POLICY "Admins can manage action requests" ON public.project_action_requests
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Clients can view own project action requests" ON public.project_action_requests;
CREATE POLICY "Clients can view own project action requests" ON public.project_action_requests
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_action_requests.project_id AND p.client_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Clients can update own project action requests" ON public.project_action_requests;
CREATE POLICY "Clients can update own project action requests" ON public.project_action_requests
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_action_requests.project_id AND p.client_id = auth.uid()
    ))
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_action_requests.project_id AND p.client_id = auth.uid()
        )
        -- Clients can only update client_response, submitted_at, and status to 'submitted'
        AND status = 'submitted'
        AND client_response IS NOT NULL
        AND submitted_at IS NOT NULL
    );

-- 4. Centralized trigger for logging action request activities
CREATE OR REPLACE FUNCTION public.log_action_request_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
        VALUES (v_user_id, 'Action Request Created', 'project_action_requests', NEW.id, jsonb_build_object('title', NEW.title, 'project_id', NEW.project_id));
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'pending' AND NEW.status = 'submitted' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Action Request Submitted', 'project_action_requests', NEW.id, jsonb_build_object('title', NEW.title, 'project_id', NEW.project_id));
        ELSIF OLD.status = 'submitted' AND NEW.status = 'completed' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Action Request Completed', 'project_action_requests', NEW.id, jsonb_build_object('title', NEW.title, 'project_id', NEW.project_id));
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_audit_action_requests ON public.project_action_requests;
CREATE TRIGGER trigger_audit_action_requests AFTER INSERT OR UPDATE ON public.project_action_requests FOR EACH ROW EXECUTE FUNCTION public.log_action_request_activity();

-- 5. Trigger to automatically create a user_notification for client when admin creates a request
CREATE OR REPLACE FUNCTION public.notify_client_on_action_request()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id UUID;
    v_project_name TEXT;
BEGIN
    SELECT client_id, project_name INTO v_client_id, v_project_name
    FROM public.projects
    WHERE id = NEW.project_id;

    IF v_client_id IS NOT NULL THEN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.user_notifications (user_id, title, description, link)
            VALUES (
                v_client_id,
                'Action Required: ' || NEW.title,
                NEW.description,
                '/client'
            );
        ELSIF TG_OP = 'UPDATE' AND OLD.status = 'submitted' AND NEW.status = 'completed' THEN
            INSERT INTO public.user_notifications (user_id, title, description, link)
            VALUES (
                v_client_id,
                'Action Completed: ' || NEW.title,
                'The information you provided has been verified and marked complete.',
                '/client'
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_client_action_request ON public.project_action_requests;
CREATE TRIGGER trigger_notify_client_action_request AFTER INSERT OR UPDATE ON public.project_action_requests FOR EACH ROW EXECUTE FUNCTION public.notify_client_on_action_request();
