"use client"

import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import Image from "next/image"

const differentiators = [
  "Bespoke visual identity aligned with category dominance.",
  "Autonomous AI systems, never boilerplate templates.",
  "Rapid execution paths designed to eliminate deployment lag.",
  "Data-backed conversion architecture on every component.",
  "Dedicated optimization retention to preserve system throughput.",
]

export function WhyGSLegacy() {
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
            className="space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Engineered for Leverage. Built for Prestige.
            </h2>
            <p className="font-sans text-base text-text-primary opacity-80 leading-relaxed max-w-xl">
              We focus on premium, custom digital assets tailored specifically for businesses ready to dominate their space. By combining luxury visual storytelling with AI automation, we ensure your online presence acts as a 24/7 revenue-generating asset rather than a static brochure.
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
            {differentiators.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 border border-border-brand/20 bg-bg-tertiary/40 hover:border-accent-gold hover:bg-bg-tertiary/60 transition-colors duration-300"
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
            The Structural Reality
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Agency */}
            <div className="p-6 rounded-xl border border-red-500/10 bg-red-500/5 space-y-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-red-400">
                [ Standard Agency Model ]
              </span>
              <ul className="space-y-2.5 text-xs text-text-primary opacity-70">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✕</span> Boilerplate templates and generic layout setups.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✕</span> Delayed deployment paths taking 2 to 3 months.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✕</span> Disconnected lead qualifiers and manual CRM copying.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">✕</span> Ongoing hourly overhead without performance guarantees.
                </li>
              </ul>
            </div>
            
            {/* GS Legacy */}
            <div className="p-6 rounded-xl border border-accent-gold/20 bg-accent-gold/5 space-y-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-accent-purple">
                [ Autonomic Systems Lab ]
              </span>
              <ul className="space-y-2.5 text-xs text-[#F0EDE6] opacity-90">
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold">✦</span> Bespoke authority platforms built from the ground up.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold">✦</span> Rapid execution protocol delivering assets in under 28 days.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold">✦</span> Autonomous capture funnels with direct CRM data pipelines.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-gold">✦</span> Clear capital investment aligned with guaranteed throughput.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
