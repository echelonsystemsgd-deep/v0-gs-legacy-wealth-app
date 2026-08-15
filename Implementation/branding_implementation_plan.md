# Mercian Wealth Branding, Logo & UI Implementation Plan

## Status: COMPLETED ✅

## Overview
This document records the exact branding, logo, and UI integration completed across `mercianwealth.com`. All legacy mascot graphics inside product workflow sections have been replaced with dark-mode interactive UI cards, and visual identity is unified around local business storefront automation.

---

## 1. Asset Audit & Integration Findings (Completed ✅)

| Asset / Component | Visual Attributes | Implemented Placement |
| :--- | :--- | :--- |
| **MW + Awning Emblem** (`ModernBrandBadge`) | Dark slate emblem with gold MW typography + storefront awning vector mark | Header Navbar, Footer, Fallback Brand Logo Component |
| **Workflow Step 1 (24/7 Storefront)** | Interactive Tailwind UI checkout card with 50% deposit lock (£125.00) | [`components/stickman-workflow.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx) |
| **Workflow Step 2 (WhatsApp Webhook)** | WhatsApp alert notification card with live order summary & Stripe confirmation | [`components/stickman-workflow.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx) |
| **Workflow Step 3 (CRM Autopilot)** | Encrypted database table feed logging customer records & review triggers | [`components/stickman-workflow.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx) |
| **Workflow Step 4 (Weekly Freedom)** | Admin metric dashboard card showing `10.5 Hours Saved / Wk` & zero unpaid slots | [`components/stickman-workflow.tsx`](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx) |

---

## 2. Issues Resolved

> [!IMPORTANT]
> **Issue 1: Mascot Graphic Clash inside Product Workflow**
> In `components/stickman-workflow.tsx`, static mascot PNG illustrations (`/stickman_baker_order.png`, etc.) created a visual clash when placed next to technical node graphs and ROI calculators. They have been replaced with interactive, responsive dark-mode UI mockups.

> [!IMPORTANT]
> **Issue 2: Contact Infrastructure Standardisation**
> All instances of legacy contact email `mercianwealthgs@gmail.com` across footer cards, copy buttons, and contact page components have been replaced with `contact@mercianwealth.com`.

> [!IMPORTANT]
> **Issue 3: SEO & Social Preview Tag Alignment**
> All layout & homepage meta tags, Open Graph schema (`og:title`, `og:description`, `og:locale`), Twitter cards, and keyword arrays have been updated to exact local business search positioning.

---

## 3. Verification Plan
1. **Hero & Header Inspection**: Confirm logo scales smoothly and navbar blends cleanly.
2. **Workflow Demo**: Confirm interactive UI cards render for each of the 4 steps without static mascot PNGs.
3. **Contact Touchpoints**: Verify `contact@mercianwealth.com` is displayed and copied via 1-tap buttons.
4. **TypeScript Verification**: Zero type errors (`tsc --noEmit`).
