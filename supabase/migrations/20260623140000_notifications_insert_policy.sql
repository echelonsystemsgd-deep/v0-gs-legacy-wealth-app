-- Add INSERT policy for user_notifications
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.user_notifications;
CREATE POLICY "Users can insert own notifications" ON public.user_notifications
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());
