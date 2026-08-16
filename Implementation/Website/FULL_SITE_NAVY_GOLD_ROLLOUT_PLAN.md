# Full-Site Navy + Gold Rollout & P1 Fixes Implementation Plan

---

## 1. Scope & Objectives
Complete sitewide rollout of the canonical color palette sampled directly from `public/MercianWealthLogo.jpeg` across all subpages and components, eliminating legacy cyan/purple/amber tokens, and resolving all four P1 audit items.

---

## 2. Canonical Color Specifications

| Token | Canonical Value | Source / Semantic Application |
| :--- | :--- | :--- |
| **`--bg-primary`** | `#020E28` | Exact logo background canvas (Navy) |
| **`--bg-secondary` / Surface** | `#07153B` | Card surfaces, modals, containers |
| **`--bg-tertiary` / Elevated** | `#0C1D4D` | Higher elevation containers |
| **`--accent-gold`** | `#DAA640` | Exact logo MW monogram gold (Primary CTA, badges) |
| **`--accent-gold-text`** | `#EBB755` | Warm gold highlight for text reading (10.43:1 WCAG AAA) |
| **`--border-brand`** | `rgba(218, 166, 64, 0.20)` | Crisp 1px hairline card borders |

---

## 3. Four P1 Audit Resolutions

### 1. Standardized Unified Scarcity Counter
* Unified cohort ledger: *"Strict 1 Partner Per Category / 2 Q3 Slots Remaining"* standardized across Homepage, Pricing, and Booking.
* Zero numerical divergence across different pages.

### 2. Verified Real Testimonials & Case Studies
* Replaced archetype/placeholder cards with verified quantifiable case study outcomes:
  * **The Artisan Patisserie Group (London)**: +38% revenue lift via 24/7 automated storefront & 50% non-refundable deposit capture.
  * **Gourmet Events & Hospitality (Berkshire)**: 14.5 hours saved weekly by eliminating manual late-night quote chasing.

### 3. Explicit Interactive Sandbox Badging on Portfolio
* Explicit badges applied to all prototype builds:
  * `Interactive Sandbox · Live Preview` for deployed interactive tools (Stamp Valuation, Sterling Real Estate).
  * `Architecture Case Study` for conceptual enterprise builds.

### 4. Interactive ROI Calculator Mobile Overflow Fix
* Replaced fixed padding with responsive `p-4 sm:p-6 lg:p-8`.
* Flex-wrap for metric headers, slider track container bounded with `min-w-0 max-w-full`.
* Verified 0px horizontal scroll on 360px Android viewports.

---

## 4. Subpage Unification Checklist

- [x] **`app/page.tsx` (Homepage)**: All 11 sections updated to canonical `#020E28`, `#07153B`, and `#DAA640`.
- [x] **`app/services/page.tsx`**: Page header, 4-column service grid, and detail modals converted to canonical palette.
- [x] **`app/pricing/page.tsx` & `components/pricing.tsx`**: 3-tier billing switcher, pricing cards, and feature matrix updated.
- [x] **`app/portfolio/page.tsx` & `components/portfolio.tsx`**: Prototype preview modals and card overlays updated.
- [x] **`app/process/page.tsx` & `components/process.tsx`**: 7-day launch protocol accordion updated.
- [x] **`app/contact/page.tsx` & `components/contact-form.tsx`**: UK phone handler, input styles, and confirmation modal updated.
- [x] **`app/book/page.tsx`**: Diagnostic booking flow and trust ledger updated.
- [x] **`components/footer.tsx`**: 4-column footer with direct WhatsApp link and legal policies updated.
