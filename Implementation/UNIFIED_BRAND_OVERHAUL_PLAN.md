# 🏛️ Mercian Wealth — Unified Brand & Single-Page Overhaul Plan

## Executive Overview & Goal Description

Transform `mercianwealth.com` into a single, unified, ultra-sleek master storefront inspired by Vesthorn (`vesthorn.com`). 

We are eliminating the separate `/local` page and moving all high-impact assets—including the interactive 3-tap cake/catering order demo, instant WhatsApp alert preview, plain-English local business copy, and simplified 3-tier pricing—directly onto the main homepage (`/`).

---

## 📐 Key Changes & Component Architecture

### 1. Site-Wide Copy Rewrite (`lib/site-copy.ts`)
Replace dense corporate real-estate jargon with crystal-clear, plain-language value propositions:

* **Hero Headline**: 
  > *"We Build Fast Websites & AI Automations That Capture Leads, Take Orders, and Scale Your Business — On Autopilot."*
* **Hero Subheadline**: 
  > *"We diagnose manual friction for bakeries, food artisans, local services, and estate operators across Berkshire & the UK. From sub-second mobile sites to automated WhatsApp order alerts and 5-star Google review engines."*
* **Hero Trust Pills**: 
  * `✓ Sub-1-Second Mobile Storefront`
  * `✓ Instant WhatsApp & SMS Order Alerts`
  * `✓ Automated 5-Star Google Review Engine`

### 2. Single-Page Architecture & Navigation Cleanup
* **Consolidate `/local` into Homepage**:
  - Remove the separate `/local` route or set up a clean redirect from `/local` → `/#demo` on `app/page.tsx`.
* **Navbar Optimization (`components/navbar.tsx` & `lib/site-copy.ts`)**:
  - Clean up navigation links to: `Home`, `Services`, `Process`, `Portfolio`, `Pricing`, `Contact`.
* **Homepage Demo Integration (`app/page.tsx`)**:
  - Embed `FieldSalesDemo` directly onto the main homepage (`/`) between the deliverables section and pricing section. It will serve as the primary interactive sales tool for both web visitors and face-to-face phone/iPad pitches.

### 3. Unified 3-Tier Pricing Model (`lib/site-copy.ts` & `components/pricing.tsx`)

Simplify pricing into a single, transparent table:

```
+----------------------------------+----------------------------------+----------------------------------+
|        DIGITAL STOREFRONT        |     GROWTH & ORDER ENGINE        |         AUTONOMIC SCALE          |
|            £495 Setup            |    £895 Setup (MOST POPULAR)     |           £1,850 Setup           |
|             £99/mo               |             £195/mo              |             £395/mo              |
+----------------------------------+----------------------------------+----------------------------------+
| • 3–5 Page Fast Custom Site      | • Everything in Storefront       | • Everything in Order Engine     |
| • Google Maps & Local SEO        | • Custom Cake/Catering Builder   | • Custom AI Chat Agent Concierge |
| • Auto Google Review Engine      | • Stripe Deposit Payments        | • Monthly Photo & Asset Pack     |
| • Hosting, Security & Edits      | • Instant WhatsApp/SMS Alerts    | • Custom CRM & Webhook Sync      |
+----------------------------------+----------------------------------+----------------------------------+
```

### 4. Files to Modify / Create

#### [MODIFY] [site-copy.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/lib/site-copy.ts)
Rewrite hero, diagnostic, service, and pricing copy to match the unified Vesthorn-style tone.

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/page.tsx)
Integrate `FieldSalesDemo` and update section order for single master homepage.

#### [MODIFY] [pricing.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/pricing.tsx)
Update default view to render the unified 3-tier model cleanly.

#### [MODIFY] [navbar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/navbar.tsx)
Clean up links array and mobile drawer.

#### [MODIFY] [announcement-bar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/announcement-bar.tsx)
Streamline top bar: `"We build custom AI automations & digital storefronts for growing businesses — Explore Solutions →"`

---

## 🚦 Verification Plan

### Automated Tests
* `npx tsc --noEmit` to verify 0 TypeScript errors.

### Manual Verification
1. Verify `mercianwealth.com/` loads as a single, ultra-clear homepage with Vesthorn-style messaging.
2. Test the interactive `FieldSalesDemo` on mobile viewports right on the homepage.
3. Test lead submission form and verify records are saved in Supabase with proper `lead_type` tags.
