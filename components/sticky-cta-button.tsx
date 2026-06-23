"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PhoneCall } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function StickyCTAButton() {
  const pathname = usePathname()
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  // Derived: show only when past hero AND footer isn't encroaching
  const isVisible = scrolledPastHero && !footerVisible

  // Do not render the Sticky CTA Button on admin, client, dashboard, auth, or booking pages
  const excludedPrefixes = [
    '/admin',
    '/client',
    '/dashboard',
    '/forgot-password',
    '/login',
    '/reset-password',
    '/signup',
    '/book',
    '/unauthorized'
  ]
  const isExcluded = excludedPrefixes.some((prefix) => pathname?.startsWith(prefix))

  // Show after scrolling past the hero section (~600px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 600)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide when footer enters the viewport — using a 100px rootMargin buffer
  // so the fade-out completes before any visual overlap occurs
  useEffect(() => {
    const footer = document.querySelector("footer")
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting)
      },
      {
        // Shrink the bottom of the "viewport" by 100px — the footer is
        // considered "visible" (and the widget hides) 100px before it
        // would naturally enter the viewport from below
        rootMargin: "0px 0px -100px 0px",
      }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  if (isExcluded) return null

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
              <span className="font-medium text-xs sm:text-sm text-background pr-3 sm:pr-4 whitespace-nowrap">
                <span className="sm:hidden">Book Call</span>
                <span className="hidden sm:inline">GS Concierge</span>
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
