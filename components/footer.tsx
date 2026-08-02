"use client"

import { BrandLogo } from "@/components/brand-logo"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, Instagram, Linkedin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWebsiteContent } from "@/hooks/use-website-content"
import { CopyEmailButton } from "@/components/copy-email-button"

export function Footer() {
  const { getSection } = useWebsiteContent()
  const data = getSection('footer', {
    tagline: "Automated Storefronts & AI Engines for Bakeries, Food Artisans & Local Services.",
    email: "mercianwealthgs@gmail.com",
    phone: "+44 7851 055929",
    whatsappLink: "https://wa.me/447851055929?text=Hi%20Mercian%20Wealth,%20I'd%20like%20to%20inquire%20about%20your%20services.",
    instagramLink: "https://instagram.com",
    linkedinLink: "https://linkedin.com",
    ctaDescription: "Book a 15-minute quick audit to see how much manual admin time we can eliminate for your business.",
    ctaButtonText: "Book 15-Min Quick Audit"
  })

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <footer className="relative bg-bg-primary border-t border-border-brand/30 text-text-primary py-16 lg:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4 flex flex-col items-start">
            <div className="relative h-12 w-12">
              <BrandLogo
                alt="Mercian Wealth"
                fill
                className="object-contain mix-blend-screen"
              />
            </div>
            <p className="font-serif italic text-sm text-text-primary opacity-80 leading-relaxed max-w-[200px]">
              {data.tagline}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-accent-gold">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="font-sans text-sm text-text-primary opacity-70 hover:opacity-100 hover:text-accent-gold transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-accent-gold">
              Contact Us
            </h4>
            <div className="space-y-3 font-sans text-sm text-text-primary opacity-70">
              <CopyEmailButton email={data.email} variant="footer" />
              <a 
                href={`tel:${data.phone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-2 hover:text-accent-gold hover:opacity-100 transition-colors min-w-0"
              >
                <Phone size={16} className="text-accent-gold shrink-0" />
                <span className="truncate">{data.phone}</span>
              </a>
              {data.whatsappLink && (
                <a 
                  href={data.whatsappLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-accent-gold hover:opacity-100 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-accent-gold">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 pt-2 text-text-primary opacity-70">
              {data.instagramLink && (
                <a 
                  href={data.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-accent-gold transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {data.linkedinLink && (
                <a 
                  href={data.linkedinLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-accent-gold transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Column 4: Book a Call Mini-CTA */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-accent-gold">
              Start a Project
            </h4>
            <p className="font-sans text-xs text-text-primary opacity-80 leading-relaxed">
              {data.ctaDescription}
            </p>
              <Button 
                asChild
                variant="outline"
                className="px-4 py-2 text-xs"
              >
                <Link href="/book" className="inline-flex items-center gap-2">
                  <span>{data.ctaButtonText}</span>
                  <ArrowRight size={12} />
                </Link>
              </Button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center md:flex md:justify-between md:items-center text-xs text-text-primary opacity-85">
          <p>
            © {new Date().getFullYear()} Mercian Wealth. All Rights Reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-accent-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
