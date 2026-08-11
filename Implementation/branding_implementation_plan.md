# Mercian Wealth Branding & Logo Integration Plan

## Overview
This implementation plan outlines the exact technical steps to integrate the new **Mercian Wealth** brand assets (`MercianWealthLogo.jpeg` and `MercianWealthWatermark.jpeg`) from the `public/` folder into the web application, while removing legacy cartoon assets to maintain a high-end, luxury aesthetic.

---

## 1. Asset Audit Findings

| Asset Path | Specifications | Visual Attributes | Recommended Placement |
| :--- | :--- | :--- | :--- |
| `public/MercianWealthLogo.jpeg` | 64 KB JPEG | Gold emblem ("MW" interlocked with 4-panel canopy mark) on `#0A1128` Deep Navy background | Header Navbar, Footer, Loading Screen, Favicons |
| `public/MercianWealthWatermark.jpeg` | 24.4 KB JPEG | Dark monochrome slate emblem on pure black background | Hero background, strategy card watermarks, section backgrounds |
| `public/stickman_speed_automation.png` | 759 KB PNG | Cartoon stickman in a go-kart (AUTOKART 9000) | **REMOVING** from Landing Page Hero to align with luxury wealth branding |

---

## 2. Issues to Resolve

> [!WARNING]
> **Issue 1: Case Sensitivity Bug in Asset Constants**
> In `lib/brand-assets.ts`, `BRAND_LOGO` is currently set to `/MercianWealthlogo.jpeg` (lowercase `l`). On Linux/Vercel production environments, case mismatch leads to broken `404` image loads. `BRAND_WATERMARK` is also mistakenly pointing to the logo image instead of `MercianWealthWatermark.jpeg`.

> [!IMPORTANT]
> **Issue 2: Translucent JPEG Blending**
> Because `MercianWealthLogo.jpeg` is a JPEG with a solid `#0A1128` background, placing it on translucent headers (`backdrop-blur`) causes visible rectangular edges. We must apply CSS `mix-blend-screen` / `mix-blend-lighten` or matching container backgrounds so the logo blends natively into the navy header backdrop.

> [!CAUTION]
> **Issue 3: Cartoon Image Removal (`stickman_speed_automation.png`)**
> The cartoon go-kart stickman image (`/stickman_speed_automation.png`) in the Hero section conflicts with the sophisticated Mercian Wealth brand identity. It will be removed from the Hero section and replaced with the subtle Mercian Wealth Gold/Slate watermark.

---

## 3. Detailed Proposed Changes

### Core Config & Asset Constants

#### [MODIFY] [lib/brand-assets.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/lib/brand-assets.ts)
- Update `BRAND_LOGO` constant to `/MercianWealthLogo.jpeg`.
- Update `BRAND_WATERMARK` constant to `/MercianWealthWatermark.jpeg`.
- Preserve `/placeholder-logo.svg` as strict fallback.

#### [MODIFY] [app/layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/layout.tsx)
- Update `metadata.icons` object:
  - `icon`: `/MercianWealthLogo.jpeg?v=2`
  - `shortcut`: `/MercianWealthLogo.jpeg?v=2`
  - `apple`: `/MercianWealthLogo.jpeg?v=2`

---

### Landing Page Hero Cleanup & Watermark Placement

#### [MODIFY] [components/hero.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/hero.tsx)
- **REMOVE**: Remove cartoon stickman go-kart `<Image src="/stickman_speed_automation.png" ... />` block from Hero section.
- **ADD**: Inject absolute-positioned `<BrandLogo variant="watermark" />` in the background with `opacity-10`, `mix-blend-screen`, and `pointer-events-none` for a high-end luxury backdrop.

#### [MODIFY] [components/stickman-workflow.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/stickman-workflow.tsx)
- Replace cartoon stickman illustrations with professional UI/system workflow cards or high-ticket brand icons.

---

### Brand Components & Header Navbar

#### [MODIFY] [components/brand-logo.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/brand-logo.tsx)
- Add proper default width/height aspect ratio for `MercianWealthLogo.jpeg`.
- Ensure error handling falls back gracefully to `BRAND_LOGO_FALLBACK` or `WordmarkLogo`.
- Support `mix-blend-screen` class propagation.

#### [MODIFY] [components/navbar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/navbar.tsx)
- Update Brand Logo rendered inside the header.
- Apply `mix-blend-screen` so dark background edges dissolve seamlessly into navbar backdrop.
- Add dynamic scroll height scaling and subtle gold drop-shadow (`drop-shadow-[0_0_12px_rgba(217,167,74,0.25)]`).

---

### Ambient Background Watermarks & Feature Sections

#### [MODIFY] [components/why-mercian-wealth.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/why-mercian-wealth.tsx)
- Integrate background watermark behind the strategy feature cards for a luxury private wealth atmosphere.

---

### Loading Screen & Footer

#### [MODIFY] [app/loading.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/loading.tsx)
- Replace generic spinner with pulsing gold Mercian Wealth emblem with ambient gold radial glow.

#### [MODIFY] [components/footer.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/footer.tsx)
- Anchor the footer column with `<BrandLogo />` and update homepage link target to `/`.

---

## 4. Verification Plan

### Manual Verification
1. **Hero Cleanup Inspection**: Confirm the cartoon stickman go-kart image (`stickman_speed_automation.png`) is completely removed from the landing page Hero.
2. **Header Inspection**: Scroll up and down on homepage to ensure logo scales smoothly and background blends without rectangular borders.
3. **Watermark Aesthetics**: Verify watermark displays faintly behind hero text without obstructing readability or click targets.
4. **Browser Tab Icon**: Confirm favicon loads correctly in browser tabs.
5. **Loading Screen**: Test page transitions to verify gold emblem pulse animation.
