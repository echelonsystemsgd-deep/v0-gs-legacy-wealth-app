# Branding, Meta Tags, Contact Infrastructure & Workflow UI Master Plan

## Status: COMPLETED ✅

## Overview
This document records the exact positioning, branding, contact infrastructure, and visual refinements completed across `mercianwealth.com`. The codebase is 100% aligned with the core target audience: **Websites & Automation for Bakeries, Caterers, and Local UK Service Businesses**.

---

## 1. Meta Tags & Social Preview Alignment (Completed ✅)
- **Target Files**:
  - [`lib/site-copy.ts`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/lib/site-copy.ts)
  - [`app/layout.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/layout.tsx)
- **Exact Implemented Tags**:
  - **Page Title**: `Mercian Wealth | Websites & Automation for Bakeries & Local Businesses`
  - **Meta Description**: `Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls. From £495.`
  - **Open Graph (Facebook/WhatsApp/iMessage)**:
    - `og:title`: `Mercian Wealth | Websites & Automation for Bakeries & Local Businesses`
    - `og:description`: `Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls.`
    - `og:site_name`: `Mercian Wealth`
    - `og:type`: `website`
    - `og:url`: `https://mercianwealth.com`
    - `og:locale`: `en_GB`
  - **Twitter Card**:
    - `twitter:card`: `summary_large_image`
    - `twitter:title`: `Mercian Wealth | Websites & Automation for Bakeries & Local Businesses`
    - `twitter:description`: `Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls.`
  - **Meta Keywords**:
    - `website for bakery, local business automation, WhatsApp order alerts, deposit collection UK, small business website, bakery website design, catering business website`

---

## 2. Brand Logo & Emblem Upgrade (Completed ✅)
- **Target Files**:
  - [`components/brand-logo.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/brand-logo.tsx)
  - [`lib/brand-assets.ts`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/lib/brand-assets.ts)
- **Implemented Changes**:
  - Upgraded badge fallback to `ModernBrandBadge` featuring a sleek dark-mode vector emblem combining the **MW mark** with **storefront awning lines**.
  - Replaced legacy heraldic crest to maintain a 100% unified visual identity across header, hero watermark, and footer.

---

## 3. Contact Email Standardisation (Completed ✅)
- **Target Files**:
  - [`components/footer.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/footer.tsx)
  - [`components/copy-email-button.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/copy-email-button.tsx)
  - [`app/contact/page.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/contact/page.tsx)
- **Implemented Changes**:
  - Replaced `mercianwealthgs@gmail.com` with branded address `contact@mercianwealth.com` across all visible site components, copy buttons, and contact page cards.

---

## 4. Workflow Demo Product UI Graphics (Completed ✅)
- **Target Files**:
  - [`components/stickman-workflow.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx)
- **Implemented Changes**:
  - Replaced static mascot illustrations inside the product workflow showcase with dark-mode interactive Tailwind UI cards:
    1. **Step 1 (24/7 Mobile Storefront)**: Interactive checkout card showing 50% upfront deposit capture (£125.00) for custom celebration cake orders.
    2. **Step 2 (Instant WhatsApp Webhook)**: Real-time alert UI card displaying order breakdown & Stripe payment confirmation.
    3. **Step 3 (CRM Autopilot)**: Encrypted CRM table feed logging leads, deposit tags, and automated Google review requests.
    4. **Step 4 (Weekly Freedom Recovery)**: Metric card displaying `10.5 Hours Saved / Wk` and `£0 Lost Unpaid Bookings`.

---

## Verification Summary
1. All page meta tags in `app/layout.tsx` and `lib/site-copy.ts` match local business copy standards.
2. Email touchpoints display `contact@mercianwealth.com`.
3. Modern MW + Awning emblem replaces legacy crest badge.
4. Product demo renders clean interactive UI mockups.
5. TypeScript compilation passed cleanly with zero errors (`tsc --noEmit`).
