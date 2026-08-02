"use client"

import { motion } from "framer-motion"
import { Smartphone, ShoppingBag, BellRing, Star, MapPin, ShieldCheck } from "lucide-react"

const deliverables = [
  {
    icon: Smartphone,
    title: "1. Ultra-Fast Mobile Storefront",
    outcome: "Sub-1-Second Mobile Speed",
    description: "A gorgeous, high-converting digital storefront showcasing your artisan products, menu, location, and opening hours. Loads instantly on any smartphone.",
    highlights: ["Custom photo gallery", "One-tap direction & calling", "100% mobile-optimized"],
  },
  {
    icon: ShoppingBag,
    title: "2. Cake & Catering Order Builder",
    outcome: "50% Upfront Deposit Capture",
    description: "Customers build their custom order online (flavor, size, diet, pickup date & time) and pay a deposit instantly via Stripe. Zero manual copy-pasting required.",
    highlights: ["Custom deposit collection", "Automated pickup scheduling", "Instant email receipts"],
  },
  {
    icon: BellRing,
    title: "3. Instant WhatsApp Phone Alerts",
    outcome: "Sub-2-Second Order Delivery",
    description: "The moment a customer places an order online, your phone dings with a WhatsApp summary card showing customer name, cake specs, pickup date, and deposit paid.",
    highlights: ["Direct to owner's WhatsApp", "Formatted order summary", "Zero missed instructions"],
  },
  {
    icon: Star,
    title: "4. Automated 5-Star Review Engine",
    outcome: "Stack 20+ Google Reviews Monthly",
    description: "24 hours after an order is picked up, an automated SMS or Email friendly check-in prompts the customer to leave a 5-star Google Maps review with one tap.",
    highlights: ["Ranks top 3 on Google Local", "Automated review link", "Permanent SEO asset"],
  },
]

export function LocalDeliverables() {
  return (
    <section className="py-16 sm:py-24 bg-[#07050B] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} />
            <span>Complete Local Growth System</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            What Changes For Your Business On Day One
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            No developer jargon. Just 4 practical systems working 24/7/365 to bring you customers and save you time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deliverables.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-8 rounded-2xl bg-bg-secondary/60 border border-accent-gold/20 hover:border-accent-gold/60 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-accent-gold/10 text-accent-gold border border-accent-gold/30 group-hover:scale-105 transition-transform duration-200">
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.outcome}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-accent-gold transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/80 font-medium">
                      <span className="text-accent-gold font-bold">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
