"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function AnnouncementBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex justify-center px-4 mb-6 z-20"
    >
      <Link
        href="/#demo"
        className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-accent-gold/10 border border-accent-gold/30 hover:border-accent-gold/60 text-xs sm:text-sm font-medium text-accent-gold transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] group text-center max-w-full"
      >
        <Sparkles size={14} className="text-accent-gold shrink-0 animate-pulse hidden sm:inline-block" />
        <span className="font-sans tracking-wide text-white/90 group-hover:text-white transition-colors">
          Custom AI Automations & Digital Storefronts — <span className="text-accent-gold font-semibold underline decoration-accent-gold/40 underline-offset-4 group-hover:decoration-accent-gold">Test Live Order Demo</span>
        </span>
        <ArrowRight size={14} className="text-accent-gold shrink-0 group-hover:translate-x-1 transition-transform duration-200 ml-0.5" />
      </Link>
    </motion.div>
  )
}
