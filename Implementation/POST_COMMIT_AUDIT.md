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

---

## LOCALENGINE AI 6-SERVICE OVERHAUL & VENDOR PRIVACY AUDIT 2026-08-02

### 1. Audit & Overhaul Summary
On 2026-08-02, a complete site overhaul and vendor privacy audit was executed. The objectives were to align the entire site 100% with the client's 6 core offerings, eliminate all public mentions of technical vendor tools (*Supabase, Stripe, Make.com, Zapier, etc.*), integrate a playful stickman character speed illustration suite, build a real 3-tap interactive order simulator with custom calendar picker input, and align pricing tiers.

### 2. Key Remediation & Overhaul Executed
* **100% Vendor Tool Privacy Sweep**:
  - Removed all public frontend references to specific vendor tools (*Supabase, Stripe, Make.com, Zapier, Next.js, SMS bots*).
  - Replaced all badges, tickers, and feature copy with outcome-driven capability terms (*"Secure Cloud Database"*, *"Instant Deposit Gateways"*, *"WhatsApp Phone Alerts"*, *"Automated Workflows"*, *"Instant Lead Telemetry"*).
* **6-Pillar Core Service Alignment**:
  - Aligned all site headlines, subheadlines, badges, and pricing cards to focus exclusively on: **Web Design, 24/7 Lead Capture, Bookings & Upfront Deposits, Secure Cloud CRM, Email Automations, and WhatsApp Phone Alerts**.
* **Stickman Character Art Suite Integration**:
  - Generated and deployed 4 custom stickman character assets saved directly to `public/`:
    - `public/stickman_speed_automation.png` (Hero & Speed Kart Automation)
    - `public/stickman_baker_order.png` (Baker Order Alert)
    - `public/stickman_crm_autopilot.png` (CRM Autopilot Dashboard)
    - `public/stickman_relax_saved_time.png` (Time Saved & ROI Calculator)
* **Real 3-Tap Interactive Simulator (`components/interactive-phone-demo.tsx`)**:
  - Built an interactive widget with numbered step badges (`STEP 1`, `STEP 2`, `STEP 3`), item numbers (`01.`, `02.`, `03.`), and a live **HTML5 Calendar Date Picker Input** + quick date presets (*Tomorrow*, *This Saturday*, *Next Tuesday*).
  - Triggers live simulated WhatsApp notifications on the smartphone mockup.
* **Pricing Copy & Model Alignment (`lib/site-copy.ts`)**:
  - Aligned setup & retainer pricing tiers:
    - **One-Time Build (£495)**: 3–5 Page Custom Mobile Storefront + 24/7 Lead Capture.
    - **Flat Monthly Retainer (£195/mo)**: Custom 3-Tap Order Builder, Upfront Deposit Collection, and WhatsApp Alerts.
    - **Performance 5% Revenue Share**: 100% skin-in-the-game risk alignment.

### 3. Final Verification & Validation Results
* **Production Build**: Executed `npm run build` — **Built 100% successfully with 0 errors across all 60 static and dynamic routes** (`✓ Compiled successfully in 23.3s`).
* **Vendor Privacy Audit**: `grep_search` across `components/` and `lib/` verified **0 vendor tool names in public site text**.
* **Responsive Layouts**: Verified 100% layout compatibility across mobile smartphones, tablets, laptops, and desktop viewports.

---

## BUTTON NAVIGATION FIXES & MULTI-NICHE COPY OVERHAUL 2026-08-02

### 1. Incident & Audit Summary
On 2026-08-02, an audit of site interactive elements and niche positioning was conducted following user feedback regarding broken CTA buttons and single-niche copy focus.

### 2. Issues & Root Causes Identified
* **Anchor Scroll Interception Failure**: Next.js `<Link href="/#demo">` when clicked on `/` did not trigger smooth scrolling to `<div id="demo">`.
* **Misdirected CTA Targets**:
  - `bottleneck.tsx`: *"Test Interactive Order Builder →"* pointed to `/pricing#roi-calculator` instead of `#demo`.
  - `divergence-comparison.tsx`: *"Explore Interactive Demo"* pointed to `/book` instead of `#demo`.
  - `pricing.tsx`: ROI Estimator button linked to `/book` without passing recommended tier query params.
* **Unmapped Booking Form Parameters**: `booking-flow.tsx` only mapped 4 legacy service IDs and ignored `tier` parameters (`Essential Storefront`, `Pro Order Builder`, `Full Custom Build`, `Revenue Engine`, etc.) and new service tags (`storefront`, `order-builder`, `phone-alerts`, `review-engine`).
* **Single-Niche Jargon Bias**: Site copy heavily over-emphasized bakery/cake terms (*"baking at 6 AM"*), excluding broader local service providers, trades, and food artisans.

### 3. Fixes & Remediation Executed
* **Smooth-Scroll Event Handlers**:
  - Added custom smooth-scroll click handlers in `components/hero.tsx`, `components/bottleneck.tsx`, `components/divergence-comparison.tsx`, and `components/navbar.tsx` for instant scrolling to `#demo` and `#pricing`.
* **Booking Parameter Pre-filling**:
  - Updated `components/booking-flow.tsx` URL parameter logic to parse `?tier=...` and `?service=...` and pre-select corresponding items in the booking form.
