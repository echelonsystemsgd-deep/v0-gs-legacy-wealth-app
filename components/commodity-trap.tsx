"use client"

import { motion } from "framer-motion"
import { AlertTriangle, HelpCircle, XCircle } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function CommodityTrap() {
  const data = SITE_COPY.homepage.commodityTrap

  const traps = [
    {
      title: "The Zero-Cost Bait",
      issue: "Opting in because of 'free' setups or trial tiers.",
      impact: "Hosting fees, feature paywalls, and integration costs accumulate silently in the background.",
    },
    {
      title: "Boilerplate Templates",
      issue: "Generic layouts shared by thousands of competitors.",
      impact: "Signals mediocrity to high-intent vendors, actively leaking high-value instructions.",
    },
    {
      title: "No Operational Ownership",
      issue: "Software platforms sell raw design tools, not business outcomes.",
      impact: "You are left to build, manage, and debug complex API routes alone when workflows break.",
    },
  ]

  return (
    <section id="commodity-trap" className="relative py-24 lg:py-32 overflow-hidden bg-bg-secondary border-t border-white/5">
      {/* Radial Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 10% 50%, rgba(239, 68, 68, 0.04) 0%, rgba(10, 10, 10, 0) 60%)"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Heading Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#ef4444]">
              [ {data.eyebrow} ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {data.headline}
            </h2>
            <p className="font-sans text-sm sm:text-base text-text-primary opacity-80 leading-relaxed">
              {data.description}
            </p>
          </motion.div>

          {/* Right Column: Visual Breakdown of the Traps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {traps.map((trap, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-bg-tertiary/20 border border-white/5 hover:border-red-500/30 rounded-xl transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[#ef4444] shrink-0 mt-0.5 group-hover:bg-red-500/20 transition-all duration-300">
                  <XCircle size={18} />
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="font-sans font-semibold text-base text-white">
                    {trap.title}
                  </h3>
                  <p className="font-sans text-xs text-red-400 font-medium">
                    {trap.issue}
                  </p>
                  <p className="font-sans text-xs text-text-primary opacity-70 leading-relaxed">
                    {trap.impact}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
