# Admin Dashboard Update — 2026-06-29

## Summary

Two targeted fixes applied to `components/admin/project-workspace.tsx`. No other dashboard areas were touched.

---

## Fix 1 — Staging Viewport Console: Device Auto-Detection

**File:** `components/admin/project-workspace.tsx`

**Change:**
- Added a `getDeviceViewport()` helper function that reads `window.innerWidth` at runtime:
  - < 768px ? Mobile
  - 768–1023px ? Tablet
  - >= 1024px ? Desktop
- Changed `viewportSize` initial state from hardcoded `'desktop'` to a lazy initialiser `() => getDeviceViewport()`
- Added a dedicated `useEffect([id])` that calls `setViewportSize(getDeviceViewport())` on every client open — ensuring re-detection happens whenever you navigate between client profiles
- Desktop / Tablet / Mobile toggle buttons remain fully functional for manual override

**Before:** Always opened on Desktop.
**After:** Opens on the correct device view automatically; can still be toggled manually.

---

## Fix 2 — Financial Strategy & Contract Schemes: Pricing Options Redesign

**File:** `components/admin/project-workspace.tsx`

**Change:**
- Replaced three flat labelled inputs with three distinct model cards — one per pricing type
- Cards: Monthly Retainer, One-Time Setup Fee, Performance Royalty Yield (PRY)
- Each card contains its inline input field with the appropriate label and placeholder
- Cards visually react to the Contract Valuation Model dropdown:
  - Active model card is highlighted (gold border + subtle gold background) with an Active badge
  - Inactive cards are de-emphasised (reduced opacity)
- Helper subtitle explains the relationship between the dropdown and cards
- Layout is responsive: single-column on mobile, three-column on tablet/desktop
- Contract Valuation Model dropdown and Amount Settled field were NOT modified

---

## Verification

- No changes to: sidebar, kpi-row, client-health-grid, pricing.tsx, any client-facing components, or any other admin pages
- Both changes isolated to Project Workspace (config tab, Financial Strategy card + Staging Viewport area)
- Viewport detection uses `typeof window === 'undefined'` guard for SSR safety
