import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { SocialProofStrip } from "@/components/social-proof-strip"
import { Bottleneck } from "@/components/bottleneck"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { Results } from "@/components/results"
import { Portfolio } from "@/components/portfolio"
import { WhyGSLegacy } from "@/components/why-gs-legacy"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { FAQHome } from "@/components/faq-home"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F0EDE6] overflow-x-hidden font-sans">
      <Navbar />
      <Hero />
      <SocialProofStrip />
      <Bottleneck />
      <Services limit={3} />
      <Process />
      <Results />
      <Portfolio limit={4} />
      <WhyGSLegacy />
      <Testimonials />
      <Pricing isHomepage={true} />
      <FAQHome />
      <CTA />
      <Footer />
    </main>
  )
}
