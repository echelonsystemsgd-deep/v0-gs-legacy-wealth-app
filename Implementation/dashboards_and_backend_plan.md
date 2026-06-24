# Implementation Plan: Dashboards and Backend Optimizations

This document establishes the specifications, file diffs, and verification steps to optimize the GS Legacy Wealth dashboards (Admin, Client, and User), establish real-time direct messaging, clean up the admin navigation hierarchy, enrich the CRM Leads workflow, and align the dashboard copy with our high-authority Machiavellian brand style.

---

## 1. Clickable Summary Cards (Admin Dashboard)
The 5 metrics summary cards on the Admin Command Center will be made fully clickable:
* **Total Sales (Capital Realised)**: Opens a modal displaying the detailed breakdown of the last 10 payments received.
* **Pipeline (Projected Value)**: Opens a modal listing all active projects with their respective contract values, amounts paid, and remaining unpaid balances.
* **Total Leads (Inbound Pipelines)**: Redirects directly to `/admin/leads` (Leads page).
* **Active Projects (Active Mandates)**: Redirects directly to `/admin/projects` (Projects page).
* **Active Bookings (Scheduled Briefings)**: Redirects directly to `/admin/bookings` (Bookings page).

---

## 2. System Activity & Activity Logs
To track all platform activity comprehensively and reliably with zero Next.js network overhead:
* **Database Trigger-Based Logs**: We will add Postgres triggers on the tables: `messages`, `project_updates`, `project_assets`, `project_approvals`, `strategy_sessions`, `leads`, `projects`, and `login_history`.
* **Captured Events**:
  - `lead_created`: Logging new lead name, business, and interested service.
  - `lead_status_changed`: Logging old and new status.
  - `lead_archived`: Logging archiving status changes.
  - `message_sent`: Logging sender, project ID, and message preview.
  - `project_update_posted`: Logging the post title and author.
  - `file_uploaded`: Logging filename and size.
  - `project_approved`: Logging signed-off phases (Discovery, Design, etc.).
  - `booking_scheduled`: Logging scheduled time and attendee name.
  - `booking_status_changed`: Logging old and new status of session.
  - `auth_sign_in`: Logging login IP and browser agent.
* **Filter Options**: On the `/admin/logs` page, we will add a filter selector allowing the admin to inspect:
  - All Activity
  - Messages Only
  - Project Updates Only
  - Lead Activity Only
  - Bookings Only
  - Auth Sign-Ins Only

---

## 3. Quick Actions
We will replace the generic dashboard quick actions with highly relevant operations:
1. **Deploy Client Mandate**: Instantly redirects to `/admin/projects` with the project creation modal activated.
2. **Assess CRM Pipeline**: Redirects to `/admin/leads` filtered by "New" leads.
3. **Initiate Strategic Call**: Redirects to `/admin/bookings` to schedule or log a briefing.
4. **Verify Phase Approvals**: Redirects to active projects to review client sign-offs.

---

## 4. Simplified Sidebar Navigation
The admin sidebar navigation will be stripped down to exactly:
1. **Dashboard** (`/admin`)
2. **Leads** (`/admin/leads`)
3. **Projects** (`/admin/projects`)
4. **Client Directory** (`/admin/clients`)
5. **Message Desk** (`/admin/messages`)
6. **Bookings** (`/admin/bookings`)
7. **Notifications** (`/admin/notifications` - *NEW PAGE*)
8. **Settings** (`/admin/settings`)
9. **Activity Logs** (`/admin/logs`)
10. **View Public Site** (Redirects to `/`)
11. **Sign Out**

*Note: Portfolio, Testimonials, Content, and Media links will be removed from the sidebar.*

---

## 5. CRM Leads Section Improvements
* **Inline Status Selection**: An inline status drop-down will be added to the list/table view so status updates can be made without entering details.
* **Quick Action Controls**:
  - *Convert to Client*: Instantly redirects to creating a project pre-filled with the lead's details.
  - *Book Session*: Instantly launches session scheduler pre-filled with lead parameters.
* **Advanced Filters**: Filtering by **Interested Service** and **Traffic Source**.
* **Visual Pipeline Headers**: Displays total counts of leads in each status category at the top.

---

## 6. Real-Time Message Synchronization
* **Supabase Realtime Enablement**: Run SQL migration to add the `messages` table to `supabase_realtime` publication:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  ```
* This instantly activates real-time syncing for both the client-side *Project Workspace Chat* and the admin-side *Message Desk* without any page refresh.

---

## 7. Client Directory View Project link
* Add a "View Project" link button in the Associated Projects section inside the Client Profile view modal.
- Point link to `/admin/projects/${p.id}` so admins can transition directly into project workspace controls.

---

## 8. Dynamic Client & User Dashboards
* **Dynamic Role Redirect**: In `app/(user)/dashboard/page.tsx`, if the logged-in user profile role is `'client'`, they will automatically redirect to `/client`.
- This ensures clients are automatically guided to their active project workspace instead of landing on the sandbox dashboard, and requires no manual rebuilds.

---

## 9. Machiavellian Copy Branding
Align dashboard copy with our authoritative, commanding style:
* **Admin Dashboard**: Reframed as an "Operations Console" monitoring "Capital Realised" and "Mandate Telemetry".
* **Client Workspace**: Framed as "Operations Command", projecting elite capability.
* **User Sandbox**: Re-styled to showcase "Cohort Intake Vetting", emphasizing that slots are restricted to exactly 3 priority builds monthly to create scarcity and drive briefings bookings.

---

## Verification Plan

### Automated DB Check
- Confirm realtime tables registration:
  ```sql
  select * from pg_publication_tables where pubname = 'supabase_realtime';
  ```

### Manual UX Audit
1. **Realtime Chat Sync**: Send messages from admin to client and verify they appear instantly on both interfaces without page reload.
2. **Clickable Metrics Cards**: Click all 5 dashboard cards and confirm redirects or detail popups operate correctly.
3. **Client-Project Link**: Open Client Profile modal, click "View Project" on an associated project, and verify redirect to `/admin/projects/[id]`.
4. **Dynamic Redirect**: Upgrade a user account to `client`, navigate to `/dashboard`, and verify redirect to `/client` triggers.
5. **Sidebar Order**: Confirm sidebar is limited to the requested items in the exact sequence.
