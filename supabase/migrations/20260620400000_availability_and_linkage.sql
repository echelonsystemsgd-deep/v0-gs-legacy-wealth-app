-- Availability rules, portfolio/testimonials linkage, and RLS updates

-- 1. Create availability_rules table
CREATE TABLE IF NOT EXISTS public.availability_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Alter portfolio_items and testimonials
ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE NOT NULL;

-- 3. Enable RLS on availability_rules
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;

-- 4. Create trigger to keep updated_at current
CREATE TRIGGER on_availability_rules_updated BEFORE UPDATE ON public.availability_rules 
FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 5. Refine policies for availability_rules
DROP POLICY IF EXISTS "Public read access to availability rules" ON public.availability_rules;
CREATE POLICY "Public read access to availability rules" ON public.availability_rules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage availability rules" ON public.availability_rules;
CREATE POLICY "Admins manage availability rules" ON public.availability_rules FOR ALL USING (public.is_admin());

-- 6. Refine is_admin security definer function search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::public.user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
