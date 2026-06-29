/**
 * lib/pricing.ts
 * Server-side pricing data fetcher for the public pricing page and homepage.
 *
 * Data lives in the `website_content` Supabase table under two section keys:
 *   - pricing_setup_tiers    → one-time setup fee tiers
 *   - pricing_retainer_tiers → monthly retainer tiers
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

// ── Hardcoded fallback arrays (exact values from the original pricing.tsx) ────
// These are used when the Supabase fetch fails. Never remove these.

const FALLBACK_SETUP_TIERS: PricingTier[] = [
  {
    id: 'authority-suite',
    name: 'Authority Suite',
    price: '2,750',
    interval: '£687.50 deposit to initiate',
    milestoneBreakdown: '4 milestone stages of 25% (£687.50) linked to build progress',
    description:
      'A luxury digital front-office that projects absolute authority. Engineered without templates to secure and convert elite clients.',
    features: [
      'Bespoke Next.js Authority Platform (5 Pages)',
      'Calendly Scheduling Integration',
      'Stripe Payment Gateway Integration',
      'Core SEO Blueprint & Schema Setup',
      'Supercharged Speed Profile (95+ Mobile)',
      '30 Days Dedicated Post-Launch Support',
    ],
    cta: 'Request Alignment',
    featured: false,
    tag: 'Authority Suite',
  },
  {
    id: 'operations-machine',
    name: 'Operations Machine',
    price: '5,500',
    interval: '£1,375 deposit to initiate',
    milestoneBreakdown: '4 milestone stages of 25% (£1,375) linked to build progress',
    description:
      'Your complete digital systems layer. We replace manual administrative overhead with custom software leverage so your business runs on autopilot.',
    features: [
      'Everything in Authority Suite (up to 10 Pages)',
      'Custom Backend Admin Dashboard',
      'Custom Secure Client Portal Integration',
      'Autonomic Lead & CRM Automations',
      'Automated Stripe Billing & Invoices',
      '90 Days Dedicated Post-Launch Support',
    ],
    cta: 'Initiate Audit',
    featured: true,
    tag: 'Operations Machine',
  },
  {
    id: 'revenue-engine',
    name: 'Revenue Engine',
    price: '9,800',
    interval: '£2,450 deposit to initiate',
    milestoneBreakdown: '4 milestone stages of 25% (£2,450) linked to build progress',
    description:
      'The ultimate growth and automation infrastructure. We build a high-performance brand platform, launch your automated cold email prospecting system, and engineer your AI lead triage.',
    features: [
      'Everything in Operations Machine (Unlimited Pages)',
      'Bespoke Cold Email Outreach System',
      'Custom-Trained AI Agent Concierge',
      'Full Brand Identity Suite (Logos, Guidelines)',
      'Priority VIP Developer Slack Support',
      'Weekly Growth & Scaling Roadmaps',
    ],
    cta: 'Initiate Audit',
    featured: false,
    tag: 'Revenue Engine',
  },
]

const FALLBACK_RETAINER_TIERS: PricingTier[] = [
  {
    id: 'authority-suite',
    name: 'Pilot Support',
    price: '499',
    interval: 'billed monthly',
    milestoneBreakdown: '',
    description:
      'Continuous hosting, top-tier performance audits, and priority developer hours.',
    features: [
      'Premium Dedicated Ultra-Fast CDN Hosting',
      'Weekly Security & Speed Audits',
      '3 Hours Design & Copywriting Updates/mo',
      'Monthly Traffic & SEO Analytics Report',
      '24/7 Critical System Monitoring',
      'Same-Day Urgent Edits Turnaround',
    ],
    cta: 'Request Alignment',
    featured: false,
    tag: 'Authority Suite',
  },
  {
    id: 'operations-machine',
    name: 'Co-Pilot Growth',
    price: '1,290',
    interval: 'billed monthly',
    milestoneBreakdown: '',
    description:
      'Custom scaling campaigns, search engine dominance, and continuous autonomic AI system tuning.',
    features: [
      'Everything in Pilot Support',
      'Continuous AI Agent Re-training & Updates',
      '1 Custom High-Converting Landing Page/mo',
      'Advanced SEO Content & Competitor Strategy',
      'Weekly Lead Funnel Optimisation',
      '10 Dedicated Developer/Designer Hours/mo',
    ],
    cta: 'Initiate Audit',
    featured: true,
    tag: 'Operations Machine',
  },
  {
    id: 'revenue-engine',
    name: 'Enterprise Autonomic Partner',
    price: '2,850',
    interval: 'billed monthly',
    milestoneBreakdown: '',
    description:
      'Your complete external fractional Chief Technology & Marketing Team.',
    features: [
      'Everything in Co-Pilot Growth',
      'Weekly High-Level Growth Consulting Call',
      'Unlimited Minor System & UI Adjustments',
      'New AI Workflow Builds & Automations',
      'Bespoke Cold Email/Marketing System setups',
      'Direct Slack Hotline to Core Founders',
    ],
    cta: 'Initiate Audit',
    featured: false,
    tag: 'Revenue Engine',
  },
]

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
 * Fetches both setup and retainer pricing tiers from Supabase.
 * Falls back to hardcoded arrays if the DB is unreachable.
 * Safe to call from any server component — cached + tagged.
 */
export async function getPricingTiers(): Promise<{
  setupTiers: PricingTier[]
  retainerTiers: PricingTier[]
}> {
  const [setup, retainer] = await Promise.all([
    fetchSection('pricing_setup_tiers'),
    fetchSection('pricing_retainer_tiers'),
  ])

  return {
    setupTiers: setup ?? FALLBACK_SETUP_TIERS,
    retainerTiers: retainer ?? FALLBACK_RETAINER_TIERS,
  }
}
