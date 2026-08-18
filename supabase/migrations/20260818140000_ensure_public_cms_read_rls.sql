-- Migration: Ensure Public CMS Read Access (RLS)
-- Enables unauthenticated frontend visitors (anon) to read portfolio items, testimonials, pricing, and website content.

DO $$
BEGIN
  -- 1. Portfolio Items
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'portfolio_items') THEN
    ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read access to active portfolio_items" ON public.portfolio_items;
    DROP POLICY IF EXISTS "Allow public select on active portfolio_items" ON public.portfolio_items;
    CREATE POLICY "Allow public select on active portfolio_items" 
      ON public.portfolio_items 
      FOR SELECT 
      USING (is_archived = false);
  END IF;

  -- 2. Testimonials
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testimonials') THEN
    ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read access to active testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Allow public select on active testimonials" ON public.testimonials;
    CREATE POLICY "Allow public select on active testimonials" 
      ON public.testimonials 
      FOR SELECT 
      USING (is_archived = false);
  END IF;

  -- 3. Website Content (CMS & Cohort Settings)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'website_content') THEN
    ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read access to website_content" ON public.website_content;
    DROP POLICY IF EXISTS "Allow public select on website_content" ON public.website_content;
    CREATE POLICY "Allow public select on website_content" 
      ON public.website_content 
      FOR SELECT 
      USING (true);
  END IF;

  -- 4. Pricing Plans
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pricing_plans') THEN
    ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read access to pricing_plans" ON public.pricing_plans;
    DROP POLICY IF EXISTS "Allow public select on pricing_plans" ON public.pricing_plans;
    CREATE POLICY "Allow public select on pricing_plans" 
      ON public.pricing_plans 
      FOR SELECT 
      USING (is_active = true);
  END IF;
END $$;
