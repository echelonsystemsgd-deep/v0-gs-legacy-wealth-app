# Interactive Portal Tour Enhancement Plan

This plan details the technical analysis of the existing Portal Tour in the client dashboard, identifies current bottlenecks and device issues, and proposes a complete set of enhancements to make the tour highly interactive, cross-device compatible, and comprehensive—focusing on contract details, pricing tier options, and project milestones.

It also notes the restoration of the password for user `ali_nawaz122@outlook.com` back to `nawaz123`.

## User Review Required

Please review the proposed enhancements to the portal tour flow, which transition from static center modals to dynamic, device-aware targeted spotlights.

> [!IMPORTANT]
> **Key Improvement highlights:**
> 1. **Dynamic Pricing/Contract Step**: Customizes the tour explanation depending on whether the client has already enrolled in a contract scheme.
> 2. **Conditional Step Filtering**: Solves the bug where the tour hangs for 6 seconds on "System Build Logs" if the project status is beyond Discovery/Design.
> 3. **Real Subpage Spotlights**: Spotlights actual elements on subpages rather than showing fallback center modals.
> 4. **Sidebar Navigation & Mobile Auto-Open**: Highlights the sidebar navigation links before redirecting, automatically expanding/collapsing the sidebar on mobile devices.

---

## Proposed Changes

We will modify three main files in the workspace: the portal tour component, the tour trigger context/attribute mappings, and the sidebar to add selector IDs.

### Client Dashboard Components

#### [MODIFY] [navbar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/navbar.tsx)
- Add `suppressHydrationWarning` to the Logo `<button>` element (line 203) to prevent browser extensions (such as password managers or form fillers) from causing Next.js hydration mismatches by injecting attributes like `fdprocessedid` before React mounts.

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28client%29/client/page.tsx)
- Remove import of `<BriefingPlayer />` on line 15 and remove the `<BriefingPlayer />` render element on line 218 to completely remove the tactical briefing audio player from the dashboard.

#### [MODIFY] [portal-tour.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/portal-tour.tsx)
- Dynamically build the `TOUR_STEPS` array on mount or render based on:
  - The client's active project status (exclude `[data-tour="provisioning-logs"]` if status is not 'Discovery' or 'Design').
  - The client's contract enrollment state (`project.contract_type`):
    - **If not enrolled**: Focus the tour on the **Contract Enrollment Desk**, explaining the Monthly Retainer, One-Time Setup, and Performance Royalty Yield (PRY) plans.
    - **If enrolled**: Focus the tour on the **Financial Telemetry Gauge** (percentage settled vs remaining) and the **Phase Unlock Milestones** list.
- Replace generic center modals for `/client/actions`, `/client/progress`, and `/client/messages` with targeted spotlights pointing to `[data-tour="actions-title"]`, `[data-tour="progress-timeline"]`, and `[data-tour="messages-chat"]`.
- Add steps that target the corresponding sidebar navigation links (`[data-tour="sidebar-actions"]`, `[data-tour="sidebar-progress"]`, `[data-tour="sidebar-messages"]`) to show the user how to navigate there.
- Implement onboarding auto-trigger mechanism:
  - Add an effect that checks for the unique local storage key `gs_portal_tour_v2_auto_triggered`.
  - If it is not found (meaning it is the client's first login from now), write it as `'true'`, set `gs_portal_tour_active` to `'true'`, reset step index to `0`, and push route `/client` to immediately initiate the portal tour.
- Implement mobile-specific helpers:
  - If a step targets a sidebar link and the screen width is mobile, programmatically trigger/dispatch an event to open the sidebar, and close it when moving to the next step.
  - Enhance spotlight and scroll recalculations to handle viewports elegantly.

#### [MODIFY] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/sidebar.tsx)
- Add `data-tour` attributes to the key navigation link elements:
  - Overview: `data-tour="sidebar-overview"`
  - Action Required: `data-tour="sidebar-actions"`
  - Project Progress: `data-tour="sidebar-progress"`
  - Messages: `data-tour="sidebar-messages"`
- Listen for CustomEvents from `PortalTour` (e.g. `'set-mobile-sidebar-open'`) to programmatically expand the mobile sidebar when the tour highlights a sidebar item.

---

## Verification Plan

Since we are instructed to not browse the site, we will verify the code using linting and typescript compilation, as well as checking database data.

### Automated Tests
- Run `npm run build` or `npx tsc --noEmit` to verify type safety.
- Review database states via `execute_sql` to confirm the password restoration.

### Manual Verification
- Ask the user to run the tour on their browser on desktop and mobile viewports, selecting different contract enrollment states, and verifying that:
  - The tour highlights the sidebar and opens it on mobile automatically.
  - The build logs step is skipped automatically when the project status is "Development".
  - The contract and pricing descriptions update dynamically.
