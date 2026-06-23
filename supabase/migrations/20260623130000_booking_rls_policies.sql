-- 1. Policies on strategy_sessions
DROP POLICY IF EXISTS "Users can select own strategy sessions" ON public.strategy_sessions;
CREATE POLICY "Users can select own strategy sessions" ON public.strategy_sessions
    FOR SELECT TO authenticated
    USING (
        client_id = auth.uid() 
        OR 
        lead_id IN (
            SELECT id FROM public.leads 
            WHERE lower(email) = lower(auth.jwt() ->> 'email')
        )
    );

DROP POLICY IF EXISTS "Users can insert own strategy sessions" ON public.strategy_sessions;
CREATE POLICY "Users can insert own strategy sessions" ON public.strategy_sessions
    FOR INSERT TO authenticated
    WITH CHECK (
        client_id = auth.uid() 
        OR 
        lead_id IN (
            SELECT id FROM public.leads 
            WHERE lower(email) = lower(auth.jwt() ->> 'email')
        )
    );

DROP POLICY IF EXISTS "Users can update own strategy sessions" ON public.strategy_sessions;
CREATE POLICY "Users can update own strategy sessions" ON public.strategy_sessions
    FOR UPDATE TO authenticated
    USING (
        client_id = auth.uid() 
        OR 
        lead_id IN (
            SELECT id FROM public.leads 
            WHERE lower(email) = lower(auth.jwt() ->> 'email')
        )
    );

-- 2. Policies on leads
DROP POLICY IF EXISTS "Users can select own lead" ON public.leads;
CREATE POLICY "Users can select own lead" ON public.leads
    FOR SELECT TO authenticated
    USING (lower(email) = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Users can insert own lead" ON public.leads;
CREATE POLICY "Users can insert own lead" ON public.leads
    FOR INSERT TO authenticated
    WITH CHECK (lower(email) = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Users can update own lead" ON public.leads;
CREATE POLICY "Users can update own lead" ON public.leads
    FOR UPDATE TO authenticated
    USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- 3. Automatic conversion trigger: turn users into clients when they pay >= 50%
CREATE OR REPLACE FUNCTION public.check_client_role_conversion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.client_id IS NOT NULL AND NEW.contract_value > 0 THEN
        IF NEW.amount_paid >= (NEW.contract_value * 0.5) THEN
            UPDATE public.profiles
            SET role = 'client'::public.user_role
            WHERE id = NEW.client_id AND role = 'user'::public.user_role;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_project_payment_upgrade ON public.projects;
CREATE TRIGGER on_project_payment_upgrade
AFTER INSERT OR UPDATE OF amount_paid, contract_value, client_id ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.check_client_role_conversion();
