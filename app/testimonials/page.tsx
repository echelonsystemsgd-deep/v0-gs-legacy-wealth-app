import { Navbar } from "@/components/navbar"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Client Testimonials",
  description: "Real results from ambitious businesses we have partnered with. Hear directly from our elite clientele about the impact of our premium digital solutions.",
}

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title="What Our Clients"
        highlight="Say"
        subtitle="Real results from ambitious businesses we have partnered with. Every word is from a founder who trusted us to build their legacy."
      />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
