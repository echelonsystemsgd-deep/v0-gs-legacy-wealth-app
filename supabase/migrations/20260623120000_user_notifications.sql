-- Create user_notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- 1. Select Policy: users can view their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.user_notifications;
CREATE POLICY "Users can view own notifications" ON public.user_notifications
    FOR SELECT
    USING (user_id = auth.uid());

-- 2. Update Policy: users can update (mark as read) their own notifications
DROP POLICY IF EXISTS "Users can update own notifications" ON public.user_notifications;
CREATE POLICY "Users can update own notifications" ON public.user_notifications
    FOR UPDATE
    USING (user_id = auth.uid());

-- 3. Delete Policy: users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.user_notifications;
CREATE POLICY "Users can delete own notifications" ON public.user_notifications
    FOR DELETE
    USING (user_id = auth.uid());

-- 4. Admin Policy: admins can manage all notifications
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.user_notifications;
CREATE POLICY "Admins can manage all notifications" ON public.user_notifications
    FOR ALL
    USING (public.is_admin());

-- Automated Triggers

-- A. Trigger for new project updates
CREATE OR REPLACE FUNCTION public.handle_new_project_update()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id UUID;
    v_project_name TEXT;
BEGIN
    SELECT client_id, project_name INTO v_client_id, v_project_name
    FROM public.projects
    WHERE id = NEW.project_id;

    IF v_client_id IS NOT NULL THEN
        INSERT INTO public.user_notifications (user_id, title, description, link)
        VALUES (
            v_client_id,
            'New Project Update: ' || v_project_name,
            NEW.title,
            '/client'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_update_inserted ON public.project_updates;
CREATE TRIGGER on_project_update_inserted
    AFTER INSERT ON public.project_updates
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_project_update();

-- B. Trigger for new project messages
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id UUID;
BEGIN
    SELECT client_id INTO v_client_id
    FROM public.projects
    WHERE id = NEW.project_id;

    -- Notify the client if the sender is not the client (i.e. sent by admin)
    IF v_client_id IS NOT NULL AND NEW.sender_id != v_client_id THEN
        INSERT INTO public.user_notifications (user_id, title, description, link)
        VALUES (
            v_client_id,
            'New Message from Team',
            CASE 
                WHEN length(NEW.content) > 100 THEN substring(NEW.content from 1 for 100) || '...'
                ELSE NEW.content
            END,
            '/client/messages'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- C. Trigger for project status milestone changes
CREATE OR REPLACE FUNCTION public.handle_project_status_update()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) AND (NEW.client_id IS NOT NULL) THEN
        INSERT INTO public.user_notifications (user_id, title, description, link)
        VALUES (
            NEW.client_id,
            'Project Milestone Progressed',
            'Your project "' || NEW.project_name || '" has progressed from ' || OLD.status || ' to ' || NEW.status || '.',
            '/client'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_status_updated ON public.projects;
CREATE TRIGGER on_project_status_updated
    AFTER UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_project_status_update();
