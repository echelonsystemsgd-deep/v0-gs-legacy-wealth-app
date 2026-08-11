"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Sparkles, Zap, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SpeedGapVisualizer } from "@/components/speed-gap-visualizer"
import { SITE_COPY } from "@/lib/site-copy"
import { AnnouncementBar } from "@/components/announcement-bar"
import { BrandLogo } from "@/components/brand-logo"

export function Hero() {
  const data = SITE_COPY.homepage.hero

  const handleDemoClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const el = document.getElementById("demo")
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const el = document.getElementById("pricing")
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-32 sm:pt-36 pb-20 overflow-hidden bg-[#0A1128]">
      {/* Ambient Brand Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] opacity-10 pointer-events-none mix-blend-screen z-0">
        <BrandLogo variant="watermark" fill className="object-contain" priority />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
        {/* Top Announcement Bar */}
        <AnnouncementBar />
        
        {/* Scarcity Indicator & Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 mb-8 text-center max-w-full px-2"
        >
          <span className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D9A74A]/10 border border-[#D9A74A]/30 text-xs font-mono font-bold text-[#D9A74A] uppercase tracking-wider shadow-[0_0_20px_rgba(217,167,74,0.15)]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A74A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9A74A]" />
            </span>
            <span>Q3 ONBOARDING: 2 REGIONAL SLOTS REMAINING</span>
          </span>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D9A74A]">
            [ AI AUTOMATION FOR LOCAL BUSINESSES ]
          </span>
        </motion.div>

        {/* Headline with High-Contrast Gold/White Hierarchy */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-sans text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.12] text-balance mb-8 max-w-5xl tracking-tight"
        >
          Stop Losing Local Customers To Missed Calls & Manual Work. We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A74A] via-[#F5C042] to-[#E2E8F0]">Automated Digital Systems</span> That Capture Leads & Collect Deposits 24/7.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-base sm:text-lg md:text-xl text-slate-300 max-w-[760px] leading-relaxed mb-10 font-normal"
        >
          Professional high-converting web storefront, 3-tap order builder, instant WhatsApp phone alerts, and automated 5-star Google review collection. Deployed in under 7 days.
        </motion.p>

        {/* Integration Badges Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-10"
        >
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mr-1">Core Tech Stack:</span>
          <span className="px-3 py-1 rounded-lg bg-[#0D1635] border border-[#D9A74A]/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Zap size={13} className="text-[#D9A74A]" /> High-Speed Web Storefront
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0D1635] border border-[#D9A74A]/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Zap size={13} className="text-[#D9A74A]" /> Instant Deposit Gateways
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0D1635] border border-[#D9A74A]/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <MessageSquare size={13} className="text-[#D9A74A]" /> WhatsApp Phone Alerts
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0D1635] border border-[#D9A74A]/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#D9A74A]" /> 5-Star Review Automation
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center gap-4 mb-14 w-full justify-center"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-gradient-to-r from-[#D9A74A] via-[#E5A93C] to-[#B8860B] text-slate-950 hover:from-[#E5A93C] hover:to-[#D9A74A] transition-all duration-300 shadow-[0_0_30px_rgba(217,167,74,0.35)] border-0 rounded-xl"
            >
              <Link href="/book" className="flex items-center gap-2">
                <span>Claim Free 15-Min Audit</span>
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-[#D9A74A]/40 text-white hover:bg-[#D9A74A]/10 rounded-xl"
            >
              <Link href="/#demo" onClick={handleDemoClick}>Test 3-Tap Order Demo ↓</Link>
            </Button>
          </div>

          <div className="w-full max-w-md pt-4">
            <SpeedGapVisualizer />
          </div>
        </motion.div>

        {/* Capability Trust Commitments (Zero Fabrication) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-300 border-t border-[#D9A74A]/20 pt-8 w-full max-w-3xl font-medium"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D9A74A] shrink-0" />
            <span>Under 7-Day Complete System Deployment Guarantee</span>
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D9A74A] shrink-0" />
            <span>Zero Tech Overhaul Needed — We Set Up Everything</span>
          </span>
        </motion.div>

      </div>
    </section>
  )
}

