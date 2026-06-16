"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Instagram, Linkedin, ArrowRight } from "lucide-react"

export function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Process", href: "/process" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-[#C9A227]/30 text-white py-16 lg:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4 flex flex-col items-start">
            <div className="relative h-12 w-12">
              <Image 
                src="/GS_Legacy_Wealth_Watermark-removebg-preview.png" 
                alt="GS Legacy Wealth Crest" 
                fill
                className="object-contain"
              />
            </div>
            <p className="font-serif italic text-sm text-[#F0EDE6] opacity-80 leading-relaxed max-w-[200px]">
              Building Wealth. Creating Legacy. Giving Back.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#C9A227]">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="font-sans text-sm text-[#F0EDE6] opacity-70 hover:opacity-100 hover:text-[#C9A227] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#C9A227]">
              Contact Us
            </h4>
            <div className="space-y-3 font-sans text-sm text-[#F0EDE6] opacity-70">
              <a 
                href="mailto:gslegacywealth@gmail.com" 
                className="flex items-center gap-2 hover:text-[#C9A227] hover:opacity-100 transition-colors"
              >
                <Mail size={16} className="text-[#C9A227]" />
                <span>gslegacywealth@gmail.com</span>
              </a>
              <a 
                href="tel:+447700900077" 
                className="flex items-center gap-2 hover:text-[#C9A227] hover:opacity-100 transition-colors"
              >
                <Phone size={16} className="text-[#C9A227]" />
                <span>+44 7700 900077</span>
              </a>
            </div>
            <div className="flex items-center gap-3 pt-2 text-[#F0EDE6] opacity-70">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A227] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A227] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 4: Book a Call Mini-CTA */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#C9A227]">
              Start a Project
            </h4>
            <p className="font-sans text-xs text-[#F0EDE6] opacity-60 leading-relaxed">
              Secure your strategy session to reserve your spot and design your legacy.
            </p>
            <div className="pt-2">
              <Link 
                href="/book" 
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#C9A227]/60 text-[#C9A227] hover:bg-[#C9A227] hover:text-black transition-colors duration-300 text-xs font-bold uppercase tracking-wider bg-transparent"
              >
                <span>Book a Call</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center md:flex md:justify-between md:items-center text-xs text-[#F0EDE6] opacity-65">
          <p>
            © {new Date().getFullYear()} GS Legacy Wealth · Privacy Policy · All Rights Reserved
          </p>
          <div className="flex justify-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#C9A227] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#C9A227] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
