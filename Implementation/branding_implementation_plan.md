# Subtle Branding Implementation Plan

This plan outlines the steps to integrate your logo throughout the Legacy Wealth App in a subtle, premium, and non-intrusive way. We will focus on implementing the "Ghost Watermark", the "Scroll-Shrink Header", "Loading Animations", and "Footer Anchor" based on our previous discussion. 

## User Review Required

> [!IMPORTANT]
> **Logo File Needed:** To implement these features, we need the actual logo files. Ideally, we need:
> 1. A high-resolution SVG or PNG of the **full logo**.
> 2. A high-resolution SVG or PNG of the **logo icon/monogram** (just the symbol).
> 
> Please ensure these are available in the `public/` directory (e.g., `public/logo-full.svg`, `public/logo-icon.svg`), or let me know if they need to be generated/added.

## Open Questions

> [!CAUTION]
> **Animation Preferences:** Do you currently have `framer-motion` installed for animations, or would you prefer we stick purely to CSS transitions for the logo animations (like the sticky header shrinking)? CSS is lighter, while Framer Motion allows for more complex, bouncy animations.

> [!NOTE]
> **Watermark Placement:** Do you want the "Ghost Watermark" strictly on the Hero section, or should it subtly repeat across all major page sections (Pricing, Process, etc.)?

## Proposed Changes

---

### UI Components (`components/`)

#### [MODIFY] [Header Component](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/Header.tsx)
- Implement a scroll event listener (using a React `useEffect` hook).
- Add dynamic CSS classes that reduce the logo's max-width/height when the user scrolls down past a certain threshold (e.g., 50px).
- Add smooth CSS transitions (`transition-all duration-300 ease-in-out`) to make the shrinking effect feel premium.
- Swap the full logo out for the monogram/icon version when scrolled, if desired.

#### [NEW] [Watermark Component](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/ui/Watermark.tsx)
- Create a reusable `<Watermark />` component.
- This component will render an absolutely positioned `<Image>` of the logo icon, pushed to the background (`z-[-1]`).
- It will use classes like `opacity-5`, `scale-150`, and `pointer-events-none` so it doesn't block clicks.
- It can accept props for positioning (top-left, center-right) so we can scatter it naturally across pages.

#### [MODIFY] [Footer Component](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/Footer.tsx)
- Add a muted version of the logo (e.g., grayscale, 50% opacity) as a visual anchor centered above the copyright text, or aligned left with the brand column.

#### [MODIFY] [Loading/Spinner Component](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/ui/Loading.tsx)
- Replace the generic loading spinner with an animated logo icon. We can use a simple CSS `@keyframes` pulse effect: `animate-pulse` or a custom scale-in animation.

---

### Application Layout & Pages (`app/`)

#### [MODIFY] [Main Layout / Page](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/page.tsx)
- Import and inject the `<Watermark />` component into the Hero Section and potentially the Pricing Section to add that premium textured feel.

## Verification Plan

### Manual Verification
1. **Header Test:** Scroll up and down on the homepage to ensure the header logo transitions smoothly without jumping or layout shifts.
2. **Watermark Test:** Inspect the hero section to ensure the watermark is visible but does not impede reading text or clicking buttons (verifying `pointer-events: none`).
3. **Responsiveness:** Check the header logo sizing and watermark placement on mobile, tablet, and desktop views to ensure it remains elegant on all devices.
4. **Footer Test:** Verify the footer logo looks anchored and intentionally muted.
