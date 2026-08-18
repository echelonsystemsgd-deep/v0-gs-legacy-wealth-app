"use client"

import { BrandLogo } from "@/components/brand-logo"
import Link from "next/link"
import { Phone, Instagram, Linkedin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWebsiteContent } from "@/hooks/use-website-content"
import { CopyEmailButton } from "@/components/copy-email-button"

export function Footer() {
  const { getSection } = useWebsiteContent()
  const data = getSection('footer', {
    tagline: "Automated Storefronts & AI Engines for Local Businesses.",
    email: "mercianwealthgs@gmail.com",
    phone: "+44 7851 055929",
    whatsappLink: "https://wa.me/447851055929?text=Hi%20Mercian%20Wealth,%20I'd%20like%20to%20inquire%20about%20your%20services.",
    instagramLink: "https://www.instagram.com/mercianwealth/",
    linkedinLink: "https://www.linkedin.com/in/gs-legacy-wealth/",
    ctaDescription: "Book a 15-minute quick audit to see how much manual admin time we can eliminate for your business.",
    ctaButtonText: "Book your free 15 minute audit"
  })

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <footer className="relative bg-[#020E28] border-t border-[#DAA640]/20 text-slate-300 py-16 lg:py-20 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4 flex flex-col items-start">
            <div className="relative h-12 w-12 rounded-xl border border-[#DAA640]/30 overflow-hidden shadow-md">
              <BrandLogo
                alt="Mercian Wealth"
                fill
                className="object-cover"
              />
            </div>
            <p className="font-sans text-sm text-slate-300 leading-relaxed max-w-[220px]">
              {data.tagline}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#DAA640]">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="font-sans text-sm text-slate-300 hover:text-[#DAA640] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#DAA640]">
              Contact Us
            </h4>
            <div className="space-y-3 font-sans text-sm text-slate-300">
              <CopyEmailButton email={data.email} variant="footer" />
              <a 
                href={`tel:${data.phone.replace(/\s+/g, '')}`} 
                className="flex items-center gap-2 hover:text-[#DAA640] transition-colors min-w-0"
              >
                <Phone size={16} className="text-[#DAA640] shrink-0" />
                <span className="truncate">{data.phone}</span>
              </a>
              {data.whatsappLink && (
                <a 
                  href={data.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 hover:text-[#DAA640] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#DAA640]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              {data.instagramLink && (
                <a 
                  href={data.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#DAA640] transition-colors"
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
                  className="hover:text-[#DAA640] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Column 4: Book a Call Mini-CTA */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#DAA640]">
              Start a Project
            </h4>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              {data.ctaDescription}
            </p>
            <Button 
              asChild
              variant="outline"
              className="px-4 py-2 text-xs border-[#DAA640]/40 text-white hover:bg-[#DAA640] hover:text-[#020E28] transition-all rounded-lg"
            >
              <Link href="/book" className="inline-flex items-center gap-2">
                <span>{data.ctaButtonText}</span>
                <ArrowRight size={12} />
              </Link>
            </Button>
          </div>

        </div>

        {/* UK Compliance & Trust Band */}
        <div className="my-10 py-5 px-4 sm:px-6 rounded-2xl bg-[#07153B]/70 border border-[#DAA640]/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#DAA640]/10 text-[#DAA640] border border-[#DAA640]/30 shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-white block">UK & EU GDPR Compliant Systems</span>
              <span className="text-slate-400 text-[11px]">Strict data residency with zero AI model training on your confidential business data.</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              UK Support Hours: 08:00 - 18:00 GMT
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="text-slate-400">United Kingdom</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#DAA640]/15 text-center md:flex md:justify-between md:items-center text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Mercian Wealth. All Rights Reserved. Engineered in the United Kingdom.
          </p>
          <div className="flex justify-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#DAA640] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#DAA640] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
