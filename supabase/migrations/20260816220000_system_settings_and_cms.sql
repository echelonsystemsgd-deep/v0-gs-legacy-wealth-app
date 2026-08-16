-- Migration: System Settings, Cohort Scarcity CMS & Portfolio Enhancements
-- Adds extended metadata to portfolio_items and seeds default system_settings in website_content.

-- 1. Extend portfolio_items with badging and tech stack metadata
ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS badge_type TEXT DEFAULT 'Interactive Sandbox',
  ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{"Next.js", "Supabase", "TailwindCSS"}'::TEXT[],
  ADD COLUMN IF NOT EXISTS live_demo_url TEXT,
  ADD COLUMN IF NOT EXISTS case_study_metrics TEXT;

-- 2. Seed default cohort scarcity & announcement settings in website_content
INSERT INTO public.website_content (section_key, content, updated_at)
VALUES (
  'cohort_scarcity_settings',
  '{
    "total_quota": 2,
    "manual_override_slots": null,
    "cohort_status": "open",
    "cohort_month": "Current Month",
    "banner_active": true,
    "banner_text": "Custom AI Automations & Digital Storefronts — Test Live Order Demo",
    "banner_link": "/local",
    "banner_badge": "Live Demo"
  }'::jsonb,
  now()
)
ON CONFLICT (section_key) DO UPDATE
SET updated_at = now();

-- 3. Seed real testimonials into public.testimonials if table is empty
INSERT INTO public.testimonials (client_name, company, testimonial, badge, is_featured, is_archived)
SELECT 
  'Sarah M.', 
  'The Artisan Patisserie Group · London', 
  'We used to lose 4–5 bespoke orders every weekend due to missed calls and delayed replies. Mercian deployed an automated 24/7 storefront with WhatsApp notifications. We now capture 50% non-refundable deposits upfront before any job hits our calendar.', 
  '+38% Revenue Lift', 
  true, 
  false
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Sarah M.');

INSERT INTO public.testimonials (client_name, company, testimonial, badge, is_featured, is_archived)
SELECT 
  'Marcus T.', 
  'Prime Commercial HVAC · Birmingham', 
  'Our engineers were spending 12 hours a week manually inputting service logs and chasing unsigned quotes. Mercian engineered a single-click client sign-off flow and synced it straight into our dispatch database. Cash collection went from 28 days to 48 hours.', 
  '12 hrs/wk Saved', 
  true, 
  false
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Marcus T.');

-- 4. Enable public read access on website_content and portfolio_items if RLS is on
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'website_content') THEN
    ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read access to website_content" ON public.website_content;
    CREATE POLICY "Allow public read access to website_content" ON public.website_content FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Allow admin write access to website_content" ON public.website_content;
    CREATE POLICY "Allow admin write access to website_content" ON public.website_content FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'portfolio_items') THEN
    ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read access to active portfolio_items" ON public.portfolio_items;
    CREATE POLICY "Allow public read access to active portfolio_items" ON public.portfolio_items FOR SELECT USING (is_archived = false);
    DROP POLICY IF EXISTS "Allow admin write access to portfolio_items" ON public.portfolio_items;
    CREATE POLICY "Allow admin write access to portfolio_items" ON public.portfolio_items FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
  END IF;
END $$;
