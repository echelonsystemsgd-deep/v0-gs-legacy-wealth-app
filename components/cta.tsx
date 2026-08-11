"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function CTA() {
  const data = SITE_COPY.homepage.cta

  return (
    <section id="cta" className="relative py-28 lg:py-36 overflow-hidden bg-[#090D16]">
      {/* Background Radial Gold Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.12) 0%, rgba(56, 189, 248, 0.06) 45%, rgba(9, 13, 22, 0) 75%)"
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center space-y-8">
        
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance max-w-4xl"
        >
          {data.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed font-normal"
        >
          {data.subheadline}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full flex flex-col items-center gap-6 pt-4"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto px-10 py-7 text-lg font-bold shadow-[0_0_35px_rgba(212,175,55,0.25)] hover:shadow-accent-gold/40 transition-all duration-300 bg-accent-gold text-slate-950 hover:bg-amber-300"
          >
            <Link href="/book" className="flex items-center gap-3">
              <span>{data.buttonText}</span>
              <ArrowRight size={20} />
            </Link>
          </Button>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-text-secondary">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-accent-gold uppercase tracking-wider">
              <ShieldCheck size={12} className="text-accent-gold" />
              15-Minute Telephone Call · Zero High-Pressure Pitch
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
