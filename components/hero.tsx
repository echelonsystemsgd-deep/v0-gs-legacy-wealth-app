"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0A0A0A]">
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(45, 10, 94, 0.15) 0%, rgba(10, 10, 10, 0) 70%)"
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
            AI-Powered Digital Growth Agency
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] text-balance mb-8 max-w-4xl"
        >
          Websites That Command Authority. Systems That Generate Revenue.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-base sm:text-lg text-[#F0EDE6] opacity-90 max-w-[580px] leading-relaxed mb-10"
        >
          We build premium AI-powered websites and automated lead systems for ambitious businesses ready to scale.
        </motion.p>

        {/* Two CTA Buttons Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full justify-center"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-[#6D28D9] hover:bg-[#5B21B6] text-white border border-[#C9A227] rounded-none px-8 py-7 text-sm font-bold tracking-wider uppercase transition-colors"
          >
            <Link href="/book" className="flex items-center justify-center gap-2">
              Book Your Free Strategy Call
              <ArrowRight size={16} />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-[#C9A227] hover:bg-[#C9A227] hover:text-black text-white bg-transparent rounded-none px-8 py-7 text-sm font-bold tracking-wider uppercase transition-colors"
          >
            <Link href="/portfolio">See Our Work</Link>
          </Button>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-[#A39E96] border-t border-white/10 pt-8 w-full max-w-3xl"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-[#C9A227]">✦</span> Trusted by 50+ premium brands
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C9A227]">✦</span> AI-Powered
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C9A227]">✦</span> Mobile Optimised
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#C9A227]">✦</span> Fast Delivery
          </span>
        </motion.div>
      </div>
    </section>
  )
}
