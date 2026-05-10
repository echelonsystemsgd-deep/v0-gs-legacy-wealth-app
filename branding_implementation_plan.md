# GS Legacy Wealth - Branding Implementation Plan

This document outlines the step-by-step strategy for integrating the new "GS Legacy Wealth" branding (luxury black and gold theme) across the website. 

## 1. Asset Extraction & Preparation
Before writing any code, we need to prepare the visual assets:
- **Logo Assets:** Extract the logo from the provided concepts into high-resolution, web-optimized formats. We will need:
  - A primary transparent PNG/SVG of the full logo (Crown, Lion, GS, Khanda) with the text.
  - A standalone icon version (just the central emblem) for favicons and mobile headers.
- **Image Processing:** Ensure the gold metallic gradients and 3D effects are preserved in the transparent versions.

## 2. Design System & Theme Configuration
We will establish a global design system to ensure consistency.

### Color Palette
- **Primary Background:** Deep Charcoal / Rich Black (e.g., `#0A0A0A`, `#111111`) to create a premium, high-contrast canvas.
- **Primary Accent (Gold):** We will use a gradient or a solid rich gold hex code (e.g., `#D4AF37`, `#B8860B`, `#C5A059`) for text highlights, borders, and buttons.
- **Text (Body):** Soft Off-White (e.g., `#EAEAEA` or `#F5F5F5`) for readability on dark backgrounds.
- **Surface/Card Backgrounds:** Slightly lighter dark tones (e.g., `#1A1A1A`) or dark glassmorphism effects with subtle gold borders.

### Typography
- **Headings (H1, H2, H3):** A luxury serif font that matches the logo's elegance. *Suggestions: Playfair Display, Cinzel, or Cormorant Garamond.*
- **Body Text:** A clean, modern sans-serif to balance the ornate headings. *Suggestions: Inter, Montserrat, or Lato.*

## 3. Global Codebase Updates
- **Tailwind Configuration (`tailwind.config.ts`):** Extend the theme to include the new custom colors (`legacy-black`, `legacy-gold`, etc.) and the new font families.
- **Global CSS (`globals.css`):** Update the root variables to apply the dark background globally and set default text colors. Create utility classes for the "metallic gold" text gradient effect.

## 4. Component-Level Implementation

### Header & Navigation
- Change the header background to deep black or a dark translucent glass effect.
- Replace the current logo with the new "GS Legacy Wealth" transparent SVG.
- Update navigation links to use the new body font, with a gold hover effect or underline.

### Buttons & Interactive Elements
- **Primary CTAs:** Black or dark grey buttons with a solid gold border (`#D4AF37`) and gold text, featuring a subtle gold glow on hover.
- **Alternative CTAs:** Solid gold background with black text for high-priority actions.

### Page Sections (Hero, Features, Testimonials)
- **Hero Section:** Needs a striking dark background. If using a background image, it should have a heavy dark overlay so the gold logo and text pop.
- **Cards/Containers:** Update all informational cards to have dark backgrounds (`#1A1A1A`), subtle gold borders, and gold accent icons.

### Footer
- Implement a rich black background.
- Center the new logo and tagline: *"BUILDING WEALTH. CREATING LEGACY. GIVING BACK."*
- Ensure all footer links and legal text are legible against the dark background.

## 5. Review & Refinement
- **Contrast Checking:** Ensure the gold-on-black and white-on-black combinations meet accessibility standards for readability.
- **Responsive Testing:** Verify that the complex logo scales down nicely on mobile screens without losing detail.
- **Micro-animations:** Add subtle fade-ins and smooth transitions (especially on gold elements) to reinforce the "premium" feel.
