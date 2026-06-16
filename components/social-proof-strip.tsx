"use client"

import { motion } from "framer-motion"

export function SocialProofStrip() {
  return (
    <section className="relative bg-[#1A0A2E] py-8 border-y border-gold/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <p className="text-xxs sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-4">
          Trusted by ambitious businesses across the UK
        </p>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-4 sm:gap-x-12 md:gap-x-16 text-sm md:text-base text-[#F0EDE6] opacity-95 font-medium">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <span className="text-[#C9A227] text-lg font-serif">50+</span>
            <span className="text-xs uppercase tracking-wider text-[#A39E96]">Websites Built</span>
          </motion.div>

          <span className="hidden sm:inline text-white/10 text-xl">|</span>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <span className="text-[#C9A227] text-lg font-serif">100%</span>
            <span className="text-xs uppercase tracking-wider text-[#A39E96]">Client Satisfaction</span>
          </motion.div>

          <span className="hidden sm:inline text-white/10 text-xl">|</span>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-[#C9A227] text-lg font-serif">48hr</span>
            <span className="text-xs uppercase tracking-wider text-[#A39E96]">Turnaround</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
