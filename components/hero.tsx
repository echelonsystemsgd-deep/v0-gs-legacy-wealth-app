"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SITE_COPY } from "@/lib/site-copy"
import { BrandLogo } from "@/components/brand-logo"

export function Hero() {
  const data = SITE_COPY.homepage.hero

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center pt-36 sm:pt-40 pb-20 overflow-hidden bg-[#020E28]">
      {/* Ambient Brand Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] opacity-15 pointer-events-none z-0 rounded-full overflow-hidden blur-[1px]">
        <BrandLogo variant="watermark" fill className="object-cover rounded-full" priority />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
        
        {/* Eyebrow & Bold Proof Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-2.5 mb-6 text-center max-w-full px-2"
        >
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#DAA640] bg-[#DAA640]/10 border border-[#DAA640]/25 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-center max-w-full">
            [ {data.eyebrow} ]
          </span>

          {/* Quantified Proof Metric Badge */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-sm font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 sm:px-3.5 py-1 rounded-full mt-1 max-w-full text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="leading-snug">{data.proofBadge}</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-sans text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.2] sm:leading-[1.15] text-balance mb-5 sm:mb-6 max-w-5xl tracking-tight px-1 break-words"
        >
          {data.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-sm sm:text-lg md:text-xl text-slate-300 max-w-[800px] leading-relaxed mb-6 sm:mb-8 font-normal px-2 break-words"
        >
          {data.subheadline}
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full justify-center min-w-0 max-w-full"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto px-5 sm:px-8 py-5 sm:py-7 text-xs sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] text-slate-950 hover:from-[#EBB755] hover:to-[#DAA640] transition-all duration-300 shadow-[0_0_30px_rgba(218,166,64,0.35)] border-0 rounded-xl"
          >
            <Link href="/book" className="flex items-center justify-center gap-2 sm:gap-3 text-center">
              <span>{data.primaryCtaText}</span>
              <ArrowRight size={18} className="shrink-0" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto px-5 sm:px-7 py-5 sm:py-7 text-xs sm:text-base font-semibold border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl text-center"
          >
            <Link
              href="/#demo"
              onClick={(e) => {
                if (typeof window !== "undefined" && window.location.pathname === "/") {
                  e.preventDefault()
                  const el = document.getElementById("demo")
                  if (el) {
                    const headerOffset = 90
                    const elementPosition = el.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                    window.scrollTo({ top: Math.max(0, offsetPosition), behavior: "smooth" })
                    window.history.pushState(null, "", "/#demo")
                  }
                }
              }}
              className="flex items-center justify-center gap-2 text-center"
            >
              <span>{data.secondaryCtaText}</span>
            </Link>
          </Button>
        </motion.div>

        {/* Live Product Visual: Interactive WhatsApp Order Flow Mockup (Replacing Mascot) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="w-full max-w-3xl mb-12 rounded-2xl border border-slate-800 bg-[#07153B]/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                💬
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">Mercian Lead & Deposit Dispatch</h2>
                <p className="text-[10px] text-emerald-400 font-mono">Live WhatsApp API Stream · Sub-1s Sync</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">Auto-Pilot Active</span>
          </div>

          <div className="space-y-3 font-sans text-xs sm:text-sm">
            {/* Customer Message */}
            <div className="flex justify-end">
              <div className="bg-emerald-950/80 border border-emerald-800/60 text-emerald-100 p-3 rounded-2xl rounded-tr-none max-w-[85%] sm:max-w-[70%]">
                <p className="font-medium">Hi! Can I order a 2-tier chocolate cake for Saturday afternoon?</p>
                <span className="text-[9px] text-emerald-400/70 block text-right mt-1 font-mono">11:42 PM</span>
              </div>
            </div>

            {/* Instant Automated Bot Reply */}
            <div className="flex justify-start">
              <div className="bg-slate-800/90 border border-slate-700 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[90%] sm:max-w-[80%] space-y-2">
                <p className="font-semibold text-white">🍰 Absolutely! We have Saturday slots open for pickup.</p>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/60 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>2-Tier Chocolate Fudge</span>
                    <span className="font-bold text-white">£65.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-mono text-[11px]">
                    <span>Required Deposit (50%):</span>
                    <span>£32.50</span>
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-amber-400 font-mono font-medium">
                  <span>⚡ Stripe Deposit Secured Automatically</span>
                  <span>11:42 PM</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Capability Trust Commitments */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-300 border-t border-[#D9A74A]/20 pt-8 w-full max-w-3xl font-medium"
        >
          {data.trustItems.map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D9A74A] shrink-0" />
              <span>{item}</span>
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
