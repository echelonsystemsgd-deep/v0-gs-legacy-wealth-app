"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Exclude dashboard, admin, client, auth & booking routes
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

  // 1. Detect scroll past header/hero (> 300px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 2. Hide 150px before footer enters viewport
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

  // 3. Hide if mobile menu is open
  useEffect(() => {
    const checkMenu = () => {
      setIsMobileMenuOpen(document.body.classList.contains("mobile-menu-open"))
    }
    checkMenu()
    const observer = new MutationObserver(checkMenu)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const isVisible = scrolledPastHero && !footerVisible && !isMobileMenuOpen

  if (isExcluded) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-18 sm:right-52 z-50 sm:bottom-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0A0A0A]/90 border border-accent-gold/40 hover:border-accent-gold text-accent-gold hover:text-bg-primary hover:bg-accent-gold flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 group cursor-pointer focus:outline-none"
        >
          <ChevronUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
