# Reversible Scroll Animations Implementation Plan

Enhance site scroll animations so visual elements, section badges, and scroll-linked components re-trigger or smoothly play in reverse when users scroll back up.

## Overview & UX Strategy

- **Reversible Scroll Viewports**: Update `viewport={{ once: true }}` to `viewport={{ once: false, amount: 0.2 }}` across major homepage components so elements play entrance animations both when scrolling down into view and when scrolling back up into view.
- **Controlled Viewport Amount**: Setting `amount: 0.2` ensures animations only reset once the element has substantially left the screen, preventing rapid flickering while reading.
- **Target Components**:
  - `section-divider.tsx`
  - `why-mercian-wealth.tsx`
  - `bottleneck.tsx`
  - `social-proof-strip.tsx`
  - `speed-gap-visualizer.tsx`
  - `services.tsx`
  - `results.tsx`
  - `testimonials.tsx`

## Implementation Steps

1. Update `viewport` props in target components from `once: true` to `once: false, amount: 0.2`.
2. Verify TypeScript compilation (`npx tsc --noEmit`).
3. Verify dev server operation and confirm no runtime console errors.
