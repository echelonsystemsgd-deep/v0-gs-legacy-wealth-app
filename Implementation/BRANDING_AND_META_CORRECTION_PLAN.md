# Branding, Meta Tags, and Contact Infrastructure Correction Plan

## Overview
This plan addresses critical positioning and brand mismatches across `mercianwealth.com`. The goal is to align page titles, meta descriptions, Open Graph/Twitter social preview tags, brand logo/watermark elements, contact emails, and Calendly booking links with the actual service offering: **AI-Powered Websites & Automation for Local Service Businesses** (bakeries, caterers, trade services).

---

## 1. Meta Tags & Social Preview Alignment (Priority 1)
- **Target Files**:
  - `lib/site-copy.ts`
  - `app/layout.tsx`
- **Changes**:
  - Replace legacy "Luxury AI-Powered Websites ... Vetted partnerships only" with sharp, local business conversion copy.
  - Update `layout` defaultTitle, titleTemplate, description, OG title/description, Twitter card metadata, and keywords array.
  - Ensure individual page meta tags (`home`, `services`, `process`, `portfolio`, `pricing`, `testimonials`, `contact`, `book`) in `SITE_COPY.metadata` maintain consistent messaging.

---

## 2. Brand Logo & Watermark Assets (Priority 2)
- **Assets retained**: References in `lib/brand-assets.ts` and `app/layout.tsx` explicitly point to your original image files (`public/MercianWealthLogo.jpeg` and `public/MercianWealthWatermark.jpeg`).

---

## 3. Contact Email Standardisation (Priority 3)
- **Email retained**: `mercianwealthgs@gmail.com` is explicitly preserved as the primary contact email across all components, footer, contact form routes, and copy buttons as requested by the user.

---

## 4. Calendly Audit & Integration (Priority 4)
- **Target Files**:
  - `components/client/booking-calendly.tsx`
  - `components/calendly-popup-button.tsx`
- **Changes**:
  - Ensure booking parameters and fallback URLs match `contact@mercianwealth.com` and 15-minute audit booking positioning.

---

## Verification Plan
1. Check meta tags in `app/layout.tsx` and `lib/site-copy.ts`.
2. Test responsive header, footer, hero watermark, and logo rendering.
3. Verify contact form submissions and email buttons point to `contact@mercianwealth.com`.
4. Run `npm run build` to verify zero TypeScript or Next.js build errors.
