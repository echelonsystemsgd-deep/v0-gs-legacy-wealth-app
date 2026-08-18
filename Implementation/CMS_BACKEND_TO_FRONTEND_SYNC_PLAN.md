# CMS Backend to Frontend Synchronization Plan

## Objective
Establish a 100% reliable, real-time synchronization pipeline between the Admin Dashboard CMS (Portfolio, Testimonials, Pricing, Cohort Settings, Announcement Banners) and the public-facing Next.js frontend.

---

## Root Cause Analysis & Diagnostic Findings

1. **Portfolio Blueprint State Lock**:
   - `components/portfolio.tsx` previously evaluated `item.href && !item.underConstruction`. If `website_link` (`item.href`) was omitted or empty, the frontend rendered the "View Blueprint" lead modal even if `under_construction` was unchecked by the admin.
2. **Public RLS Permissions in Supabase**:
   - Public frontend visitors query Supabase anonymously (`anon` role). If `SELECT` policies are missing or restricted, queries fail silently and trigger hardcoded static fallbacks.
3. **Overly Restrictive Client Guards**:
   - For example, `components/testimonials.tsx` required `liveData.length >= 2` before overriding static fallback data, preventing single-item updates from appearing.

---

## Architectural Solutions

### 1. Robust Status & Sandbox Handling (`components/portfolio.tsx`)
- Status logic decoupled:
  - If `item.under_construction === true`: Display **"Architecture Case Study"** badge and trigger **"View Blueprint"** lead capture modal.
  - If `item.under_construction === false`: Display **"Live Interactive Sandbox"** badge.
    - If `item.href` exists: Launch live interactive iframe viewport modal or direct navigation.
    - If `item.href` is omitted: Display interactive project showcase preview.

### 2. Direct Sync in Admin Dashboard (`app/(admin)/admin/portfolio/page.tsx`)
- Automatic conversion of default items into real Supabase rows upon saving.
- Clear field labels distinguishing between "Blueprint / Architecture Mode" and "Public / Interactive Sandbox Mode".

### 3. Testimonials & Dynamic Content Sync (`components/testimonials.tsx`)
- Fallback thresholds relaxed (`liveData.length > 0`) to ensure all published client reviews appear instantly.

### 4. Row Level Security Policy Verification (`supabase/migrations/`)
- Migration ensuring `public.portfolio_items`, `public.testimonials`, `public.website_content`, and `public.pricing_plans` have active `anon` `SELECT` policies.
