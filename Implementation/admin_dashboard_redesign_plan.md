# Admin Dashboard Redesign — Implementation Plan

**File:** `Implementation/admin_dashboard_redesign_plan.md`
**Status:** Draft — Awaiting Approval
**Scope:** Admin dashboard homepage (`/admin`) only
**Approach:** Refactor existing `app/(admin)/admin/page.tsx` + introduce new focused components

---

## Goal

Redesign the admin Command Center dashboard to mirror the quality of the upgraded client dashboard: purposeful layout, interactive components, real live data surfaced at a glance, and a clear "what needs my attention right now?" moment — without any extra page navigation.

---

## Open Questions (confirm before coding)

> **Q1 — Client Health Grid placement:**
> Should the Client Health overview grid live on the admin homepage, or should the homepage show a condensed version (3 clients max) that links to a dedicated `/admin/clients` page?
> _Recommendation: condensed on homepage, full list at `/admin/clients`_

> **Q2 — Finances page:**
> Should there be a dedicated `/admin/finances` route (revenue, invoices, pipeline), or keep financials inline on the dashboard?
> _Recommendation: keep inline for now, add a "View all" link pointing to `/admin/projects`_

> **Q3 — Attention Panel vs Quick Actions:**
> Should "Attention Needed" fully replace Quick Actions, or sit above it?
> _Recommendation: replace entirely — Quick Actions links can live at the bottom of Attention Needed as fallback CTAs_

> **Q4 — Today's Schedule Strip:**
> Is this essential or nice-to-have for your workflow?
> _Recommendation: include — it is one query and a thin strip, low cost, high value_

---

## Architecture Overview

The redesign keeps the page as a **server component** that fetches all data, then passes it down to lean client components for interactivity. No global state needed.

```
app/(admin)/admin/page.tsx           <- Server component, all DB queries here
  |- AdminAlertBanner               <- New client component
  |- AdminKpiRow                    <- Refactored, inline expand replaces modal
  |- TodayScheduleStrip             <- New client component
  |- ClientHealthGrid               <- New client component (biggest new piece)
  |- AttentionPanel                 <- New client component (replaces Quick Actions)
  |- TransactionsFeed               <- Refactored from inline JSX into component
  |- ActivityLogPanel               <- Existing — demoted to bottom, kept as-is
```

---

## Phase 1 — Data Layer (server queries in `page.tsx`)

Update `app/(admin)/admin/page.tsx` to fetch all data required by the new UI. All queries run server-side at page render.

### New queries to add

| Data | Query | Used By |
|---|---|---|
| All active clients with projects | `profiles` joined with `projects` where `is_archived = false` | ClientHealthGrid |
| Unread messages per project | `messages` count grouped by `project_id`, `sender_id != admin` | ClientHealthGrid, AttentionPanel |
| Pending approvals | `project_approvals` where `client_approved = false` | AttentionPanel |
| New leads older than 48h | `leads` where `status = New` and `created_at < now() - 48h` | AttentionPanel |
| Today sessions | `strategy_sessions` where `scheduled_at` is today, `status = Scheduled` | TodayScheduleStrip, AttentionPanel |

### Existing queries to keep (unchanged)

- `leadsCount` — KPI card
- `projectsCount` — KPI card
- `sessionsCount` — KPI card
- `projectsFinancials` — Capital Realised + Pipeline hero KPI cards
- `recentPayments` — TransactionsFeed
- `recentLogs` — ActivityLogPanel

### Remove

- The URL-state `searchParams` for `modal=sales` and `modal=pipeline` — replaced by inline expand panels.

---

## Phase 2 — KPI Row Refactor (`AdminKpiRow`)

**File:** `components/admin/kpi-row.tsx` *(new)*

### What changes

- Extract KPI cards from `page.tsx` into their own component
- **Two hero cards** (Capital Realised + Pipeline Value): larger serif number, inline expandable breakdown panel triggered by clicking the card — no URL modal
- **Three standard cards** (Leads, Projects, Sessions): same size as now
- Remove the `?modal=sales` and `?modal=pipeline` URL pattern entirely
- The expand panel slides open below the hero cards using `useState` and a max-height CSS transition

### Hero card expand panel contents

- **Capital Realised expand:** project name, payment notes, amount, date
- **Pipeline expand:** project name, client, status, contract value, paid, balance

---

## Phase 3 — Alert Banner (`AdminAlertBanner`)

**File:** `components/admin/alert-banner.tsx` *(new)*

Renders **only if at least one priority condition is true**. Zero DOM output when everything is clear.

### Priority order (highest to lowest)

1. Unread client messages
2. Pending phase approvals
3. Cold leads — New status, older than 48h
4. Session starting within 1 hour

### Behaviour

- Shows the single highest-priority alert with a count and action link
- Gold pulsing dot on the left (matches client dashboard action banner style)
- Does not render at all if nothing is urgent — handled in `page.tsx`

---

## Phase 4 — Today Schedule Strip (`TodayScheduleStrip`)

**File:** `components/admin/today-schedule-strip.tsx` *(new)*

