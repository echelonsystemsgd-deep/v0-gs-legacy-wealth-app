# Mobile Audit & Responsive Layout Fixes Implementation Plan
Date: 2026-07-24

## Goal Description
Address all mobile UX and layout issues identified during real-device testing to ensure clean, high-converting responsive design across all viewports without breaking desktop behavior or violating site standards.

---

## Technical Specifications & Phase 2 Refinements

### Phase 1: Core Mobile Audit Fixes
1. **Bottleneck & Divider Spacing:** Reduced section padding to `py-12 sm:py-24` and divider padding to `py-8 sm:py-16`.
2. **Pricing Comparison Matrix Switcher:** Implemented a 3-tab tier selector (`Authority Suite` | `Operations Machine` | `Revenue Engine`) for mobile screens (`block md:hidden`), allowing 1-tap comparison without horizontal clipping.
3. **Mobile Navigation Auth Links:** Added `Login / Portal Access` when signed out and direct `Access Dashboard` link when signed in.
4. **Drawer Scroll Lock:** Locked `document.body.style.overflow = "hidden"` while `isMobileMenuOpen` is active.
5. **Floating Button Visibility:** Hidden floating CTA when mobile drawer is open via `mobile-menu-open` class observer.
6. **Terminology Compliance:** Replaced "The Autonomic Engine" with "The Automated Growth Engine".
7. **Metric Compliance:** Updated Service 3 outcome to "Complete Data Sovereignty & Isolation".

### Phase 2: Mobile Viewport & Component Refinements
1. **Mobile Drawer Viewport & Safe-Area Inset (`components/navbar.tsx`):**
   - Use `h-[100dvh]` with `pt-20 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] px-6` flex layout.
   - Prevent bottom clipping of social icons (`Instagram`, `LinkedIn`) on iOS devices with home indicators.
   - Provide clean top breathing room above the `Home` link.

2. **Inter-Section Double Gap Elimination (`components/divergence-comparison.tsx` & `components/section-divider.tsx`):**
   - Reduce top padding on `DivergenceComparison` to `pt-4 sm:pt-12 lg:pt-24`.
   - Reduce `SectionDivider` vertical padding to `py-4 sm:py-10`.

3. **Floating CTA Compact Mobile Mode (`components/sticky-cta-button.tsx`):**
   - On mobile screens (`< 640px`), render a compact 48x48px circular badge (`MW` crest icon) at `bottom-4 right-4` so it never obscures centered headlines or body copy.
   - Expand to full pill on desktop (`hidden sm:flex`).

4. **Card Button & Text Overflow (`components/divergence-comparison.tsx`):**
   - Shorten Path B CTA text on mobile to `"SECURE ALIGNMENT →"` with `text-xs sm:text-sm md:text-base font-bold`.
   - Adjust card title font sizing to `text-xl sm:text-2xl lg:text-3xl` with `leading-tight` to eliminate top clipping.

---

## Verification Plan
1. Run `.\node_modules\.bin\tsc.cmd --noEmit` to verify 0 TypeScript errors.
2. Run `npx next build` to verify clean production build.
3. Confirm `npx next dev` starts cleanly.
