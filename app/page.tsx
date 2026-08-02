import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Bottleneck } from "@/components/bottleneck"
import { DivergenceComparison } from "@/components/divergence-comparison"
import { WhyMercianWealth } from "@/components/why-mercian-wealth"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { SectionDivider } from "@/components/section-divider"
import { LiveTelemetryTicker } from "@/components/live-telemetry-ticker"
import { ChapterTracker } from "@/components/chapter-tracker"
import { SystemBlueprint } from "@/components/system-blueprint"
import { LatencyCalculator } from "@/components/latency-calculator"
import { FieldSalesDemo } from "@/components/local/field-sales-demo"
import { getPricingTiers } from "@/lib/pricing"
import { Suspense } from "react"

export const revalidate = 60

export default async function Home() {
  const { setupTiers, retainerTiers } = await getPricingTiers()
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://mercianwealth.com/#organization",
                "name": "Mercian Wealth",
                "url": "https://mercianwealth.com",
                "logo": {
                  "@type": "ImageObject",
                  "@id": "https://mercianwealth.com/#logo",
                  "url": "https://mercianwealth.com/MercianWealthlogo.jpeg",
                  "caption": "Mercian Wealth"
                },
                "image": {
                  "@id": "https://mercianwealth.com/#logo"
                },
                "sameAs": [
                  "https://instagram.com/mercianwealth",
                  "https://www.linkedin.com/in/gs-legacy-wealth"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://mercianwealth.com/#website",
                "url": "https://mercianwealth.com",
                "name": "Mercian Wealth",
                "description": "Custom digital systems and automated AI architectures engineered to secure category dominance for market leaders.",
                "publisher": {
                  "@id": "https://mercianwealth.com/#organization"
                }
              },
              {
                "@type": "WebPage",
                "@id": "https://mercianwealth.com/#webpage",
                "url": "https://mercianwealth.com",
                "name": "Mercian Wealth | AI Automations & Fast Storefronts",
                "isPartOf": {
                  "@id": "https://mercianwealth.com/#website"
                },
                "about": {
                  "@id": "https://mercianwealth.com/#organization"
                },
                "description": "Custom digital storefronts and automated AI engines for bakeries, food artisans, local services, and growing operators across Berkshire & the UK."
              }
            ]
          })
        }}
      />
      <Navbar />
      <ChapterTracker />
      <Hero />
      <SectionDivider id="chapter-divider-I" chapter="I" title="Operational Friction" />
      <Bottleneck />
      <LatencyCalculator />
      <SectionDivider id="chapter-divider-II" chapter="II" title="The Structural Divergence" />
      <DivergenceComparison />
      <SectionDivider id="chapter-divider-III" chapter="III" title="Interactive System Demo" />
      <div id="demo" className="scroll-mt-28">
        <FieldSalesDemo />
      </div>
      <SectionDivider id="chapter-divider-IV" chapter="IV" title="System Architecture" />
      <WhyMercianWealth />
      <SystemBlueprint />
      <SectionDivider id="chapter-divider-V" chapter="V" title="Pricing & Packages" />
      <Suspense fallback={<div className="py-20 text-center text-accent-gold font-mono text-sm">Loading Systems Pricing...</div>}>
        <Pricing isHomepage={true} setupTiers={setupTiers} retainerTiers={retainerTiers} />
      </Suspense>
      <SectionDivider id="chapter-divider-VI" chapter="VI" title="Initiate Integration" />
      <CTA />
      <Footer />
    </main>
  )
}
