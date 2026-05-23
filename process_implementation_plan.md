# Process Section Alignment Implementation Plan

Currently, the landing page displays only 3 steps of a "4-step process" because the `Process` component is called with `limit={3}` in `app/page.tsx`. Additionally, a connector line is drawn extending from the third card even though no fourth card is rendered.

This implementation plan outlines the specific code changes needed to:
1. Show all 4 steps on the landing page, resolving the visual contradiction and balancing the desktop grid.
2. Fix the connector line rendering logic in the `Process` component to be dynamically based on the rendered limit rather than the total count.

## Proposed Changes

---

### Landing Page & Process Layout

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/page.tsx)
- Remove the `limit={3}` prop from the `<Process />` component call, allowing it to render all 4 steps naturally.

#### [MODIFY] [process.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/process.tsx)
- Update the connector line condition (currently `index < steps.length - 1`) to check the visible count (`index < displaySteps.length - 1`) instead of the total count. This makes the component robust if a limit is ever applied elsewhere.
- Hide the "Explore Full Process" button when `limit` is undefined or when all steps are already visible, avoiding redundant navigation.

---

## Verification Plan

### Manual Verification
- Launch the development server (`npm run dev`).
- Open `http://localhost:3000` in the browser and verify the **Our Proven 4-Step Process** section contains exactly 4 beautiful cards.
- Confirm that the connector lines connect cards 1-2, 2-3, and 3-4, and that no floating line exists on the right side of the final card.
- Confirm that the redundant "Explore Full Process" button is correctly hidden on the Home page since all steps are now displayed, but remains fully functional on any page where a limit is active.
