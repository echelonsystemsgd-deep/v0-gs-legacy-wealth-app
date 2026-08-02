# Implementation Plan - Site-Wide Cyan & Slate-Navy Color Unification

Standardize 100% of website components, backgrounds, glows, toggles, badges, and modals to match the modern Hero color system (**Electric Sky Blue/Cyan `#38BDF8` + Deep Slate-Navy `#090D16` + Warm Amber Gold `#F59E0B`**), replacing all legacy deep purple (`#130B24`, `rgba(109, 40, 217, ...)`) elements.

## User Review Required

> [!IMPORTANT]
> - **Unified Design Palette Across 100% of Pages**:
>   - **Primary Accent**: Electric Sky Blue / Cyan (`#38BDF8` / `sky-400` to `blue-600`) for all primary CTA buttons, active state indicators, cyan glows, link highlights.
>   - **Secondary Accent**: Warm Amber Gold (`#F59E0B` / `amber-400`) for price highlights, trust badges, and scarcity tags.
>   - **Base Background**: Deep Slate-Navy (`#090D16`) across all page sections, eliminating dark obsidian (`#07050B`) and midnight purple (`#130B24`).
>   - **Card & Drawer Surfaces**: Dark Slate (`#0F172A` / `#1E293B`).
>   - **Ambient Glows**: Electric Cyan radial glows (`rgba(56, 189, 248, 0.14)`), replacing deep purple glows (`rgba(109, 40, 217, ...)`).

---

## Proposed Changes

### 1. Global CSS & Design Tokens

#### [MODIFY] [globals.css](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/globals.css)
- Set `--color-accent-purple` token to Electric Cyan (`#38BDF8`) and `--color-accent-purple-glow` to `rgba(56, 189, 248, 0.15)`.

---

### 2. Divergence Comparison Component

#### [MODIFY] [divergence-comparison.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/divergence-comparison.tsx)
- Replace section background `#07050B` with `#090D16` (Deep Slate-Navy).
- Replace radial purple glow `rgba(109, 40, 217, 0.15)` with Electric Cyan glow `rgba(56, 189, 248, 0.14)`.
- Replace card background `from-accent-purple/20 via-[#130B24]` with `from-sky-500/15 via-[#0F172A] to-slate-900`.
- Update schema badges and arrows from purple to sky-blue (`bg-sky-500/10 border-sky-500/30 text-sky-400`).

---

### 3. Pricing Component

#### [MODIFY] [pricing.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/pricing.tsx)
- Update billing cycle toggle pills (`One-Time Setup`, `Monthly Retainer`, `% Revenue Share`) active background from purple (`bg-accent-purple`) to Electric Cyan gradient (`bg-gradient-to-r from-sky-400 to-blue-600`).
- Update ROI Estimator value card container background from `from-accent-purple/10` to `from-sky-500/10 border-sky-500/20`.
- Update comparison matrix tab button background from `bg-accent-purple/30` to `bg-sky-500/10 border-sky-500/30 text-sky-400`.

---

### 4. Services Component

#### [MODIFY] [services.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/services.tsx)
- Replace card hover shadow `rgba(109, 40, 217, 0.15)` with Cyan glow `rgba(56, 189, 248, 0.25)`.
- Update modal detail primary button background from `bg-accent-purple` to Electric Cyan (`bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950`).

---

### 5. Navbar Component

#### [MODIFY] [navbar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/navbar.tsx)
- Replace mobile menu drawer background `#07050B` with `#090D16`.
- Replace mobile menu radial background glow `rgba(109, 40, 217, 0.25)` with Electric Cyan glow `rgba(56, 189, 248, 0.15)`.

---

### 6. CTA, Testimonials & FAQ Components

#### [MODIFY] [cta.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/cta.tsx)
#### [MODIFY] [testimonials.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/testimonials.tsx)
#### [MODIFY] [faq-home.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/faq-home.tsx)
- Replace section backgrounds `#07050B` with `#090D16`.
- Replace deep purple radial glows `rgba(109, 40, 217, ...)` with Electric Cyan radial glows `rgba(56, 189, 248, 0.14)`.

---

## Verification Plan

### Manual Verification
1. **Visual Consistency Check**:
   - Scroll through the homepage from Hero to Footer -> Verify 100% of section backgrounds, card borders, active buttons, and glows follow the Electric Sky Blue + Deep Slate-Navy + Amber Gold palette.
   - Verify 0 instances of deep purple (`#130B24`, `rgba(109, 40, 217, ...)`) remain.
2. **TypeScript Compilation**:
   - Run `npx tsc --noEmit` -> Verify clean compilation with 0 errors.
