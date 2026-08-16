import { Navbar } from "@/components/navbar"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { getPricingTiers } from "@/lib/pricing"
import { SITE_COPY } from "@/lib/site-copy"
import { Suspense } from "react"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: SITE_COPY.metadata.pricing.title,
  description: SITE_COPY.metadata.pricing.description,
}

export default async function PricingPage() {
  const { setupTiers, retainerTiers, revenueShareTiers } = await getPricingTiers()
  const data = SITE_COPY.pricingPage

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title={data.headerTitle}
        highlight={data.headerHighlight}
        subtitle={data.headerSubtitle}
      />
      <Suspense fallback={<div className="py-20 text-center text-accent-gold font-mono text-sm">Loading Pricing Systems...</div>}>
        <Pricing setupTiers={setupTiers} retainerTiers={retainerTiers} revenueShareTiers={revenueShareTiers} />
      </Suspense>
      
      {/* SLA & Throughput Guarantees Section */}
      <section className="relative py-16 bg-bg-secondary border-y border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            {data.performanceSLATitle}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {data.performanceSLASubtitle}
          </h3>
          <p className="font-sans text-sm text-text-primary opacity-80 max-w-2xl mx-auto leading-relaxed">
            {data.performanceSLAParagraph}
          </p>
        </div>
      </section>

      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
