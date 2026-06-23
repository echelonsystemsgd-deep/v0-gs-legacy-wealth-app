# CALENDLY_INTEGRATION_PLAN.md
## Calendly Embed Integration — GS Legacy Wealth

> **Repo inspection date:** 2026-06-23
> **Framework:** Next.js 16 (App Router), React 19, TypeScript
> **Styling:** Tailwind CSS v4 (`@import 'tailwindcss'`), Vanilla CSS custom properties
> **Animation:** Framer Motion v12
> **Auth/DB:** Supabase SSR
> **Deploy target:** Vercel
> **Monitoring:** Sentry

---

## Status: Current State of Booking

The `/book` route and `BookingFlow` component **already exist** with a working 2-step flow:

| Step | What exists today |
|------|-------------------|
| Step 1 | Qualification form (name, email, company, website, challenge) → POSTs to `/api/forms/submit` |
| Step 2 | Calendly inline widget via `Calendly.initInlineWidget()`, `next/script` lazyOnload, prefill + brand params wired |

**The core embed is already partially implemented.** This plan focuses on **hardening, fixing known gaps, adding the modal/popup flow, and documenting every decision** — not starting from zero.

---

## A) Recommended Embed Approach

### Decision: Advanced JS Embed (`Calendly.initInlineWidget`) ✅ — Already Chosen

| | Advanced JS Embed | Plain `<iframe>` |
|---|---|---|
| **Prefill** | ✅ Native `prefill` object | ✅ Via URL params only |
| **Auto-resize** | ✅ `resize: true` built in | ❌ Fixed height or manual postMessage |
| **Modal/popup** | ✅ `Calendly.initPopupWidget()` — same script | ❌ Separate implementation needed |
| **No SSR risk** | ✅ Guard with `typeof window !== 'undefined'` | ✅ iframes are inert on SSR |
| **Script size** | ~50 KB gzipped, loaded `lazyOnload` | Zero extra JS |
| **Brand params** | Identical for both | Identical for both |

**Why JS embed wins:** The existing `BookingFlow` already uses `Calendly.initInlineWidget()` correctly. The same `widget.js` powers the popup variant too — zero extra payload for adding the optional modal flow.

> **Assumption:** A single Event Type URL is used (`https://calendly.com/gslegacywealth/30min` — already in the codebase). If this URL changes, update via env var (see Section D).

---

## B) Step-by-Step Task Checklist

### Phase 1 — Environment & Config
- [x] Add `NEXT_PUBLIC_CALENDLY_URL` to `.env.local.example`
- [x] Add `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR`, `NEXT_PUBLIC_CALENDLY_BG_COLOR`, `NEXT_PUBLIC_CALENDLY_TEXT_COLOR`
- [x] Add these vars to Vercel dashboard (manual step — see Section D)

### Phase 2 — Inline Embed Hardening
- [x] Fix double-init race: single `useEffect` init path, removed `onLoad` re-init from `<Script>`
- [x] Skeleton loader: branded shimmer replaces always-visible spinner until first `calendly.page_height` fires
- [x] Container cleanup on back-navigation: clear `innerHTML` before re-initialising
- [x] Booking confirmation toast: `calendly.event_scheduled` → sonner `toast.success()`
- [x] CLS prevention: `contain: layout style` on wrapper
- [x] Accessibility: `aria-label` and `role="region"` on container
- [x] 8-second fallback: if widget never loads, show branded fallback with direct Calendly link
- [x] Calendly script moved to `app/layout.tsx` (root layout, `lazyOnload`)

### Phase 3 — Modal/Popup CTA Flow
- [x] Create `components/calendly-popup-button.tsx`
- [x] Add popup CTA as secondary button in `components/cta.tsx`
- [x] `sticky-cta-button.tsx` unchanged — inline embed remains primary flow

### Phase 4 — GDPR & Privacy
- [x] On-page GDPR disclosure added to `/book` page (replaces hidden banner — see decision below)
- [x] Privacy Policy section — see Section on GDPR below

### Phase 5 — Performance & Reliability
- [x] `widget.js` script moved to root layout
- [x] DNS preconnect hints added to root layout
- [x] Fallback UI implemented in `booking-flow.tsx`

### Phase 6 — QA
- [ ] Run QA checklist (Section E) — manual

### Phase 7 — Deploy
- [ ] Add env vars to Vercel dashboard (manual)
- [ ] Push to feature branch → verify Preview URL
- [ ] Merge to main → production smoke test

---

## C) Files Modified / Created

