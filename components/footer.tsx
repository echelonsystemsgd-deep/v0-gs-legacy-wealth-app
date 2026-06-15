"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { SocialMediaLinks } from "@/components/social-media-links"

const navigation = {
  services: [
    { name: "AI Websites", href: "/services" },
    { name: "Landing Pages", href: "/services" },
    { name: "Lead Generation", href: "/services" },
    { name: "Automation", href: "/services" },
  ],
  company: [
    { name: "About", href: "/" },
    { name: "Process", href: "/process" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Testimonials", href: "/testimonials" },
  ],
  resources: [
    { name: "FAQ", href: "/#faq" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-gold/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="flex flex-col items-center mb-16 text-center">
            <Link href="/" className="flex flex-col items-center gap-4 mb-6">
              <div className="relative h-20 w-40 sm:h-32 sm:w-64 md:h-40 md:w-80 transition-all hover:scale-105 duration-300 opacity-50 grayscale hover:grayscale-0 hover:opacity-100">
                <Image 
                  src="/GS_Legacy_Wealth-removebg-preview.png" 
                  alt="GS Legacy Wealth" 
                  fill
                  sizes="(max-width: 640px) 160px, 320px"
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center md:text-left">
            {/* Brand/Socials Column */}
            <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs text-center md:text-left">
                We engineer digital assets that create authority, automate growth, and generate revenue.
              </p>
              <SocialMediaLinks />
            </div>

            {/* Services */}
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gold/10 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GS Legacy Wealth AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </footer>
  )
}
