# Implementation Plan - Fix All Website Buttons & Refine Hybrid Niche Copy

Fix all non-functional buttons shown in user screenshots, ensure smooth scroll anchor navigation for demo links, map booking form URL parameters, and continuously reinforce the complete hybrid niche messaging across the entire site (**Local Services, Cake Bakeries, Food Artisans & Catering**).

## Overview & User Feedback
- **Multi-Niche Copy Alignment**: 
  - The copy throughout `lib/site-copy.ts` and all components constantly and explicitly refers to **local services, cake bakeries, food artisans, and catering businesses**.
  - Examples of real-world scenarios across all four categories (e.g. custom birthday cake orders, catering platters, local service appointments, trade consultations) will be woven into every section.
- **Button Navigation Fixes**: 
  - Clicking **"TEST INTERACTIVE DEMO →"** and **"Try our interactive 3-tap order builder →"** will smoothly scroll straight to the Interactive 3-Tap Demo section (`#demo`) on the homepage.
  - Clicking **"VIEW SOLUTIONS & PRICING"** will smoothly scroll to `#pricing` on the homepage or navigate to `/pricing`.
  - The sticky **"Apply for Audit"** button and scroll-to-top button will be fully functional.
  - Selecting any pricing tier or service package will carry that pre-filled selection straight into the booking form on `/book`.

---

## Proposed Changes

### 1. Site Copy Expansion (`lib/site-copy.ts`)

#### [MODIFY] [site-copy.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/lib/site-copy.ts)
- Update **Homepage Hero**: Emphasize custom web design, lead capture, 24/7 online booking, and automated CRM engines for **local services, cake bakeries, food artisans, and catering brands**.
- Update **Bottleneck / Daily Reality Section**:
  - Headline: *"While You're Busy On The Job or In The Kitchen, High-Value Leads & Orders Are Slipping Away."*
  - Subheadline & Cards: Include specific scenarios for **custom cake orders, catering platters, local service appointments, and trade consultations**.
- Update **Divergence, Services, Why Mercian, and FAQ sections**: Consistently highlight the four pillars (**local services, cake bakeries, artisans, catering**).

---

### 2. Button Navigation & Smooth Scroll Handlers

#### [MODIFY] [hero.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/hero.tsx)
- Add explicit smooth scroll handler for `/#demo` links:
  - `TEST INTERACTIVE DEMO →`
  - `Want to see how it works live? Try our interactive 3-tap order builder →`
- Ensure `VIEW SOLUTIONS & PRICING` handles scrolling to `#pricing` or navigating to `/pricing`.

#### [MODIFY] [bottleneck.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/bottleneck.tsx)
- Update link and button target to smoothly scroll down to `<div id="demo">` when clicking "Test Interactive Order Builder →".

#### [MODIFY] [divergence-comparison.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/divergence-comparison.tsx)
- Point "Explore Order Engine Demo →" CTA button to smooth scroll to `<div id="demo">`.

#### [MODIFY] [navbar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/navbar.tsx)
- Convert Brand Logo `<button>` to Next.js `<Link href="/">`.
- Include `/process` and `/#demo` in navigation links.

---

### 3. Booking Flow Pre-filling (`components/booking-flow.tsx`)

#### [MODIFY] [booking-flow.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/booking-flow.tsx)
- Map URL parameters `?tier=...` and `?service=...` so clicking ANY pricing or service CTA preselects the corresponding option in the booking form on `/book`.

---

## Verification Plan

### Manual Verification
1. **Hero Buttons (Shown in Screenshot)**:
   - Click `TEST INTERACTIVE DEMO →` -> Verify smooth scroll straight to `Interactive 3-Tap Phone Demo` (`#demo`).
   - Click `VIEW SOLUTIONS & PRICING` -> Verify smooth scroll to `#pricing` or navigation to `/pricing`.
   - Click `Try our interactive 3-tap order builder →` -> Verify smooth scroll to `#demo`.
2. **Bottleneck Section Button**:
   - Click `Test Interactive Order Builder →` in the Bottleneck section -> Verify smooth scroll to `#demo`.
3. **Copy Review**:
   - Verify that the homepage headline and sections constantly refer to **local services, cake bakeries, artisans, and catering**.
4. **Booking Pre-fill**:
   - Click any pricing tier CTA -> Verify `/book` opens with the selected tier pre-filled in the form.
