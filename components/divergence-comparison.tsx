"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, XCircle, ShieldAlert } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function DivergenceComparison() {
  const data = SITE_COPY.homepage.divergenceComparison

  return (
    <section id="divergence" className="relative pt-4 sm:pt-12 lg:pt-20 pb-12 sm:pb-20 lg:pb-24 overflow-hidden bg-[#090D16]">
      {/* Ambient Lighting Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.12) 0%, rgba(9, 13, 22, 0) 70%)"
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
          {data.headline}
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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-left items-stretch max-w-6xl mx-auto">
          
          {/* Path A: Conventional Manual Drag */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-between p-5 sm:p-8 lg:p-10 rounded-2xl border border-red-500/20 bg-red-950/10 backdrop-blur-sm relative overflow-hidden min-w-0 max-w-full"
          >
            <div className="space-y-6 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  <ShieldAlert size={12} className="text-red-400 shrink-0" />
                  {data.pathConventional.badge}
                </span>
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
          </motion.div>

          {/* Path B: The Mercian Automated Growth Engine */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-between p-5 sm:p-8 lg:p-10 rounded-2xl border-2 border-accent-gold/40 bg-gradient-to-b from-[#D9A74A]/10 via-[#0D1635] to-[#0A1128] backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(217,167,74,0.12)] hover:border-accent-gold transition-all duration-300 group min-w-0 max-w-full"
          >
            <div className="space-y-6 relative z-10 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent-gold/10 border border-accent-gold/30 font-mono text-[10px] font-bold text-accent-gold uppercase tracking-wider shadow-sm">
                  {data.pathMercian.badge}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-2 leading-tight">
                  {data.pathMercian.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-primary opacity-90 leading-relaxed">
                  {data.pathMercian.subtitle}
                </p>
              </div>

              <div className="h-[1px] w-full bg-accent-gold/25" />

              <ul className="space-y-4">
                {data.pathMercian.points.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border border-accent-gold/40">✓</span>
                    <span className="text-xs sm:text-sm text-white font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Single CTA Button */}
            <div className="mt-8 pt-6 border-t border-accent-gold/20 relative z-10">
              <Button
                asChild
                size="lg"
                className="w-full py-6 sm:py-7 font-bold text-sm md:text-base flex items-center justify-center shadow-lg hover:shadow-accent-gold/20 text-center tracking-normal px-2 sm:px-4 bg-accent-gold text-slate-950 hover:bg-amber-300"
              >
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Book your free 15 minute audit</span>
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
