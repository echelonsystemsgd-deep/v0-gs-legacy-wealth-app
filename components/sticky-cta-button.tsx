"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuditModal } from "@/components/audit-modal-context"

export function StickyCTAButton() {
  const { openModal } = useAuditModal()
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
    '/success',
    '/unauthorized'
  ]
  const isExcluded = excludedPrefixes.some((prefix) => pathname?.startsWith(prefix))

  // Show after scrolling past the header/navbar (>120px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 120)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide when footer enters the viewport — using a 150px positive rootMargin buffer
  // so the fade-out completes before any visual overlap with footer text occurs
  useEffect(() => {
    let observer: IntersectionObserver | null = null

    // We add a tiny delay to ensure the client has finished rendering the page
    const timer = setTimeout(() => {
      const footer = document.querySelector("footer")
      if (!footer) {
        setFooterVisible(false)
        return
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setFooterVisible(entry.isIntersecting)
        },
        {
          // Positive bottom margin expands the root's bounding box downwards by 150px.
          // This triggers intersection 150px before the footer enters the viewport,
          // allowing the CTA button to hide smoothly before overlapping.
          rootMargin: "0px 0px 150px 0px",
        }
      )

      observer.observe(footer)
    }, 150)

    return () => {
      clearTimeout(timer)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [pathname])

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
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-6 z-50 md:bottom-10 md:right-10"
        >
          <button 
            onClick={() => openModal()}
            className="group flex items-center border-none bg-transparent outline-none cursor-pointer"
          >
            <div className="flex items-center gap-3 bg-foreground border border-accent/40 hover:border-primary/40 p-2 md:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                <span className="font-serif font-bold text-lg">GS</span>
              </div>
              <span className="font-medium text-xs sm:text-sm text-background pr-3 sm:pr-4 whitespace-nowrap">
                Apply for Audit
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