A thin horizontal strip below the KPI row showing today's booked sessions as pill tags.

### Behaviour

- If no sessions today: renders single muted line "No sessions scheduled today" so layout does not jump
- If sessions exist: one pill per session — client name and time
- Clicking a pill links to `/admin/bookings`
- Max 4 pills, "+N more" overflow pill if needed

---

## Phase 5 — Client Health Grid (`ClientHealthGrid`)

**File:** `components/admin/client-health-grid.tsx` *(new — the biggest new component)*

A grid of mini cards, one per active client project.

### Each card shows

- Client avatar (or initials fallback) + full name
- Project name
- Current stage badge (colour-coded: Discovery=blue, Design=purple, Development=amber, Revision=orange, Complete=green)
- Days since last message
- Unread message indicator dot if applicable
- Pending approval flag icon if applicable
- Full card is a link to `/admin/projects` filtered to that project

### Health border colour (left-border accent)

| Status | Condition | Colour |
|---|---|---|
| On Track | No unread messages, no pending approvals | Green |
| Needs Attention | Unread messages OR pending approval | Amber |
| Blocked | Pending approval older than 3 days | Red |

### Layout

- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 1-column stack

### Empty state

"No active client mandates. Deploy a new project from the Projects page." with a link to `/admin/projects?create=true`

---

## Phase 6 — Attention Needed Panel (`AttentionPanel`)

**File:** `components/admin/attention-panel.tsx` *(new — replaces Quick Actions)*

A prioritised list of real actionable items pulled from live data.

### Dynamic rows (only rendered if condition is true)

- Unread messages from clients → `/admin/messages`
- Stage approvals awaiting sign-off → `/admin/projects`
- Leads cold for 48+ hours → `/admin/leads?status=New`
- Strategy call today → `/admin/bookings`

### All Clear state

If nothing urgent: green pulsing dot + "All systems nominal — no immediate actions required."

### Fallback static links (always shown below a divider)

- Deploy Client Mandate → `/admin/projects?create=true`
- Assess CRM Pipeline → `/admin/leads?status=New`
- Initiate Strategic Call → `/admin/bookings?schedule=true`

---

## Phase 7 — Transactions Feed (`TransactionsFeed`)

**File:** `components/admin/transactions-feed.tsx` *(extracted from inline JSX)*

Minor refactor of the existing Recent Sales panel.

### Changes

- Extract from inline JSX in `page.tsx` into its own component
- Show max 3 transactions (down from 4)
- Add collection rate bar at the bottom: "£X of £Y collected (Z%)" with a thin gold progress bar
- "View all transactions" link to `/admin/projects`
- Remove the duplicate expand modal (replaced by KPI row inline expand)

---

## Phase 8 — Final Page Assembly (`page.tsx` rewrite)

After all components are built, `app/(admin)/admin/page.tsx` is cleaned up to a readable shell:

```tsx
return (
  <div className="space-y-6 sm:space-y-10">
    <AdminHeader />

    {hasAlerts && <AdminAlertBanner {...alertProps} />}

    <AdminKpiRow {...kpiProps} />

    <TodayScheduleStrip sessions={todaySessions} />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ClientHealthGrid clients={clientsWithProjects} />
      </div>
      <div className="space-y-6">
        <AttentionPanel {...attentionProps} />
        <TransactionsFeed {...transactionProps} />
      </div>
    </div>

    <ActivityLogPanel initialLogs={recentLogs} />
  </div>
)
```

---

## Files Summary

| Action | File |
|---|---|
| MODIFY | `app/(admin)/admin/page.tsx` — new queries, new layout, remove modal state |
| NEW | `components/admin/kpi-row.tsx` |
| NEW | `components/admin/alert-banner.tsx` |
| NEW | `components/admin/today-schedule-strip.tsx` |
| NEW | `components/admin/client-health-grid.tsx` |
| NEW | `components/admin/attention-panel.tsx` |
| NEW | `components/admin/transactions-feed.tsx` |
| KEEP | `components/admin/activity-log-panel.tsx` — unchanged |
| KEEP | `components/admin/sidebar.tsx` — unchanged |
| DELETE (inline) | Sales modal JSX currently in `page.tsx` |
| DELETE (inline) | Pipeline modal JSX currently in `page.tsx` |
| DELETE (inline) | Quick Actions JSX currently in `page.tsx` |

---

## No Database Changes Required

All data already exists in the current schema. This is a purely frontend and query refactor.

---

## Recommended Delivery Order

1. Phase 1 — Add new queries to `page.tsx` (foundation everything else depends on)
2. Phase 2 — `AdminKpiRow` (highest visibility change, removes modal clutter)
3. Phase 5 — `ClientHealthGrid` (biggest UX win, most impactful)
4. Phase 6 — `AttentionPanel` (replaces Quick Actions)
5. Phase 3 — `AdminAlertBanner` (conditional, depends on Phase 1 data)
6. Phase 4 — `TodayScheduleStrip` (thin, quick to build)
7. Phase 7 — `TransactionsFeed` (minor extraction refactor)
8. Phase 8 — Final `page.tsx` assembly and cleanup
