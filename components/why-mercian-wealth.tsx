"use client"

import { motion } from "framer-motion"
import { ShieldCheck, RefreshCw, Landmark } from "lucide-react"
import Image from "next/image"
import { SITE_COPY } from "@/lib/site-copy"

export function WhyGSLegacy() {
  const data = SITE_COPY.homepage.whyGsLegacy
  const trendData = SITE_COPY.homepage.trendAdaptation
  const modelData = SITE_COPY.homepage.modelHint

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-bg-secondary">
      {/* Background Crest Watermark (Scrolls with page, behind text) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="relative w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-[0.03]">
          <Image 
            src="/GS_Legacy_Wealth_Watermark-removebg-preview.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in">
              {data.headline}
            </h2>
            <p className="font-sans text-base text-text-primary opacity-80 leading-relaxed max-w-xl">
              {data.description}
            </p>
          </motion.div>

          {/* Right Side: Differentiators */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {data.differentiators.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 border border-border-brand/20 bg-bg-tertiary/40 hover:border-accent-gold hover:bg-bg-tertiary/60 transition-colors duration-300 text-left"
              >
                {/* Gold tick icon */}
                <div className="flex items-center justify-center w-6 h-6 text-accent-gold shrink-0 mt-0.5">
                  <span>✦</span>
                </div>
                <span className="font-sans text-sm text-text-primary opacity-90 font-medium">
                  {diff}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contrast Comparison Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 pt-16 border-t border-white/5"
        >
          <h3 className="font-serif text-2xl font-bold text-white text-center mb-8">
            {data.structuralRealityHeadline}
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Standard Agency */}
            <div className="p-6 rounded-xl border border-red-500/10 bg-red-500/5 space-y-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">
                [ {data.standardAgency.title} ]
              </span>
              <ul className="space-y-2.5 text-xs text-text-primary opacity-70">
                {data.standardAgency.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* GS Legacy */}
            <div className="p-6 rounded-xl border border-accent-gold/20 bg-accent-gold/5 space-y-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent-purple">
                [ {data.gsLegacy.title} ]
              </span>
              <ul className="space-y-2.5 text-xs text-[#F0EDE6] opacity-90">
                {data.gsLegacy.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent-gold">✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Trend Adaptation & Model Hint (Exclusivity Sections) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-white/5 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left"
        >
          {/* Trend Adaptation Callout */}
          <div className="p-6 rounded-xl border border-white/5 bg-bg-tertiary/20 space-y-3 hover:border-accent-gold/30 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <RefreshCw size={16} className="text-accent-gold animate-spin-slow" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent-gold">
                [ {trendData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white">{trendData.headline}</h4>
            <p className="text-xs text-text-primary opacity-80 leading-relaxed">
              {trendData.description}
            </p>
          </div>

          {/* Model Hint Callout */}
          <div className="p-6 rounded-xl border border-white/5 bg-bg-tertiary/20 space-y-3 hover:border-accent-gold/30 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <Landmark size={16} className="text-accent-gold" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent-gold">
                [ {modelData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white">{modelData.headline}</h4>
            <p className="text-xs text-text-primary opacity-80 leading-relaxed">
              {modelData.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
