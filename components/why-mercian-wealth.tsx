"use client"

import { motion } from "framer-motion"
import { RefreshCw, Landmark } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"
import { BrandLogo } from "@/components/brand-logo"

export function WhyMercianWealth() {
  const data = SITE_COPY.homepage.whyMercianWealth
  const trendData = SITE_COPY.homepage.trendAdaptation
  const modelData = SITE_COPY.homepage.modelHint

  return (
    <section id="architecture" className="relative py-24 lg:py-32 overflow-hidden bg-[#0B0F17]">
      {/* Background Crest Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden max-w-full">
        <div className="relative w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] max-w-full opacity-20">
          <BrandLogo 
            variant="watermark"
            alt=""
            fill
            className="object-contain mix-blend-screen"
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Founder Spotlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 p-6 sm:p-8 rounded-2xl border border-[#D9A74A]/30 bg-[#1E293B]/60 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-8 text-left max-w-5xl mx-auto"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#D9A74A] to-[#B8860B] p-1 shrink-0 shadow-lg relative">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative p-3.5 overflow-hidden">
              <BrandLogo 
                alt="Mercian Wealth Logo"
                fill
                className="object-contain p-1.5"
              />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A74A]/10 border border-[#D9A74A]/25 text-[10px] font-mono text-[#D9A74A] uppercase tracking-wider">
              <span>FOUNDER & AUTOMATION STRATEGIST</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              "I built Mercian Wealth so local business owners & service operators never lose high-paying clients to missed calls or late-night text chasing."
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Unlike generic corporate agencies that force broad templates onto every industry, we specialize strictly in fast, mobile order storefronts, automated WhatsApp deposit workflows, and 5-star Google review collection for local UK businesses.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#D9A74A]">
              [ THE DIFFERENCE ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {data.headline}
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              {data.description}
            </p>
          </motion.div>

          {/* Right Side: Differentiators */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {data.differentiators.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl border border-slate-800 bg-[#1E293B]/50 hover:border-[#D9A74A]/50 transition-all duration-300 text-left shadow-lg"
              >
                {/* Gold tick icon */}
                <div className="flex items-center justify-center w-6 h-6 text-[#D9A74A] shrink-0 mt-0.5">
                  <span className="text-sm">✦</span>
                </div>
                <span className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {diff}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trend Adaptation & Model Hint */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-slate-800 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left"
        >
          {/* Trend Adaptation Callout */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#D9A74A]/20 bg-[#1E293B]/40 space-y-4 hover:border-[#D9A74A]/40 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <RefreshCw size={18} className="text-[#D9A74A] animate-spin-slow" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D9A74A]">
                [ {trendData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-serif text-xl font-bold text-white">{trendData.headline}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {trendData.description}
            </p>
          </div>

          {/* Model Hint Callout */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#D9A74A]/20 bg-[#1E293B]/40 space-y-4 hover:border-[#D9A74A]/40 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <Landmark size={18} className="text-[#D9A74A]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D9A74A]">
                [ {modelData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-serif text-xl font-bold text-white">{modelData.headline}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {modelData.description}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
