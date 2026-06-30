# Implementation Plan - Post-Implementation Integrity Audit & Responsive Fixes

This plan outlines the visual, layout, and browser compatibility issues identified during static analysis of the recent implementation, and details the steps to resolve them.

## User Review Required

> [!NOTE]
> All changes are styling and responsive layout adjustments (e.g., tap targets, selective viewport visibility, iOS Safari height compatibility). There are no breaking database schema or structural changes.

## Proposed Changes

We will modify five key components to address the responsive layout, tap targets, and browser compatibility issues.

---

### Client Console & Sidebar

#### [MODIFY] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/sidebar.tsx)
- Increase mobile toggle menu button size from `p-2` (34px) to `p-3 w-11 h-11` (44px) to satisfy the touch target requirements.
- Increase mobile close button (`X`) size from `p-1.5` (28px) to `p-2.5 w-10 h-10` to satisfy the touch target requirements.
- Update `h-screen` on the sidebar container to `h-dvh` to resolve iOS Safari bottom-bar viewport height quirks.

#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(client)/layout.tsx)
- Update main layout container height from `h-screen` to `h-[100dvh]` to prevent viewport layout shift and truncation on iOS Safari.

#### [MODIFY] [portal-tour.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/portal-tour.tsx)
- Increase touch target sizes for the guide control buttons:
  - **Back**: Change from `px-3 py-1.5` (approx 32px) to `px-3.5 py-2.5 sm:py-1.5` to ensure a larger hit area on mobile.
  - **Next/Finish**: Change from `px-4 py-1.5` to `px-4 py-2.5 sm:py-1.5`.
  - **Skip/Close**: Change from `p-1` (22px) to `p-2` (30px) or add a transparent overlay to expand the tap region.

---

### Interactive Estimators & FAQ

#### [MODIFY] [roi-calculator-modal.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/roi-calculator-modal.tsx)
- Add selective viewport visibility to the ROI Inputs:
  - Add `hidden md:block` to the range slider `<input type="range">` elements so they only render on desktop.
  - Add `flex md:hidden` to the mobile stepper wrapper `<div>` elements so they only render on mobile viewports, avoiding layout clutter and overlapping controls.

#### [MODIFY] [faq-home.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/faq-home.tsx)
- Add `rounded-xl` to the FAQ items wrapper container to ensure visual styling consistency with the main public FAQ page and the rest of the application branding.

## Verification Plan

Since we are not running a dev server or accessing localhost, we will perform static verification:
1. Verify TypeScript compiles cleanly with `npx tsc --noEmit`.
2. Inspect the file diffs to confirm code correctness, CSS layout rules, and standard responsive prefixes.
