import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FieldSalesDemo } from "@/components/local/field-sales-demo"
import { BrandLogo } from "@/components/brand-logo"

export const metadata = {
  title: "Local Business AI Automation Demo | Mercian Wealth",
  description: "Interactive 3-tap order engine, instant WhatsApp alerts, and Google review automation live demo for local businesses.",
}

export default function LocalPage() {
  return (
    <main className="min-h-screen bg-[#0A1128] text-white font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Background Watermark */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none mix-blend-screen z-0">
        <BrandLogo variant="watermark" fill className="object-contain" priority />
      </div>

      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A74A]/10 border border-[#D9A74A]/30 text-[#D9A74A] text-xs font-mono font-bold uppercase tracking-wider mb-4">
          [ LOCAL FIELD SALES DEMO ]
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Test The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A74A] via-[#F5C042] to-[#E2E8F0]">Sub-60s Local Order Engine</span> Live.
        </h1>
        <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-10">
          See exactly how a customer places a custom deposit or service request in 3 taps while you receive an instant phone notification.
        </p>

        <FieldSalesDemo />
      </section>

      <Footer />
    </main>
  )
}
