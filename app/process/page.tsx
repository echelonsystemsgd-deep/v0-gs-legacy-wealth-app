import { Navbar } from "@/components/navbar"
import { Process } from "@/components/process"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Our Process",
  description: "Forensic audits, bespoke authority platforms, and automated lead conduits. View our clinical execution protocol.",
}

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="The Path to"
        highlight="Excellence"
        subtitle="Our refined 4-step methodology designed to take your brand from vision to high-impact market dominance."
      />
      <Process />
      <CTA />
      <Footer />
    </main>
  )
}
