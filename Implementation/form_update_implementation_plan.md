# Form Conversion Flow Update — Implementation Plan

Simplify the booking and contact forms by removing the pricing/plan selection entirely and replacing it with lightweight qualification fields that lower the barrier to entry. The goal is to make it as frictionless as possible for a prospect to raise their hand — the sales conversation happens on the call, not in the form.

---

## Overview of Changes

| File | What Changes |
|---|---|
| `components/booking-flow.tsx` | Remove tier/billing selection, replace obstacle with new challenge options, add contact time picker, update trust line |
| `app/contact/page.tsx` | Remove phone, service dropdown, notes textarea — add challenge dropdown, contact time picker, trust line |
| Supabase `leads` table | Pack new fields into existing `notes` column (no schema change required) |

---

## Open Questions (Resolve Before Executing)

### 1. Supabase Schema Strategy

Two new fields are being added (`biggest_challenge`, `preferred_contact_time`). Choose one:

- **Option A — New columns (recommended):** Add `biggest_challenge` (text) and `preferred_contact_time` (text) columns to the `leads` table. Clean, queryable, filterable in admin.
- **Option B — Pack into `notes`:** Format both as a string into the existing `notes` column. No schema change required.

> Default used in execution: **Option B** (safe, no migration needed).

### 2. Contact Time Toggle Width on Mobile

The 3-pill toggle (Morning / Afternoon / Evening) should stretch full-width on mobile for easier tap targets. Confirm this is acceptable.

---

## Files NOT Changing

- `components/cta.tsx` — buttons only, no form
- `components/hero.tsx` — CTA buttons only
- `components/navbar.tsx` — navigation only
- `app/pricing/` — pricing display, links to `/book` still functional
- All other pages — no forms

---

## Detailed Changes

---

### 1. `components/booking-flow.tsx`

#### Remove

- `Tier`, `BillingType` types
- `tierMeta`, `tierKeys` config objects
- `selectedTier`, `billingType` from `FormData` interface
- The entire **Investment Tier** card grid section (billing toggle + 4 tier cards)
- `useSearchParams` import + `?tier=` URL param read + `useEffect` sync
- Tier/billing summary badges on Step 2
- Unused Lucide imports: `Crown`, `Zap`, `Settings`, `RefreshCw`, `Sparkles`

#### Add / Update

- New type: `Challenge = "No website yet" | "Outdated website" | "Not getting leads" | "Want to modernise / add AI features"`
- New type: `ContactTime = "Morning" | "Afternoon" | "Evening"`
- Updated `FormData`:
  ```ts
  interface FormData {
    fullName: string
    email: string
    websiteUrl: string
    companyName: string
    biggestChallenge: Challenge | ""
    preferredContactTime: ContactTime | ""
  }
  ```
- `challengeOptions` array (replaces `obstacleOptions`) with 4 new values
- **Preferred Contact Time** 3-pill toggle section (Morning / Afternoon / Evening)
- Updated `validateForm`: remove tier check, add `biggestChallenge` + `preferredContactTime` checks
- Updated Calendly `a2` param: `"${biggestChallenge} — Preferred time: ${preferredContactTime}"`
- Step 2 badges: `biggestChallenge` badge + `preferredContactTime` badge (with Clock icon)
- Submit subtext replaced with:
  > *"No commitment. We'll review your business and give you honest feedback in 20 minutes — completely free."*

---

### 2. `app/contact/page.tsx`

#### Remove

- `SERVICES` constant array
- `phone`, `service_interested`, `notes` from form state
- Phone Number field (UI)
- Service Required `<select>` dropdown (UI)
- Project Details & Objectives `<textarea>` (UI)

#### Add / Update

- `biggest_challenge: ''` and `preferred_contact_time: ''` added to form state
- **Biggest Challenge** `<select>` dropdown with 4 options
- **Preferred Contact Time** 3-pill toggle (Morning / Afternoon / Evening)
- Supabase insert updated (Option B):
  ```ts
  notes: `Challenge: ${form.biggest_challenge} | Preferred time: ${form.preferred_contact_time}`
  ```
- Remove `phone`, `service_interested` from insert payload
- Trust line added below submit button:
  > *"No commitment. We'll review your business and give you honest feedback in 20 minutes — completely free."*

---

## Supabase Migration (Option A Only — Skip if using Option B)

```sql
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS biggest_challenge text,
  ADD COLUMN IF NOT EXISTS preferred_contact_time text;
```

> Non-breaking additive migration. Existing rows will have `NULL` for these columns.

---

## Verification Plan

1. **`/book` page** — Fill form with all 4 challenge options + all 3 contact times, confirm Step 2 (Calendly) loads and summary badges show new fields correctly
2. **`/contact` page** — Submit form, verify lead appears in Supabase `leads` table with `notes` field populated correctly
3. **Pricing page links** — Confirm `/book?tier=Launch` etc. still navigate cleanly without errors
4. **Mobile** — Confirm pill toggles and challenge cards are tap-friendly on small screens
5. **Trust line** — Confirm muted text appears below submit on both forms
6. **Build check** — Run `npm run build` to confirm no TypeScript errors after type changes
