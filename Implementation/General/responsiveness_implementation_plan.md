# Mobile, Tablet & Desktop Responsiveness — Full Implementation Plan

GS Legacy Wealth currently has a strong desktop experience but contains several layout breakages, performance issues, and UX gaps when viewed on mobile and tablet devices. This plan addresses every identified issue in priority order, grouped by component.

---

## ⚠️ User Review Required

> This plan covers **10 components** across the full site. All changes are purely responsive/performance fixes — no redesigns to the visual identity, colour palette, or copy.

> The `Math.random()` hydration fix will cause a **brief visual change** to the gold particles on first load (they will be stable/seeded rather than random on every render). This is the correct behaviour and eliminates React hydration errors currently appearing in the browser console.

> The Calendly embed height fix requires listening to Calendly's `postMessage` events. This is fully supported by Calendly's public API and requires no additional packages.

---

## ❓ Open Questions

**Hero right column on mobile** — Should the laptop mockup card be:
- **(A) Hidden on mobile** — show copy only, cleaner and faster
- **(B) Shown in a compact form** — scaled down with floating badges removed

**Gold particles on mobile** — Currently 20 in Hero and 15 in CTA. Options:
- **(A) Reduce to 8** on mobile for balanced performance
- **(B) Remove entirely** on mobile for maximum speed

Please confirm both before implementation begins.

---

## Proposed Changes

---

### 1 — Navbar `components/navbar.tsx`

- Add **active route highlighting** using `usePathname()` — current page link glows gold
- Add **outside-click-to-close** on the mobile drawer using a `useRef` + `mousedown` listener
- Add **backdrop blur + dark overlay** behind the open mobile drawer
- Style the mobile "Book a Strategy Call" CTA button with the gold gradient (currently renders as plain outline)
- Add `active:scale-95` tap feedback to all nav interactive elements
- Add `padding-bottom: env(safe-area-inset-bottom)` to the mobile drawer to clear the iPhone home bar

---

### 2 — Hero `components/hero.tsx`

- **Floating cards** (`-top-6 -right-6` and `-bottom-4 -left-4`): change to `sm:-top-6 sm:-right-6` so they only appear on tablet+ and don't clip off-screen on mobile
- **Right column visual**: conditionally render based on screen size — hidden on `xs`/`sm`, visible from `md` upward *(pending user confirmation above)*
- **Gold particles**: wrap in a `useMemo` with stable seeded positions to fix hydration mismatch; reduce count on mobile via a `useMediaQuery` hook
- **Hero heading**: audit `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl` — add tighter base for very small phones (320–360px screens)
- Add `active:scale-95` to both hero CTA buttons

---

### 3 — Pricing `components/pricing.tsx`

- **Billing toggle slider**: replace hardcoded `142px`/`228px` pixel widths with a `useRef`-measured dynamic approach so the gold pill always perfectly aligns with the active button on any screen width
- **Pricing cards grid**: add `sm:grid-cols-2 lg:grid-cols-3` — currently jumps from 1-col to 3-col with no intermediate tablet step, leaving large whitespace at ~700px viewport
- **3D tilt card effect**: detect touch devices (`window.matchMedia('(pointer: coarse)')`) and disable `onMouseMove` tilt — replace with a subtle `whileHover={{ scale: 1.02 }}` for touch instead
- **Feature comparison table**: add a horizontal scroll hint (fade gradient on right edge) and make the first "Feature" column sticky so users can scroll and always see what they're comparing
- **ROI calculator sliders**: increase thumb hit area to minimum 44px for touch usability

---

### 4 — Booking Flow `components/booking-flow.tsx`

- **Calendly embed height**: subscribe to Calendly's `postMessage` events and dynamically set the container height — eliminates nested scrolling on mobile
- **Tier cards**: ensure `active:scale-95` and `touch-action: manipulation` on all tile buttons to eliminate the 300ms tap delay on iOS
- **Billing toggle touch targets**: increase padding on the One-Time/Monthly pills to meet the 44px minimum
- **Step indicator**: ensure wraps cleanly on 320px screens without clipping

---

### 5 — Services `components/services.tsx`

- Add `sm:grid-cols-2` intermediate breakpoint to fill the tablet portrait gap
- Audit card padding — reduce from `p-8` to `p-5 sm:p-8` on small screens
- Ensure icon containers don't overflow on 320px devices

---

### 6 — Portfolio `components/portfolio.tsx`