* **Full Multi-Niche Copy Overhaul (`lib/site-copy.ts`)**:
  - Refined site copy across Hero, Bottleneck, Divergence, Why Mercian, Services, and FAQ sections to consistently position for **Local Services, Cake Bakeries, Food Artisans & Catering**.
  - Replaced *"While You're Baking at 6 AM..."* with universal positioning: *"While You're Busy On The Job, High-Value Leads Are Slipping Away."*
* **Navbar Logo & Links Sync**:
  - Converted Brand Logo `<button>` in `components/navbar.tsx` to Next.js `<Link href="/">`. Added `/process` and `/#demo` into `navLinks`.

### 4. Final Validation & Verification Results
* **TypeScript Compiler**: `npx tsc --noEmit` passed with **0 errors**.
* **Navigation Verification**: Verified all CTAs and smooth anchor scrolls across desktop & mobile viewports.

---

## SITE-WIDE CYAN & SLATE-NAVY BRAND UNIFICATION 2026-08-02

### 1. Audit Summary
On 2026-08-02, a full visual brand audit identified an inconsistency between the Hero section (Electric Sky Blue / Slate-Navy palette) and multiple lower components that still used legacy deep purple (`#130B24`, `rgba(109, 40, 217, ...)`) gradients and obsidian (`#07050B`) backgrounds.

### 2. Issues Identified
* **Legacy Purple Remnants**: `divergence-comparison.tsx`, `bottleneck.tsx`, `cta.tsx`, `testimonials.tsx`, `faq-home.tsx`, and `navbar.tsx` all contained `rgba(109, 40, 217, ...)` radial glows and `#07050B` / `#130B24` backgrounds.
* **Incorrect Button Hover Colour**: `components/ui/button.tsx` default variant hover was hardcoded to deep purple `#5B21B6` which clashed with the new Electric Cyan primary.
* **Card Hover Shadow**: `components/services.tsx` card hover shadow used `rgba(109, 40, 217, 0.15)` instead of Cyan.
* **CSS Token Misalignment**: `--color-accent-purple` was already correct (`#38BDF8`) but a bad edit had temporarily set it to `#8B5CF6` — restored.

### 3. Fixes Executed
* **`app/globals.css`**: Confirmed and restored `--color-accent-purple: #38BDF8` (Electric Cyan) and `--color-accent-purple-glow: rgba(56, 189, 248, 0.15)`.
* **`components/ui/button.tsx`**: Updated default variant hover from `hover:bg-[#5B21B6]` to `hover:bg-sky-300` + `text-slate-950`.
* **`components/divergence-comparison.tsx`**: Section background `#07050B` → `#090D16`; card gradient `via-[#130B24]` → `via-[#0F172A]`; purple glow → cyan; schema badge → `bg-sky-500/15`.
* **`components/bottleneck.tsx`**: Purple glow → cyan glow.
* **`components/cta.tsx`**: Section background `#07050B` → `#090D16`; purple glow → cyan.
* **`components/testimonials.tsx`**: Card ambient glow `rgba(109, 40, 217, 0.25)` → `rgba(56, 189, 248, 0.12)`.
* **`components/faq-home.tsx`**: Purple glow → cyan glow.
* **`components/services.tsx`**: Card hover shadow purple → cyan `rgba(56, 189, 248, 0.20)`.
* **`components/navbar.tsx`**: Mobile drawer background `#07050B` → `#090D16`; ambient glow purple → cyan.

### 4. Final Validation & Verification Results
* **TypeScript Compiler**: `npx tsc --noEmit` passed with **0 errors**.
* **Visual Consistency**: 100% of section backgrounds, card borders, active buttons, and glows now follow the unified Electric Sky Blue + Deep Slate-Navy + Amber Gold palette.
* **Zero Legacy Purple**: All hardcoded `#07050B`, `#130B24`, and `rgba(109, 40, 217, ...)` values eliminated from public-facing components.

---

## 1-CLICK EMAIL COPY & PERFORMANCE AUDIT 2026-08-02

### 1. Audit Summary
Verified all clickable links, mailto actions, brand metadata, and build performance to ensure 100% production readiness.

### 2. Enhancements & Fixes Executed
* **1-Click Email Copy Feature (`CopyEmailButton`)**:
  - Built `components/copy-email-button.tsx` to handle 1-click clipboard copy (`navigator.clipboard.writeText`) with animated green checkmark confirmation (`Copied!`).
  - Updated `components/footer.tsx` and `app/contact/page.tsx` with this component.
* **Mailto Tab Handling**:
  - Removed `target="_blank"` from mailto links to prevent browsers from opening empty blank tabs when initiating email actions.
* **Vercel ISR Writes Optimization**:
  - Switched `app/page.tsx` and `app/pricing/page.tsx` from `revalidate = 60` (ISR) to `export const dynamic = 'force-dynamic'`.
  - Eliminates Vercel ISR disk writes completely and utilizes the generous 1,000,000 Edge/Serverless Requests quota.
* **Full Brand & Email Alignment**:
  - Replaced legacy `MERCIAN WEALTH` strings and default notification emails with `LOCALENGINE AI` and `mercianwealthgs@gmail.com`.

### 3. Final Build & Verification Results
* **TypeScript Compiler**: `npx tsc --noEmit` passed with **0 errors**.
* **Next.js Production Build**: `npx next build` compiled **58/58 pages & API routes** in 17.3s with zero errors.
* **Working Tree State**: All local changes saved and ready.

