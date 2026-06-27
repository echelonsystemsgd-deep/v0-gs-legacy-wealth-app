-- 1. Add visual CMS columns to portfolio_items
ALTER TABLE public.portfolio_items 
  ADD COLUMN IF NOT EXISTS gradient TEXT,
  ADD COLUMN IF NOT EXISTS metric TEXT,
  ADD COLUMN IF NOT EXISTS under_construction BOOLEAN DEFAULT TRUE NOT NULL;

-- 2. Add badge column to testimonials
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS badge TEXT;

-- 3. Add insert policy for login_history so users can write their own logins
DROP POLICY IF EXISTS "Users can insert own logins" ON public.login_history;
CREATE POLICY "Users can insert own logins" ON public.login_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 4. Create centralized trigger function for activity logging
CREATE OR REPLACE FUNCTION public.log_activity_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_action TEXT;
    v_details JSONB;
BEGIN
    -- Capture auth user if available
    v_user_id := auth.uid();
    v_action := TG_OP;
    
    IF TG_TABLE_NAME = 'leads' THEN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Lead Submission', 'leads', NEW.id, jsonb_build_object('name', NEW.name, 'business_name', NEW.business_name, 'source', NEW.source));
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.status IS DISTINCT FROM NEW.status THEN
                INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
                VALUES (v_user_id, 'Lead Status Change', 'leads', NEW.id, jsonb_build_object('name', NEW.name, 'old_status', OLD.status, 'new_status', NEW.status));
            ELSE
                INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
                VALUES (v_user_id, 'Lead Update', 'leads', NEW.id, jsonb_build_object('name', NEW.name));
            END IF;
        END IF;
    ELSIF TG_TABLE_NAME = 'projects' THEN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Project Created', 'projects', NEW.id, jsonb_build_object('project_name', NEW.project_name, 'client_name', NEW.client_name));
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.status IS DISTINCT FROM NEW.status THEN
                INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
                VALUES (v_user_id, 'Project Milestone Change', 'projects', NEW.id, jsonb_build_object('project_name', NEW.project_name, 'old_status', OLD.status, 'new_status', NEW.status));
            ELSE
                INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
                VALUES (v_user_id, 'Project Config Update', 'projects', NEW.id, jsonb_build_object('project_name', NEW.project_name));
            END IF;
        END IF;
    ELSIF TG_TABLE_NAME = 'messages' THEN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Message Sent', 'messages', NEW.id, jsonb_build_object('project_id', NEW.project_id));
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Message Deleted', 'messages', OLD.id, jsonb_build_object('project_id', OLD.project_id));
        END IF;
    ELSIF TG_TABLE_NAME = 'project_updates' THEN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Project Update Published', 'project_updates', NEW.id, jsonb_build_object('project_id', NEW.project_id, 'title', NEW.title));
        END IF;
    ELSIF TG_TABLE_NAME = 'strategy_sessions' THEN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (v_user_id, 'Booking Scheduled', 'strategy_sessions', NEW.id, jsonb_build_object('scheduled_at', NEW.scheduled_at));
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.status IS DISTINCT FROM NEW.status THEN
                INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
                VALUES (v_user_id, 'Booking Status Updated', 'strategy_sessions', NEW.id, jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
            END IF;
        END IF;
    ELSIF TG_TABLE_NAME = 'login_history' THEN
        IF TG_OP = 'INSERT' THEN
            -- Record login as activity log
            INSERT INTO public.activity_logs (user_id, action_type, target_table, target_id, details)
            VALUES (NEW.user_id, 'Auth Sign-In', 'login_history', NEW.id, jsonb_build_object('ip_address', NEW.ip_address, 'user_agent', NEW.user_agent));
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach audit triggers to target tables
DROP TRIGGER IF EXISTS trigger_audit_leads ON public.leads;
CREATE TRIGGER trigger_audit_leads AFTER INSERT OR UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.log_activity_changes();

DROP TRIGGER IF EXISTS trigger_audit_projects ON public.projects;
CREATE TRIGGER trigger_audit_projects AFTER INSERT OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.log_activity_changes();

DROP TRIGGER IF EXISTS trigger_audit_messages ON public.messages;
CREATE TRIGGER trigger_audit_messages AFTER INSERT OR DELETE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.log_activity_changes();

DROP TRIGGER IF EXISTS trigger_audit_project_updates ON public.project_updates;
CREATE TRIGGER trigger_audit_project_updates AFTER INSERT ON public.project_updates FOR EACH ROW EXECUTE FUNCTION public.log_activity_changes();

DROP TRIGGER IF EXISTS trigger_audit_strategy_sessions ON public.strategy_sessions;
CREATE TRIGGER trigger_audit_strategy_sessions AFTER INSERT OR UPDATE ON public.strategy_sessions FOR EACH ROW EXECUTE FUNCTION public.log_activity_changes();

DROP TRIGGER IF EXISTS trigger_audit_login_history ON public.login_history;
CREATE TRIGGER trigger_audit_login_history AFTER INSERT ON public.login_history FOR EACH ROW EXECUTE FUNCTION public.log_activity_changes();

-- 6. Add triggers to user_notifications for admin notification dispatch
CREATE OR REPLACE FUNCTION public.handle_admin_notifications()
RETURNS TRIGGER AS $$
DECLARE
    admin_record RECORD;
BEGIN
    -- Notify admins on lead submissions
    IF TG_TABLE_NAME = 'leads' AND TG_OP = 'INSERT' THEN
        FOR admin_record IN SELECT id FROM public.profiles WHERE role = 'admin' LOOP
            INSERT INTO public.user_notifications (user_id, title, description, link)
            VALUES (admin_record.id, 'New Vetting Lead', NEW.name || ' from ' || NEW.business_name, '/admin/leads/' || NEW.id);
        END LOOP;
    -- Notify admins on booking registrations
    ELSIF TG_TABLE_NAME = 'strategy_sessions' AND TG_OP = 'INSERT' THEN
        FOR admin_record IN SELECT id FROM public.profiles WHERE role = 'admin' LOOP
            INSERT INTO public.user_notifications (user_id, title, description, link)
            VALUES (admin_record.id, 'New Call Scheduled', 'Strategy session scheduled', '/admin/bookings');
        END LOOP;
    -- Notify admins on client message incoming
    ELSIF TG_TABLE_NAME = 'messages' AND TG_OP = 'INSERT' THEN
        -- Only notify if sender is a client (role != admin)
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.sender_id AND role != 'admin') THEN
            FOR admin_record IN SELECT id FROM public.profiles WHERE role = 'admin' LOOP
                INSERT INTO public.user_notifications (user_id, title, description, link)
                VALUES (admin_record.id, 'New Client Message', NEW.content, '/admin/messages');
            END LOOP;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_admin_lead ON public.leads;
CREATE TRIGGER trigger_notify_admin_lead AFTER INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.handle_admin_notifications();

DROP TRIGGER IF EXISTS trigger_notify_admin_booking ON public.strategy_sessions;
CREATE TRIGGER trigger_notify_admin_booking AFTER INSERT ON public.strategy_sessions FOR EACH ROW EXECUTE FUNCTION public.handle_admin_notifications();

DROP TRIGGER IF EXISTS trigger_notify_admin_message ON public.messages;
CREATE TRIGGER trigger_notify_admin_message AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.handle_admin_notifications();
