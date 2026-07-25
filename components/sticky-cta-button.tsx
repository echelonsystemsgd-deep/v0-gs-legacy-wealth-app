"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronUp } from "lucide-react"

export function StickyCTAButton() {
  const pathname = usePathname()
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Derived: show only when past hero AND footer isn't encroaching AND mobile menu is closed
  const isVisible = scrolledPastHero && !footerVisible && !isMobileMenuOpen

  useEffect(() => {
    const checkMenu = () => {
      setIsMobileMenuOpen(document.body.classList.contains("mobile-menu-open"))
    }
    checkMenu()
    const observer = new MutationObserver(checkMenu)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  // Do not render on admin, client, dashboard, auth, or booking pages
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

  // Show after scrolling past header (>120px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 120)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide when footer enters the viewport — using a 150px positive rootMargin buffer
  useEffect(() => {
    let observer: IntersectionObserver | null = null

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (isExcluded) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-3 sm:right-6 sm:bottom-6 z-50 flex items-center gap-2 pointer-events-auto"
        >
          {/* CTA Pill Button (LEFT) */}
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
            <Link
              href="/book"
              className="group flex items-center gap-2 bg-foreground border border-accent-gold/40 hover:border-accent-gold/70 p-1.5 sm:p-2 pr-3.5 sm:pr-4 rounded-full shadow-2xl transition-all duration-300 relative"
            >
              <div className="bg-accent-purple text-accent-gold w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-accent-gold/30">
                <span className="font-serif font-bold text-xs">MW</span>
              </div>
              <span className="font-bold text-xs sm:text-sm text-background pr-1 whitespace-nowrap">
                Apply for Audit
              </span>
            </Link>
          </motion.div>

          {/* Scroll to Top Arrow Button (RIGHT) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0A0A0A] border border-accent-gold/40 hover:border-accent-gold text-accent-gold hover:text-bg-primary hover:bg-accent-gold flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 group cursor-pointer focus:outline-none shrink-0"
          >
            <ChevronUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
