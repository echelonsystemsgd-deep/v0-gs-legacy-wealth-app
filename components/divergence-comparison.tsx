"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, XCircle, ShieldAlert } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function DivergenceComparison() {
  const data = SITE_COPY.homepage.divergenceComparison

  return (
    <section id="divergence" className="relative pt-6 sm:pt-12 lg:pt-20 pb-12 sm:pb-20 lg:pb-24 overflow-hidden bg-[#020E28]">
      {/* Ambient Lighting Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(218, 166, 64, 0.10) 0%, rgba(2, 14, 40, 0) 70%)"
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DAA640]/10 border border-[#DAA640]/25 text-[11px] font-mono font-semibold text-[#DAA640] uppercase tracking-[0.25em] mb-4"
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
          className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight text-balance max-w-4xl mx-auto mb-6"
        >
          {data.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14"
        >
          {data.subheadline}
        </motion.p>

        {/* Two-Column Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 text-left items-stretch max-w-6xl mx-auto">
          
          {/* Path A: Conventional Manual Drag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between p-5 sm:p-7 lg:p-9 rounded-2xl border border-red-500/25 bg-red-950/20 backdrop-blur-sm relative overflow-hidden min-w-0 max-w-full"
          >
            <div className="space-y-5 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/25 font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  <ShieldAlert size={12} className="text-red-400 shrink-0" />
                  {data.pathConventional.badge}
                </span>
              </div>

              <div>
                <h3 className="font-sans text-lg sm:text-xl font-bold text-white/95 mb-2 leading-tight">
                  {data.pathConventional.title}
                </h3>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  {data.pathConventional.subtitle}
                </p>
              </div>

              <div className="h-[1px] w-full bg-red-500/20" />

              <ul className="space-y-3.5">
                {data.pathConventional.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                    <span className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Path B: The Mercian Automated Growth Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-between p-5 sm:p-7 lg:p-9 rounded-2xl border-2 border-[#DAA640]/40 bg-gradient-to-b from-[#DAA640]/10 via-[#07153B] to-[#020E28] backdrop-blur-md relative overflow-hidden shadow-[0_0_40px_rgba(218,166,64,0.15)] hover:border-[#DAA640] transition-all duration-300 group min-w-0 max-w-full"
          >
            <div className="space-y-5 relative z-10 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#DAA640]/10 border border-[#DAA640]/30 font-mono text-[10px] font-bold text-[#DAA640] uppercase tracking-wider shadow-sm">
                  {data.pathMercian.badge}
                </span>
              </div>

              <div>
                <h3 className="font-sans text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 flex items-center gap-2 leading-tight">
                  {data.pathMercian.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {data.pathMercian.subtitle}
                </p>
              </div>

              <div className="h-[1px] w-full bg-[#DAA640]/25" />

              <ul className="space-y-3.5">
                {data.pathMercian.points.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded-full bg-[#DAA640]/20 text-[#DAA640] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border border-[#DAA640]/40">✓</span>
                    <span className="text-xs sm:text-sm text-white font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Single CTA Button */}
            <div className="mt-8 pt-6 border-t border-[#DAA640]/20 relative z-10">
              <Button
                asChild
                size="lg"
                className="w-full py-5 sm:py-6 font-bold text-sm md:text-base flex items-center justify-center shadow-lg text-center tracking-normal px-2 sm:px-4 bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] text-[#020E28] hover:from-[#EBB755] hover:to-[#DAA640] rounded-xl border-0"
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
