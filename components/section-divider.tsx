"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  chapter?: string
  title?: string
  className?: string
}

export function SectionDivider({ chapter, title, className = "" }: SectionDividerProps) {
  return (
    <div className={`relative w-full py-10 flex items-center justify-center overflow-hidden z-20 ${className}`}>
      {/* Hairline Border with Gold Gradient */}
      <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-accent-gold/35 to-transparent" />
      
      {/* Centered Chapter Badge */}
      {chapter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative px-6 py-1.5 rounded-full bg-bg-primary border border-accent-gold/25 shadow-xl flex items-center gap-2"
        >
          <span className="text-accent-gold text-[10px]">✦</span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent-gold">
            CHAPTER {chapter} {title ? `· ${title}` : ""}
          </span>
          <span className="text-accent-gold text-[10px]">✦</span>
        </motion.div>
      )}
    </div>
  )
}
