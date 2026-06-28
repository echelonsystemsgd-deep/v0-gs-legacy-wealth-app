import { Navbar } from "@/components/navbar"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Pricing & Investment",
  description: "Transparent capital requirements for high-yield digital assets. Choose Authority Suite, Operations Machine, or Revenue Engine alignment.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Investment"
        highlight="Tiers"
        subtitle="Transparent pricing models for elite digital solutions. Choose the level of impact that matches your ambition."
      />
      <Pricing />
      
      {/* SLA & Throughput Guarantees Section */}
      <section className="relative py-16 bg-bg-secondary border-y border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            System Performance SLA
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Uptime, Speed & Telemetry Guarantees
          </h3>
          <p className="font-sans text-sm text-text-primary opacity-80 max-w-2xl mx-auto leading-relaxed">
            Every GS Legacy custom deployment operates under a strict performance SLA. We guarantee a Mobile PageSpeed score of 90+ and immediate database replication failovers. Our engineering team maintains active telemetry dashboards to verify system throughput 24/7/365.
          </p>
        </div>
      </section>

      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
