"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BRAND_WATERMARK } from "@/lib/brand-assets"

interface WatermarkProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "custom";
  className?: string;
  opacity?: number;
}

export function Watermark({ position = "center", className = "", opacity = 0.25 }: WatermarkProps) {
  // Always use static public/ path directly — no Supabase CMS dependency.
  // This ensures Vercel and localhost render identically.
  const src = BRAND_WATERMARK

  const getPositionClasses = () => {
    switch (position) {
      case "top-left": return "top-0 left-0 -translate-x-1/4 -translate-y-1/4";
      case "top-right": return "top-0 right-0 translate-x-1/4 -translate-y-1/4";
      case "bottom-left": return "bottom-0 left-0 -translate-x-1/4 translate-y-1/4";
      case "bottom-right": return "bottom-0 right-0 translate-x-1/4 translate-y-1/4";
      case "center": return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      case "custom": return "";
      default: return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  }

  return (
    <div className={`fixed pointer-events-none z-[-10] ${getPositionClasses()} ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: opacity, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] lg:w-[1600px] lg:h-[1600px] mix-blend-screen"
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>
    </div>
  )
}
