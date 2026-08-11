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
        <>
          {/* Mobile Unified Conversion Bar (Visible strictly on sm:hidden) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="sm:hidden fixed bottom-0 inset-x-0 z-[90] bg-[#0A1128]/95 backdrop-blur-xl border-t border-[#D9A74A]/30 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pointer-events-auto"
          >
            <a
              href="tel:+447851055929"
              className="flex-1 py-3 px-3 rounded-xl bg-slate-900 border border-[#D9A74A]/40 text-[#D9A74A] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <span>📞 Call Direct</span>
            </a>
            <Link
              href="/book"
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#D9A74A] via-[#E5A93C] to-[#B8860B] text-slate-950 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-md active:scale-95 transition-transform"
            >
              <span>Get Free Audit →</span>
            </Link>
          </motion.div>

          {/* Desktop Floating Pill CTA (Visible on sm:flex) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="hidden sm:flex fixed bottom-6 right-6 z-50 items-center gap-2 pointer-events-auto"
          >
            {/* CTA Pill Button (LEFT) */}
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
              <Link
                href="/book"
                className="group flex items-center gap-2.5 bg-[#0D1635] border border-[#D9A74A]/40 hover:border-[#D9A74A] p-2 pr-4 rounded-full shadow-2xl transition-all duration-300 relative text-white"
              >
                <div className="bg-[#D9A74A] text-slate-950 w-9 h-9 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-amber-300/40">
                  <span className="font-serif font-bold text-xs">MW</span>
                </div>
                <span className="font-bold text-xs sm:text-sm text-white pr-1 whitespace-nowrap">
                  Apply for Audit
                </span>
              </Link>
            </motion.div>

            {/* Scroll to Top Arrow Button (RIGHT) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-[#0D1635] border border-[#D9A74A]/40 text-[#D9A74A] hover:bg-[#D9A74A] hover:text-slate-950 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Scroll to top"
            >
              <ChevronUp size={18} />
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
