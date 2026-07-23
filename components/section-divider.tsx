"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  chapter?: string
  title?: string
  className?: string
}

export function SectionDivider({ chapter, title, className = "" }: SectionDividerProps) {
  return (
    <div className={`relative w-full py-16 sm:py-24 flex items-center justify-center overflow-hidden z-20 ${className}`}>
      {/* Background Ambient Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-50"
        style={{
          background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 10, 0) 70%)"
        }}
      />

      {/* Hairline Border with Gold Gradient */}
      <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
      
      {/* Centered Chapter Badge */}
      {chapter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative px-7 py-2 rounded-full bg-[#0A0A0A] border border-accent-gold/40 shadow-[0_0_25px_rgba(212,175,55,0.15)] flex items-center gap-2.5 z-10 backdrop-blur-md"
        >
          <span className="text-accent-gold text-[10px] animate-pulse">✦</span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-accent-gold">
            CHAPTER {chapter} {title ? `· ${title}` : ""}
          </span>
          <span className="text-accent-gold text-[10px] animate-pulse">✦</span>
        </motion.div>
      )}
    </div>
  )
}
