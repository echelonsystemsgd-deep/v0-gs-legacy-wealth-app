"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#1A0A2E]">
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(109, 40, 217, 0.1) 0%, rgba(26, 10, 46, 0) 70%)"
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center space-y-8">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance max-w-3xl"
        >
          Ready to Build Your Digital Legacy?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-sans text-base sm:text-lg text-[#F0EDE6] opacity-90 max-w-xl leading-relaxed"
        >
          Limited client spots available. We only work with businesses serious about growth.
        </motion.p>

        {/* Single CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full sm:w-auto pt-4"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#B8952A] text-black border border-[#C9A227] rounded-none px-10 py-7 text-sm font-extrabold tracking-wider uppercase transition-colors"
          >
            <Link href="/book">
              Book Your Free Strategy Call
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
