import { Navbar } from "@/components/navbar"
import { Portfolio } from "@/components/portfolio"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Portfolio",
  description: "View our premium website designs and AI automation systems built for ambitious businesses.",
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Our Digital"
        highlight="Masterpieces"
        subtitle="A showcase of high-end digital assets crafted to command attention and drive exceptional business results."
      />
      <Portfolio />
      <CTA />
      <Footer />
    </main>
  )
}
