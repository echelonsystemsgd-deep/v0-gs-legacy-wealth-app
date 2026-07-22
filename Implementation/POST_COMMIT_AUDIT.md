# Post-Commit & Incident Audit Log

## DATABASE INCIDENT 2026-07-21

### 1. Incident Summary
On 2026-07-21, a script intended for another project (a real estate portal) was accidentally executed on the Supabase database instance (`ladebhmyywkcqtyazxxk`). This action dropped `public.profiles` and recreated it with an incompatible schema, causing loss of user profile records, missing columns required by the application, and infinite recursion errors in Row Level Security (RLS) policies.

### 2. Root Causes Identified
* **Schema Collision**: The `public.profiles` table was replaced with a legacy schema containing only `id`, `full_name`, `role`, and `created_at`.
* **Missing Columns**: Columns `first_name`, `last_name`, `email`, `is_suspended`, `avatar_url`, `phone_number`, `address_line1`, `address_line2`, `post_code`, `city`, `updated_at`, and `has_completed_tour` were removed.
* **RLS Policy Recursion**: Direct inline subqueries on `public.profiles` within policies on `public.profiles` caused `infinite recursion detected in policy for relation "profiles"` runtime errors.
* **Data Loss**: Existing user profile entries, including the admin account for `gslegacywealth@gmail.com`, were wiped.

### 3. Remediation & Fixes Executed (2026-07-22)
* **Real Estate Artifact Removal**: Dropped invalid tables (`properties`, `inquiries`, `saved_properties`, `boundary_alerts`, `viewing_requests`) and purged real estate seed data profiles (`Arthur Pendragon`, `Victoria Ashworth`, `Albert Stirling`).
* **Schema Restoration**: Altered `public.profiles` to restore all missing columns and set defaults. Added `admin`, `user`, and `client` enum values to `public.user_role`.
* **RLS Repair**: Replaced recursive RLS policies on `public.profiles` with non-recursive policies (`auth.uid() = id` and `is_admin()`). Defined `public.is_admin()` with `SECURITY DEFINER SET search_path = public`.
* **Trigger Restoration**: Restored `public.handle_new_user()` trigger function to automatically provision profile records for newly registered auth users.
* **Profile Provisioning**: Re-created and linked the admin profile record for `gslegacywealth@gmail.com` (`id: 32e053a9-ae7a-4bc8-95cc-d0c91f454af9`) with `role = 'admin'` and `is_suspended = false`, and auto-provisioned missing profiles for all existing auth users.

---

## MERCIAN WEALTH FULL SITE REDESIGN & BRAND AUDIT 2026-07-22

### 1. Audit Summary & Objectives
On 2026-07-22, a full site design, visual hierarchy, responsive layout, and brand compliance post-commit audit was executed for `mercianwealth.com` (`v0-gs-legacy-wealth-app`). The objectives were to eliminate legacy brand artifacts, enforce a strict Zero Fabrication Policy, restructure the landing page into a high-velocity 5-section narrative journey, replace technical jargon with plain English, and resolve responsive layout bottlenecks.

### 2. Key Audit Findings & Root Causes Identified
* **Brand Inconsistency**: Legacy strings (`GS Legacy Wealth`, `GS`, `gslegacywealth`, `agency@gslegacywealth.ai`) remained in multiple components, API routes, and auth layouts.
* **Over-Engineered Homepage Depth**: The homepage contained 8 stacked sections and 6 visual chapter dividers, creating a 4+ minute scroll depth that overloaded high-ticket UK estate agency partners and managing directors.
* **Technical Jargon Overuse**: Prominent site headings and copy used dense engineering terms (e.g. "autonomic", "autonomic orchestrations"), diluting clarity for target business prospects.
* **Unsubstantiated Metric Claims**: Fictional client testimonials and unverified speed metric claims violated brand honesty principles.
* **Mobile Layout Bottlenecks**: `components/bottleneck.tsx` left-panel cards contained fixed height rules (`min-h-[440px]`) and `overflow-hidden` constraints, causing content clipping and button collisions on viewports below 480px.

### 3. Remediation & Fixes Executed
* **100% Brand Replacement Sweep**:
  - Replaced all application instances of legacy brand text with `Mercian Wealth`.
  - Updated standard contact email to `mercianwealthgs@gmail.com` across all endpoints (`components/footer.tsx`, `app/contact/page.tsx`, `app/api/forms/submit/route.ts`, `app/api/portfolio/request/route.ts`, `app/(admin)/admin/content/page.tsx`).
* **Zero Fabrication Policy & Honest Launch Cohort Status**:
  - Replaced fictional client testimonials with an honest **Option B Launch Cohort Status Card** (`eyebrow: "ACTIVE DEPLOYMENT COHORT"`).
  - Framed all system metrics as capability statements (e.g., *"Engineered for sub-60-second lead routing"*).
* **5-Section Homepage Restructuring**:
  - Streamlined homepage from 8 sections to 5 high-velocity sections:
    1. **Hero & Scarcity Positioning** (`components/hero.tsx`): 1 of 2 cohort slots live indicator.
    2. **Operational Deficit** (`components/bottleneck.tsx`): Quantified manual lag with an integrated 2-line Commodity Trap callout.
    3. **System Infrastructure** (`components/why-mercian-wealth.tsx`): 3 core system capabilities.
    4. **Cohort & Capital Allocation** (`components/testimonials.tsx` + `components/pricing.tsx`): Option B Status Card and transparent setup/retainer tiers.
    5. **Clinical Closing** (`components/cta.tsx`): Direct conversion block linking to `/book`.
  - Offloaded FAQ accordion to `/process` & `/book`.
  - Relocated ROI slider off the homepage to `/pricing#roi-calculator` with direct jump link wiring.
* **Plain-English Terminology Substitution**:
  - Replaced "autonomic" jargon across eyebrows, titles, and tier descriptions with plain-English equivalents (*"Bespoke Digital Infrastructure & Automated Engines"*, *"Automated Pipeline Architecture"*, *"Systems Built for Speed"*).
* **Responsive Layout & Mobile Controls**:
  - Converted `components/bottleneck.tsx` left-panel height constraints to `h-auto` and `overflow-visible`, moving action buttons into standard document flow.
  - Increased mobile drawer touch targets (`py-3.5 px-4`, 48px touch boundary).
  - Fixed mobile text wrapping in `components/testimonials.tsx` footer.

### 4. Verification & Validation Results
* **TypeScript Compiler Integrity**: Passed `npx tsc --noEmit` with **0 errors**.
* **Brand Audit**: `grep_search` across `app/`, `components/`, `lib/`, and `public/` verified **0 legacy brand instances**.
* **Build Verification**: Clean Next.js compilation and Turbopack dev server stability verified.

