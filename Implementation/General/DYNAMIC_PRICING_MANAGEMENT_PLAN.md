# Dynamic Pricing Management — Implementation Plan
**Version:** 1.0  
**Scope:** Admin-controlled pricing data layer for the GS Legacy Wealth public pricing page and homepage  
**Status:** Awaiting execution approval

---

## Overview

The site currently has six hardcoded pricing tiers (three setup, three retainer) embedded directly in `components/pricing.tsx`. This plan migrates all tier data into the Supabase `website_content` table, adds a dedicated Pricing editor inside the existing `/admin/content` page, and updates the public-facing `<Pricing />` component to consume live data from Supabase — with zero performance degradation, full fallback safety, and client-specific pricing entirely isolated from the public page.

---

## Architecture Summary

```
Admin saves → website_content table (Supabase)
                    ↓
          Next.js server fetch (revalidateTag)
                    ↓
        Public /pricing page (statically cached, fast)
        Public homepage (same data, same cache)

Client portal reads → projects table (client-specific overrides)
Public page reads  → website_content table (public tiers)
These NEVER touch each other.
```

---

## Data Shape

### Section Keys
| section_key | Contents |
|---|---|
| `pricing_setup_tiers` | Array of 3 one-time setup fee tier objects |
| `pricing_retainer_tiers` | Array of 3 monthly retainer tier objects |

### Tier Object Shape (JSONB)
```json
{
  "id": "authority-suite",
  "name": "Authority Suite",
  "price": "2,750",
  "deposit": "£687.50 deposit to initiate",
  "milestoneBreakdown": "4 milestone stages of 25% (£687.50) linked to build progress",
  "description": "A luxury digital front-office...",
  "features": [
    "Bespoke Next.js Authority Platform (5 Pages)",
    "Calendly Scheduling Integration",
    "Stripe Payment Gateway Integration",
    "Core SEO Blueprint & Schema Setup",
    "Supercharged Speed Profile (95+ Mobile)",
    "30 Days Dedicated Post-Launch Support"
  ],
  "cta": "Request Alignment",
  "featured": false
}
```

The `id` field provides a stable identifier that ties the setup tier to its retainer counterpart (e.g. `"authority-suite"` maps across both modes).

---

## Phase 1 — Database: Seed Pricing Data

**File:** New migration `supabase/migrations/20260629200000_pricing_cms_seed.sql`

**What it does:**
- Inserts the current hardcoded setup tiers as a `pricing_setup_tiers` row in `website_content`
- Inserts the current hardcoded retainer tiers as a `pricing_retainer_tiers` row in `website_content`
- Uses `ON CONFLICT (section_key) DO NOTHING` so running it twice is safe
- No schema changes required — `website_content` already has the right structure
- RLS is already correct: public can SELECT, admins can ALL

**Safety:** The migration is non-destructive. It only inserts. If the rows already exist, it does nothing. The current hardcoded values in `pricing.tsx` remain as the fallback until replaced.

---

## Phase 2 — Utility: Supabase Pricing Fetcher

**File:** New `lib/pricing.ts`

**What it does:**
- Exports a `getPricingTiers()` async function that fetches both `pricing_setup_tiers` and `pricing_retainer_tiers` from Supabase
- Uses `next: { revalidate: 60, tags: ['pricing'] }` on the fetch — page refreshes from cache max every 60 seconds, or instantly on-demand
- Returns typed arrays: `{ setupTiers: Tier[], retainerTiers: Tier[] }`
- If either fetch fails or returns null, falls back to the hardcoded arrays from `pricing.tsx` (the current values become the safety net)

**Fallback guarantee:** The public page NEVER breaks if the database is unreachable. It serves the hardcoded fallback silently.

---

## Phase 3 — Component: Refactor `<Pricing />` to Accept Props

**File:** `components/pricing.tsx`

**What it does:**
- Adds two optional props: `setupTiers?: Tier[]` and `retainerTiers?: Tier[]`
- When these props are passed, they take priority over the internal hardcoded arrays
- When they are NOT passed, it falls back to the existing hardcoded arrays
- The `billingCycle` toggle, ROI calculator, comparison matrix — ALL remain completely untouched
- Internal types are defined for `Tier` (name, price, deposit, description, features, cta, featured, milestoneBreakdown)
- The comparison matrix is intentionally left hardcoded in this version (see Open Items)

**Safety:** The component is 100% backward-compatible. Passing no props = current behaviour. This means the homepage (`<Pricing isHomepage={true} />`) keeps working even if the data layer isn't wired yet.

---

## Phase 4 — Pages: Wire Server-Side Data Fetching

### `/pricing` page
**File:** `app/pricing/page.tsx`

- Convert to an async server component
- Call `getPricingTiers()` at the top
- Pass the results as props to `<Pricing setupTiers={...} retainerTiers={...} />`
- Add `export const revalidate = 60` at the top of the file

### Homepage
**File:** `app/page.tsx`

- Same pattern: async, fetch, pass props to `<Pricing isHomepage={true} setupTiers={...} retainerTiers={...} />`
- Add `export const revalidate = 60`

**Performance impact:** Zero. Both pages are server-rendered and cached. Visitors never hit the database. The `revalidate = 60` means Next.js serves from cache and silently refreshes in the background every 60 seconds.

