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
import { InteractivePhoneDemo } from "@/components/interactive-phone-demo"
import { InteractiveRoiCalculator } from "@/components/interactive-roi-calculator"
import { StickmanWorkflow } from "@/components/stickman-workflow"
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
                "@id": "https://localengine.ai/#organization",
                "name": "LocalEngine AI",
                "url": "https://localengine.ai",
                "logo": {
                  "@type": "ImageObject",
                  "@id": "https://localengine.ai/#logo",
                  "url": "https://localengine.ai/logo.png",
                  "caption": "LocalEngine AI"
                },
                "image": {
                  "@id": "https://localengine.ai/#logo"
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://localengine.ai/#website",
                "url": "https://localengine.ai",
                "name": "LocalEngine AI",
                "description": "Custom digital storefronts and automated AI engines for bakeries, food artisans, and local services.",
                "publisher": {
                  "@id": "https://localengine.ai/#organization"
                }
              },
              {
                "@type": "WebPage",
                "@id": "https://localengine.ai/#webpage",
                "url": "https://localengine.ai",
                "name": "LocalEngine AI | Automation & Mobile Storefronts for Bakeries & Local Services",
                "isPartOf": {
                  "@id": "https://localengine.ai/#website"
                },
                "about": {
                  "@id": "https://localengine.ai/#organization"
                },
                "description": "Custom digital storefronts, 3-tap order builders, WhatsApp phone alerts, and automated 5-star Google review engines for bakeries and local services."
              }
            ]
          })
        }}
      />
      <Navbar />
      <ChapterTracker />
      <Hero />
      
      <SectionDivider id="chapter-divider-I" chapter="I" title="Operational Bottlenecks" />
      <Bottleneck />
      
      <SectionDivider id="chapter-divider-II" chapter="II" title="How Automation Works" />
      <StickmanWorkflow />

      <SectionDivider id="chapter-divider-III" chapter="III" title="Interactive 3-Tap Phone Demo" />
      <div id="demo" className="scroll-mt-28">
        <InteractivePhoneDemo />
      </div>

      <SectionDivider id="chapter-divider-III" chapter="III" title="Order Engine vs Manual Drag" />
      <DivergenceComparison />

      <SectionDivider id="chapter-divider-IV" chapter="IV" title="Calculate Saved Hours & Revenue" />
      <InteractiveRoiCalculator />

      <SectionDivider id="chapter-divider-V" chapter="V" title="Built for Bakeries & Local Services" />
      <WhyMercianWealth />
      <SystemBlueprint />

      <SectionDivider id="chapter-divider-VI" chapter="VI" title="Transparent Pricing & Packages" />
      <Suspense fallback={<div className="py-20 text-center text-sky-400 font-mono text-sm">Loading Solutions & Pricing...</div>}>
        <Pricing isHomepage={true} setupTiers={setupTiers} retainerTiers={retainerTiers} />
      </Suspense>

      <SectionDivider id="chapter-divider-VII" chapter="VII" title="Book 15-Min Quick Audit" />
      <CTA />
      <Footer />
    </main>
  )
}