| File | Action | Summary |
|------|--------|---------|
| `app/layout.tsx` | MODIFY | Add Calendly `<Script>` + DNS preconnect at root level |
| `components/booking-flow.tsx` | MODIFY | Fix race, add skeleton, fallback, toast, accessibility, env vars |
| `components/calendly-popup-button.tsx` | NEW | Modal/popup trigger component |
| `components/cta.tsx` | MODIFY | Add secondary popup CTA button |
| `app/book/page.tsx` | MODIFY | Add on-page GDPR disclosure notice |
| `app/globals.css` | MODIFY | Skeleton shimmer + container constraint CSS |
| `.env.local.example` | MODIFY | Add Calendly env var documentation |

---

## D) Environment / Config

### Environment Variables

| Variable | Example Value | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_URL` | `https://calendly.com/gslegacywealth/30min` | Event Type URL |
| `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR` | `C9A227` | Gold accent — **hex without #** |
| `NEXT_PUBLIC_CALENDLY_BG_COLOR` | `0A0A0A` | Dark background — **hex without #** |
| `NEXT_PUBLIC_CALENDLY_TEXT_COLOR` | `F0EDE6` | Light text — **hex without #** |

**Brand colour derivation** from `globals.css`:
```
--color-accent-gold: #C9A227  → primary_color  = C9A227
--color-bg-primary:  #0A0A0A  → background_color = 0A0A0A
--color-text-primary:#F0EDE6  → text_color = F0EDE6
```

### Vercel Dashboard Steps
1. Project → Settings → Environment Variables
2. Add all four `NEXT_PUBLIC_CALENDLY_*` vars for Production, Preview, and Development
3. Trigger redeploy after saving

---

## GDPR Banner — Analysis & Decision

### What `hide_gdpr_banner=1` does
Hides Calendly's visible consent notice **inside the iframe**. Does **not** disable Calendly's cookies or data processing — only removes the UI element.

### Advice for UK user base

> [!CAUTION]
> **Do NOT hide the banner without providing your own equivalent on-page notice.**

UK GDPR (retained by the Data Protection Act 2018) requires transparency about third-party data processors. Calendly collects: name, email, IP address, timezone, and custom question answers.

**Decision applied in this implementation:** We set `hide_gdpr_banner=1` (better UX) and add a small, styled, accessible GDPR disclosure box on the `/book` page itself, above the Step 1 form. The box:
- States that booking is powered by Calendly
- Names the data collected (name, email, selected answers)
- Links to Calendly's Privacy Policy
- Links to your own Privacy Policy

### Cookies set by Calendly embed

| Cookie type | Origin | Impact |
|---|---|---|
| Session/functional | `calendly.com` | Required for booking; set on Calendly origin, not yours |
| Analytics (`_gat`, `__utmz`) | `calendly.com` | May be blocked by Safari ITP — booking still works |
| Marketing/advertising | None | Not injected into your domain |

> Calendly's cookies do **not** appear in your domain's cookie jar. Your own cookie banner need not cover them, but your Privacy Policy must disclose Calendly as a third-party processor.

---

## Branding Limitations

| Controllable | Not Controllable |
|---|---|
| `background_color` | Calendly logo |
| `primary_color` (buttons, highlights) | Font family |
| `text_color` | Border-radius of internal elements |
| `hide_landing_page_details=1` | Internal padding/spacing |
| `hide_gdpr_banner=1` | "Powered by Calendly" footer (paid plans only) |
| Prefill via `prefill` object / URL params | Full CSS injection |

The widget will always look like "a dark-themed Calendly" inside our branded container. Our outer card (border, skeleton, success banner) is fully under our control.

---

## Data Capture — Invitee Questions

### Calendly Admin Setup (One-Time — Must Be Done Manually)

1. Calendly Admin → Event Types → `30min` → Edit → Invitee Questions
2. Add:
   - **Q1 (a1):** "Website URL" — Text, optional
   - **Q2 (a2):** "Biggest Challenge" — Text/Dropdown, required
3. **Verify order** matches code mapping: `a1 = websiteUrl`, `a2 = biggestChallenge`

> **Assumption:** Question order in Calendly admin panel must match code. If you reorder questions in Calendly, update the URL param keys accordingly.

### Prefill Architecture

**Now:** Step 1 form → `Calendly.initInlineWidget({ prefill: { name, email } })` + URL params `a1`, `a2`

**Future (optional):** Homepage pre-form → `sessionStorage` → read on `/book` mount:
```typescript
const savedName = sessionStorage.getItem('gs_prefill_name') ?? ''
const savedEmail = sessionStorage.getItem('gs_prefill_email') ?? ''
```

---

## E) QA Checklist

### Desktop Browsers
- [ ] Chrome (latest) — embed loads, prefill populated, booking completes, toast fires
- [ ] Firefox (latest)
- [ ] Safari macOS — ITP enabled; functional cookies survive 7 days post-interaction
- [ ] Edge (Chromium)

### Mobile
- [ ] iPhone Safari — no horizontal scroll; `minWidth: 320px` respected
- [ ] iPhone Chrome
- [ ] Android Chrome

