"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function CTA() {
  const data = SITE_COPY.homepage.cta

  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden bg-[#020E28]">
      {/* Background Radial Gold Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(218, 166, 64, 0.12) 0%, rgba(2, 14, 40, 0) 70%)"
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center space-y-8">
        
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight text-balance max-w-4xl"
        >
          {data.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal"
        >
          {data.subheadline}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex flex-col items-center gap-6 pt-2"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-bold shadow-[0_0_35px_rgba(218,166,64,0.35)] transition-all duration-300 bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] text-[#020E28] hover:from-[#EBB755] hover:to-[#DAA640] border-0 rounded-xl"
          >
            <Link href="/book" className="flex items-center gap-3">
              <span>{data.buttonText}</span>
              <ArrowRight size={20} />
            </Link>
          </Button>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-slate-400">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#07153B] border border-[#DAA640]/25 text-[10px] text-[#DAA640] uppercase tracking-wider">
              <ShieldCheck size={12} className="text-[#DAA640]" />
              15-Minute Telephone Call · Zero High-Pressure Pitch
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
