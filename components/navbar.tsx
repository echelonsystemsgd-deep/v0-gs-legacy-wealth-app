"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SocialMediaLinks } from "@/components/social-media-links"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Outside click handler for mobile menu drawer
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('button[aria-label="Toggle menu"]')
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group active:scale-98 transition-transform">
            <div className={`relative transition-all duration-300 ${isScrolled ? "h-8 w-8 sm:h-10 sm:w-10" : "h-12 w-12 sm:h-16 sm:w-16"}`}>
              <Image 
                src="/GS_Legacy_Wealth-removebg-preview.png" 
                alt="GS Legacy Wealth" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`font-serif tracking-tight text-foreground transition-all duration-300 group-hover:text-gold hidden sm:block ${isScrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl font-bold"}`}>
              GS Legacy Wealth
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors hover:text-gold active:scale-95 transition-transform ${
                  isActive(link.href) 
                    ? "text-gold font-semibold" 
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              asChild
              variant="outline"
              className="active:scale-95 transition-transform"
            >
              <Link href="/book">Book a Strategy Call</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground p-2 active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-20 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Mobile Drawer */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 top-20 glass border-t border-primary/10 z-50 lg:hidden overflow-y-auto max-h-[calc(100vh-5rem)]"
              style={{
                paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
              }}
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm transition-colors hover:text-gold py-2 active:scale-98 transition-transform ${
                      isActive(link.href) ? "text-gold font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  asChild
                  variant="outline"
                  className="w-full active:scale-[0.98] transition-transform"
                >
                  <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                    Book a Strategy Call
                  </Link>
                </Button>
                <div className="flex justify-center pt-6 border-t border-primary/10">
                  <SocialMediaLinks />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
