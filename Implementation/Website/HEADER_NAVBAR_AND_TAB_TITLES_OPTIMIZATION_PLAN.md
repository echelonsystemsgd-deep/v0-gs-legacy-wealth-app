# Header Spacing, Navbar Density & Browser Tab Titles Optimization Plan

## Executive Summary
This document outlines the architectural enhancements to resolve browser tab title truncation, optimize navbar horizontal density across laptops and large desktop monitors, and refine mobile hero top-spacing so that critical value propositions and primary call-to-action buttons sit firmly above the fold on all standard mobile viewports.

---

## 1. Browser Tab Title Optimization (Anti-Truncation Strategy)

### The Problem
When titles exceed 25–30 characters (such as `Login — Client & Admin Portal | Mercian Wealth`), standard browser tabs (~120px–150px wide) truncate the string midway to `Login — Client...`, cutting off the brand name and leaving an incomplete, unprofessional tab heading.

### The Solution
Front-load primary keywords and keep full title strings under **28–32 characters** using a clean middle dot (`·`) separator:

| Page Route | Previous Long Title | Optimized Compact Tab Title |
| :--- | :--- | :--- |
| **`/login`** | `Login — Client & Admin Portal \| Mercian Wealth` | **`Client Login · Mercian Wealth`** |
| **`/` (Home)** | `Mercian Wealth \| AI Websites & Automated Storefronts...` | **`Mercian Wealth · AI Systems`** |
| **`/portfolio`** | `Interactive Prototypes & Case Studies \| Mercian Wealth` | **`Portfolio · Mercian Wealth`** |
| **`/services`** | `Automated Systems & Services \| Mercian Wealth` | **`Services · Mercian Wealth`** |
| **`/process`** | `7-Day Launch Protocol \| Mercian Wealth` | **`Process · Mercian Wealth`** |
| **`/pricing`** | `Transparent Pricing & Retainer Models \| Mercian Wealth` | **`Pricing · Mercian Wealth`** |
| **`/testimonials`**| `Client Case Studies & Verified Deliverables...` | **`Case Studies · Mercian Wealth`** |
| **`/contact`** | `Contact Our Engineering Team \| Mercian Wealth` | **`Contact · Mercian Wealth`** |
| **`/book`** | `Book Your Free 15-Minute Audit \| Mercian Wealth` | **`Book Audit · Mercian Wealth`** |

---

## 2. Navbar Layout & Horizontal Density Enhancements

### Desktop & Laptop Sizing Matrix
* **Laptop Breakpoint (`1024px` to `1280px` - `lg`):**
  * CTA Button text responsively adapts to **`Book Free Audit`** to eliminate crowding between `Contact`, `Client Login`, and the button.
  * Nav link spacing set to `gap-1.5` with `px-2.5 py-1.5`.
* **Large Desktop Breakpoint (`≥1280px` - `xl`):**
  * CTA Button text displays full **`BOOK YOUR FREE 15 MINUTE AUDIT`**.
  * Nav link spacing expands to `gap-2.5` with `px-3 py-1.5`.
* **Vertical Height Profile:**
  * Default unscrolled state: `py-3.5` (~60px).
  * Scrolled state: `py-2.5` (~52px) with `backdrop-blur-md`.

---

## 3. Mobile Header & Hero Above-the-Fold Optimization

### Mobile Phone Sizing Matrix (< 1024px)
* **Combined Fixed Header:** Ticker (`py-1 text-[10px]`) + Navbar (`py-2.5`) = **~82px total fixed height**.
* **Hero Top Padding:** Reduced from `pt-36 sm:pt-40` to `pt-28 sm:pt-36 lg:pt-40`.
* **Eyebrow & Proof Badges:**
  * Eyebrow pill: `text-[9px] sm:text-xs px-2.5 sm:px-4 py-0.5 sm:py-1.5`.
  * Proof badge: `text-[9px] sm:text-sm px-2.5 sm:px-3.5 py-0.5 sm:py-1`.
* **Buttons Ergonomics:**
  * Touch-friendly full-width layout (`w-full sm:w-auto`) with `py-3.5 sm:py-6` padding.
  * Ensures **"CLAIM CATEGORY EXCLUSIVITY & FREE AUDIT →"** sits above the fold on all standard 375px–430px smartphone viewports without requiring an initial scroll.

---

## 4. Verification & Testing Matrix

| Viewport Category | Width Range | Verified Layout Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Small Mobile** | 320px – 375px | Compact logo + hamburger, H1 & CTA fully above fold | ✅ Verified |
| **Standard Mobile** | 390px – 430px | Balanced vertical spacing, thumb-friendly buttons | ✅ Verified |
| **Tablet** | 768px – 1023px | Clean hamburger drawer with 48px touch targets | ✅ Verified |
| **Compact Laptop** | 1024px – 1279px| 7 nav links + `Client Login` + `Book Free Audit` with zero collision | ✅ Verified |
| **Large Desktop** | 1280px+ | Full CTA, generous link spacing, ambient watermark | ✅ Verified |
