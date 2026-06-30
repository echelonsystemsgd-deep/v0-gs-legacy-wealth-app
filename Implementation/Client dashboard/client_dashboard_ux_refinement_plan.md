# Implementation Plan - Client Dashboard UX & UI Refinements (Updated)

This document outlines the step-by-step technical plan to refine the UX and UI of the Client Dashboard (Sovereign Partner Console), resolve layout issues, enforce notification isolation, create a cleaner, premium navigation experience, add a multi-page interactive client portal tour, and implement a fully interactive Secure Asset Vault.

---

## User Review Required

> [!IMPORTANT]
> 1. **Robust Tour Page Transitions (Fix for breaking/disappearing tour):**
>    - Add a background polling interval (every 100ms) inside `PortalTour` to wait for target elements to mount when navigating to a new page.
>    - Silence the tour (render `null`) during page transitions while `pathname` or `targetRect` is loading, preventing visual jumps and accidental clicks to terminate the tour.
> 2. **Interactive Document Vault (Secure Asset Vault) & Dynamic Downloads:**
>    - Query `public.project_assets` dynamically.
>    - Seed initial assets (Brand Guidelines, Strategy Blueprint) in the database.
>    - **Seeded Download Decision (Option 1 - Dynamic Client-Side Downloads):** Instead of redirecting to dead mock external links (Option 3 / 404 errors) or creating public dummy assets in the repo (Option 2), we will intercept mock downloads and generate local browser-level `Blob` downloads (`URL.createObjectURL(Blob)`) dynamically containing verified security statements.
> 3. **Chronological Actions Sorting & Date Display:**
>    - Sort the pending actions chronologically (oldest requested first) using `{ ascending: true }` on the database query.
>    - Add the request date (e.g. `Requested: 24/06/2026`) and an urgency age indicator (e.g. `[ Pending 4 Days ]` or `[ Requested 1 day ago ]`) on each action card.
> 4. **Unblurred Spotlight & Pointer Arrows (Tour Fixes):**
>    - Remove the full-screen backdrop overlay during element highlights to prevent target dimming and blurring.
>    - Use a massive box-shadow (`box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75)`) on the spotlight box so the highlighted element remains 100% sharp and visible.
>    - Add a gold triangle pointing pointer on the tooltip box (pointing up for bottom tooltips, and down for top tooltips).
> 5. **Header Tour Guide Trigger:** Render `<TourTrigger />` next to `<InspectorToggle />` in the top bar.

---

## Proposed Changes

### 1. Database & Security Isolation

#### [NEW] [20260627160000_client_dashboard_ux_refinements.sql](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260627160000_client_dashboard_ux_refinements.sql)
* **RLS INSERT Policy:** Add an `INSERT` RLS policy to `public.project_action_requests` (Completed).
* **Pre-seed Vault Assets:** Add initial documents in `project_assets` linked to the active project (Completed).

#### [MODIFY] [notification-center.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/admin/notification-center.tsx)
* **Notification Query:** Add `.eq('user_id', user.id)` to the database `select` statement (Completed).

---

### 2. Client Multi-Page Onboarding Tour

#### [MODIFY] [portal-tour.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/portal-tour.tsx)
* **Transition Silencing:** Hide tour elements completely (return `null`) while `pathname !== currentStep.path` or while waiting for `targetRect` to calculate.
* **Background DOM Polling:** Set up a `setInterval` checking every 100ms for the presence of the `currentStep.target` element. This accommodates server-side compilation and rendering delays across Next.js pages.
* **Unblurred Spotlight box-shadow:** Remove screen-wide blurs, applying `box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75)` directly to the spotlight container (Completed).
* **Point Arrow Indicators:** Render CSS triangle arrows at tooltip card boundaries (Completed).

#### [NEW] [tour-trigger.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/tour-trigger.tsx)
* **Tour Trigger Button:** Client-side button dispatching tour reset actions (Completed).

#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(client)/layout.tsx)
* **Mount Trigger in Header:** Render `<TourTrigger />` next to `<InspectorToggle />` inside the sticky header flex items row (Completed).

---

### 3. Chronological Actions sorting & Date stamps

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(client)/client/actions/page.tsx)
* **Query sorting:** Modify query sorting parameter to sort ascending (oldest requested first) (Completed).
* **Date Badge Calculations:** Add metadata display showing request calendar dates and elapsed pending badges (Completed).

---

### 4. Fully Interactive Secure Asset Vault

#### [MODIFY] [secure-vault.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/secure-vault.tsx)
* **Dynamic Table Loading, Preview Details Modal & Real-time Upload Modal:** (Completed).
* **Dynamic Client-side File Downloads:** Update the download anchor link. If the file URL is a mock external URL, generate a local browser `Blob` object download containing verified security greetings, eliminating 404 dead link redirections.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify TypeScript compile compliance.
- Run `npm run build` to ensure Next.js bundle compiles correctly.

### Manual Verification
1. **Multi-page Tour Transitions:** Run the tour from step 1, click "Next" across page boundaries and verify that the tour component pauses and fades in cleanly on the new route without failing.
2. **Local Dynamic Downloads:** Click a seeded file in the vault, hit download, and verify it successfully downloads a `.pdf` or `.zip` file with mock content directly to your desktop.
