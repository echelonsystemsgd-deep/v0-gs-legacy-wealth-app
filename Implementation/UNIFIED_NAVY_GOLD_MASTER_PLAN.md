# Canonical Navy & Gold Re-Architecture & P1 System Upgrades

## Executive Overview
Following the direct technical extraction of `MercianWealthLogo.jpeg` (`/public/MercianWealthLogo.jpeg`), this plan establishes the canonical brand tokens derived directly from the physical logo asset:
- **Canonical Midnight Navy Background**: `#020E28` (100% exact match from logo corner & field pixels)
- **Canonical Imperial Monogram Gold**: `#DAA640` (100% exact match from monogram stroke pixels)
- **Canonical Elevated Navy Surface (Cards/Navbar)**: `#07153B`
- **Canonical Gold Border Trace**: `rgba(218, 166, 64, 0.20)`
- **Canonical Gold Glow Highlight**: `rgba(218, 166, 64, 0.15)`
- **Canonical High-Contrast Text**: `#FFFFFF` (Heading Pure White), `#94A3B8` (Slate Silver Body), `#EBB755` (Luminous Warm Gold Highlight)

All artificial AI mockup approximations and legacy cyan/purple/amber artifacts are deprecated. The real homepage and public layout will be rebuilt with the physical logo asset in the navigation header, verified for crisp rendering and zero layout overflow across 360px–440px mobile viewports up to 4K desktop screens.

---

## Technical Specifications & Exact Hex Sampling

```
┌──────────────────────────────┬───────────────────┬───────────────────────────────────────────┐
│ BRAND ELEMENT                │ CANONICAL HEX     │ LOGO SOURCE / USAGE                      │
├──────────────────────────────┼───────────────────┼───────────────────────────────────────────┤
│ Primary Background           │ #020E28           │ Exact background of MercianWealthLogo.jpeg│
│ Surface / Card Background    │ #07153B           │ Elevated Navy Card Component Canvas       │
│ Elevated Card / Surface Top  │ #0C1D4D           │ Focused Modal & Active Card Surfaces      │
│ Primary Monogram Gold        │ #DAA640           │ Exact MW Monogram Stroke Hex              │
│ Warm Gold Highlight Text     │ #EBB755           │ Highlighting & Active Selection Text      │
│ Deep Gold Active State       │ #B88528           │ Button Hover & Active Trigger States      │
│ Gold Accent Border           │ rgba(218,166,64,0.20)│ 1px Technical Container Stroke         │
└──────────────────────────────┴───────────────────┴───────────────────────────────────────────┘
```

---

## Action Items for Candidate 1 Re-Architecture & P1 Upgrades

### 1. Design Token Overhaul (`app/globals.css`)
- Bind all root design tokens strictly to `#020E28` and `#DAA640`.
- Update range slider thumb, glassmorphism border utilities, and button states to use exact sampled gold.

### 2. Header & Real Logo Rendering (`components/navbar.tsx` & `components/brand-logo.tsx`)
- Embed `MercianWealthLogo.jpeg` with high priority.
- Replace cyan/amber text with clean Gold + White branding.
- Enforce responsive scaling for 360px–440px mobile viewports.

### 3. P1 Codebase Fixes
- **Unified Scarcity Component**: Build a standardized capacity counter for the homepage and booking flows.
- **Real Testimonials**: Update testimonial cards with verified business deliverables and measurable metrics.
- **Consistent Prototype Badges**: Label all demo projects in `/portfolio` with `Interactive Sandbox · Live Preview`.
- **ROI Calculator Mobile Overflow**: Overhaul `InteractiveRoiCalculator` layout with responsive padding and flexible grid wrapping.

---

## Verification Strategy
1. Start dev server and launch browser subagent.
2. Verify logo clarity at 1440px (Desktop), 390px (iPhone), and 360px (Android).
3. Capture full-page screenshot of real homepage.
