# Unified Pricing Manager — Admin Dashboard
**Status:** In Progress  
**Date:** 2026-08-16

## Goal
Replace the broken split-tab pricing CMS with a dedicated, mobile-optimised /admin/pricing page that mirrors the frontend pricing layout — all three billing models visible at once, fully editable, with live sync to Supabase.

## Problems Being Solved
- Reset Section loses state on tab switch (fetchSection fires on every tab change)
- Revenue Share tiers missing from admin entirely
- Duplicate React key 'one-time-setup' (t.tag shared across all tiers)
- Stale DB data (Authority Suite £3,500)
- Admin UX disconnected from frontend layout

## Architecture

### New Route: app/(admin)/admin/pricing/page.tsx
### Storage: website_content table — 3 rows:
  - pricing_setup_tiers     (One-Time Setup)
  - pricing_retainer_tiers  (Monthly Retainer)
  - pricing_revshare_tiers  (% Revenue Share) — NEW

### Files Changed:
  - app/(admin)/admin/pricing/page.tsx    [NEW]  Unified pricing manager page
  - components/admin/sidebar.tsx          [MODIFY]  Add Pricing link under Marketing Manager
  - lib/pricing.ts                        [MODIFY]  Add revenueShareTiers to getPricingTiers()
  - app/pricing/page.tsx                  [MODIFY]  Pass revenueShareTiers to Pricing component
  - app/(admin)/admin/content/page.tsx    [MODIFY]  Remove old Setup/Retainer tabs

## Mobile Design
  - Billing model tabs: horizontal scrollable pills
  - Tier cards: full-width stacked accordion on mobile, 3-col on desktop
  - Save All button: sticky bottom bar on mobile
  - Feature list: tap-to-edit, swipe-to-delete on mobile
