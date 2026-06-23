# Implementation Plan - Dashboard Customization & Telemetry (Branding, Booking & Notifications)

This plan details the design, structure, and database additions needed to elevate the `/dashboard` and `/client` page experiences. We focus on premium branding alignment, a database-backed persistent notification system, and inline booking workflow integration.

---

## User Review Required (Approved)

> [!NOTE]
> All core architecture changes have been approved by the user:
> 1. **Persistent Notifications Database Table**: Added `public.user_notifications` table with RLS policies.
> 2. **Automated Notification Triggers**: Added triggers for project updates, messages, and milestone stage transitions.
> 3. **Direct Calendar Booking (No Calendly/Iframe)**: Added custom visual booking calendar at `/dashboard/book` querying available slots dynamically.


## Proposed Changes

### Database Layer (`supabase/migrations/`)

#### [NEW] [20260623120000_user_notifications.sql](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260623120000_user_notifications.sql)
We will create a migration file to set up the notifications table, triggers, and RLS policies.
*   **Table Schema**:
    ```sql
    CREATE TABLE public.user_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT,
        is_read BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL
    );
    ```
*   **RLS Policies**:
    - Select: Users can view their own notifications (`user_id = auth.uid()`).
    - Update: Users can mark their own notifications as read.
*   **Automated DB Triggers**:
    - Trigger `on_project_update_added`: Inserts a notification record for the corresponding project's `client_id` when a row is inserted in `project_updates`.
    - Trigger `on_message_sent`: Inserts a notification record for the client (if admin sent it) or for the admin (if client sent it) when a message is inserted in `messages`.

---

### Core UI Components (`components/`)

#### [NEW] [user-notification-center.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/user-notification-center.tsx)
A client-facing notification bell component similar to the admin one.
*   Fetches unread notifications from `user_notifications`.
*   Uses Supabase Realtime client to subscribe to inserts on `user_notifications` where `user_id = auth.uid()`.
*   Shows a badge count and lists recent notifications in a premium glassmorphic dropdown list with options to "Mark Read" and "Clear All".

#### [NEW] [client-booking-calendar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/client-booking-calendar.tsx)
A custom, interactive booking component replacing Calendly embeds:
*   Queries active packages from `session_categories`.
*   Queries weekly availability rules from `availability_rules`.
*   Queries scheduled bookings from `strategy_sessions` to prevent double-booking.
*   Renders a grid-based monthly calendar using `@/components/ui/button` or `react-day-picker`.
*   Highlights available booking days with a subtle gold glow.
*   Displays selectable, dynamic time slot pills for the chosen date.
*   Handles booking creation, writing the session details straight to `strategy_sessions` in Supabase.

#### [MODIFY] [dashboard-client-container.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/dashboard/dashboard-client-container.tsx)
*   **Branding**: Import and overlay the `<Watermark />` component.
*   **Notification Center**: Integrate `<UserNotificationCenter />` in the dashboard header right-action list.
*   **Integrated Booking**:
    - Check if a strategy session exists in database.
    - If scheduled, render current session card (date, status, meeting info) with quick cancel/reschedule actions.
    - If none, direct users to the custom booking page (`/dashboard/book`) instead of the Calendly iframe.

---

### Layouts & Pages (`app/`)

#### [NEW] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28user%29/dashboard/book/page.tsx)
Dedicated, page-level booking path:
*   Validates session context.
*   Renders `<ClientBookingCalendar />` in a clean, glassmorphic layout decorated with background purple/gold glows and a watermark.

#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28client%29/layout.tsx)
*   Integrate `<UserNotificationCenter />` in the top bar header of the Client dashboard layout next to the user profile bubble.

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28client%29/client/page.tsx)
*   Show more detailed sub-checklists inside each phase of the "System Implementation Phases".
*   Display a preview panel of recent message logs and link to the Message Hub.
*   Link the "Schedule Dev Sync" button to `/dashboard/book` instead of Calendly.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify layout structures, client-server bindings, and compiler parameters.

### Manual Verification
1.  **Notification Flow**:
    - Trigger a project update from the admin panel. Verify a real-time notification drops in on the client portal without reload.
    - Check that clicking "Mark Read" resolves the badge count and persists across refresh.
2.  **Custom Calendar Booking**:
    - Navigate to `/dashboard/book` as a standard user.
    - Verify all active session packages (Discovery Call, Strategy Session) load.
    - Confirm available dates match the weekly availability rules.
    - Confirm slot times are computed dynamically and that clicking "Confirm Booking" adds the record to `strategy_sessions`.
3.  **Branding**:
    - Verify that the watermark appears beautifully behind the dashboard elements and does not intercept mouse clicks.
