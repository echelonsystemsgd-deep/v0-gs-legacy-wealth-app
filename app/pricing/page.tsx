import { Navbar } from "@/components/navbar"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Pricing & Investment",
  description: "Transparent pricing for premium web design and AI automation systems. Find the right package for your growth.",
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
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
