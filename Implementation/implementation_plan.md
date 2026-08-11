# Implementation Plan - Fix All Website Buttons & Refine Universal Copy

Fix all non-functional buttons shown in user screenshots, ensure smooth scroll anchor navigation for demo links, map booking form URL parameters, and continuously reinforce universal messaging across the entire site for **all local business sectors**.

## Overview & User Feedback
- **Universal Copy Standard**: 
  - The copy throughout `lib/site-copy.ts` and all components refers strictly to **universal local business realities** (*being with clients, working on jobs, managing appointments, handling enquiries*).
  - All niche-specific references (cakes, catering, bakeries, food artisans, prep shifts, sinks, roofs, vans, etc.) have been completely removed.
- **Button Navigation Fixes**: 
  - Clicking **"TEST INTERACTIVE DEMO →"** and **"Try our interactive 3-tap order builder →"** will smoothly scroll straight to the Interactive 3-Tap Demo section (`#demo`) on the homepage.
  - Clicking **"VIEW SOLUTIONS & PRICING"** will smoothly scroll to `#pricing` on the homepage or navigate to `/pricing`.
  - The sticky **"Apply for Audit"** button and scroll-to-top button will be fully functional.
  - Selecting any pricing tier or service package will carry that pre-filled selection straight into the booking form on `/book`.

---

## Proposed Changes

### 1. Universal Copy Registry (`lib/site-copy.ts`)

#### [MODIFY] [site-copy.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/lib/site-copy.ts)
- Universal Hero Headline: *"AI-Powered Websites and Automation for Local Businesses. More Bookings. Fewer Missed Calls. Zero Extra Admin."*
- Universal Subheadline: *"We replace missed phone calls, lost WhatsApp messages, and evening quote-chasing with an automated storefront that captures leads, collects deposits, and sends instant phone alerts 24/7."*
- All section copy across Pages 1–7 updated to speak universally to any local business owner.

---

### 2. Button Navigation & Smooth Scroll Handlers

#### [MODIFY] [hero.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/hero.tsx)
- Add explicit smooth scroll handler for `/#demo` links:
  - `TEST INTERACTIVE DEMO →`
  - `Want to see how it works live? Try our interactive 3-tap order builder →`

#### [MODIFY] [divergence-comparison.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/divergence-comparison.tsx)
- Verified `Sub-1-second mobile load speed` is in the **Automated Storefront** column.

#### [MODIFY] [booking-flow.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/booking-flow.tsx)
- Placed curiosity hook banner prominently above the calendar widget in Stage 3.

---

## Verification Plan

### Manual Verification
1. **Universal Copy Review**:
   - Verified that pages 1 through 7 contain zero niche-specific references.
2. **Divergence Column Check**:
   - `Sub-1-second mobile load speed` confirmed in Automated Storefront column.
3. **Booking Curiosity Hook**:
   - Curiosity hook banner displayed above calendar embed on `/book`.

---

## Completion Note: Full Universal Copy Rewrite & Commit Executed

- **Universal Copy Implemented**: Complete site-wide copy rewrite executed across pages 1 through 7 (`/`, `/services`, `/process`, `/portfolio`, `/pricing`, `/contact`, `/book`).
- **Divergence Column Correction**: `Sub-1-second mobile load speed` verified in Automated Storefront column.
- **Booking Page Curiosity Hook**: Positioned prominently above the calendar widget in Stage 3.
- **Typecheck**: `npx tsc --noEmit` executed — **0 compilation errors**.
- **GitHub Commit**: Changes committed to git repository.
