import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DiagnosticsWizard } from "@/components/diagnostics-wizard"

export const metadata: Metadata = {
  title: "System Diagnostics Audit | Mercian Wealth",
  description: "Calculate your operational friction score and identify speed-to-lead latency leaks in 30 seconds.",
}

export default function DiagnosticsPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary font-sans flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Background glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 z-0"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(109, 40, 217, 0.15) 0%, rgba(10, 10, 10, 0) 70%)"
          }}
        />

        <div className="relative z-10 mb-12">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent-gold">
            [ AUTONOMIC DIAGNOSTIC ]
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            30-Second Operational <span className="bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent">Friction Audit</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-text-primary opacity-75 mt-3 max-w-xl mx-auto">
            Evaluate your current lead intake pipeline, response latency, and system automation score.
          </p>
        </div>

        <div className="relative z-10">
          <DiagnosticsWizard />
        </div>
      </section>

      <Footer />
    </main>
  )
}
