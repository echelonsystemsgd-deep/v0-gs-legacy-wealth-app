# Implementation Plan - Client Dashboard Refinements

This document outlines the technical plan and proposed features to upgrade the GS Legacy Wealth Client Dashboard (Sovereign Partner Console) to a production-grade, highly-reassuring experience.

---

## Proposed Changes & Brainstorming

### 1. Unknown Floating Buttons — Left Edge
- **Finding:** The floating icon column on the left edge is rendered by the `<PortalHub />` component. It is redundant and causes visual clutter.
- **Proposal:** 
  - Remove `<PortalHub />` from the client layout in [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(client)/layout.tsx).
  - Integrate a premium "Console Switcher" dropdown at the top of the [ClientSidebar](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/sidebar.tsx) (just below the logo, identical in styling to the switcher in the `AdminSidebar`) containing links to:
    - **Sovereign Partner Console** (Client Portal - `/client`)
    - **Vetting Terminal** (User Dashboard - `/dashboard`)
    - **Operations Terminal** (Admin Portal - `/admin`, visible only if the user role is `'admin'`)
    - **View Public Site** (Home - `/`)

---

### 2. Data Isolation & RLS Security Audit
- **Audit Findings:** 
  - RLS is correctly enabled on `projects`, `project_updates`, `messages`, `project_assets`, and `user_notifications`.
  - The tables use policies restricting select access to `client_id = auth.uid()` or checking sub-queries against `projects.client_id`.
  - The `messages` table already has a delete policy: `"Clients can delete own messages within 15 minutes"`.
- **Proposal:**
  - Verify that no data leak occurs and that query payloads always route through the current user session ID on the server.
  - Review the Realtime channel subscriptions in client components to ensure filters are strictly applied: `project_id=eq.${projectId}` and `user_id=eq.${userId}`.

---

### 3. Project Progress Pipeline
- **Finding:** The milestones list inside the `ProjectTelemetry` component currently locks stages based strictly on the payment percentage settled. For clients who pay at the end, milestones like "Development" show a lock icon even when the admin has explicitly marked the project as in Development.
- **Proposal:**
  - Update the milestones checklist logic in [project-telemetry.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/project-telemetry.tsx).
  - A milestone stage should be marked as **Unlocked** if *either* of the following conditions is met:
    1. The client's settled payment percentage meets the milestone threshold.
    2. The project's actual status (controlled by the admin in the workspace) has reached or passed that stage.
  - Maintain the circular chart progress showing the actual payment settled percentage (e.g. 0% for clients paying at the end), but unlock the progress checkpoints to reflect real-world engineering momentum.

---

### 4. Dedicated Client Booking Page
- **Finding:** Currently, clicking "Book a Session" in the Client Sidebar takes the client to `/dashboard/book`. This navigates the user out of the Client Dashboard layout into the User Vetting layout, breaking navigation and layout consistency.
- **Proposal:**
  - Create a new, dedicated page: [NEW] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(client)/client/book/page.tsx) that renders the booking calendar inside the Client portal layout.
  - Update the link in `components/client/sidebar.tsx` from `/dashboard/book` to `/client/book`.
  - Ensure the calendar and step selection forms use the premium, dark-purple card system with gold highlight borders.

---

### 5. Layout Adjustments & Sticky Sidebar
- **Finding:** When scrolling down long content pages (like Updates or Messages), the sidebar scrolls away or cuts off at the bottom because it uses `lg:relative`.
- **Proposal:**
  - Update [sidebar.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/sidebar.tsx) layout style. Change the desktop sidebar wrapper from `lg:relative` to `lg:sticky lg:top-0 lg:h-screen`. This will ensure it remains pinned and intact next to the viewport while the content pane scrolls.
  - Audit mobile viewports to ensure the toggle menu button is easily clickable and overlay backdrop functions correctly.

---

### 6. Profile Settings Enhancements
- **Finding:** The profile page `/profile` is a standalone public page with no link back to the dashboards. The avatar photo upload in `ProfileClientContainer` requires clicking "Save Profile Changes" at the bottom to upload, which is counter-intuitive.
- **Proposal:**
  - Add a gold-bordered "Back to Dashboard" button in [profile/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/profile/page.tsx) that dynamically redirects the user back to `/client`, `/admin`, or `/dashboard` based on their profile role.
  - Refactor `ProfileClientContainer` to trigger the avatar upload immediately upon image selection. Once the file is selected, upload it to the Supabase storage bucket, update the profile's `avatar_url`, and trigger a success toast instantly.