---

## Phase 5 — Admin: On-Demand Revalidation API Route

**File:** New `app/api/revalidate-pricing/route.ts`

**What it does:**
- A POST endpoint protected by a secret header (`x-admin-key`)
- Calls `revalidateTag('pricing')` — instantly clears the cached pricing data so the next page visit fetches fresh data from Supabase
- Called automatically by the admin pricing editor on successful save
- Without this: changes go live within 60 seconds. With this: changes go live immediately.

---

## Phase 6 — Admin UI: Pricing Tab in `/admin/content`

**File:** `app/(admin)/admin/content/page.tsx`

**What it does:**
- Adds `'pricing_setup'` and `'pricing_retainer'` to the `SectionKey` type and tab list
- The existing tab navigation, upsert save logic, and JSON editor all work identically for the new tabs — zero new patterns to maintain
- For the Visual Editor (form mode), adds a **dedicated Pricing form UI** instead of the generic key/value form:
  - **Mode toggle** at the top: `One-Time Setup` / `Monthly Retainer` (controls which section_key is active)
  - **Three tier cards** side by side on desktop, stacked on mobile
  - Each card shows: **Tier name**, **Price input (£)**, **Deposit text**, **Milestone breakdown text**, **Description textarea**, **Feature list editor** (each feature is a row: text input + delete button + add feature button), **CTA text**, **Featured toggle**
  - **Save button per card** — saves only that card's tier object, leaves the other two unchanged
  - **Mini preview** — a read-only styled card below each editor showing exactly how it renders on the public page
- The Raw JSON tab also works for pricing — power users can paste the entire tier array directly

**UX flow (day-to-day use):**
1. Admin → Marketing Manager → Content → Pricing tab
2. Toggle between Setup and Retainer modes
3. Click into any field, type the new value
4. Hit Save on that card
5. Done — public page updates within 60 seconds (or instantly with revalidation)

---

## Phase 7 — Verification & Integrity Checks

Before marking this complete, the following must all pass:

### Build Check
```bash
pnpm run build
```
Must produce zero TypeScript errors and zero build warnings related to the pricing refactor.

### Functional Checks
- [ ] `/pricing` page loads and displays correct tier data from Supabase
- [ ] `/` (homepage) pricing section loads and displays correctly
- [ ] Changing a price in the admin Content → Pricing tab and saving reflects on the public page within 60s
- [ ] If the Supabase fetch fails (simulated by passing wrong key), hardcoded fallback tiers appear — no blank page
- [ ] The billing cycle toggle (Setup / Retainer) still works correctly
- [ ] The ROI calculator still works correctly
- [ ] The comparison matrix still renders (hardcoded, unchanged)
- [ ] Admin pricing editor saves correctly without breaking other Content tabs (Hero, CTA, Process, FAQ, Footer)

### No-Regression Checks
- [ ] Client portal is unaffected — client-specific pricing in `projects` table is untouched
- [ ] `project-workspace.tsx` Financial Strategy card is unaffected
- [ ] The `website_content` RLS policies remain correct (public SELECT, admin ALL)
- [ ] No new environment variables required
- [ ] The 6 other admin dashboard sections (KPI row, client health grid, transactions feed, etc.) are untouched

---

## Open Items (Out of Scope for This Implementation)

| Item | Decision |
|---|---|
| **Comparison matrix** | Still hardcoded in `pricing.tsx`. Moving it to dynamic CMS is a follow-up task — it has a different structure (categories/rows not tiers) and would need its own editor UI. |
| **Client add-on line items** | Currently, client-specific adjustments are handled by editing `retainer_amount` in the project workspace. A formal `project_addons` table with itemised billing is a future feature. |
| **On-demand revalidation** | If the API route is deemed unnecessary (60s lag is acceptable), Phase 5 can be skipped without affecting anything else. |
| **Drag-to-reorder features** | Feature list reordering via drag-and-drop is a nice-to-have. Initial implementation uses simple add/delete/text-edit. |

---

## File Change Summary

| File | Action | Notes |
|---|---|---|
| `supabase/migrations/20260629200000_pricing_cms_seed.sql` | CREATE | Non-destructive seed migration |
| `lib/pricing.ts` | CREATE | Typed fetcher with fallback |
| `components/pricing.tsx` | MODIFY | Add optional props, keep all existing logic |
| `app/pricing/page.tsx` | MODIFY | Async server fetch, pass props |
| `app/page.tsx` | MODIFY | Async server fetch, pass props |
| `app/api/revalidate-pricing/route.ts` | CREATE | On-demand cache busting |
| `app/(admin)/admin/content/page.tsx` | MODIFY | Add pricing tabs + visual editor UI |

**Files NOT touched:** All other components, all other admin pages, all client-facing pages, all Supabase schema (no ALTER TABLE), all RLS policies.

---

## Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Supabase fetch fails on build | Low | Fallback to hardcoded arrays — build succeeds |
| Admin accidentally clears a tier | Low | JSON mode shows raw data; Reset button restores defaults |
| Cache stale beyond 60s | Very Low | On-demand revalidation endpoint clears cache immediately on save |
| Type mismatch on JSONB fields | Low | Typed `Tier` interface + runtime null-checks on all fields |
| Breaking the comparison matrix | None | It is not touched in this implementation |
