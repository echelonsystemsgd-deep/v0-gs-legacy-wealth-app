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
import { getPricingTiers } from "@/lib/pricing"

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
                  "https://www.linkedin.com/company/mercian-wealth"
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
                "name": "Mercian Wealth | Luxury AI-Powered Websites",
                "isPartOf": {
                  "@id": "https://mercianwealth.com/#website"
                },
                "about": {
                  "@id": "https://mercianwealth.com/#organization"
                },
                "description": "Custom digital systems and automated AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only."
              }
            ]
          })
        }}
      />
      <Navbar />
      <ChapterTracker />
      <Hero />
      <SectionDivider chapter="I" title="Operational Friction" />
      <Bottleneck />
      <LatencyCalculator />
      <SectionDivider chapter="II" title="The Structural Divergence" />
      <DivergenceComparison />
      <SectionDivider chapter="III" title="System Architecture" />
      <WhyMercianWealth />
      <SystemBlueprint />
      <SectionDivider chapter="IV" title="Cohort Telemetry & Allocation" />
      <Testimonials />
      <Pricing isHomepage={true} setupTiers={setupTiers} retainerTiers={retainerTiers} />
      <SectionDivider chapter="V" title="Initiate Integration" />
      <CTA />
      <Footer />
    </main>
  )
}
