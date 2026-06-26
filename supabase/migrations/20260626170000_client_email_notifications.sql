-- Notify Client on User Notification Insert
CREATE OR REPLACE FUNCTION public.notify_client_on_notification_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_recipient_email TEXT;
  v_payload JSONB;
  v_url TEXT;
  v_webhook_token TEXT := '8d2f7a93-b6c8-47e1-95d4-fa06b3e817cf';
BEGIN
  -- Query the email of the profile associated with the notification recipient
  SELECT email INTO v_recipient_email
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Only send email if the recipient has a registered email address
  IF v_recipient_email IS NOT NULL THEN
    v_payload := jsonb_build_object(
      'email', v_recipient_email,
      'title', NEW.title,
      'description', NEW.description
    );

    v_url := public.get_supabase_url() || '/functions/v1/send-email-notification';

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

DROP TRIGGER IF EXISTS on_notification_inserted_webhook ON public.user_notifications;
CREATE TRIGGER on_notification_inserted_webhook
  AFTER INSERT ON public.user_notifications
  FOR EACH ROW EXECUTE FUNCTION public.notify_client_on_notification_insert();
