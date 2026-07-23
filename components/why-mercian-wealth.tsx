"use client"

import { motion } from "framer-motion"
import { RefreshCw, Landmark, Cpu } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"
import { BrandLogo } from "@/components/brand-logo"

export function WhyMercianWealth() {
  const data = SITE_COPY.homepage.whyMercianWealth
  const trendData = SITE_COPY.homepage.trendAdaptation
  const modelData = SITE_COPY.homepage.modelHint

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#130B24]">
      {/* Background Crest Watermark (Scrolls with page, behind text) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="relative w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-[0.04]">
          <BrandLogo 
            alt=""
            fill
            className="object-contain mix-blend-screen"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold">
              [ SYSTEM ARCHITECTURE ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              We Build <span className="inline bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent">Leverage.</span> The Rest Build Overhead.
            </h2>
            <p className="font-sans text-base sm:text-lg text-white/80 leading-relaxed max-w-xl font-normal">
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
                className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-accent-gold/50 hover:bg-white/[0.06] transition-all duration-300 text-left shadow-lg"
              >
                {/* Gold tick icon */}
                <div className="flex items-center justify-center w-6 h-6 text-accent-gold shrink-0 mt-0.5">
                  <span className="text-sm">✦</span>
                </div>
                <span className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                  {diff}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trend Adaptation & Model Hint (Exclusivity Sections) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-white/10 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left"
        >
          {/* Trend Adaptation Callout */}
          <div className="p-6 sm:p-8 rounded-2xl border border-accent-gold/20 bg-white/[0.02] space-y-4 hover:border-accent-gold/40 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <RefreshCw size={18} className="text-accent-gold animate-spin-slow" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-gold">
                [ {trendData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-serif text-xl font-bold text-white">{trendData.headline}</h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {trendData.description}
            </p>
          </div>

          {/* Model Hint Callout */}
          <div className="p-6 sm:p-8 rounded-2xl border border-accent-gold/20 bg-white/[0.02] space-y-4 hover:border-accent-gold/40 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <Landmark size={18} className="text-accent-gold" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-gold">
                [ {modelData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-serif text-xl font-bold text-white">{modelData.headline}</h4>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {modelData.description}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
