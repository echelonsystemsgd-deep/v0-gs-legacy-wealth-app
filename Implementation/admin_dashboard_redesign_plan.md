# Admin Dashboard & Workspace Redesign — Updated Implementation Plan

**File:** `Implementation/admin_dashboard_redesign_plan.md`  
**Status:** In Progress (Phases 1-11 Implemented; Phases 12-18 Drafted for Immediate Implementation)  
**Scope:** Admin command center (`/admin`), projects index (`/admin/projects`), project workspace (`/admin/projects/[id]`), client directory (`/admin/clients`), and timeline logs / nudge mechanics.

---

## Goal

Redesign the admin experience to be a premium, responsive, and highly visual control center. This includes filtering alerts to only show admin-actionable items, re-defining client health metrics, enlarging the daily schedule board, introducing a prioritized client list, restructuring the workspace details layout, configuring client-enrolled contract schemes (Monthly Retainer, One-Time Setup, and Performance Royalty Yield), implementing real-time task synchronization, fixing the account deletion edge function, simplifying billing inputs, and introducing timeline deletions (unsend), client micro-theming accents, task due dates with nudges, embedded viewport previews, alignment of health filters (Awaiting Client), deep-linked viewport tabs, message date grouping headers, and action/vault timestamp extensions.

---

## Detailed Phases

### Phases 1 to 11 (Completed)
- Integrated Alert Filtering, Health Metrics Grid, Timeline schedule expansion, Prioritized Client checklist, Stepper Workspace tabs, dynamic Realtime updates, Account Deletion edge functions, Sonner stacks, dynamic Billing sync, visual Modal dividers, and layout transitions.

### Phase 12 — Project Timeline Log Deletion & Unsend (Completed)
- Added log unsend hooks on admin timeline list and configured Supabase Realtime postgres deletions listener on the client updates page.

### Phase 13 — Client Portal Micro-Theming Accents (Completed)
- Custom accents dropdown added to sidebar, dynamic override variables appended to globals.css and injected globally via client layout.tsx wrapper.

### Phase 14 — Action Request Due Dates & Auto-Nudge Trigger (Completed)
- Due date inputs integrated in dispatch form, due date tags rendering on list, and system alerts nudge trigger wired to the action requests history.

### Phase 15 — Embedded Staging Preview Viewport (Completed)
- Embedded iframe previews added to configuration dashboard featuring responsive mobile, tablet, and desktop viewport selectors.

### Phase 16 — Health Board Filtering Alignment (Awaiting Implementation)
- **Goal:** Fix the empty grid bug when clicking the "Needs Attention" filter and align copy to "Awaiting Client".
- **Implementation:**
  - Rename the filter tabs and headers in [clients/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28admin%29/admin/clients/page.tsx) to use `"Awaiting Client"`.
  - Adjust the memoized search matching condition so that a filter of `'Awaiting Client'` matches projects marked with `label === 'Awaiting Client'`.

### Phase 17 — Deep-Linked Client Tapping (Awaiting Implementation)
- **Goal:** Click a client card in the health board and land directly on the specific Workspace tab (Chat or Actions) requiring attention.
- **Implementation:**
  - Support `initialTab` in [project-workspace.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/admin/project-workspace.tsx).
  - Feed the `tab` parameter from search query strings in [projects/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28admin%29/admin/projects/page.tsx) down to the workspace.
  - Deep-link cards in [client-health-grid.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/admin/client-health-grid.tsx):
    - Blocked (Red) cards -> `tab=chat`
    - Awaiting Client (Amber) cards -> `tab=actions`

### Phase 18 — Chat Grouping Banners & Extended Timestamps (Awaiting Implementation)
- **Goal:** Render chronological date headers inside chat conversations and show clear dates next to messages, file assets, and action logs.
- **Implementation:**
  - Add date banner divisions inside [project-workspace.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/admin/project-workspace.tsx) and [messages-client-container.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/messages-client-container.tsx).
  - Update layout tags on assets and logs to include comprehensive date-time logs.
