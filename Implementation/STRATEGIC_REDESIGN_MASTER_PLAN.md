# Strategic Redesign & Master Execution Plan - Mercian Wealth

## Executive Overview
This document serves as the master implementation spec for the full strategic reset, brand overhaul, visual redesign, copy realignment, and technical architecture of **Mercian Wealth**.

---

## Strategic Mandate & Target Model
* **Primary Target Model**: High-volume, fast-turnaround local business acquisition in Slough, Berkshire, and across the UK.
* **Monthly Revenue Benchmark**: £10,000+ monthly profit driven by 15–20 local business closures per month.
* **Local Package Tiers**: £495 – £1,495 setup fees + £195 – £495/mo retainer.
* **Enterprise Offer Handling**: Isolated to `/enterprise` route with a single subtle anchor link on the homepage.
* **Niche Focus Priority**:
  1. **Primary**: High-End Local Trades & Services (Plumbers, Electricians, HVAC, Roofers, Landscapers).
  2. **Secondary**: Bakeries, Gourmet Caterers & Artisanal Food Brands (Used for `/local` and field pitches).
  3. **Tertiary**: Aesthetics Clinics & Private Wellness Practices (Upsell pipeline).

---

## Approved Brand Identity & Colour Palette
Only 4 strict brand colors are permitted across 100% of components, text, borders, glows, and buttons (Restrained Palette):
1. **Primary Canvas**: Slate Dark Navy (`#0B0F17` / `#060B18`)
2. **Card Surfaces**: Deep Charcoal Slate (`#1E293B` / `#111827`)
3. **Primary Accent (CTA)**: Electric Gold (`#D9A74A` / `#C59B27`) or Emerald Green (`#10B981`)
4. **Body Text**: Sterling Silver (`#C3C7D4` / `#FFFFFF`)
*Strict Rule: Eliminate competing purples, light sky blues, and multi-color background glows to maintain a mature, enterprise-grade dark aesthetic.*

---

## Stage-by-Stage Execution Plan

### Stage 1: Logo Asset Update (Section 8)
Deploy `MercianWealthLogo.jpeg` and `MercianWealthWatermark.jpeg` across all 12 system locations:
- `lib/brand-assets.ts`
- `app/layout.tsx`
- `components/brand-logo.tsx`
- `components/navbar.tsx`
- `components/footer.tsx`
- `components/admin/sidebar.tsx`
- `components/client/sidebar.tsx`
- `components/dashboard/portal-hub.tsx`
- `app/(auth)/layout.tsx`
- `app/loading.tsx`
- `app/api/portfolio/request/route.ts`
- `app/api/forms/submit/route.ts`

### Stage 2: Colour System & Theme Harmonization
Replace off-brand colors (`sky-400`, `#38BDF8`, `purple-600`, `#130B24`, `blue-600`, `amber-400`) across all CSS variables, Tailwind classes, and component files with the strict 4-color Slate, Charcoal, Gold, and Sterling Silver system.

### Stage 3: Hero Section Redesign & Mascot Replacement
- **Mascot Strategy**: Remove cartoon stickman images (`stickman_speed_automation.png`, etc.) as primary hero visuals. Relegate stickman graphics strictly to tiny 32x32px explainer icons, or remove them entirely from the homepage.
- **Eyebrow Badge**: `[ AI AUTOMATION FOR LOCAL BAKERIES & SERVICES ]`
- **Headline**: *"Stop Missed Orders & Late Night DMs. Automated WhatsApp Order & Deposit Systems for Local Bakeries."*
- **Subheadline**: *"High-converting digital storefront, 3-tap custom cake builder, instant WhatsApp alerts, and automated Stripe deposit collection. Live in 7 days."*
- **Primary Hero Visual**: Interactive/animated WhatsApp Phone Mockup showing a customer placing a cake order and paying a deposit in 15 seconds, side-by-side with product UI screenshots (Order Builder & ROI Calculator).
- **Quantified Hero Proof Metric**: *"1,400+ Automated WhatsApp Orders Captured | £65,000+ Deposits Collected"*
- **CTAs**: Gold Primary `"Claim Free 15-Min Audit →"`, Silver Secondary `"Test 3-Tap Order Demo ↓"`.

### Stage 4: Local Integration Logo Bar & Social Proof
- **Integrations Bar**: Replace generic enterprise logos (Salesforce/Monday/UI Path) with recognizable local business tech stack logos: **WhatsApp Business**, **Stripe**, **SumUp**, **Square**, **Google Calendar**, **Shopify**, **Instagram DM**.
- **Founder Spotlight Section**: Feature real headshot/photo of the founder with name & title (*"Founded by [Name] — Dedicated to helping local bakeries automate orders and keep 100% of profit."*).
- **Specific Testimonials**: Replace generic labels with specific client titles (e.g. *"Sarah M. — Artisan Cake Designer, London"*).
- **Homepage Structure**: Isolate homepage to local volume conversion sequence while preserving transparent 3-tier pricing (£495 / £895 / £1,495).

### Stage 5: Floating Elements Consolidation (Section 5)
Consolidate competing mobile floating elements into a single Navy & Gold bottom bar:
`[ 📞 Call Direct ]  |  [ Get Free Audit (15 Mins) → ]`

### Stage 6: Technical Fixes (Section 6)
- Mobile Login Redirect: Replace `router.push` with `window.location.href` in `app/(auth)/login/page.tsx` to force mobile cookie flush.
- Update `lib/social-links.ts` to `https://www.linkedin.com/company/mercianwealth`.
- Preserve historical audit plan records in `Implementation/` directory.

### Stage 7: SEO Metadata & README Overhaul (Section 7)
- Apply updated metadata across `app/layout.tsx`, page exports, OG tags, and Twitter card tags.
- Fully rewrite `README.md` to accurately represent Mercian Wealth.

### Stage 8: Dedicated Pricing Page & Component Unification (COMPLETED)
- Single Unified `Pricing` Component (`components/pricing.tsx`):
  - Renders single 3-tab switcher (`ONE-TIME SETUP`, `MONTHLY RETAINER`, `% REVENUE SHARE`).
  - Active tier cards grid rendered once without duplication.
  - Interactive feature comparison matrix embedded cleanly at the bottom of `/pricing`.
- Verified live visual browser audit on `http://localhost:3000` and `http://localhost:3000/pricing` with zero element collisions.
- Clean `npx tsc --noEmit` build (0 compilation errors).

---

## Verification Strategy
- Run `npx tsc --noEmit` after every single stage.
- Live visual inspection with browser agent.
- Ensure 0 errors before deployment.

