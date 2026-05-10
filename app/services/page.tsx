import { Navbar } from "@/components/navbar"
import { Services } from "@/components/services"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Services | GS Legacy Wealth",
  description: "Explore our premium AI-powered digital solutions designed to elevate your brand and automate growth.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Services />
      </div>
      <CTA />
      <Footer />
    </main>
  )
}
