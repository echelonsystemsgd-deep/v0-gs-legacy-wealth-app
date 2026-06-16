"use client"

import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import Image from "next/image"

const differentiators = [
  "Royal purple + gold brand aesthetic — built to stand out",
  "AI-enhanced, not template-built",
  "Delivered in days, not months",
  "Conversion-first architecture on every build",
  "Ongoing support & optimisation included",
]

export function WhyGSLegacy() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#1A0A2E]">
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
              Built Different. Priced for Ambition.
            </h2>
            <p className="font-sans text-base text-[#F0EDE6] opacity-80 leading-relaxed max-w-xl">
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
                className="flex items-start gap-4 p-4 border border-white/5 bg-[#130D24]/40 hover:border-gold/30 hover:bg-[#130D24]/60 transition-colors duration-300"
              >
                {/* Gold tick icon */}
                <div className="flex items-center justify-center w-6 h-6 text-[#C9A227] shrink-0 mt-0.5">
                  <span>✦</span>
                </div>
                <span className="font-sans text-sm text-[#F0EDE6] opacity-90 font-medium">
                  {diff}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
