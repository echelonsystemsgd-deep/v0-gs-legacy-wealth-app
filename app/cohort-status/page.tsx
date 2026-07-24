import { Navbar } from "@/components/navbar"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import type { Metadata } from "next"

import { SITE_COPY } from "@/lib/site-copy"

export const metadata: Metadata = {
  title: SITE_COPY.metadata.testimonials.title,
  description: SITE_COPY.metadata.testimonials.description,
}

export default function CohortStatusPage() {
  const data = SITE_COPY.testimonialsPage
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader
        title={data.headerTitle}
        highlight={data.headerHighlight}
        subtitle={data.headerSubtitle}
      />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
