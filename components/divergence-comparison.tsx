"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle2, XCircle, Zap, ShieldAlert, Cpu } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function DivergenceComparison() {
  const data = SITE_COPY.homepage.divergenceComparison

  return (
    <section id="divergence" className="relative pt-4 pb-20 sm:py-24 lg:py-32 overflow-hidden bg-[#07050B]">
      {/* Ambient Lighting Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(109, 40, 217, 0.15) 0%, rgba(7, 5, 11, 0) 70%)"
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-[11px] font-mono font-semibold text-accent-gold uppercase tracking-[0.25em] mb-4"
        >
          <span>✦</span>
          <span>{data.eyebrow}</span>
          <span>✦</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance max-w-4xl mx-auto mb-6"
        >
          THE DIVERGENCE: <span className="text-red-400 line-through opacity-70 decoration-red-500/60 mr-2">Manual Drag</span> vs. <span className="bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent">The Automated Growth Engine</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-sans text-base sm:text-lg text-text-primary opacity-80 max-w-2xl mx-auto leading-relaxed mb-12 sm:mb-16"
        >
          {data.subheadline}
        </motion.p>

        {/* Two-Column Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 text-left items-stretch max-w-6xl mx-auto">
          
          {/* Path A: Conventional Manual Drag */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-between p-6 sm:p-10 rounded-2xl border border-red-500/20 bg-red-950/10 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  <ShieldAlert size={12} className="text-red-400" />
                  {data.pathConventional.badge}
                </span>
                <span className="font-mono text-xs text-red-400/60 font-semibold">[ LATENCY TAX ]</span>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white/90 mb-2 leading-tight">
                  {data.pathConventional.title}
                </h3>
                <p className="font-sans text-xs text-text-primary opacity-70 leading-relaxed">
                  {data.pathConventional.subtitle}
                </p>
              </div>

              <div className="h-[1px] w-full bg-red-500/15" />

              <ul className="space-y-4">
                {data.pathConventional.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-text-primary opacity-85 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-red-500/15 flex items-center justify-between text-xs font-mono text-red-400/80">
              <span>Cumulative Throughput Loss:</span>
              <span className="font-bold text-red-400">HIGH LATENCY COST</span>
            </div>
          </motion.div>

          {/* Path B: The Mercian Automated Growth Engine */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-between p-6 sm:p-10 rounded-2xl border-2 border-accent-gold/40 bg-gradient-to-b from-accent-purple/20 via-[#130B24] to-bg-secondary backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(109,40,217,0.2)] hover:border-accent-gold transition-all duration-300 group"
          >
            {/* Subtle corner watermark badge */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 font-serif text-6xl text-accent-gold">
              ✦
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent-gold/10 border border-accent-gold/30 font-mono text-[10px] font-bold text-accent-gold uppercase tracking-wider shadow-sm">
                  <Zap size={12} className="text-accent-gold animate-pulse" />
                  {data.pathMercian.badge}
                </span>
                <span className="font-mono text-xs text-accent-gold font-semibold tracking-wider">[ 0-LATENCY ]</span>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-2 leading-tight">
                  {data.pathMercian.title}
                  <span className="text-accent-gold text-lg shrink-0">✦</span>
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-primary opacity-90 leading-relaxed">
                  {data.pathMercian.subtitle}
                </p>
              </div>

              <div className="h-[1px] w-full bg-accent-gold/25" />

              <ul className="space-y-4">
                {data.pathMercian.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-accent-gold shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-white opacity-95 leading-relaxed font-medium">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Architectural Schema Visual Anchor */}
              <div className="mt-6 p-4 rounded-xl border border-accent-gold/20 bg-bg-primary/90 font-mono text-[11px] space-y-3 text-accent-gold/90">
                <div className="flex items-center justify-between text-[10px] text-text-secondary uppercase">
                  <span className="flex items-center gap-1"><Cpu size={12} /> System Schema</span>
                  <span className="text-emerald-400 font-bold">Active Engine</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 font-bold text-xs">
                  <span className="w-full sm:w-auto text-center px-3 py-1.5 bg-white/5 rounded border border-white/10 text-white">Lead Intent</span>
                  <span className="text-accent-gold shrink-0 sm:rotate-0 rotate-90 my-0.5 sm:my-0">▶</span>
                  <span className="w-full sm:w-auto text-center px-3 py-1.5 bg-accent-purple/30 rounded border border-accent-gold/40 text-accent-gold">Sub-60s AI Triage</span>
                  <span className="text-accent-gold shrink-0 sm:rotate-0 rotate-90 my-0.5 sm:my-0">▶</span>
                  <span className="w-full sm:w-auto text-center px-3 py-1.5 bg-emerald-500/10 rounded border border-emerald-500/30 text-emerald-400">CRM Dispatch</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-accent-gold/20 relative z-10">
              <Button
                asChild
                size="lg"
                className="w-full py-6 sm:py-7 font-bold text-sm md:text-base flex items-center justify-center shadow-lg hover:shadow-accent-gold/20 text-center tracking-normal px-2 sm:px-4"
              >
                <Link href="/book" className="flex items-center justify-center gap-2">
                  <span>{data.pathMercian.ctaText.replace(" →", "")}</span>
                  <ArrowRight size={18} className="shrink-0" />
                </Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
