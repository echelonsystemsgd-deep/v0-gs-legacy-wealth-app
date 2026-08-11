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
Only 4 strict brand colors are permitted across 100% of components, text, borders, glows, and buttons:
1. **Primary Background**: Navy (`#0A1128` / `#060B18`)
2. **Primary Accent**: Gold (`#D9A74A` / `#C59B27`)
3. **Body Text**: White (`#FFFFFF`)
4. **Secondary Accent**: Silver (`#94A3B8` / `#CBD5E1`)

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

### Stage 2: Colour System Overhaul (Section 2)
Replace every off-brand color (`sky-400`, `#38BDF8`, `emerald-400`, `#130B24`, `blue-600`, `amber-400`) across all CSS variables, Tailwind classes, and component files with the strict 4-color Navy, Gold, White, and Silver system.

### Stage 3: Hero Section Redesign (Section 3)
- **Eyebrow**: `[ AI AUTOMATION FOR LOCAL BUSINESSES ]`
- **Headline**: *"Stop Losing Local Customers To Missed Calls & Manual Work. We Build Automated Digital Systems That Capture Leads & Collect Deposits 24/7."*
- **Subheadline**: *"Professional high-converting web storefront, 3-tap order builder, instant WhatsApp phone alerts, and automated 5-star Google review collection. Deployed in under 7 days."*
- **Visuals**: Animated System Node Visualizer (Live Lead -> WhatsApp Alert -> Deposit Secured -> Review Request).
- **CTAs**: Gold Primary `"Claim Free 15-Min Audit →"`, Silver Secondary `"Test 3-Tap Order Demo ↓"`.

### Stage 4: Homepage Structure & Page Isolation (Section 4)
- Isolate main homepage to 100% local volume conversion sequence.
- Move `FieldSalesDemo` strictly to `/local`.
- Create `/enterprise` route for enterprise package tiers (£1,850 – £7,500+).
- Zero Fabrication Policy: Frame social proof as capabilities & 7-day deployment commitment.

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

---

## Verification Strategy
- Run `npx tsc --noEmit` after every single stage.
- Ensure 0 errors before proceeding to the next stage.
- Push to GitHub only after all 7 stages are clean and complete.
