"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Star, ShieldCheck, ArrowRight } from "lucide-react"

export const LOCAL_PRICING_TIERS = [
  {
    name: "Local Storefront",
    tagline: "Essential Digital Presence",
    setupPrice: "495",
    retainerPrice: "99",
    description: "A fast 3-page mobile website, Google Maps optimization, and automated review collection system.",
    featured: false,
    badge: null,
    features: [
      "Custom Fast 3-Page Website",
      "Google Business Profile Setup",
      "Automated Google Review Engine",
      "Click-to-Call & Location Maps",
      "Discreet \"Built by Mercian Wealth\" Seal",
      "Hosting & Maintenance Included",
    ],
    ctaText: "Select Local Storefront",
  },
  {
    name: "Catering & Order Engine",
    tagline: "Complete Storefront & Automation",
    setupPrice: "895",
    retainerPrice: "195",
    description: "Your complete online cake/catering order builder, Stripe deposits, and instant WhatsApp alerts.",
    featured: true,
    badge: "MOST POPULAR FOR BAKERIES",
    features: [
      "Everything in Local Storefront",
      "Custom Cake & Catering Order Builder",
      "Integrated Stripe Deposit Payments",
      "Instant WhatsApp & SMS Phone Alerts",
      "Automated Pickup Date Scheduler",
      "Complimentary White-Labeling Option",
      "Priority 24h Edits SLA",
    ],
    ctaText: "Get Order Engine",
  },
  {
    name: "Full Local Domination",
    tagline: "Storefront + Monthly Content & Ads",
    setupPrice: "1,495",
    retainerPrice: "395",
    description: "Everything in Catering Engine plus monthly photo asset days, social media scheduling, and Google Ads.",
    featured: false,
    badge: null,
    features: [
      "Everything in Catering Engine",
      "Monthly On-Site Photo/Video Asset Shoot",
      "12 Branded Social Content Posts/mo",
      "Google Local Ads Campaign Setup",
      "100% White-Labeled Infrastructure",
      "Dedicated Account Manager",
    ],
    ctaText: "Select Full Domination",
  },
]

export function LocalPricing() {
  return (
    <section id="pricing-local" className="py-16 sm:py-24 bg-[#07050B] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} />
            <span>Transparent Local Business Investment</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Accessible Pricing. Zero Surprises.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            One-time setup fee for your custom digital build + accessible monthly retainer for hosting, security, and updates.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {LOCAL_PRICING_TIERS.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                tier.featured
                  ? "bg-gradient-to-b from-accent-gold/15 via-bg-secondary to-bg-secondary border-2 border-accent-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] lg:-translate-y-2"
                  : "bg-bg-secondary/60 border border-accent-gold/20 hover:border-accent-gold/40"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-gold text-black text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-xs text-accent-gold font-mono uppercase tracking-wider">{tier.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-white">£{tier.setupPrice}</span>
                    <span className="text-xs text-text-secondary">one-time setup</span>
                  </div>
                  <div className="mt-2 text-xs text-accent-gold font-mono font-semibold">
                    + £{tier.retainerPrice}/month retainer
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 font-sans">
                  {tier.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-white/90">
                      <div className="p-0.5 rounded-full bg-accent-gold/20 text-accent-gold shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link
                href={`#contact-local?tier=${encodeURIComponent(tier.name)}`}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tier.featured
                    ? "bg-accent-gold text-black hover:bg-amber-300 shadow-lg"
                    : "bg-white/5 border border-accent-gold/30 text-white hover:bg-accent-gold/10 hover:border-accent-gold"
                }`}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center text-xs text-text-secondary font-mono">
          All local packages include dedicated hosting, SSL encryption, and direct phone/WhatsApp support.
        </div>
      </div>
    </section>
  )
}
