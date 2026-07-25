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

## SECTION 2: TOPIC TWO — Theme Assessment & Option A Decision

### 1. Decision & Strategic Rationale
- **Full Light Mode**: Rejected. A full white/bright background introduces a severe risk of brand dilution against Mercian Wealth's deep purple, obsidian glass, and metallic gold aesthetic. Furthermore, manual theme toggling provides minimal conversion value to busy UK estate agency decision-makers on mobile devices.
- **Approved Theme Action**: **Option A — High Contrast Soft Dark Improvement**.
  - Elevate contrast on muted body text and secondary labels across the public site for improved mobile readability under bright ambient light conditions (e.g. daylight viewing).
  - Preserve all signature dark luxury tokens: deep purple canvas (`#0B051D`), dark glass cards (`#12092E`), and metallic gold highlights (`#E5C158`).
  - Keep the header and navigation completely clean with zero theme toggle clutter.

---

## SECTION 3: Summary of Proposed Codebase Modifications

1. **Pricing Copy Updates**:
   - `lib/site-copy.ts`: Add the approved white-label credit line items to the setup tiers.
   - `supabase/migrations/20260629200000_pricing_cms_seed.sql`: Sync seed data for CMS pricing fallback.

2. **Option A Body Text Contrast Improvements**:
   - `app/globals.css`: Elevated `--color-text-secondary` token from `#A3A8B4` to luminous sterling silver `#C3C7D4`.
   - Component contrast enhancements across `components/pricing.tsx`, `components/hero.tsx`, `components/bottleneck.tsx`, and `components/footer.tsx`.

---

## SECTION 4: Implementation Verification & Status

- **Status**: ✅ **COMPLETE**
- **TypeScript Check (`npx tsc --noEmit`)**: 0 errors
- **Files Modified**:
  - `Implementation/BRANDING_AND_THEME_STRATEGY.md`
  - `lib/site-copy.ts`
  - `supabase/migrations/20260629200000_pricing_cms_seed.sql`
  - `app/globals.css`
  - `components/pricing.tsx`
  - `components/hero.tsx`
  - `components/bottleneck.tsx`
  - `components/footer.tsx`

