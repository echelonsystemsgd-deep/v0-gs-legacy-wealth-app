import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LocalHero } from "@/components/local/local-hero"
import { LocalPainPoints } from "@/components/local/local-pain-points"
import { LocalDeliverables } from "@/components/local/local-deliverables"
import { FieldSalesDemo } from "@/components/local/field-sales-demo"
import { LocalPricing } from "@/components/local/local-pricing"
import { LocalLeadForm } from "@/components/local/local-lead-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Local Business Digital Storefront & Ordering Engines | Mercian Wealth",
  description: "Bespoke digital storefronts, custom cake & catering order builders, instant WhatsApp phone alerts, and automated Google reviews for bakeries and local businesses in Berkshire.",
}

export default function LocalPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-sans">
      <Navbar />
      <LocalHero />
      <LocalPainPoints />
      <LocalDeliverables />
      <FieldSalesDemo />
      <LocalPricing />
      <LocalLeadForm />
      <Footer />
    </main>
  )
}
