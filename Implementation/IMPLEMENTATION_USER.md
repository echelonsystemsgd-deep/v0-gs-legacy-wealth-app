# Implementation Plan - Dashboard Customization & Telemetry (Branding, Booking & Notifications)

This plan details the design, structure, and database additions needed to elevate the `/dashboard` and `/client` page experiences. We focus on premium branding alignment, a database-backed persistent notification system, and inline booking workflow integration.

---

## User Review Required

> [!IMPORTANT]
> We are unifying the layouts for both standard users and clients to match the premium, sidebar-centric SaaS layout:
> 1. **Unified Left Sidebar**: Add `app/(user)/dashboard/layout.tsx` to provide standard users with a persistent sidebar (Dashboard, Book a Session, My Bookings, Notifications, Profile Settings).
> 2. **Dedicated Notifications Page**: Build dedicated notification timeline pages under `/dashboard/notifications` and `/client/notifications` showing alert list cards (e.g. "Booking Confirmed!").
> 3. **Sidebar Navigation Realignment**: Add direct navigation links to the client sidebar for Bookings, Notifications, and Profile Settings.

---

## Proposed Changes

### Core Sidebar & Layout System

#### [NEW] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/sidebar.tsx)
A custom left-sidebar component for standard (`user`) users.
*   **Links**:
    *   **Dashboard**: Links to `/dashboard` (standard overview).
    *   **My Bookings**: Links to `/dashboard/book?tab=my-bookings` (existing sessions calendar).
    *   **Book a Session**: Links to `/dashboard/book` (new session calendar).
    *   **Notifications**: Links to `/dashboard/notifications` (dedicated notification list page).
    *   **Profile Settings** (under ACCOUNT section header): Links to `/dashboard?tab=profile`.
*   **Design**: Glassmorphism dark-matte style, with active link indicator glowing with a gold accent.

#### [NEW] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28user%29/dashboard/layout.tsx)
The sidebar layout wrapper for all standard user dashboard routes:
*   Renders the `<UserSidebar />` on the left.
*   Provides a responsive main content container with:
    *   Mobile collapsible toggle header.
    *   Sleek top bar with active breadcrumbs (e.g. `Dashboard > Notifications`).
    *   Scrollable content area with background ambient glows.

#### [MODIFY] [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/sidebar.tsx)
Update the active client's sidebar to include matching tabs under an `ACCOUNT` sub-header:
*   Add **Book a Session** (`/dashboard/book`).
*   Add **Notifications** (`/client/notifications`).
*   Add **Profile Settings** (`/profile` or `/dashboard?tab=profile`).

---

### Notifications Views

#### [NEW] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28user%29/dashboard/notifications/page.tsx)
A dedicated, full-width page for standard user notifications:
*   Fetches the user's notification list from the database.
*   Displays a clean list of cards containing alert titles, descriptions, and action buttons.
*   Includes real-time subscription to auto-inject notifications as they arrive.
*   "Mark All Read" and "Clear All" buttons integrated.

#### [NEW] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28client%29/client/notifications/page.tsx)
A matching dedicated notification page for the active client layout.

---

### Pages & Containers (Modularization)

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28user%29/dashboard/page.tsx)
*   Accept `tab` search parameters to set the default tab state (e.g. profile onboarding tab).
*   Remove full-page wrapper structure (header, footer, background glows) since they are inherited from the parent sidebar layout.

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28user%29/dashboard/book/page.tsx)
*   Accept active tab query parameters to default the calendar view to "Schedule Call" or "My Bookings".
*   Remove full-page wrapper elements (header, footer) since they are provided by the parent sidebar layout.

#### [MODIFY] [dashboard-client-container.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/dashboard-client-container.tsx)
*   Extract outer layout wrapper: render only the interior content tab grids, removing duplicate top headers and global footers.
*   Support programmatic switching of local tabs (`overview`, `profile`, `vault`) triggered by parent sidebar query parameters.

---

## Verification Plan

### Automated Tests
*   Run `npm run build` to verify Next.js static page generation, TypeScript bindings, and route optimizations.

### Manual Verification
1.  **Sidebar Interactions**: Verify that standard users see the custom User Sidebar, and clients see the expanded Client Sidebar. Check that the sidebar collapses on mobile.
2.  **Navigation Flow**: Verify clicking "Profile Settings" in the sidebar opens `/dashboard` with the CRM form tab active. Verify "My Bookings" opens the calendar page defaulting to the list of scheduled bookings.
3.  **Realtime Notifications**: Send a message from admin and verify that a card instantly drops into the dedicated Notifications page in real time with a accompanying toast.
