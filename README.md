# Mercian Wealth — AI Automation & Digital Systems Platform
**High-Converting Websites & Automated Revenue Engines for UK Local Businesses**

---

## 🏛️ Brand System & Canonical Palette

Directly sampled and mathematically validated (WCAG AAA compliant: 8.06:1 to 10.43:1 contrast):

* **Canvas Navy**: `#020E28` — *Exact sampled background from `/public/MercianWealthLogo.jpeg`*
* **Surface Navy**: `#07153B` — *Card surfaces, modals, and container backgrounds*
* **Elevated Navy**: `#0C1D4D` — *Higher-elevation UI containers and focus states*
* **Primary Gold**: `#DAA640` — *Exact sampled MW monogram gold (Primary CTA buttons, badges)*
* **Warm Gold Highlight**: `#EBB755` — *Enhanced readability gold highlight for headings and body accents*
* **Hairline Border**: `rgba(218, 166, 64, 0.20)` — *Crisp 1px card borders*
* **Emblem Mark**: Gold MW Monogram with Market Stall Awning (`/public/MercianWealthLogo.jpeg`)

---

## 🛠️ Tech Stack & Architecture

* **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router, React 19)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
* **Database & Auth**: [Supabase](https://supabase.com/) PostgreSQL with Row Level Security (RLS) & Server-Side Session Auth (`proxy.ts`)
* **Payments & Deposits**: Stripe Checkout & automated deposit locking
* **Alert Infrastructure**: Sub-60s WhatsApp Phone Notifications & Webhooks
* **Scheduling**: Custom diagnostic calendar engine with Calendly integration
* **Analytics**: Vercel Analytics

---

## 🚀 6 Core Service Pillars

1. **Custom Mobile Web Design**: Sub-second, high-converting digital storefronts tailored for local UK operators.
2. **24/7 Lead Capture Engine**: Multi-step order builders taking customer specs and enquiries around the clock.
3. **Automated Upfront Deposits**: Non-refundable 50% deposit collection via Stripe to eliminate no-shows.
4. **Secure Cloud CRM**: Centralized customer records, order history, and lead management.
5. **Automated Email Confirmations**: Instant branded receipts, production updates, and calendar invites.
6. **Instant WhatsApp Alerts**: Sub-60 second phone notifications dispatched whenever a paid order is received.

---

## 🗺️ Page & Route Structure

```
app/
├── (auth)/login/               # Client and Admin login portal
├── page.tsx                    # Main Homepage (11 sections, interactive ROI engine, case studies)
├── services/page.tsx           # Full Services overview & interactive detail modals
├── process/page.tsx            # 7-Day Launch Protocol interactive accordion
├── portfolio/page.tsx          # Live Interactive Sandbox prototypes & case studies
├── pricing/page.tsx            # Transparent 3-tier pricing matrix & billing switcher
├── contact/page.tsx            # UK direct phone, WhatsApp dispatch & enquiry form
├── book/page.tsx               # 15-Minute diagnostic audit booking flow
├── testimonials/page.tsx       # Quantified client case studies and deliverables
├── terms/page.tsx              # Standard UK commercial terms
├── privacy/page.tsx            # GDPR-compliant privacy policy
├── sitemap.ts                  # Dynamic search engine XML sitemap
├── robots.ts                   # Search crawler directives
├── manifest.ts                 # PWA Web App manifest with #020E28 theme color
└── opengraph-image.tsx         # Dynamic 1200x630 social share card generator
```

---

## ⚡ Getting Started & Verification

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Typecheck verification (must be 0 errors)
npx tsc --noEmit

# 4. Build for production
npm run build
```

---

## 📄 License & Ownership
Mercian Wealth © 2026. All Rights Reserved. Exclusively engineered for United Kingdom businesses.
