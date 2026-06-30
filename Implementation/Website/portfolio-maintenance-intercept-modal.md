# Portfolio Maintenance Intercept Modal

## Background

The portfolio section on the GS Legacy Wealth site currently shows live client websites in a browser-preview modal when visitors click **"View Live Site"**. One client's website is not yet complete — if a visitor clicks through and submits an enquiry on that unfinished site, it will never reach the client.

This plan introduces an **intercept modal** that fires _before_ the site preview loads for any portfolio item flagged as `underConstruction: true`. The intercept informs the visitor the site is coming soon and optionally allows them to register interest, turning a limitation into a lead capture opportunity.

---

## Proposed Changes

### `components/portfolio.tsx`

This is the only file that needs to change.

#### Step 1 — Flag the incomplete portfolio item

Add an `underConstruction` boolean to the relevant item in the `portfolioItems` array.

```ts
// Before
{
  title: "Stamp Valuation App",
  ...
  href: "https://v0-stamp-valuation-app.vercel.app",
  image: "/stamp-app-preview.png",
},

// After — add flag to whichever item is under construction
{
  title: "Stamp Valuation App",
  ...
  href: "https://v0-stamp-valuation-app.vercel.app",
  image: "/stamp-app-preview.png",
  underConstruction: true,   // <-- added
},
```

> **IMPORTANT:** Which portfolio item should be flagged? The Stamp Valuation App is the only one with a real `href` and screenshot. Please confirm whether this is the item to flag, or if it is one of the others (Elite Fitness Studio, Prestige Properties, etc.).

---

#### Step 2 — New `UnderConstructionModal` component (inline)

A new self-contained modal component added inside `portfolio.tsx`, rendered _before_ the `SitePreviewModal`. It will:

- Appear with a smooth fade + scale animation (matching the existing `SitePreviewModal` style)
- Show a 🚧 construction icon with premium gold branding
- Display a short, professional message explaining the site is coming soon
- Offer a **"Notify Me When It's Live"** email capture field (optional — can be disabled)
- Have a **"Close"** button
- Match the existing dark glassmorphism aesthetic of the site

**Visual design:**
```
┌────────────────────────────────────────────┐
│                   🚧                       │
│        Coming Soon                         │
│                                            │
│  This website is currently being crafted   │
│  to the highest standard. Check back soon  │
│  for the finished experience.              │
│                                            │
│  ┌──────────────────────────┐  [Notify Me] │
│  │  your@email.com          │              │
│  └──────────────────────────┘              │
│                                            │
│              [ Close ]                     │
└────────────────────────────────────────────┘
```

---

#### Step 3 — Intercept click logic

The existing click handler in both desktop and mobile overlays currently calls:
```ts
onClick={() => setActiveModal(item)}
```

This will be updated to:
```ts
onClick={() => item.underConstruction ? setConstructionModal(item) : setActiveModal(item)}
```

A second state variable `constructionModal` will be added alongside the existing `activeModal`.

---

#### Step 4 — Visual badge on the card

When `underConstruction: true`, the card will show a subtle **"Coming Soon"** pill badge (replacing or sitting alongside the "Legacy Partner" badge), so it's visually clear to visitors at a glance.

---

## State Changes Summary

| State variable       | Purpose                                              |
|----------------------|------------------------------------------------------|
| `activeModal`        | Existing — opens the full site preview iframe        |
| `constructionModal`  | New — opens the maintenance intercept modal          |

---

## Open Questions

1. **Which portfolio item** is the one under construction? Please confirm the title so the correct one is flagged.
2. **Email capture**: Do you want the "Notify Me" email input in the modal, or just a clean informational message with a Close button? The email capture could feed into your existing Supabase backend.
3. **Button label on the card**: Should the card button still say "View Live Site" (intercept fires after the click), or change to "Coming Soon" upfront?

---

## Verification Plan

### Manual Verification
- Confirm the flagged card shows the "Coming Soon" badge on hover
- Click "View Live Site" on the flagged card → intercept modal should appear, **not** the iframe preview
- Click "View Live Site" on the unflagged card → iframe preview should open as normal
- Close button dismisses the intercept modal cleanly
- Test on mobile layout (mobile footer buttons also trigger the modal)
