"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-20 h-20 sm:w-24 sm:h-24"
      >
        <Image
          src="/GS_Legacy_Wealth_Watermark-removebg-preview.png"
          alt="Loading..."
          fill
          className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
        />
      </motion.div>
    </div>
  )
}
