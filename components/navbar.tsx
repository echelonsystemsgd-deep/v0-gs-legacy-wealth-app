"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
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
  const router = useRouter()
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0D0B12] border-b border-gold/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Crest Only */}
          <button
            onClick={() => {
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" })
              } else {
                router.push("/")
                setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
              }
            }}
            className="flex items-center gap-3 cursor-pointer"
            aria-label="Go to homepage top"
          >
            <div className={`relative transition-all duration-300 ${isScrolled ? "h-10 w-10" : "h-14 w-14"}`}>
              <Image 
                src="/GS_Legacy_Wealth_Watermark-removebg-preview.png" 
                alt="GS Legacy Wealth Crest" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-200 hover:text-gold ${
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
              className="border-gold/60 text-gold hover:bg-gold hover:text-black transition-colors duration-300 bg-transparent rounded-none px-6 py-2"
            >
              <Link href="/book">Book a Strategy Call</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 bg-[#1A0A2E] z-50 lg:hidden overflow-y-auto flex flex-col"
            style={{
              height: "calc(100vh - 5rem)",
            }}
          >
            <div className="flex-1 px-6 py-8 space-y-6 flex flex-col justify-start">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xl py-2 border-b border-white/5 transition-colors duration-200 hover:text-gold ${
                    isActive(link.href) ? "text-gold font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gold/60 text-gold hover:bg-gold hover:text-black transition-colors duration-300 bg-transparent rounded-none py-6 text-lg"
                >
                  <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                    Book a Strategy Call
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center pt-8 border-t border-white/5">
                <SocialMediaLinks />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
