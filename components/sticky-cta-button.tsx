"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PhoneCall } from "lucide-react"
import Link from "next/link"

export function StickyCTAButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past the hero section (approx 600px)
      if (window.scrollY > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10"
        >
          <Link href="/book" className="group">
            <div className="flex items-center gap-3 bg-secondary/80 backdrop-blur-md border border-gold/30 hover:border-gold px-4 py-3 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              
              <div className="bg-gold text-background p-2 rounded-full shadow-lg">
                <PhoneCall size={18} />
              </div>
              <span className="font-medium text-sm text-foreground pr-2 hidden sm:block">
                Book Strategy Call
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
