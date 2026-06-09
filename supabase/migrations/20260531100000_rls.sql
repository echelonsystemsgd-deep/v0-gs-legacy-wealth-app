-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read and update their own profile, Admins can do anything
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Publicly readable tables
CREATE POLICY "Public can view portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view website content" ON public.website_content FOR SELECT USING (true);

-- Admins can manage everything
CREATE POLICY "Admins manage leads" ON public.leads FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage project assets" ON public.project_assets FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage portfolio items" ON public.portfolio_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage website content" ON public.website_content FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage media assets" ON public.media_assets FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage strategy sessions" ON public.strategy_sessions FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage login history" ON public.login_history FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage activity logs" ON public.activity_logs FOR ALL USING (public.is_admin());
