# Implementation Plan - Client Operations Center Enhancements (Interactive Roadmaps, Telemetry & Vault Upgrades)

This plan details the design, structure, and database additions needed to elevate the active client dashboard experience (`/client`). We focus on interactive stage sign-offs, financial milestone telemetry, secure asset vault mechanics, and quick support composer nodes.

---

## User Review Required

> [!IMPORTANT]
> 1. **Interactive Phase Approval (Sign-Off)**: We are introducing a new database table `public.project_approvals` to log stage completions approved by clients.
> 2. **Financial Milestone Telemetry**: We will render a gold-themed circular indicator or linear gauge visualizing total contract cost vs. payments settled to clarify stage unlocks.
> 3. **Vault Upgrades**: We will replace the current file asset uploader with a premium drag-and-drop secure container with realtime threat scanning simulation and upload progress gauges.

---

## Proposed Changes

### Database Layer (`supabase/migrations/`)

#### [NEW] [20260623150000_project_approvals.sql](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260623150000_project_approvals.sql)
Create a migration to set up the stage sign-off logger and RLS policies:
*   **Table Schema**:
    ```sql
    CREATE TABLE public.project_approvals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
        stage TEXT NOT NULL,
        approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
        approved_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        notes TEXT,
        UNIQUE(project_id, stage)
    );
    ```
*   **RLS Policies**:
    - Select: Clients can view approvals associated with their project (`project_id` matching `client_id = auth.uid()`).
    - Insert: Clients can insert sign-offs for their own project.

---

### Core UI Components (`components/client/`)

#### [NEW] [project-telemetry.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/project-telemetry.tsx)
Renders a gold-glowing circular SVG or line meter tracking financial and delivery milestones:
*   Queries `projects` amount paid vs. contract value.
*   Draws interactive milestone nodes indicating unlocked stages based on payments.

#### [NEW] [quick-message-reply.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/quick-message-reply.tsx)
A compact inline messaging card for the dashboard home screen:
*   Renders a small text area allowing the client to post instant messages to the project channel.
*   Directly saves the message in the `messages` table and fires realtime database triggers.

#### [NEW] [stage-approval-button.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/stage-approval-button.tsx)
The interactive client stage approval node:
*   Renders a clean, gold-glowing button (`[ Sign Off Phase ]`) next to completed design/discovery stages.
*   Sends SQL inserts to `project_approvals` and generates user notifications.

---

### Layouts & Pages (`app/`)

#### [MODIFY] [page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28client%29/client/page.tsx)
*   **Active Project Summary**: Integrate `<ProjectTelemetry />` metrics next to Summary cards.
*   **Implementation Phases Checklist**: Make stages interactive. Render client sign-off states next to completed phases using `<StageApprovalButton />`. If approved, show stamp details (`Approved on [date] by [client]`).
*   **Quick Support Reply**: Integrate `<QuickMessageReply />` directly under the recent messages logs card.
*   **Staging Preview device frame**: Render a miniature browser mockup frame if `project.preview_url` is active.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify layout compilations, type safety, and asset parameters.

### Manual Verification
1.  **Stage Sign-Off**: Log in as client. Complete discovery stage and click "Sign Off Phase". Verify row inserts in `project_approvals` and a notification logs automatically.
2.  **Telemetry Calculation**: Update project payments in the admin dashboard. Verify progress updates immediately in the client portal.
3.  **Quick Message Reply**: Type and send a quick message in the home page composer. Verify message logs instantly to the message thread.
