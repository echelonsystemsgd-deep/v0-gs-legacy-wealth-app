# Mobile Audit & Responsive Layout Fixes Implementation Plan
Date: 2026-07-24

## Goal Description
Address all 7 mobile UX and layout issues identified during real-device testing to ensure clean, high-converting responsive design across all viewports without breaking desktop behavior or violating site standards.

---

## Technical Diagnoses & Fix Specifications

### Issue 1: Large Empty Black Gap Between Bottleneck Section & Chapter II Divider
- **Root Cause:** `components/bottleneck.tsx` applies `py-24` (96px) on mobile and `mt-16` (64px) on the CTA container. `components/section-divider.tsx` applies `py-16` (64px) on mobile. Combined, these create 160px+ of empty space between content and the divider line.
- **Fix:**
  - Update `Bottleneck` section padding: `py-12 sm:py-24 lg:py-32`.
  - Update post-bottleneck CTA margin: `mt-10 sm:mt-16`.
  - Update `SectionDivider` padding: `py-8 sm:py-16`.

### Issue 2: Pricing Comparison Table Column Cutoff on Mobile
- **Root Cause:** `components/pricing.tsx` matrix uses `min-w-[600px]` with `overflow-x-auto` and `sticky left-0 bg-bg-primary z-20` on the `Feature Category` column. On small screens (~375px), the sticky column takes ~50% width and hides 2 out of 3 pricing tiers with no scrollbar.
- **Fix (Option B - Tab Switcher):**
  - Implement a mobile tab switcher (`Authority Suite` | `Operations Machine` | `Revenue Engine`) for screens `< 768px` (`block md:hidden`).
  - Mobile view displays a clean 2-column breakdown comparing `Feature Category` vs. the active tab's tier.
  - Desktop retains full 4-column matrix (`hidden md:block`).

### Issue 3: Missing Login / Dashboard Access Link on Mobile Navigation
- **Root Cause:** `components/navbar.tsx` mobile menu drawer contains site links and the main CTA, but lacks a link to `/login` when logged out and quick portal access when logged in.
- **Fix:**
  - Add a `Login` link (routing to `/login`) below `Contact` and above the main CTA button when logged out.
  - When logged in, add a direct `Dashboard` / `Admin Panel` / `Client Portal` link based on user role.

### Issue 4: Mobile Menu Drawer Not Position Fixed / Background Scrolling
- **Root Cause:** `components/navbar.tsx` does not lock `document.body.style.overflow` when `isMobileMenuOpen` is true. Scrolling on mobile drags the main page behind the open menu drawer.
- **Fix:**
  - Add an `useEffect` hook in `components/navbar.tsx` that sets `document.body.style.overflow = "hidden"` when `isMobileMenuOpen` is true and cleans up to `"unset"`.
  - Update mobile drawer position styling to `fixed inset-x-0 top-16 bottom-0 sm:top-20 z-40 bg-[#0D0716] overflow-y-auto`.

### Issue 5: Floating "Apply for Audit" Button Overlaps Open Mobile Menu
- **Root Cause:** `StickyCTAButton` (`components/sticky-cta-button.tsx`) is rendered at `z-50` in `app/layout.tsx` without observing `isMobileMenuOpen` state from `Navbar`.
- **Fix:**
  - `Navbar` toggles class `mobile-menu-open` on `document.body` when `isMobileMenuOpen` changes.
  - `StickyCTAButton` listens for body class changes / includes CSS rule `.mobile-menu-open .sticky-cta-container { display: none !important; }` to hide the floating CTA while the menu is open.

### Issue 6: "The Autonomic Engine" Heading Terminology Replacement
- **Root Cause:** Heading in `components/divergence-comparison.tsx` and `lib/site-copy.ts` contains the technical term "Autonomic Engine".
- **Fix:** Replace "The Autonomic Engine" with plain English option **"The Automated Growth Engine"** across headings and labels in `divergence-comparison.tsx` and `site-copy.ts`.

### Issue 7: Target Yield Percentage Metric Violation
- **Root Cause:** Service card 3 (Cloud Data Architecture & Pipelines) outcome in `lib/site-copy.ts` is `100% Data Sovereignty`. The 100% metric is unverified.
- **Fix:** Update Service 3 outcome in `lib/site-copy.ts` to `"Complete Data Sovereignty & Isolation"`.

---

## Verification Plan
1. Run `npx tsc --noEmit` to ensure zero TypeScript errors.
2. Confirm `npm run dev` builds and starts cleanly.
3. Validate mobile drawer, table tab switcher, and section spacing in responsive views.