---

### 7. Proposed Feature: Project Action Requests
To support the round-trip detail collection flow where the admin asks for files/copy and the client provides them:

#### A. Database Schema
We propose creating a new table `public.project_action_requests`:
```sql
CREATE TABLE IF NOT EXISTS public.project_action_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'submitted', 'completed'
    client_response TEXT,
    submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_action_requests ENABLE ROW LEVEL SECURITY;

-- Select policy: Admins see all, Clients see requests for their project
CREATE POLICY "Select action requests" ON public.project_action_requests
    FOR SELECT TO authenticated
    USING (
        public.is_admin() OR 
        project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
    );

-- Insert policy: Admins only
CREATE POLICY "Admins insert action requests" ON public.project_action_requests
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- Update policy: Admins can update all, Clients can fill responses
CREATE POLICY "Update action requests" ON public.project_action_requests
    FOR UPDATE TO authenticated
    USING (
        public.is_admin() OR 
        project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
    );
```

#### B. Admin Portal Integration
- Add an **Action Requests Desk** to the Admin Project Detail workspace ([projects/[id]/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/(admin)/admin/projects/%5Bid%5D/page.tsx)).
- Admins can create a request with a title (e.g. "Google Analytics Access") and details (e.g. "We need your tracking code to configure the dashboard").
- Displays active requests, client-submitted responses, and a button to "Mark Completed" (which marks it `'completed'` and notifies the client).

#### C. Client Portal Integration
- If there is an active request (`'pending'`), show a prominent, premium **Action Required** card at the top of the Client Dashboard Overview.
- Clicking "Provide Details" in the banner opens an elegant, dark glassmorphic modal where the client can write their response and submit it.
- Once submitted, it updates the status to `'submitted'` and saves the text response. The card switches to "Awaiting Verification" and notifies the admin.

---

### 8. Premium Copy & Micro-Animations
We will replace all generic placeholders with precise, high-prestige copywriting:
* **Empty Staging Links:** *"Staging Instance Initializing: Our development team is provisioning server containers. Secure build logs will appear here once assets are compiled."*
* **Empty Updates Feed:** *"Awaiting Log Dispatch: Chronological system updates will populate here as engineering milestones are reached."*
* **Active Progress Badges:** Rename to emphasize momentum: *“Discovery Phase Completed”*, *“Design Infrastructure active”*, *“Database schema established”*.

---

### 9. Client Contract Enrollment Desk
- **Finding:** A mechanism was needed for clients to choose and enroll in a contract schema directly from their dashboard interface before project milestones and financial indicators are active.
- **Proposal:**
  - Introduce an elegant **Contract Enrollment Desk** view inside [project-telemetry.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/project-telemetry.tsx) when `!project.contract_type`.
  - Present three tailored contract options configured by the admin:
    - **Monthly Retainer**: Continuous support billed monthly.
    - **One-Time Setup Fee**: Flat-rate deployment and handover fee.
    - **Performance Royalty Yield (PRY)**: Tailored performance/revenue share co-investment scheme.
  - Selecting a model calls `handleEnroll(type)` which triggers a secure Supabase query to set `contract_type` and set the initial `contract_value` to the corresponding rate, resolving the setup state and unlocking the milestones pipeline.

---

## Verification Plan

### Automated Verification
- Run database migration tests to confirm schema modifications for `project_action_requests`.
- Run `npm run build` and `npx tsc --noEmit` to verify type safety across all components.

### Manual Verification
1. **Console Switcher**: Inspect switcher navigation from Client Sidebar to Vetting/Admin terminals.
2. **Milestone Progress**: Log in as a client with £0 payment. Verify "Design" and "Development" stages show as unlocked when project status is updated on the admin side.
3. **Dedicated Booking Page**: Go to `/client/book`. Book a test session. Verify navigation stays inside `/client` layout.
4. **Project Action Requests**:
   - Create a request from the Admin project workspace.
   - Verify the "Action Required" card appears on the Client Dashboard.
   - Submit text details in the modal on the client side.
   - Verify the admin can read the response, mark it as completed, and the client status updates instantly in real time.
