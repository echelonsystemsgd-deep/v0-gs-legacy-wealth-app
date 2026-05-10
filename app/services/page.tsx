import { Navbar } from "@/components/navbar"
import { Services } from "@/components/services"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Services | GS Legacy Wealth",
  description: "Explore our premium AI-powered digital solutions designed to elevate your brand and automate growth.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Our Premium"
        highlight="Solutions"
        subtitle="Strategic AI-powered services engineered to create authority, automate growth, and generate elite revenue."
      />
      <Services />
      <CTA />
      <Footer />
    </main>
  )
}
