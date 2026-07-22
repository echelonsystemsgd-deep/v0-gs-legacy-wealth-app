import { Navbar } from "@/components/navbar"
import { Process } from "@/components/process"
import { FAQHome } from "@/components/faq-home"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

import { SITE_COPY } from "@/lib/site-copy"

export const metadata = {
  title: SITE_COPY.metadata.process.title,
  description: SITE_COPY.metadata.process.description,
}

export default function ProcessPage() {
  const data = SITE_COPY.processPage
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title={data.headerTitle}
        highlight={data.headerHighlight}
        subtitle={data.headerSubtitle}
      />
      <Process />
      <FAQHome />
      <CTA />
      <Footer />
    </main>
  )
}
