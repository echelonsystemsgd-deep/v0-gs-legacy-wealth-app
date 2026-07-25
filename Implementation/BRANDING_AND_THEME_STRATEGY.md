# Mercian Wealth — Branding & Theme Strategy Implementation Plan

## SECTION 1: TOPIC ONE — Built by Mercian Wealth Footer Credit Strategy

### 1. Approved Decisions & Tier Breakdown

#### Setup Tiers (One-Time Capital Allocations)
- **Launch Catalyst (£1,850)**: Standard inclusion of the "Built by Mercian Wealth" footer credit line by default.
- **System Leverage (£3,850)**: Included by default with complimentary white-label removal available upon request during onboarding setup.
- **Enterprise Partner (£7,500)**: 100% white-labeled as standard with zero agency branding or attribution lines.

#### Retainer Tiers (Monthly Growth & SLA Support)
- **Launch Support (£395/mo)**: Standard inclusion of the footer credit line.
- **Leverage Growth (£750/mo)**: Optional removal at no extra charge upon client request.
- **Enterprise Alliance (£1,450/mo)**: Strictly white-labeled; footer credit excluded entirely as part of the strategic partnership.

#### Paid White-Label Add-on
- **White-Label License**: Approved at a **£350 one-time fee** for any client on lower or standard tiers (e.g., Launch Catalyst) requesting total white-labeling where removal is not already standard or complimentary.

### 2. Pricing Page Presentation Line Items

The setup pricing cards in `lib/site-copy.ts` (and database seed files) will feature transparent line items under their feature lists:

- **Launch Catalyst**:
  - `✓ Discreet "Built by Mercian Wealth" Digital Seal (White-Label upgrade available)`
- **System Leverage**:
  - `✓ Optional "Built by Mercian Wealth" Digital Seal or Complimentary White-Labeling`
- **Enterprise Partner**:
  - `✓ 100% White-Labeled & Proprietary Delivery (Zero Agency Branding)`

### 3. Legal & Contractual Note
- Contractual attribution clauses and Master Services Agreement (MSA) terms are handled separately outside the codebase. No contractual code or legal modal updates are required in the application.

---

## SECTION 2: TOPIC TWO — Strategic Theme Assessment & Option A Decision

### 1. Strategic 6-Point Evaluation

1. **Brand Identity Impact (Risks vs. Benefits)**:
   - **Risk**: Full light mode introduces a severe risk of brand dilution. Metallic gold accents (`#C5A059`, `#E2C792`) turn yellow/muddy on white backgrounds, and royal purple glows (`#6D28D9`) lose visual depth.
   - **Benefit**: Minor readability under direct sunlight.
   - **Conclusion**: Full light mode trades away elite dark luxury brand authority for non-essential utility.

2. **Target Audience & Conversion Purpose**:
   - **Audience**: Busy UK estate agents and property business owners on mobile devices.
   - **Behavior**: High-intent B2B decision-makers spend 45–90s scanning for ROI, social proof, and booking CTA. They do not use navbar theme toggles.
   - **Conclusion**: A theme toggle adds header clutter and zero conversion value.

3. **Implementation Approach (If Built)**:
   - **Recommendation**: Dark-native default for 100% of un-preference-detected sessions. Automatically match OS system settings via `prefers-color-scheme`. Keep navigation header completely clean; place any override control in footer or mobile drawer utilities.

4. **Proposed Light Mode Colour Palette**:
   - **Canvas**: `#F8F9FC` (Executive Alabaster Ice)
   - **Cards**: `#FFFFFF` with `#E2E8F0` border
   - **Primary Text**: `#0F172A` (Midnight Slate Charcoal)
   - **Purple**: `#4C1D95` (Deep Imperial Purple)
   - **Gold**: `#A17724` (Bronzed Champagne)

5. **Implementation Stack & Technical Risk**:
   - **Complexity**: High risk of visual regressions across 35+ components due to hardcoded dark hexes (`bg-[#0A0A0A]`, `bg-[#0D0716]`), Calendly dark iframe compositing filters (`filter: invert(1)`), and custom radial glass hover effects.

6. **Strategic Alternatives**:
   - **Approved Choice**: **Option A — High Contrast Soft Dark Improvement**.
   - Elevates body text contrast (`#C3C7D4` Sterling Silver) while preserving 100% of signature dark luxury brand tokens (`#0A0A0A`, `#0D0716`, `#6D28D9`, `#C5A059`).

### 2. Formal Decision & Execution Record
- **Full Light Mode & Navbar Toggle**: ❌ **REJECTED** (Zero conversion impact, high brand dilution risk).
- **Option A (High-Contrast Soft Dark Improvement)**: ✅ **CONFIRMED & APPLIED**.
  - All body text and secondary labels elevated to luminous sterling silver (`#C3C7D4`) for mobile daylight contrast.
  - Navbar kept clean and focused entirely on call bookings.
  - All luxury dark tokens preserved.

---

## SECTION 3: Summary of Codebase Modifications

1. **Pricing Copy & CMS Seed Updates**:
   - `lib/site-copy.ts`: Added approved white-label credit line items to setup tiers.
   - `supabase/migrations/20260629200000_pricing_cms_seed.sql`: Synced seed data for CMS pricing fallback.

2. **Option A Body Text Contrast Improvements**:
   - `app/globals.css`: Elevated `--color-text-secondary` token to luminous sterling silver `#C3C7D4`.
   - Component contrast enhancements across `components/pricing.tsx`, `components/hero.tsx`, `components/bottleneck.tsx`, and `components/footer.tsx`.

---

## SECTION 4: Implementation Verification & Status

- **Status**: ✅ **COMPLETE — 0 ERRORS**
- **TypeScript Check (`npx tsc --noEmit`)**: Passed (0 errors)
- **Files Updated**:
  - `Implementation/BRANDING_AND_THEME_STRATEGY.md`
  - `app/globals.css`
  - `lib/site-copy.ts`
  - `supabase/migrations/20260629200000_pricing_cms_seed.sql`
  - `components/pricing.tsx`
  - `components/hero.tsx`
  - `components/bottleneck.tsx`
  - `components/footer.tsx`

