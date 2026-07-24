# Site Integrity & Honesty Audit Execution Plan

## Objectives
1. Eliminate all unbacked metrics, unverified client testimonials, and misleading NDA badges.
2. Establish a single central source of truth for Cohort Scarcity Counters across all components (`lib/cohort-status.ts`).
3. Standardize Portfolio projects as "Prototype" or "Concept Build" and enable interactive live previews for demo apps.
4. Align Testimonials and Booking page headers with 100% truthful Launch Cohort positioning.
5. Add clear methodology disclaimers to interactive ROI and Diagnostic calculators.

## Changes Checklist
- [x] Create `lib/cohort-status.ts` single source helper for cohort quota and slot calculation.
- [x] Update `lib/site-copy.ts` copy registry (testimonials subtitle, telemetry items, /book quote, CTA subheadline).
- [x] Update `components/live-telemetry-ticker.tsx` to use unified cohort status helper.
- [x] Update `components/hero.tsx` and `components/cta.tsx` for cohort scarcity consistency.
- [x] Update `components/portfolio.tsx` with honest tags (`Prototype` / `Concept Build`), benchmark metric framing, and live preview modal for demo apps.
- [x] Update `components/pricing.tsx` with ROI calculator methodology disclaimer.
- [x] Update `components/diagnostics-wizard.tsx` with diagnostic heuristic disclaimer.
- [x] Run build verification (`npx tsc --noEmit` / `npm run build`).
