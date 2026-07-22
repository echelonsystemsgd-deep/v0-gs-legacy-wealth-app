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
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>

        {/* Mercian Wealth Monogram */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="font-serif text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-light via-gold to-gold-dark animate-pulse glow-gold">
            <BrandLogo wordmarkOnly />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mt-2"
          />
          <span className="text-xxs uppercase tracking-[0.3em] text-gold mt-4 font-semibold">
            Initializing
          </span>
        </motion.div>
      </div>
    </div>
  )
}

