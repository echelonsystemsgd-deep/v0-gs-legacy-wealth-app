import { Navbar } from "@/components/navbar"
import { Portfolio } from "@/components/portfolio"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Portfolio | GS Legacy Wealth",
  description: "View our premium website designs and AI automation systems built for ambitious businesses.",
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Portfolio />
      </div>
      <CTA />
      <Footer />
    </main>
  )
}
