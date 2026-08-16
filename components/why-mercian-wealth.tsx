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
    <section id="architecture" className="relative py-20 lg:py-28 overflow-hidden bg-[#020E28]">
      {/* Background Crest Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden max-w-full">
        <div className="relative w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] max-w-full opacity-15">
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
          className="mb-16 p-6 sm:p-8 rounded-2xl border border-[#DAA640]/30 bg-[#07153B] backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-8 text-left max-w-5xl mx-auto"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#020E28] border border-[#DAA640]/40 p-1 shrink-0 shadow-lg relative overflow-hidden">
            <BrandLogo 
              alt="Mercian Wealth Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAA640]/10 border border-[#DAA640]/25 text-[10px] font-mono text-[#DAA640] uppercase tracking-wider font-semibold">
              <span>FOUNDER & AUTOMATION STRATEGIST</span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl lg:text-2xl font-extrabold text-white">
              "I built Mercian Wealth so local business owners & service operators never lose high-paying clients to missed calls or late-night text chasing."
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Unlike generic corporate agencies that force broad templates onto every industry, we specialize strictly in fast, mobile order storefronts, automated WhatsApp deposit workflows, and 5-star Google review collection for local UK businesses.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Side: Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-left"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#DAA640]">
              [ THE DIFFERENCE ]
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {data.headline}
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              {data.description}
            </p>
          </motion.div>

          {/* Right Side: Differentiators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {data.differentiators.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl border border-slate-800 bg-[#07153B] hover:border-[#DAA640]/40 transition-all duration-300 text-left shadow-lg"
              >
                {/* Gold tick icon */}
                <div className="flex items-center justify-center w-5 h-5 text-[#DAA640] shrink-0 mt-0.5 font-bold">
                  ✦
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 pt-14 border-t border-slate-800 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left"
        >
          {/* Trend Adaptation Callout */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#DAA640]/20 bg-[#07153B] space-y-3 hover:border-[#DAA640]/40 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <RefreshCw size={17} className="text-[#DAA640]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#DAA640]">
                [ {trendData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-sans text-lg sm:text-xl font-bold text-white">{trendData.headline}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {trendData.description}
            </p>
          </div>

          {/* Model Hint Callout */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#DAA640]/20 bg-[#07153B] space-y-3 hover:border-[#DAA640]/40 transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <Landmark size={17} className="text-[#DAA640]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#DAA640]">
                [ {modelData.eyebrow} ]
              </span>
            </div>
            <h4 className="font-sans text-lg sm:text-xl font-bold text-white">{modelData.headline}</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {modelData.description}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
