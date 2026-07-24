# Site Enhancements & UX Innovation Implementation Plan

Comprehensive implementation of interactive features, visual telemetry, diagnostic tools, and luxury UI polish for **Mercian Wealth**.

## Overview of Planned Enhancements

1. **Interactive Latency & Revenue Leak Calculator (`components/latency-calculator.tsx`)**
   - Dual interactive sliders (Monthly Lead Volume & Average Ticket Size).
   - Live dynamic calculation of annual lost revenue due to manual response delays vs. Mercian Wealth's 45-second autonomic engine.
   - Gold glowing metrics, visual comparison bars, and direct link to alignment booking.

2. **Protocol Chapter Tracker (`components/chapter-tracker.tsx`)**
   - Floating side navigation bar tracking scroll progress through Chapters I to V on the homepage.
   - Active chapter highlighting with smooth scroll-to-chapter clicks.

3. **Interactive System Blueprint Visualizer (`components/system-blueprint.tsx`)**
   - Interactive 4-node architectural diagram (*Lead Ingestion, AI Qualification, Autonomic Booking, CRM & Telemetry*).
   - Click/hover node states showing real-time data packet animations, execution speeds, and mechanism details.

4. **30-Second System Diagnostics Wizard (`app/diagnostics/page.tsx` & `components/diagnostics-wizard.tsx`)**
   - Interactive 4-step intake quiz calculating a 0-100 System Friction Score.
   - Gives users immediate personalized feedback, recommended architecture tier, and a direct CTA to schedule an alignment.

5. **Integrated Homepage Assembly (`app/page.tsx`)**
   - Seamlessly integrate the new `ChapterTracker`, `LatencyCalculator`, and `SystemBlueprint` into the main homepage layout.

## File Map

- **[NEW]** `components/latency-calculator.tsx`
- **[NEW]** `components/chapter-tracker.tsx`
- **[NEW]** `components/system-blueprint.tsx`
- **[NEW]** `components/diagnostics-wizard.tsx`
- **[NEW]** `app/diagnostics/page.tsx`
- **[MODIFY]** `app/page.tsx`
- **[MODIFY]** `components/navbar.tsx`

## Verification Plan
- Run `npx tsc --noEmit` to verify type safety.
- Confirm Next.js compilation and verify no runtime errors.
