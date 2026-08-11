import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Zap, ArrowRight, CheckCircle2, Cpu, Building2, Sparkles } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"

export const metadata = {
  title: "Enterprise AI Workflow Engineering | Mercian Wealth",
  description: "Custom AI automation systems, multi-location CRM integrations, and bespoke digital infrastructure for enterprise & multi-fleet operators.",
}

const enterpriseFeatures = [
  "Custom Next.js & React 19 Digital Architecture",
  "Multi-Location & Fleet CRM Synchronization",
  "Custom AI Lead Triage & Autonomous Dispatch",
  "Dedicated SLA & 24/7 Priority Infrastructure Support",
  "100% White-Labeled & Proprietary Ownership",
  "Enterprise Supabase Database Isolation & RLS Security",
]

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-[#0A1128] text-white font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Background Watermark */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none mix-blend-screen z-0">
        <BrandLogo variant="watermark" fill className="object-contain" priority />
      </div>

      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A74A]/10 border border-[#D9A74A]/30 text-[#D9A74A] text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <Building2 size={14} /> Enterprise & Multi-Location Architecture
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Bespoke AI Workflows & Systems Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A74A] via-[#F5C042] to-[#E2E8F0]">Enterprise Scale.</span>
        </h1>
        
        <p className="font-sans text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
          For multi-location operators, trade fleets, and high-turnover businesses requiring custom AI integrations, dedicated database isolation, and high-throughput automated workflows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
          <div className="p-8 rounded-3xl bg-[#0D1635] border border-[#D9A74A]/30 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="text-xs font-mono font-bold text-[#D9A74A] uppercase tracking-widest mb-2">[ ADVANCED ENGINE ]</div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">Custom Enterprise Systems</h3>
            <div className="text-3xl font-extrabold text-[#D9A74A] font-mono mb-4">£1,850 – £7,500+</div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Complete custom software build, multi-branch lead distribution, custom LLM integration, and dedicated cloud database setup.
            </p>
            <Button asChild size="lg" className="w-full py-6 font-bold bg-gradient-to-r from-[#D9A74A] via-[#E5A93C] to-[#B8860B] text-slate-950">
              <Link href="/book?tier=enterprise">Request Enterprise Consultation →</Link>
            </Button>
          </div>

          <div className="p-8 rounded-3xl bg-[#0D1635]/80 border border-slate-700/60 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">[ INCLUDED CAPABILITIES ]</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-6">Enterprise Infrastructure Specs</h3>
              <ul className="space-y-3 mb-8">
                {enterpriseFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 size={18} className="text-[#D9A74A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <ShieldCheck size={16} className="text-[#D9A74A]" />
              <span>SLA Guaranteed Delivery & Executive Direct Access</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
