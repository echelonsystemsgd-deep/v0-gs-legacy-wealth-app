import { Navbar } from "@/components/navbar"
import { Process } from "@/components/process"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Our Process | GS Legacy Wealth",
  description: "Discover our proven 4-step process for delivering exceptional digital solutions and maximizing ROI.",
}

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <Process />
      </div>
      <CTA />
      <Footer />
    </main>
  )
}
