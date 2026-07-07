import { Navbar } from "@/components/navbar"
import { Services } from "@/components/services"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

import { SITE_COPY } from "@/lib/site-copy"

export const metadata = {
  title: SITE_COPY.metadata.services.title,
  description: SITE_COPY.metadata.services.description,
}

export default function ServicesPage() {
  const data = SITE_COPY.servicesPage
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title={data.headerTitle}
        highlight={data.headerHighlight}
        subtitle={data.headerSubtitle}
      />
      <Services />
      <CTA />
      <Footer />
    </main>
  )
}
