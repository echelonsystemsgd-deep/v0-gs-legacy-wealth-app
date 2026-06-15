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
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 md:bottom-10 md:right-10"
        >
          <Link href="/book" className="group flex items-center">
            <div className="flex items-center gap-3 bg-foreground border border-accent/40 hover:border-primary/40 p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                <span className="font-serif font-bold text-lg">GS</span>
              </div>
              <span className="font-medium text-sm text-background pr-4 hidden sm:block whitespace-nowrap">
                GS Concierge
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
