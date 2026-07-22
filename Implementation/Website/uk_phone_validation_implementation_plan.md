# UK Phone Number Prefix (+44) & Validation Implementation Plan

## Overview
Implement a visually locked, auto-selected `+44` country code prefix and strict UK phone number validation for both the booking form (`/book`) and contact form (`/contact`). Add a brand-aligned supporting positioning statement beneath the phone field emphasizing Mercian Wealth's UK focus.

---

## Technical Specifications

### 1. Locked Prefix UI Treatment
- Unified flex container with `rounded-xl border border-border-brand/20 bg-background/60 focus-within:ring-2 focus-within:ring-accent-gold/30 focus-within:border-accent-gold/50`.
- Locked prefix badge on the left:
  - Text: `+44` (or `🇬🇧 +44`)
  - Styled with: `bg-accent-gold/10 text-accent-gold font-mono font-semibold text-xs sm:text-sm px-3.5 flex items-center justify-center border-r border-border-brand/20 select-none shrink-0 pointer-events-none`
- Phone input field on the right:
  - `border-0 bg-transparent rounded-r-xl outline-none text-sm text-foreground`
  - Accepts numbers, spaces, and dashes.
  - Strips leading zero automatically (e.g. `07851 055929` -> `7851 055929`).

### 2. Supporting Positioning Note
- Positioned directly under the phone input field.
- Wording: `"Mercian Wealth operates exclusively with United Kingdom based businesses."`
- Styling: `text-[11px] text-muted-foreground/80 leading-snug flex items-center gap-1.5 mt-1.5`

### 3. Validation Logic
- Strips non-digits from input string to count digits.
- Validates digit count is between 10 and 11 digits.
- Booking Form validation: Required field. Error if empty or digit count not between 10 and 11.
- Contact Form validation: Optional field if empty, but if entered, must be between 10 and 11 digits.
- Standard inline error message: `"Please enter a valid 10 to 11-digit UK phone number."`

---

## Proposed File Changes

1. `components/booking-flow.tsx`:
   - Update `validateIdentity` logic for phone validation (digit count check).
   - Update phone input rendering to include `+44` locked badge and supporting statement.
   - Format submitted phone state as `+44 ${digits}`.

2. `components/contact-form.tsx`:
   - Update `validateContactForm` logic for phone validation.
   - Update phone input rendering to include `+44` locked badge and supporting statement.
   - Format submitted phone payload as `+44 ${digits}`.

---

## Verification Plan

1. Execute `npm run build` or Next.js typecheck command to ensure zero TypeScript or syntax errors.
2. Verify build succeeds cleanly without warnings or errors.
