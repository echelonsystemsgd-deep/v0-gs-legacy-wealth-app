import { Navbar } from "@/components/navbar"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Pricing & Investment | GS Legacy Wealth",
  description: "Transparent pricing for premium web design and AI automation systems. Find the right package for your growth.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Pricing />
        <FAQ />
      </div>
      <CTA />
      <Footer />
    </main>
  )
}
