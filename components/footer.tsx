"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Linkedin, Twitter } from "lucide-react"

const navigation = {
  services: [
    { name: "AI Websites", href: "#services" },
    { name: "Landing Pages", href: "#services" },
    { name: "Lead Generation", href: "#services" },
    { name: "Automation", href: "#services" },
  ],
  company: [
    { name: "About", href: "#home" },
    { name: "Process", href: "#process" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
  ],
  resources: [
    { name: "FAQ", href: "#faq" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ],
}

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
]

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-gold/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="#home" className="flex items-center gap-3 mb-6">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-light opacity-20 blur-lg" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-background">
                    <span className="font-serif text-lg font-bold text-gradient-gold">GS</span>
                  </div>
                </div>
                <div>
                  <span className="font-serif text-lg font-semibold text-foreground">Legacy Wealth</span>
                  <span className="ml-1 text-sm text-gold">AI</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                We engineer digital assets that create authority, automate growth, and generate revenue.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon size={18} />
                  </Link>
                ))}
              </div>
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
          className="border-t border-gold/10 py-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GS Legacy Wealth AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">
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
