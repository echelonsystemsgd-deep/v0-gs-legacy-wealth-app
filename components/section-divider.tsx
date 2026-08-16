"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  id?: string
  chapter?: string
  title?: string
  className?: string
}

export function SectionDivider({ id, chapter, title, className = "" }: SectionDividerProps) {
  return (
    <div id={id} className={`relative w-full py-4 sm:py-8 flex items-center justify-center overflow-hidden z-20 ${className}`}>
      {/* Background Ambient Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: "radial-gradient(circle at center, rgba(218, 166, 64, 0.08) 0%, rgba(2, 14, 40, 0) 70%)"
        }}
      />

      {/* Hairline Border with Gold Gradient */}
      <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#DAA640]/35 to-transparent" />
      
      {/* Centered Chapter Badge */}
      {chapter && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="relative px-4 sm:px-6 py-1.5 rounded-full bg-[#020E28] border border-[#DAA640]/30 shadow-[0_0_20px_rgba(218,166,64,0.15)] flex items-center justify-center gap-2 z-10 backdrop-blur-md max-w-[90%] sm:max-w-full text-center"
        >
          <span className="text-[#DAA640] text-[9px] sm:text-[10px] animate-pulse shrink-0">✦</span>
          <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#DAA640] truncate sm:whitespace-normal">
            CHAPTER {chapter} {title ? `· ${title}` : ""}
          </span>
          <span className="text-[#DAA640] text-[9px] sm:text-[10px] animate-pulse shrink-0">✦</span>
        </motion.div>
      )}
    </div>
  )
}