5. **Sidebar Scroll Test**: Scroll down on mobile and desktop viewports, verifying the sidebar does not cut off or slide out of view.
6. **Contract Enrollment Desk**: Log in as a client without an enrolled contract. Verify that the three options are rendered correctly with their respective values, choose an option, click enroll, and verify that the dashboard transitions instantly to the active progress/milestones telemetry view.

---

## Phase 3: Ultimate Premium Elevators & Visual Polish

To reach an absolute 10/10 level of luxury agency reassurance and Machiavellian persuasion, we will implement the following high-prestige features:

### 1. Growth Analytics Telemetry (Post-Launch View)
- **Change:** When `projects.status` is set to `'Complete'`, the client's `StagingPreview` container transforms into a **Growth Performance Telemetry Panel**.
- **Visuals:** Sleek line graphs showing simulated premium metrics:
  - **Operational Traffic Nodes** (representing visitors/interactions)
  - **Active Lead Conversions** (live acquisition pipeline telemetry)
- **Copy:** *"System fully deployed. Growth telemetry engine active."*

### 2. "Priority Pipeline" Override System
- **Change:** Add a high-prestige button inside the Client messages sidebar or quick composer: **"Request Priority Override"**.
- **Interactivity:** Triggers a modal detailing that *"Priority override triggers immediate engineering redirection to your build stack, subject to premium contract margins."* Submitting it creates a high-priority action request in the database.

### 3. Secure File Vault Widget & Cryptographic Verification
- **Change:** Upgrade the **Secure Vault** card under the Site Access widget.
- **Visuals:** Displays a list of core client branding assets uploaded (e.g. logos, guidelines) marked as `[SECURE VAULT] — AES-256 ENCRYPTED`.
- **Copy:** Include cryptographic verification logs next to each asset (e.g., `brand_assets.zip — [SHA-256 VERIFIED]`) and a green pulsing lock status reading: *"Cryptographic asset container active. Integrity verified."*

### 4. Welcome Briefing Media Player
- **Change:** Add a premium, collapsible briefing video/audio player at the top of the Overview: **"Tactical Briefing: Operations Director"**.
- **Visuals:** Dark purple glass border, glowing play controls, visualizer bar.
- **Copy:** *"Operations Directive: Play to initialize strategic overview."*

### 5. Luxury Micro-Interactions & Styling
- **Mouse-Tracking Radial Glows**: Integrate a javascript mouse-move listener on `.glass` cards to project a subtle, glowing radial background vector following the cursor, making cards feel physical and premium.
- **Micro-Theme Accent Sync**: Map the admin-configured `theme_accent` from the database to dynamically sync the colors of key UI indicators, such as the circular progress telemetry arc, bullet highlight nodes in the timeline updates feed, and CTA hover states.
- **Provisioning Console Logs**: Add a simulated terminal-like widget when the project is in Discovery or Design, showing chronological logs (e.g., `[SYS] Container provisioned`, `[CDN] Edge routing verified`) to display continuous backend momentum.

---

## Button Validation & Action Audit

To guarantee a flawless user experience, a comprehensive audit is specified to verify that every button, CTA, form submission, and route link across the client dashboard is fully functional:

### 1. Zero Dead Links/Buttons
- **Client Sidebar**:
  - `Overview` links to `/client`.
  - `Updates` links to `/client/updates`.
  - `Book Session` links to `/client/book` (dedicated in-portal route).
  - `Messages` links to `/client/messages`.
  - `Vetting Dashboard` links to `/dashboard`.
- **Action Banners**: 
  - The "Open Action Console" button on the Action Banner must link directly to `/client/actions`.
  - The "Provide Details" CTA must open the interactive submission modal.

### 2. State & Event Handlers
- **Form Submissions**: Every submit button (like the launch override request or the action request details form) must have a loading state (`saving` or `loading` state with a spinner) and trigger a clear, visual `toast` indicator on success or failure.
- **Contract Enrollment Desk**: The "Enroll" buttons under the plans must call `handleEnroll(type)` which triggers a loading state (`enrolling === type`), successfully writes the chosen model parameters to Supabase, and re-renders the dashboard workspace in real time.
- **Interactive Tour**: The "Take Tour" triggers must properly initialize the user guide overlay step-by-step without lockups.
