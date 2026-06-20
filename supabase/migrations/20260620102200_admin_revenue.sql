-- 1. Add contract_value and amount_paid columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contract_value NUMERIC DEFAULT 0 NOT NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0 NOT NULL;

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'Paid' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index on project_id for performance
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON public.payments(project_id);

-- 3. Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies: Only Admins can manage or view payments
CREATE POLICY "Admins manage all payments" ON public.payments
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Create Trigger Function to automatically update amount_paid in projects table
CREATE OR REPLACE FUNCTION public.update_project_amount_paid()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        UPDATE public.projects
        SET amount_paid = (
            SELECT COALESCE(SUM(amount), 0)
            FROM public.payments
            WHERE project_id = OLD.project_id AND status = 'Paid'
        )
        WHERE id = OLD.project_id;
        RETURN OLD;
    ELSE
        UPDATE public.projects
        SET amount_paid = (
            SELECT COALESCE(SUM(amount), 0)
            FROM public.payments
            WHERE project_id = NEW.project_id AND status = 'Paid'
        )
        WHERE id = NEW.project_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Bind trigger to payments table
DROP TRIGGER IF EXISTS on_payment_change ON public.payments;
CREATE TRIGGER on_payment_change
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_project_amount_paid();
