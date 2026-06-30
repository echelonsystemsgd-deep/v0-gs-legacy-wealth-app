# Calendly Inline Embed — Plain iframe Migration Plan

> **Goal:** Replace `Calendly.initInlineWidget()` (JS API) with a plain `<iframe src={url}>` embed so that `background_color`, `primary_color`, and `text_color` URL params are applied server-side by Calendly — making dark brand theming work on the **free plan** with zero account upgrade required.
>
> **Layout preserved:** The calendar remains inline and embedded exactly as it currently appears on Step 2 of the `/book` vetting flow.
>
> **Brand alignment:**
> - Colour params: `background_color=0A0A0A`, `text_color=F0EDE6`, `primary_color=C9A227`
> - Machiavellian tone preserved — vetting flow is unchanged, calendar only revealed after qualification
> - CSS filter fallback removed once iframe approach is confirmed working

---

## Context & Root Cause

| Method | How iframe is created | Colour params on free plan? |
|---|---|---|
| `initInlineWidget` (current) | Calendly JS creates iframe internally | ❌ No — JS API ignores them on free plan |
| Plain `<iframe src={url}>` (proposed) | Browser creates iframe, URL passed directly to Calendly's server | ✅ Yes — server renders with colours applied |

The Nordwacht dark-theme Calendly the user demonstrated is almost certainly using the plain iframe approach. The `background_color`, `primary_color`, and `text_color` params are server-side rendering hints — they only take effect when the URL is fetched directly as the iframe `src`, not when injected by the Calendly JS API on the free plan.

---

## Brand Constraints (from Machiavellian Repositioning Plan)

- Booking is **selective and scarce** — visitors apply; we confirm. This flow must NOT change.
- The calendar is Step 2, gated behind 5-question vetting
- Dark aesthetic (`#0A0A0A` bg, `#C9A227` gold, `#F0EDE6` text) must carry through into the calendar UI
- "Powered by Calendly" badge is acceptable — trust signal, not a brand violation
- Booking copy on Step 2 follows repositioning tone: "clinical evaluation", "strictly limited allocations"

---

## Technical Changes Required

### 1. `components/booking-flow.tsx`

#### Remove
- `containerReady` state (`useState(false)`)
- `calendlyContainerRef` (`useRef<HTMLDivElement>`)
- `setCalendlyRef` callback ref function
- The entire `initInlineWidget` `useEffect` (~60 lines including polling and cleanup)
- `window.Calendly` polling logic

#### Add
- React `<iframe>` element rendered directly in JSX with `src={buildCalendlyUrl()}`
- `key={retryCount}` prop on the iframe — forces a clean remount when the user retries
- `onLoad` handler to set `calendlyLoaded = true` and clear the fallback timer
- Simplified `useEffect` for step 2: just reset state + start 15s fallback timer (no polling needed)

#### Proposed iframe element
```tsx
<iframe
  key={retryCount}
  src={buildCalendlyUrl()}
  width="100%"
  style={{ height: calendlyHeight, minWidth: "320px", border: "none" }}
  title="Book your strategy session — GS Legacy Wealth"
  loading="lazy"
  onLoad={() => {
    setCalendlyLoaded(true)
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }}
/>
```

#### Keep unchanged
- `buildCalendlyUrl()` — URL already includes all colour params + prefill data
- `calendlyHeight` state + postMessage handler for `calendly.page_height` (auto-resize works from plain iframes)
- `calendly.event_scheduled` postMessage handler → advances to confirmation step
- Skeleton overlay (shown until `onLoad` fires)
- Fallback overlay (shown after 15s timeout)
- "Go back and edit my details" button
- Success banner, info tags, all Step 2 surrounding UI
- `retryCount` state

---

### 2. `components/calendly-init.tsx`

**No change required.** Script (`widget.js`) still loads for popup CTA fallback and future use of `CalendlyPopupButton`. The plain iframe embed does NOT require `window.Calendly` for the calendar — the iframe is a direct browser fetch. This removes the polling race condition entirely for the inline embed.

---

### 3. `app/globals.css`

**Remove the CSS filter rule** once the iframe approach is visually confirmed:

