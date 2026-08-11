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
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center pt-32 sm:pt-36 pb-20 overflow-hidden bg-[#0A1128]">
      {/* Ambient Brand Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] opacity-25 sm:opacity-30 pointer-events-none mix-blend-screen z-0">
        <BrandLogo variant="watermark" fill className="object-contain" priority />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 mb-8 text-center max-w-full px-2"
        >
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#D9A74A]">
            [ {data.eyebrow} ]
          </span>
        </motion.div>

        {/* Approved Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-sans text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] text-balance mb-8 max-w-5xl tracking-tight"
        >
          {data.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-base sm:text-lg md:text-xl text-slate-300 max-w-[780px] leading-relaxed mb-10 font-normal"
        >
          {data.subheadline}
        </motion.p>

        {/* Single Action CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center gap-4 mb-12 w-full justify-center"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-gradient-to-r from-[#D9A74A] via-[#E5A93C] to-[#B8860B] text-slate-950 hover:from-[#E5A93C] hover:to-[#D9A74A] transition-all duration-300 shadow-[0_0_30px_rgba(217,167,74,0.35)] border-0 rounded-xl"
          >
            <Link href="/book" className="flex items-center gap-3">
              <span>{data.primaryCtaText}</span>
              <ArrowRight size={20} />
            </Link>
          </Button>
        </motion.div>

        {/* Capability Trust Commitments */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-300 border-t border-[#D9A74A]/20 pt-8 w-full max-w-3xl font-medium"
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
