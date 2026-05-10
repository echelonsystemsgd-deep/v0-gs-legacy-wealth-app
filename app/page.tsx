import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Testimonials } from "@/components/testimonials"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { Portfolio } from "@/components/portfolio"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Testimonials />
      <Services />
      <Process />
      <Portfolio />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
