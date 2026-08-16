/**
 * lib/pricing.ts
 * Server-side pricing data fetcher for the public pricing page and homepage.
 *
 * Data lives in the `website_content` Supabase table under three section keys:
 *   - pricing_setup_tiers      → one-time setup fee tiers
 *   - pricing_retainer_tiers   → monthly retainer tiers
 *   - pricing_revshare_tiers   → % revenue share tiers
 *
 * Fallback guarantee: if the DB fetch fails for any reason, the hardcoded
 * arrays below are returned silently. The public page never breaks.
 *
 * Caching: uses Next.js fetch cache with `revalidate: 60` and the `pricing`
 * tag so that:
 *   - Visitors are always served from a fast static cache.
 *   - The cache is refreshed in the background every 60 seconds.
 *   - The admin can trigger an immediate cache bust via /api/revalidate-pricing.
 */

export type PricingTier = {
  id: string
  name: string
  price: string
  interval: string
  milestoneBreakdown?: string
  description: string
  features: string[]
  cta: string
  featured: boolean
  tag?: string
}

import { SITE_COPY } from "./site-copy"

const FALLBACK_SETUP_TIERS: PricingTier[] = SITE_COPY.pricingPage.oneTimeTiers.map((t, idx) => ({
  id: t.name?.toLowerCase().replace(/\s+/g, '-') || `tier-${idx}`,
  ...t
}))

const FALLBACK_RETAINER_TIERS: PricingTier[] = SITE_COPY.pricingPage.monthlyTiers.map((t, idx) => ({
  id: t.name?.toLowerCase().replace(/\s+/g, '-') || `tier-${idx}`,
  ...t
}))

const FALLBACK_REVSHARE_TIERS: PricingTier[] = SITE_COPY.pricingPage.revenueShareTiers.map((t, idx) => ({
  id: t.name?.toLowerCase().replace(/\s+/g, '-') || `tier-${idx}`,
  ...t
}))

// ── Fetcher ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function fetchSection(sectionKey: string): Promise<PricingTier[] | null> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/website_content?section_key=eq.${sectionKey}&select=content&limit=1`
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: {
        revalidate: 60,
        tags: ['pricing'],
      },
    })

    if (!res.ok) return null

    const rows: Array<{ content: PricingTier[] }> = await res.json()
    if (!rows || rows.length === 0) return null

    const tiers = rows[0].content
    if (!Array.isArray(tiers) || tiers.length === 0) return null

    return tiers
  } catch {
    return null
  }
}

/**
 * Fetches all three pricing models from Supabase.
 * Falls back to hardcoded site-copy arrays if the DB is unreachable or stale.
 * Safe to call from any server component — cached + tagged.
 */
export async function getPricingTiers(): Promise<{
  setupTiers: PricingTier[]
  retainerTiers: PricingTier[]
  revenueShareTiers: PricingTier[]
}> {
  const [setup, retainer, revshare] = await Promise.all([
    fetchSection('pricing_setup_tiers'),
    fetchSection('pricing_retainer_tiers'),
    fetchSection('pricing_revshare_tiers'),
  ])

  // Validate DB content against current brand tier names; fall back to site-copy if stale
  const isSetupValid = setup && setup.length > 0 && setup[0]?.name === FALLBACK_SETUP_TIERS[0]?.name
  const isRetainerValid = retainer && retainer.length > 0 && retainer[0]?.name === FALLBACK_RETAINER_TIERS[0]?.name
  const isRevshareValid = revshare && revshare.length > 0 && revshare[0]?.name === FALLBACK_REVSHARE_TIERS[0]?.name

  return {
    setupTiers: isSetupValid ? setup! : FALLBACK_SETUP_TIERS,
    retainerTiers: isRetainerValid ? retainer! : FALLBACK_RETAINER_TIERS,
    revenueShareTiers: isRevshareValid ? revshare! : FALLBACK_REVSHARE_TIERS,
  }
}