### Adblocker / Privacy
- [ ] uBlock Origin default — fallback link appears after 8s timeout
- [ ] Privacy Badger
- [ ] Brave (shields up)

### GDPR / Cookie
- [ ] On-page GDPR disclosure visible before user submits Step 1
- [ ] Privacy Policy accessible from `/book` page

### Timezone
- [ ] Book from BST (UTC+1) — confirmation email shows correct time
- [ ] Book from UTC-5 — Calendly converts correctly

### Performance / CLS
- [ ] Lighthouse on `/book` — CLS < 0.1
- [ ] No layout jumps during Calendly height auto-resize

### Route Change
- [ ] Navigate away mid-booking — no console errors
- [ ] Navigate to `/book` via Next.js `<Link>` — script available from root layout
- [ ] Hard refresh on `/book` — widget initialises after hydration

### Booking Confirmation
- [ ] `calendly.event_scheduled` → sonner toast displays
- [ ] Calendly confirmation email arrives with correct details

### Fallback
- [ ] Block `assets.calendly.com` in DevTools → fallback UI appears after 8s

---

## F) Rollout Plan

### Recommended: Direct Deploy

1. **Local:** `npm run dev`, test `/book` end-to-end
2. **Feature branch:** Push → Vercel Preview URL auto-generated
3. **Preview QA:** Run Section E checklist
4. **Production:** Merge to main → Vercel deploys → smoke test

### Optional: Feature Flag

```env
NEXT_PUBLIC_CALENDLY_ENABLED=true   # set false on prod until QA passes
```

Flip to `true` in Vercel dashboard — no code redeploy needed.

### Fallback if Calendly Fails to Load

After 8 seconds without a `calendly.page_height` event, the embed area is replaced with:
- A brief explanation ("ad-blocker or network issue")
- A direct link to the Calendly URL (opens in a new tab)

This is already implemented in the hardened `booking-flow.tsx`.

---

## G) Future Upgrades

### 1. Prefill from On-Site Pre-Form
Store name/email in `sessionStorage` from any on-site form → auto-populate `/book` Step 1. No backend changes.

### 2. UTM Passthrough
```typescript
['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(p => {
  const v = new URLSearchParams(window.location.search).get(p)
  if (v) calendlyParams.set(p, v)
})
```
Calendly natively forwards these in booking data. Zero plan upgrade required.

### 3. Booking Webhook (Requires Calendly Standard/Teams)
- New route: `/api/webhooks/calendly/route.ts`
- Verify HMAC `Calendly-Webhook-Signature` header
- Update Supabase leads table + trigger Resend admin notification

### 4. Multiple Event Types
Add `NEXT_PUBLIC_CALENDLY_URL_SHORT` / `NEXT_PUBLIC_CALENDLY_URL_FULL` env vars; read `?type=quick` query param to select.

### 5. Calendly Analytics Events

| postMessage event | Trigger | Suggested GA4 event |
|---|---|---|
| `calendly.profile_page_viewed` | Widget visible | `calendly_view` |
| `calendly.event_type_viewed` | Date picker opened | `calendly_event_type_view` |
| `calendly.date_and_time_selected` | Slot picked | `calendly_slot_selected` |
| `calendly.event_scheduled` | Booking confirmed | `calendly_booking_confirmed` (conversion) |

No plan upgrade required — add a `window.addEventListener('message', ...)` handler.

---

## Security & Privacy Summary

| Item | Detail |
|---|---|
| **Data passed to Calendly** | Name, email, website URL, challenge — collected with consent on Step 1 |
| **Data on our servers** | All Step 1 data saved to Supabase via `/api/forms/submit` before Calendly loads |
| **Calendly GDPR** | SOC 2 Type II certified, GDPR-compliant, provides a DPA on request |
| **Cookies** | Set on `calendly.com` origin only — not in your domain |
| **CSP (if added later)** | Must include `frame-src https://calendly.com` + `script-src https://assets.calendly.com` |
| **XSS** | postMessage handler validates `e.origin === 'https://calendly.com'` ✅ |
| **Script integrity** | Calendly does not publish SRI hashes (industry standard for third-party embeds) |

---

## Open Questions — Please Confirm Before or After Implementation

> [!IMPORTANT]
> 1. **Calendly URL:** Is `https://calendly.com/gslegacywealth/30min` live and published?
> 2. **Question order in Calendly admin:** Q1 = Website URL (a1), Q2 = Biggest Challenge (a2) — please verify in Calendly admin panel
> 3. **Popup CTA placement:** Homepage hero? Pricing section? `cta.tsx` only?
> 4. **Privacy Policy page:** Does `app/privacy/page.tsx` exist? Should Calendly disclosure be added there?

---

*Plan authored: 2026-06-23 | Repo: echelonsystemsgd-deep/v0-gs-legacy-wealth-app*
