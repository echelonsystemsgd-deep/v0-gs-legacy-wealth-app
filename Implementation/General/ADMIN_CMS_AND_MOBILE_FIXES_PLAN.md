# Admin Dashboard & Frontend Synchronisation Plan
**Session Date:** 2026-08-16  
**Status:** ✅ Implemented & Verified (tsc: 0 errors)

---

## Summary of Changes Implemented This Session

### 1. Admin CMS — Pricing Sections Now Reflect Live Frontend Copy

**Root Cause:** `DEFAULT_SECTIONS` in `/admin/content/page.tsx` was referencing non-existent keys (`setupTiers`, `retainerTiers`) on `SITE_COPY.pricingPage`. The actual keys in `lib/site-copy.ts` are `oneTimeTiers`, `monthlyTiers`, and `revenueShareTiers`.

**Fix Applied:**
```ts
// Before (broken):
pricing_setup: SITE_COPY.pricingPage.setupTiers.map(...)
pricing_retainer: SITE_COPY.pricingPage.retainerTiers.map(...)

// After (correct):
pricing_setup: SITE_COPY.pricingPage.oneTimeTiers.map(...)
pricing_retainer: SITE_COPY.pricingPage.monthlyTiers.map(...)
```

**Tier data now shown in admin Setup Tiers tab:**
- Essential Storefront — £495 one-time
- Pro Order Builder — £895 one-time (featured)
- Full Custom Build — £1,495 one-time

**Tier data now shown in admin Retainer Tiers tab:**
- Launch Support — £99/mo
- Growth & Maintenance — £195/mo (featured)
- Full Managed Partner — £395/mo

---

### 2. Admin Dashboard — Testimonials Now Visible Without DB Seeding

**Root Cause:** Testimonials admin page did a strict DB query and showed empty state if Supabase table had 0 rows. The public site renders frontend defaults from `lib/site-copy.ts`.

**Fix Applied:** `fetch()` in `app/(admin)/admin/testimonials/page.tsx` now falls back to a synthetic list of the 2 live frontend testimonials when the DB returns 0 rows:

| # | Client | Company | Badge |
|---|--------|---------|-------|
| 1 | Sarah M., Founder | The Artisan Patisserie Group · London | +38% Revenue Lift |
| 2 | Marcus T., Managing Director | Gourmet Events & Hospitality · Berkshire | 14.5 Hrs Saved / Wk |

Items with `id: 'default-0'`, `'default-1'` are treated as unsaved — clicking Save creates a new DB row rather than trying to UPDATE by a fake ID.

**"Sync Frontend Defaults" button** available in page header to persist them to Supabase in one click.

---

### 3. Admin Dashboard — Portfolio Showcase Now Visible Without DB Seeding

**Root Cause:** Same pattern as testimonials — strict DB query showed empty state.

**Fix Applied:** `fetch()` in `app/(admin)/admin/portfolio/page.tsx` now falls back to all 4 live frontend showcase projects:

| # | Project | Type | Metric | Live Link |
|---|---------|------|--------|-----------|
| 1 | Stamp Valuation App | AI Web App · Prototype | Target Latency: < 1s | ✅ |
| 2 | Elite Fitness Studio | AI Website · Concept Build | Target 90%+ Booking Flow | — |
| 3 | Sterling Direct Purchases | Lead System · Prototype | Pipeline Architecture | ✅ |
| 4 | Strategic Growth Co. | Landing Page · Concept Build | Growth Analytics Framework | — |

Same `default-{idx}` ID pattern — Save creates new DB row.

---

### 4. Admin CMS Content Page — DB Key Mapping Fixed

`fetchSection` now maps UI tab keys to correct Supabase `section_key` values:
```
pricing_setup → pricing_setup_tiers
pricing_retainer → pricing_retainer_tiers
all other tabs → same key
```
Also changed from `.single()` to `.maybeSingle()` to avoid PostgREST errors when section doesn't exist yet — falls back gracefully to `DEFAULT_SECTIONS`.

---

### 5. Admin Logout Fixed

**Root Cause:** `handleSignOut` in `components/admin/sidebar.tsx` only called `supabase.auth.signOut()` but did not clear localStorage auth tokens. This caused Supabase client-side token persistence to keep the session alive and block redirect to `/login`.

**Fix:** Now clears all `sb-*-auth-token` localStorage entries before redirecting — same robust pattern used in the public navbar `handleSignOut`:
```ts
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
localStorage.removeItem(`sb-${projectRef}-auth-token`)
// Also sweep all sb-*-auth-token keys
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('sb-') && key.endsWith('-auth-token')) localStorage.removeItem(key)
})
```

---

### 6. Custom Admin Scrollbars

`app/globals.css` now applies site-wide custom WebKit + Firefox scrollbar:
- **Track:** 6px width, dark navy rgba background
- **Thumb:** Subtle gold `rgba(218,166,64,0.28)` with gold glow on hover
- **Applies to:** Admin sidebar, main content, all modals and table views

---

### 7. Mobile Bug Fixes

#### 7a. Logo Scroll-to-Top
`components/navbar.tsx` — Logo `<Link>` now has an `onClick` handler:
- If already on `/` → calls `window.scrollTo({ top: 0, behavior: 'smooth' })` 
- From other pages → Next.js navigates home normally (no `e.preventDefault()`)

#### 7b. Horizontal Scroll/Side-Shift During Vertical Scrolling
`app/globals.css` — Strengthened overflow rules:
```css
html {
  max-width: 100%;
  overflow-x: hidden;
  overscroll-behavior-x: none;  /* ← prevents bounce/drift on iOS/Chrome */
}
body {
  max-width: 100%;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  position: relative;  /* ← anchors fixed children correctly */
}
```

#### 7c. Pinch-Zoom Viewport
`app/layout.tsx` — Viewport no longer sets `maximumScale` or `userScalable`. No zoom restrictions were found (`maximum-scale=1` was never set) but `minimumScale: 1` was added for clarity. No blocking of browser-native zoom.

---

## Files Modified

| File | Change |
|------|--------|
| `app/(admin)/admin/content/page.tsx` | Fixed `oneTimeTiers`/`monthlyTiers` keys; fixed `fetchSection` to use `maybeSingle()` and correct `dbKey` mapping |
| `app/(admin)/admin/testimonials/page.tsx` | Fallback display of 2 frontend testimonials; KPI badge field; robust handleSave |
| `app/(admin)/admin/portfolio/page.tsx` | Fallback display of 4 frontend projects; badge/metric editing; robust handleSave |
| `components/admin/sidebar.tsx` | Fixed logout to clear all localStorage auth tokens |
| `components/navbar.tsx` | Added `handleLogoClick` for scroll-to-top on homepage |
| `app/globals.css` | Custom gold scrollbars; `overscroll-behavior-x: none`; `position: relative` on body |
| `app/layout.tsx` | Viewport comment added; `minimumScale: 1` explicit |

## Verification
- `npx tsc --noEmit` → **0 errors**