- Review grid breakpoints and add `sm:grid-cols-2 lg:grid-cols-3` pattern
- Ensure hover overlay effects gracefully degrade on touch (show content by default on mobile rather than requiring hover)
- Add `touch-action: manipulation` to all interactive portfolio items

---

### 7 — Process `components/process.tsx`

- Ensure the step connector lines switch correctly between layouts at all breakpoints
- Add `sm:grid-cols-2` intermediate step where applicable
- Audit number/icon sizes on mobile

---

### 8 — CTA `components/cta.tsx`

- **Animated dashed ring**: the spinning circle is absolutely positioned and may clip on mobile — add `hidden sm:block` or reduce its size on mobile
- **CTA particles**: apply the same `useMemo` seeded fix as the hero particles
- **Button row**: confirm both buttons are full-width on mobile with adequate tap targets (`py-5` minimum)

---

### 9 — Custom Cursor `components/custom-cursor.tsx`

- Detect touch/pointer type on mount: `window.matchMedia('(pointer: coarse)').matches`
- If touch device, **return null immediately** — no cursor element is rendered, no event listeners are attached, zero performance cost on mobile

---

### 10 — Footer `components/footer.tsx`

- **Logo size**: reduce from `h-32 w-64` to `h-20 w-40 sm:h-32 sm:w-64` on mobile
- Add `sizes` prop to the footer `<Image>` component: `"(max-width: 640px) 160px, 320px"` — reduces image payload on mobile
- Add `padding-bottom: env(safe-area-inset-bottom)` to the bottom bar for iPhone home bar clearance

---

### 11 — Global CSS & Layout `app/globals.css` + `app/layout.tsx`

**globals.css**
- Add `@media (prefers-reduced-motion: reduce)` block to disable or simplify all CSS animations site-wide
- Add `touch-action: manipulation` globally to all `button` and `a` elements to remove 300ms tap delay on iOS Safari
- Add `-webkit-tap-highlight-color: transparent` to remove the default blue tap flash on mobile

**layout.tsx**
- Add `viewport-fit=cover` to the viewport meta tag — required for safe area insets to work on notched iPhones

---

### 12 — Sticky CTA Button `components/sticky-cta-button.tsx`

- Add `padding-bottom: env(safe-area-inset-bottom)` so the button clears the iPhone Safari toolbar
- Add `active:scale-95` for tactile tap feedback

---

## Verification Plan

### Browser Testing (DevTools)
Test at the following viewport widths:

| Width | Device |
|-------|--------|
| 320px | Samsung Galaxy A (smallest Android) |
| 375px | iPhone SE / 13 Mini |
| 390px | iPhone 14 |
| 768px | iPad portrait |
| 1024px | iPad landscape / small laptop |
| 1280px | Standard desktop |
| 1536px | Large desktop |

- Check browser console for hydration errors (should be zero after particle fix)
- Confirm Calendly embed loads without nested scroll on mobile
- Toggle `prefers-reduced-motion` in OS settings and confirm animations stop

### Manual Device Testing
- Real iPhone (Safari) — check safe area insets on footer and sticky button
- Real Android (Chrome) — check tap delay is eliminated
- iPad portrait and landscape — confirm all grids reflow correctly
- Pricing billing toggle animation across all breakpoints

---

## Implementation Order

| # | Component | Priority | Reason |
|---|---|---|---|
| 1 | `custom-cursor.tsx` | 🔴 Critical | Runs unnecessary JS on every mobile page load |
| 2 | `hero.tsx` | 🔴 Critical | Floating cards overflow viewport |
| 3 | `pricing.tsx` | 🔴 Critical | Toggle animation breaks between breakpoints |
| 4 | `globals.css` + `layout.tsx` | 🔴 Critical | Foundation for safe areas + tap delay fix |
| 5 | `navbar.tsx` | 🟡 High | Active states + mobile UX improvement |
| 6 | `booking-flow.tsx` | 🟡 High | Calendly nested scroll on mobile |
| 7 | `cta.tsx` | 🟡 High | Particle hydration fix |
| 8 | `footer.tsx` | 🟡 High | Safe area + image size |
| 9 | `sticky-cta-button.tsx` | 🟡 High | iPhone Safari toolbar overlap |
| 10 | `services.tsx` | 🟢 Medium | Tablet grid gap |
| 11 | `portfolio.tsx` | 🟢 Medium | Touch hover fallback |
| 12 | `process.tsx` | 🟢 Medium | Connector lines at breakpoints |
