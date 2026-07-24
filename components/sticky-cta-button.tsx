"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-50 sm:bottom-8 sm:right-8"
        >
          <Link
            href="/book"
            className="group flex items-center border-none bg-transparent outline-none cursor-pointer decoration-none"
          >
            <div className="flex items-center gap-2.5 bg-foreground border border-accent-gold/40 hover:border-accent-gold/60 p-2 sm:p-2.5 rounded-full shadow-2xl transition-all duration-300 relative group-hover:scale-105">
              <div className="bg-accent-purple text-accent-gold w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-accent-gold/30">
                <span className="font-serif font-bold text-sm sm:text-base">MW</span>
              </div>
              <span className="hidden sm:inline font-bold text-xs sm:text-sm text-background pr-3 whitespace-nowrap">
                Apply for Audit
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

