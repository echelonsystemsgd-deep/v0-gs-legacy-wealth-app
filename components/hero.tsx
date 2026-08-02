"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Sparkles, Zap, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SpeedGapVisualizer } from "@/components/speed-gap-visualizer"
import { SITE_COPY } from "@/lib/site-copy"
import { AnnouncementBar } from "@/components/announcement-bar"

export function Hero() {
  const data = SITE_COPY.homepage.hero

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-32 sm:pt-36 pb-20 overflow-hidden bg-[#090D16]">
      {/* Dynamic Background Radial Glows */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center 25%, rgba(56, 189, 248, 0.14) 0%, rgba(9, 13, 22, 0) 75%)"
        }}
      />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

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
          <span className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Q3 ONBOARDING: 2 REGIONAL SLOTS REMAINING</span>
          </span>

          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            [ {data.eyebrow} ]
          </span>
        </motion.div>

        {/* Headline with High-Contrast Gradient Accents */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-sans text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.12] text-balance mb-8 max-w-5xl tracking-tight"
        >
          Custom Web Design, Lead Capture & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">Automated CRM Systems</span> Built for Local Growth.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-base sm:text-lg md:text-xl text-slate-300 max-w-[720px] leading-relaxed mb-10 font-normal"
        >
          {data.subheadline}
        </motion.p>

        {/* Integration Badges Strip (Supabase, Stripe, WhatsApp, Google Reviews) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-10"
        >
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mr-1">Built with:</span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Zap size={13} /> Secure Cloud Database
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-400 flex items-center gap-1.5">
            <Zap size={13} /> Instant Deposit Gateways
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <MessageSquare size={13} /> WhatsApp Phone Alerts
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles size={13} /> Automated Workflows
          </span>
        </motion.div>

        {/* Stickman Character Speed Art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-48 h-48 sm:w-64 sm:h-64 my-4 pointer-events-none"
        >
          <Image
            src="/stickman_speed_automation.png"
            alt="Stickman Speed Automation"
            fill
            className="object-contain"
            priority
          />
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
              className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 hover:from-sky-300 hover:to-blue-500 transition-all duration-300 shadow-[0_0_30px_rgba(56,189,248,0.35)] border-0 rounded-xl"
            >
              <Link href="/#demo" className="flex items-center gap-2">
                <span>{data.primaryCtaText}</span>
                <ArrowRight size={18} />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-slate-700/80 text-white hover:bg-slate-800/80 rounded-xl"
            >
              <Link href="/pricing">{data.secondaryCtaText}</Link>
            </Button>
          </div>

          <Link href="/#demo" className="text-xs text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-4 mt-3 mb-6 font-medium">
            {data.unsureText}
          </Link>

          <div className="w-full max-w-md pt-4">
            <SpeedGapVisualizer />
          </div>
        </motion.div>

        {/* Trust Points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 pt-8 w-full max-w-3xl font-medium"
        >
          {Array.isArray(data.trustItems) && data.trustItems.map((item: string, idx: number) => (
            <span key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200">{item}</span>
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

