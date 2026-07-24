"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SpeedGapVisualizer } from "@/components/speed-gap-visualizer"
import { SITE_COPY } from "@/lib/site-copy"

export function Hero() {
  const data = SITE_COPY.homepage.hero

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-32 sm:pt-36 pb-20 overflow-hidden bg-[#07050B]">
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center 30%, rgba(109, 40, 217, 0.18) 0%, rgba(7, 5, 11, 0) 75%)"
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
        
        {/* Unified Centered Eyebrow & Scarcity Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-2.5 mb-8 text-center max-w-full px-2"
        >
          <span className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-[10px] sm:text-[11px] font-mono font-bold text-accent-gold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.15)] text-center">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>COHORT ALLOCATION: STRICTLY LIMITED TO 2 PARTNERSHIPS</span>
          </span>

          <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-accent-gold/80">
            [ {data.eyebrow} ]
          </span>
        </motion.div>

        {/* Headline with Gold Metallic Italic Accent */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.14] text-balance mb-8 max-w-5xl tracking-tight"
        >
          While You Read This, Your Competitors Are <span className="inline bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent font-extrabold italic">Acquiring Speed.</span> You Are Paying the <span className="inline text-red-400 font-extrabold">Manual Tax.</span>
        </motion.h1>

        {/* Subheadline with Elevated Weight & Readability */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-base sm:text-lg md:text-xl text-white/90 max-w-[680px] leading-relaxed mb-10 font-normal"
        >
          {data.subheadline}
        </motion.p>

        {/* Two CTA Buttons & Speed Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center gap-4 mb-14 w-full justify-center"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            {/* Primary Metallic Gold CTA Button */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-base font-bold bg-accent-gold text-black hover:bg-amber-300 transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)] border-0"
            >
              <Link href="/book" className="flex items-center gap-2">
                <span>{data.primaryCtaText}</span>
                <ArrowRight size={18} />
              </Link>
            </Button>

            {/* Secondary Outline Button */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/portfolio">{data.secondaryCtaText}</Link>
            </Button>
          </div>

          <Link href="/process" className="text-xs text-text-secondary hover:text-accent-gold transition-colors underline underline-offset-4 mt-3 mb-6">
            Unsure of your requirements? Review our 28-Day Execution Protocol →
          </Link>

          <div className="w-full max-w-md pt-4">
            <SpeedGapVisualizer />
          </div>
        </motion.div>

        {/* Trust Bar with Gold Nodes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-[11px] sm:text-sm text-text-secondary border-t border-white/10 pt-6 sm:pt-8 w-full max-w-3xl font-mono"
        >
          {Array.isArray(data.trustItems) && data.trustItems.map((item: string, idx: number) => (
            <span key={idx} className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-accent-gold text-[9px] sm:text-[10px]">✦</span>
              <span className="text-white/80">{item}</span>
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
