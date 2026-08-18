# Portfolio Lead Prototypes, Prototype Disclaimer & Copyright Strategy

## Executive Summary
This document establishes the architecture, legal safeguards, and deployment guidelines for showcasing custom lead prototypes within the Mercian Wealth / Sovereign agency portfolio. It covers the retirement of generic mockups in favor of live client sandboxes (**Caker St.** and **Grand Wedding Cakes**), implementation of disclaimer banners, trademark/copyright considerations, backend admin synchronization, and responsive UX verification.

---

## 1. Prototype Showcase & Lead Architecture

### Portfolio Lineup (Zero External Link Exposure)
1. **Stamp Valuation App (SellYourStampsUK)**
   * **Domain / Category:** AI Computer Vision · Case Study
   * **Benchmark:** Target Latency: < 1s
   * **Link Status:** Fully Isolated (Zero external links exposed). Opens "Book A Live Demonstration" lead-capture modal.

2. **Caker St. London Bakery**
   * **Domain / Category:** E-Commerce & Ordering · Case Study
   * **Benchmark:** Interactive Cake Concierge (30s Quote)
   * **Highlights:** Multi-step cake matching concierge, 100% Eggless & Halal filters, Trustpilot integration, popup-free browsing.
   * **Link Status:** Fully Isolated (Zero external links exposed). Opens "Book A Live Demonstration" lead-capture modal.

3. **Grand Wedding Cakes**
   * **Domain / Category:** Luxury Bridal Atelier · Case Study
   * **Benchmark:** Tier Architecture & White-Glove Setup
   * **Highlights:** Editorial luxury design, tiered packages (Drop-Off £450, Silver £750, Gold £1,000+), interactive flavour/buttercream matrix, wedding cake cutting tier logistics.
   * **Link Status:** Fully Isolated (Zero external links exposed). Opens "Book A Live Demonstration" lead-capture modal.

---

## 2. Industry Best Practices: Disclaimer Banners & Copyright Protection

### A. Prototype Disclaimer Banners
* **Why Required:** 
  1. Prevents consumer confusion and accidental orders (both prototype sites include realistic contact numbers and pricing).
  2. Sets explicit expectations that transactions and bookings operate in demo sandbox mode.
  3. Acts as an inbound agency lead magnet linking back to the primary engineering studio.
* **Banner Specification:**
  * **Visual Format:** Subtle floating top bar or bottom pill badge:
    > *"💡 Interactive Concept Prototype — Created for demonstration purposes by Mercian Wealth Studio. [View Portfolio]"*
  * **Behavior:** Dismissible with `✕` button to ensure clean client presentations.
  * **SEO / Crawler Safeguard:** Prototype `<head>` configured with `<meta name="robots" content="noindex, nofollow" />` to prevent search engines from indexing the prototype over the client's production domain.

### B. Copyright & Trademark Strategy
* **Private 1-on-1 Pitches:** Retain the client's actual branding, logos, and geographical positioning (e.g. Southall / London & Essex) for maximum emotional resonance and sales conversion.
* **Public Agency Portfolio:**
  * **Option 1 (Concept Redesign Attribution):** Clearly label case studies with:
    > *"Concept Redesign & Architectural Prototype — Developed independently to demonstrate enhanced UX and conversion pathways. Not officially affiliated with or endorsed by the featured brand."*
  * **Option 2 (Fictionalized Rebrand for White-Label Showcases):** If requested, anonymize to luxury placeholder brands (e.g., *"Sugar Street Bakery"* or *"The Grand Atelier"*) with 100% identical UI and interactive workflows.

---

## 3. Frontend & Admin Implementation Details

### A. Frontend (`components/portfolio.tsx`)
* Updated `DEFAULT_PORTFOLIO` with the 3 live sandbox items.
* Custom CSS mockups within `PremiumMockup` for **Caker St.** (burgundy/gold aesthetic with Trustpilot badge & concierge snippet) and **Grand Wedding Cakes** (ivory/navy luxury palette with tier pricing breakdown).
* Embedded `PrototypePreviewModal` providing sandbox iframe testing with preloader and demo status banner.
* Mobile-responsive bottom action bars with responsive touch targets and truncate protection.

### B. Backend Admin Dashboard (`app/(admin)/admin/portfolio/page.tsx`)
* Synchronized `DEFAULT_FRONTEND_PROJECTS` array to maintain consistent fallbacks when the database table is initializing.
* Full CRUD support with live preview launch links, badge tagging (`Interactive Sandbox`), and archive/feature toggles.

---

## 4. Verification & Device Readiness Matrix

| Device Breakpoint | Target Resolution | Verification Status | Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Mobile (Small)** | 320px – 375px | ✅ Passed | Stacked 1-col cards, fixed bottom action bar with tap-to-test button |
| **Mobile (Standard)** | 390px – 430px | ✅ Passed | Full-width cards with high-contrast text and clean touch targets |
| **Tablet** | 768px – 1024px | ✅ Passed | 2-column grid layout with smooth aspect ratios |
| **Desktop / Ultrawide** | 1280px+ | ✅ Passed | Hover reveal slide-up overlay with direct sandbox launcher |

---

## 5. Maintenance Checklist
- [x] Remove deprecated mockups (Elite Fitness, Sterling Direct Purchases, Strategic Growth).
- [x] Add Caker St. and Grand Wedding Cakes sandbox configurations.
- [x] Verify Next.js production build (`npm run build` exits with code 0).
- [x] Synchronize admin dashboard defaults with frontend showcase.
- [x] Document copyright, disclaimer, and lead pitch guidelines.
