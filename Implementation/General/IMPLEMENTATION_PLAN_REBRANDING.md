# GS Legacy Wealth Rebrand Implementation Plan

This implementation plan focuses on rebranding the GS Legacy Wealth website to transition from the current flashy "gold-on-black" look to a restrained, authoritative luxury consultancy identity (Bloomberg, McKinsey, Stripe). We will systematically update fonts, colors, spacing, and layouts across all pages and components.

## User Review Required

> [!IMPORTANT]
> - **Purples & Gold Usage**: Purple (`#6D28D9` / `#5B21B6`) will be used as a minor 10–15% accent color for interactive states. Muted Gold (`#B8952A` / `#C9A227`) will be used for headlines, section titles, and outline CTA accents. Pure black (`#0A0A0A`) and warm off-white (`#F0EDE6`) will form the primary background and body text colors.
> - **Icon-Free Services Grid**: We will remove all visual icons from the Services grid cards. Do you have specific layout preferences for these typographic blocks, or should we style them as simple text columns with elegant headlines?
> - **Trust Bar**: We are replacing the animated counters and indicators in the Hero section with a single static trust bar reading: `"Trusted by 50+ premium brands"`.

---

## Proposed Tasks & Checklists

### 1. Design System & Global Styles Setup
- [ ] **Google Fonts Integration**:
  - Update `app/layout.tsx` to import `Playfair_Display`, `Inter`, and `Cinzel` from `next/font/google`.
  - Bind them to CSS variables: `--font-playfair`, `--font-inter`, and `--font-cinzel`.
- [ ] **CSS Variables & Color System**:
  - Update `app/globals.css` to define the new luxury color tokens:
    - `--background`: Deep black (`#0A0A0A`)
    - `--foreground`: Warm off-white (`#F0EDE6`)
    - `--card`: Near-black with subtle purple tint (`#0F0B1A`)
    - `--primary`: Royal purple (`#6D28D9`)
    - `--accent`: Muted gold (`#B8952A`)
    - `--muted-foreground`: Warm light-grey (`#A39E96`)
- [ ] **Spacing & Utilities Cleanup**:
  - Add standard padding and margin variables in `globals.css`.
  - Remove floating animations, particle float keyframes, gold glow utilities (`glow-gold`, `glow-gold-intense`), and custom scanning animations.
  - Update scrollbar styling to use muted gold and deep card backgrounds.

### 2. Layout, Navigation & Custom Cursor
- [ ] **Custom Cursor Removal**:
  - Update `components/custom-cursor.tsx` to return `null` immediately.
  - Remove all mouse-tracking calculations, listeners, and frame animations.
- [ ] **Navigation Bar Refinement**:
  - Update `components/navbar.tsx` to remove hover zoom transitions on the logo.
  - Style the navigation CTA to be a clean outlined button (`variant="outline"`) instead of a gradient-filled button.
  - Shift nav header glass transition on scroll to match the new dark purple-grey bg color.

### 3. Hero & Brand Statement Sections
- [ ] **Hero Section Cleanup**:
  - Update `components/hero.tsx` to remove `GoldParticles` background animation and glowing overlay orbs.
  - Replace floating elements (like the animated AI Assistant badge and performance stats badge).
  - Replace the trust indicators ticker list with a single, clean static trust line: `"Trusted by 50+ premium brands"`.
  - Bind the main hero headline to use `font-serif` (Playfair Display) for the text `"Luxury Websites Built to Scale Your Business."` (or another editorial headline variant).

### 4. Services & Portfolio Components
- [ ] **Typographic Services Cards**:
  - Update `components/services.tsx` to remove the mouse-move radial gradient `GlareCard` wrapper.
  - Remove all lucide-react icons (`Globe`, `Rocket`, `Bot`, etc.) from the service grids.
  - Format columns to use clean typographic hierarchy with gold headlines and off-white lists.
- [ ] **Restrained Portfolio Cards**:
  - Update `components/portfolio.tsx` to remove the scanning animation overlay.
  - Remove the floating "Coming Soon" and "Legacy Partner" badges on hover.
  - Simplify cards to clean borders and clean image layout previews (no gold tilt/glare controls).

### 5. Pricing & Testimonials Sections
- [ ] **Restrained Pricing Grid**:
  - Update `components/pricing.tsx` to remove 3D tilt controls (`TiltCard`) and radial mouse glare overlays.
  - Simplify card formats to clean borders and high typographic contrast.
  - Update the ROI calculator sliders and billing cycle switchers to use royal purple active states.
- [ ] **Minimalist Testimonials Quotes**:
  - Update `components/testimonials.tsx` to remove the circular avatar initial blocks.
  - Re-align the cards to focus on quotes, placing the name and role in clean, simple sans-serif typography below the quote text.
- [ ] **Sticky Concierge Button**:
  - Update `components/sticky-cta-button.tsx` to use purple/muted gold borders with a warm off-white layout (no gold gradients).

---

## Verification Plan

### Automated Tests
- Run `npm run build` locally to verify that all layout, page, and styling modifications compile with zero TypeScript errors.
- Run `npm run lint` to check for syntax or eslint formatting issues.

### Manual Verification
- **Visual Rebrand Check**: Open the local server and verify color changes on all pages: Home, Services, Portfolio, Pricing, Process, Testimonials.
- **Scroll & Interactions Check**: Ensure standard mouse pointer behavior is restored (no tracking cursor). Verify that scroll behavior is smooth and cards render clean borders instead of glowing gradients.
- **Responsiveness Check**: Verify text readability and margin sizing across mobile, tablet, and desktop viewports.
