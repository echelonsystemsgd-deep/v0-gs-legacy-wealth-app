# Mercian Wealth — UK AI Automation & High-Performance Web Agency
**The Premier AI Automation, Conversational Systems & Web Design Platform for UK Businesses**

---

## 🏛️ Brand System & Canonical Palette

Directly sampled and mathematically validated (WCAG AAA compliant: 8.06:1 to 10.43:1 contrast):

* **Canvas Midnight Navy**: `#020E28` — *Exact sampled background from `/public/MercianWealthLogo.jpeg`*
* **Surface Navy**: `#07153B` — *Card surfaces, modals, and container backgrounds*
* **Elevated Navy**: `#0C1D4D` — *Higher-elevation UI containers and focus states*
* **Imperial Monogram Gold**: `#DAA640` — *Exact sampled MW monogram gold (Primary CTA buttons, badges)*
* **Luminous Warm Gold**: `#EBB755` — *Enhanced readability gold highlight for headings and accents*
* **Hairline Border**: `rgba(218, 166, 64, 0.20)` — *Crisp 1px card borders*
* **Emblem Mark**: Gold MW Monogram with Market Stall Awning (`/public/MercianWealthLogo.jpeg`)

---

## 🛠️ Tech Stack & Architecture

* **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router, React 19, Server & Client Components)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
* **Database & Auth**: [Supabase](https://supabase.com/) PostgreSQL with Row Level Security (RLS) & Server-Side Session Auth (`proxy.ts`)
* **Payments & Billing**: Stripe UK Checkout, Apple Pay, Google Pay & automated deposit collection
* **Automation Infrastructure**: WhatsApp Business Cloud API, n8n / Make.com Webhooks, Resend Transactional Email Engine
* **UK Compliance & Security**: UK & EU GDPR Compliant, zero AI model training on client confidential business data
* **Performance Standard**: Sub-second load speeds, 100/100 Core Web Vitals, fluid responsive typography

---

## 🚀 Core Service Pillars

1. **High-Performance Web Design & Bespoke Apps**: Sub-second load times, luxury aesthetics, interactive product builders.
2. **24/7 AI Lead & Order Capture**: WhatsApp Business & web conversational engines capturing customer orders and inquiries around the clock.
3. **Automated Upfront Deposit Collection**: Stripe-integrated 50% non-refundable deposit collection to eliminate unpaid no-shows.
4. **Instant Sub-60s Dispatch Alerts**: Instant WhatsApp and SMS pings sent straight to the business owner's smartphone.
5. **UK Toolchain & Accounting Sync**: Automated CRM synchronization into Xero, QuickBooks UK, HubSpot, and Supabase.
6. **Automated 5-Star Google Review Engine**: Post-service automated dispatch links steadily building local Google search dominance.

---

## 🗺️ Page & Route Architecture

```
app/
├── (admin)/                    # Admin CRM, lead analytics, and content management
├── (auth)/login/               # Client and Admin secure authentication portal
├── (client)/                   # Client project war room & live telemetry dashboard
├── page.tsx                    # Main Homepage (Interactive Phone Sandbox, ROI Calculator, System Blueprint)
├── services/page.tsx           # Full Services overview & interactive detail modals
├── process/page.tsx            # 7-Day Launch Protocol interactive accordion
├── portfolio/page.tsx          # Live Interactive Sandbox prototypes & case studies
├── pricing/page.tsx            # Transparent 3-tier GBP (£) pricing matrix & billing switcher
├── contact/page.tsx            # UK direct phone, WhatsApp dispatch & enquiry form
├── book/page.tsx               # 15-Minute diagnostic audit booking flow
├── testimonials/page.tsx       # Quantified client case studies and deliverables
├── terms/page.tsx              # Standard UK commercial terms
├── privacy/page.tsx            # UK/EU GDPR-compliant privacy policy
├── sitemap.ts                  # Dynamic search engine XML sitemap
├── robots.ts                   # Search crawler directives
├── manifest.ts                 # PWA Web App manifest
└── opengraph-image.tsx         # Dynamic 1200x630 social share card generator
```

---

## ⚡ Getting Started & Verification

```bash
# 1. Install dependencies
pnpm install # or npm install

# 2. Run local development server
npm run dev

# 3. Typecheck verification (Strict 0 compilation errors)
npx tsc --noEmit

# 4. Build for production
npm run build
```

---

## 📄 License & Ownership
Mercian Wealth © 2026. All Rights Reserved. Engineered in the United Kingdom.
