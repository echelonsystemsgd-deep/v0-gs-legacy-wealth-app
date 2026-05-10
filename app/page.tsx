import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Testimonials } from "@/components/testimonials"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { Portfolio } from "@/components/portfolio"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services limit={3} />
      <Portfolio limit={2} />
      <Process limit={3} />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
