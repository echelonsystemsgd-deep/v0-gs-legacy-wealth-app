import { Navbar } from "@/components/navbar"
import { Portfolio } from "@/components/portfolio"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

import { SITE_COPY } from "@/lib/site-copy"

export const metadata = {
  title: SITE_COPY.metadata.portfolio.title,
  description: SITE_COPY.metadata.portfolio.description,
}

export default function PortfolioPage() {
  const data = SITE_COPY.portfolioPage
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title={data.headerTitle}
        highlight={data.headerHighlight}
        subtitle={data.headerSubtitle}
      />
      <Portfolio />
      <CTA />
      <Footer />
    </main>
  )
}