```css
/* REMOVE after confirmation */
.calendly-widget-wrapper iframe,
.calendly-inline-widget iframe {
  filter: invert(1) hue-rotate(10deg) saturate(0.9) brightness(0.95) !important;
}
```

**Keep:**
- `.calendly-widget-wrapper { background-color: #0A0A0A }` — covers the container before iframe loads
- `@keyframes calendly-shimmer` + `.calendly-skeleton` — used by skeleton overlay
- `.calendly-inline-widget { background-color: #0A0A0A }` — Calendly's injected shell

> Keep the filter **commented out** until visual confirmation is complete. Remove entirely once confirmed.

---

### 4. `Implementation/CALENDLY_INTEGRATION_PLAN.md`

Update:
- Phase 2 checklist: Mark initInlineWidget → plain iframe migration as complete
- Add Session 3 changes section documenting this migration

---

## Execution Order

```
Step 1 — booking-flow.tsx
  ├── Remove: containerReady, calendlyContainerRef, setCalendlyRef
  ├── Remove: initInlineWidget useEffect (incl. polling)
  ├── Simplify: step 2 useEffect (state reset + fallback timer only)
  └── Add: <iframe src={buildCalendlyUrl()} onLoad=... key={retryCount} />

Step 2 — Verify in browser (complete all 5 vetting questions to reach Step 2)
  ├── ✓ Dark background (#0A0A0A)
  ├── ✓ Gold date highlights (primary_color=C9A227)
  ├── ✓ Name/email pre-filled
  ├── ✓ Auto-height (calendly.page_height postMessage)
  ├── ✓ Booking confirmation fires (calendly.event_scheduled postMessage)
  └── ✓ Skeleton fades out when calendar is ready

Step 3 — globals.css
  └── Remove CSS filter (after visual confirmation)

Step 4 — CALENDLY_INTEGRATION_PLAN.md
  └── Update checklist and files table
```

---

## Risk & Fallback Table

| Risk | Mitigation |
|---|---|
| Colour params still ignored (deeper account restriction) | Keep CSS filter commented in globals.css as instant fallback |
| `onLoad` fires before Calendly fully renders | `calendly.page_height` postMessage is the authoritative skeleton-hide trigger |
| Prefill doesn't apply | `name` and `email` are already URL params in `buildCalendlyUrl()` — confirmed working |
| `calendly.event_scheduled` doesn't fire from iframe | Fires via postMessage from `https://calendly.com` — identical to JS-init iframes |
| iframe blocked by CSP | `frame-src calendly.com` already allowed (existing embed works) |

---

## Verification Checklist

- [ ] Calendar background is dark `#0A0A0A` (not white)
- [ ] Available date highlights are gold/amber (not Calendly blue `#0069FF`)
- [ ] Name and email are pre-filled when calendar loads
- [ ] Skeleton shimmer shows, then fades out when calendar is ready
- [ ] Auto-height works — calendar grows/shrinks with content, not fixed box scroll
- [ ] Booking completion → confirmation step advances automatically (postMessage)
- [ ] "Go back and edit" button returns to Step 1, Step 5
- [ ] No console errors
- [ ] Mobile layout renders correctly

---

## Alignment Summary

### vs. CALENDLY_INTEGRATION_PLAN.md
- Phase 2 (Inline Embed Hardening): This migration replaces the initInlineWidget approach with a simpler, more reliable plain iframe — a direct hardening improvement
- Phase 5 (Performance): Removes the `window.Calendly` polling dependency for the inline embed — improves reliability
- CSS filter from Session 2 is superseded by native colour params via iframe src

### vs. Machiavellian Repositioning Plan

| Requirement | Status after migration |
|---|---|
| Booking is selective — 5-step vetting preserved | ✅ Unchanged |
| Dark aesthetic carries through to calendar | ✅ Resolved by this migration |
| No floating badge widgets | ✅ Unchanged |
| Step 2 copy: "clinical evaluation" tone | ✅ Unchanged |
| Calendar only shown to qualified applicants | ✅ Unchanged — Step 2 only reachable after Step 1 |
