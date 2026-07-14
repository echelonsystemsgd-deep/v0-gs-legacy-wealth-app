# Implementation Plan - Admin Dashboard Premium Royal Purple & Carbon Fiber Refinements

This plan details the addition of premium Royal Purple accents, a micro-carbon fiber background pattern, and a balanced layout to the admin dashboard, creating a cohesive, high-end "Systems Laboratory" aesthetic.

---

## User Review Required

Please review the implemented features and styling enhancements:

### 1. Purple & Gold Gradient Progress Bar
* In `TransactionsFeed` (`components/admin/transactions-feed.tsx`), changed the progress bar gradient to shift from **Royal Purple to Antique Gold** (`from-purple-600 to-gold`).

### 2. Deep Amethyst Ambient Glows
* Transitioned all card background radial glows from gold (`from-gold/5`) to a **deep amethyst purple glow** (`from-purple-600/10 via-transparent to-transparent`) in `AttentionPanel`, `TransactionsFeed`, and `AdminKpiRow` cards.

### 3. Slate-Purple Card & Panel Borders
* Changed the standard borders on all main containers and client cards (`ClientHealthGrid`, `AttentionPanel`, `TransactionsFeed`) from `border-gold/10` to a tech-oriented **slate-purple** (`border-purple-500/15`).
* Updated the client cards' hover shadow from gold-based to purple-based (`hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]`).

### 4. Purple Hover Highlight States for KPIs
* Updated hover border targets on the 6 KPI cards from `hover:border-gold/25` to `hover:border-purple-500/30`.

### 5. Royal Purple KPI Gradients
* Updated secondary KPI numbers (*Inbound Pipelines*, *Active Mandates*, *Scheduled Briefings*) to use a **Royal Purple to Lavender** text gradient instead of standard white text:
  * `bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent`

### 6. Active Sidebar Indicator
* In the sidebar navigation menu, highlighted the active page (e.g. *Dashboard*) with a soft **royal purple glass background and a solid purple left accent border**:
  * `bg-purple-600/10 text-purple-300 border-l-[3px] border-purple-600`

### 7. Quick Action Hover Glows
* In the **Attention Needed** panel, updated the hover state of the "Quick Actions" links to use **Royal Purple text, border, and background glows**:
  * `hover:text-purple-400 hover:border-purple-500/35 hover:bg-purple-600/5`

### 8. Premium Carbon Fiber Background
* Created a **micro-carbon-fiber background pattern** `.bg-carbon-purple` in `app/globals.css` using interlocking geometric linear gradients with royal purple tints.
* Updated `app/(admin)/layout.tsx` to display this carbon fiber weave background across the entire admin dashboard area.

---

## Verification Plan

To ensure that the site is completely perfect and functional with no breaks or faults, we run the following verification steps:

### 1. Console Navigation Checks
* Verify that clicking the links on the main metrics cards redirects to the correct sub-consoles:
  - **Inbound Pipelines** modal "Open Console" -> `/admin/leads?status=New`
  - **Active Mandates** modal "Open Console" -> `/admin/projects?filter=active`
  - **Scheduled Briefings** modal "Open Console" -> `/admin/bookings?status=Scheduled`
  - **MRR Run Rate** modal "Manage Active Retainers" -> `/admin/projects?filter=retainer`
  - **Attention Needed** quick action buttons -> `/admin/projects?create=true&redirect=/admin`, `/admin/leads?status=New`, and `/admin/bookings?schedule=true&redirect=/admin`

### 2. Modal Controls & Prevention of Action Bubbling
* Verify that clicking the "Nudge Action" icons inside the Client Health cards triggers only the nudge (opening the context/modal or toast) and does **not** bubble up to trigger the main card click event.
* Verify that clicking the Close button or clicking the background backdrop correctly closes all detail modals.

### 3. Notification Center & Toast Messages
* Verify that triggering a client nudge fires a Toast notification correctly.
* Verify that the top bar **NotificationCenter** matches the theme and lists active notifications properly without layout layout overflow.

### 4. Build Compilation Check
* Verify that a full production build compiles successfully with no TypeScript type warnings or parsing errors:
  - Run `npm run build`
