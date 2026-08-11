"use client"

import { BrandLogo } from "@/components/brand-logo"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center">
        {/* Background pulsing watermark */}
        <motion.div
          animate={{
            scale: [0.9, 1.05, 0.9],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-40 h-40 sm:w-56 sm:h-56 mix-blend-screen"
        >
          <BrandLogo
            variant="watermark"
            alt=""
            fill
            className="object-contain mix-blend-screen"
          />
        </motion.div>

        {/* Mercian Wealth Monogram & Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-3"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_20px_rgba(217,167,74,0.4)]">
            <BrandLogo variant="logo" fill className="object-contain mix-blend-screen" priority />
          </div>
          <div className="text-xl sm:text-2xl font-bold">
            <BrandLogo wordmarkOnly />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1 w-full"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/90 font-semibold font-mono">
            Loading Wealth Console...
          </span>
        </motion.div>
      </div>
    </div>
  )
}

