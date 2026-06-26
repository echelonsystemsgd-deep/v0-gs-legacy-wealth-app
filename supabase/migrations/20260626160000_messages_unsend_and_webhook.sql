-- Enable pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Messages RLS delete policy
DROP POLICY IF EXISTS "Clients can delete own messages within 15 minutes" ON public.messages;
CREATE POLICY "Clients can delete own messages within 15 minutes" ON public.messages
FOR DELETE
TO authenticated
USING (
  sender_id = auth.uid() 
  AND created_at > now() - interval '15 minutes'
);

-- 2. Supabase URL Resolver
CREATE OR REPLACE FUNCTION public.get_supabase_url()
RETURNS text AS $$
BEGIN
  IF inet_server_addr()::text LIKE '172.%' OR inet_server_addr()::text = '127.0.0.1' OR inet_server_addr()::text IS NULL THEN
    -- Local development using docker kong service
    RETURN 'http://kong:8000';
  ELSE
    -- Production Supabase external URL
    RETURN 'https://ladebhmyywkcqtyazxxk.supabase.co';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Notify Admin on Message Insert
CREATE OR REPLACE FUNCTION public.notify_admin_on_message_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_sender_name TEXT;
  v_sender_role public.user_role;
  v_payload JSONB;
  v_url TEXT;
  v_webhook_token TEXT := '8d2f7a93-b6c8-47e1-95d4-fa06b3e817cf';
BEGIN
  -- Query sender name and role
  SELECT COALESCE(full_name, first_name || ' ' || last_name, 'Client'), role 
  INTO v_sender_name, v_sender_role
  FROM public.profiles
  WHERE id = NEW.sender_id;

  -- Only trigger webhook notification if the message is sent by a non-admin client
  IF v_sender_role != 'admin'::public.user_role THEN
    v_payload := jsonb_build_object(
      'table', 'messages',
      'type', 'INSERT',
      'record', jsonb_build_object(
        'content', NEW.content,
        'sender_id', NEW.sender_id,
        'project_id', NEW.project_id,
        'sender_name', v_sender_name
      )
    );

    v_url := public.get_supabase_url() || '/functions/v1/notify-admin';

    PERFORM net.http_post(
      url := v_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-webhook-token', v_webhook_token
      ),
      body := v_payload,
      timeout_ms := 5000
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_inserted_webhook ON public.messages;
CREATE TRIGGER on_message_inserted_webhook
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_message_insert();

-- 4. Notify Admin on Lead Insert
CREATE OR REPLACE FUNCTION public.notify_admin_on_lead_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_payload JSONB;
  v_url TEXT;
  v_webhook_token TEXT := '8d2f7a93-b6c8-47e1-95d4-fa06b3e817cf';
BEGIN
  v_payload := jsonb_build_object(
    'table', 'leads',
    'type', 'INSERT',
    'record', to_jsonb(NEW)
  );

  v_url := public.get_supabase_url() || '/functions/v1/notify-admin';

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-token', v_webhook_token
    ),
    body := v_payload,
    timeout_ms := 5000
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_inserted_webhook ON public.leads;
CREATE TRIGGER on_lead_inserted_webhook
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_lead_insert();

-- 5. Notify Admin on Strategy Session Insert
CREATE OR REPLACE FUNCTION public.notify_admin_on_session_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_payload JSONB;
  v_url TEXT;
  v_webhook_token TEXT := '8d2f7a93-b6c8-47e1-95d4-fa06b3e817cf';
BEGIN
  v_payload := jsonb_build_object(
    'table', 'strategy_sessions',
    'type', 'INSERT',
    'record', to_jsonb(NEW)
  );

  v_url := public.get_supabase_url() || '/functions/v1/notify-admin';

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-token', v_webhook_token
    ),
    body := v_payload,
    timeout_ms := 5000
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_session_inserted_webhook ON public.strategy_sessions;
CREATE TRIGGER on_session_inserted_webhook
  AFTER INSERT ON public.strategy_sessions
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_session_insert();
