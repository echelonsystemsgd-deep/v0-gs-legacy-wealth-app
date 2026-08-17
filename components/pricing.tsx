"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { ChevronDown, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import type { PricingTier } from "@/lib/pricing"
import { SITE_COPY } from "@/lib/site-copy"

const comparisonCategories = [
  {
    category: "Core Storefront & Design",
    items: [
      { name: "Custom Mobile Design", essential: "3–5 Page Custom Mobile Storefront", pro: "5–8 Page Custom Order Builder", custom: "Unlimited Multi-Service Storefront" },
      { name: "Sub-1s Mobile PageSpeed", essential: "✓ Guaranteed Sub-1s Load", pro: "✓ Guaranteed Sub-1s + Dynamic UI", custom: "✓ Max Speed + Multi-Location Architecture" },
      { name: "Local Google SEO", essential: "Core Local SEO & Schema Setup", pro: "Advanced Local Schema & Map Pack", custom: "Comprehensive Search Dominance Blueprint" },
      { name: "Conversion Copywriting", essential: "Conversion-Focused Local Copy", pro: "Persuasive Menu & Service Copy", custom: "Complete Bespoke Brand Copywriting" },
    ]
  },
  {
    category: "24/7 Booking & Deposit Engine",
    items: [
      { name: "24/7 Online Order Builder", essential: "✓ 24/7 Mobile Lead Capture Form", pro: "✓ Interactive 3-Tap Order Builder", custom: "✓ Advanced Multi-Service Quote Engine" },
      { name: "Upfront Stripe Deposit Capture", essential: "— (Lead Capture Only)", pro: "✓ 50% Non-Refundable Card & Apple Pay", custom: "✓ Custom Split & Full Deposit Rules" },
      { name: "Calendar Slot Locking", essential: "—", pro: "✓ Automatic Date & Slot Locking", custom: "✓ Multi-Staff & Multi-Location Calendar Sync" },
      { name: "Automated Receipts & Invoices", essential: "Standard Email Notification", pro: "✓ Instant Branded Receipt & Invoice", custom: "✓ Multi-Location Invoicing & Accounting Sync" },
    ]
  },
  {
    category: "Instant Alerts & 5-Star Reviews",
    items: [
      { name: "Instant WhatsApp Phone Alerts", essential: "— (Email Alerts Only)", pro: "✓ Sub-60s WhatsApp & Phone Alerts", custom: "✓ Multi-Staff WhatsApp Lead Dispatch" },
      { name: "Customer Booking Database (CRM)", essential: "Basic Lead Export", pro: "✓ Secure Customer & Booking Database", custom: "✓ Advanced CRM + Automated Retargeting" },
      { name: "Automated 5-Star Google Review Engine", essential: "—", pro: "✓ Smart Post-Job Follow-Up (+Private Filter)", custom: "✓ Multi-Channel Automated Review Engine" },
    ]
  },
  {
    category: "Support & Guarantees",
    items: [
      { name: "Build & Launch Timeline", essential: "7 Business Days", pro: "7 Business Days", custom: "14 Business Days" },
      { name: "Included Post-Launch Support", essential: "30 Days Support", pro: "60 Days Priority Support", custom: "90 Days Dedicated VIP Support" },
      { name: "100% Code Ownership", essential: "✓ Full Ownership (Zero Lock-In)", pro: "✓ Full Ownership (Zero Lock-In)", custom: "✓ Full Ownership (Zero Lock-In)" },
      { name: "Support Response Channel", essential: "Standard Email Support", pro: "Priority Support Desk (<4h)", custom: "Direct Founder Phone Hotline" },
    ]
  }
]

interface PricingProps {
  isHomepage?: boolean
  setupTiers?: PricingTier[]
  retainerTiers?: PricingTier[]
  revenueShareTiers?: PricingTier[]
}

export function Pricing({ isHomepage = false, setupTiers: propSetupTiers, retainerTiers: propRetainerTiers, revenueShareTiers: propRevenueShareTiers }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"oneTime" | "monthly" | "revenueShare">("oneTime")
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)
  const [activeMobileTier, setActiveMobileTier] = useState<"essential" | "pro" | "custom">("pro")

  const oneTimeTiers = (SITE_COPY.pricingPage as any).oneTimeTiers || []
  const monthlyTiers = (SITE_COPY.pricingPage as any).monthlyTiers || []
  const revenueShareTiers = (SITE_COPY.pricingPage as any).revenueShareTiers || []

  const activeTiers = 
    billingCycle === "oneTime"
      ? (propSetupTiers && propSetupTiers.length > 0 ? propSetupTiers : oneTimeTiers)
      : billingCycle === "monthly"
      ? (propRetainerTiers && propRetainerTiers.length > 0 ? propRetainerTiers : monthlyTiers)
      : (propRevenueShareTiers && propRevenueShareTiers.length > 0 ? propRevenueShareTiers : revenueShareTiers)

  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden bg-[#020E28]">
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-[#DAA640]/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-[#DAA640]/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header (if isHomepage) */}
        {isHomepage && (
          <div className="text-center mb-10 lg:mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DAA640] font-mono">
              [ {SITE_COPY.homepage.modelHint.eyebrow} ]
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-4 leading-tight">
              {SITE_COPY.homepage.modelHint.headline}
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              {SITE_COPY.homepage.modelHint.description}
            </p>
          </div>
        )}

        {/* Billing Switcher Header (3 Tabs) */}
        <div className="flex justify-center mb-12 lg:mb-16 relative z-20">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-[#07153B] p-1 sm:p-1.5 rounded-full border border-[#DAA640]/25 relative shadow-lg max-w-full min-w-0">
            <button
              suppressHydrationWarning
              onClick={() => setBillingCycle("oneTime")}
              className={`px-3 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                billingCycle === "oneTime" ? "text-[#020E28] font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              {billingCycle === "oneTime" && (
                <motion.div
                  layoutId="pricingBillingBg"
                  className="absolute inset-0 rounded-full bg-[#DAA640] z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              One-Time Setup
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                billingCycle === "monthly" ? "text-[#020E28] font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="pricingBillingBg"
                  className="absolute inset-0 rounded-full bg-[#DAA640] z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              Monthly Retainer
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setBillingCycle("revenueShare")}
              className={`px-3 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                billingCycle === "revenueShare" ? "text-[#020E28] font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              {billingCycle === "revenueShare" && (
                <motion.div
                  layoutId="pricingBillingBg"
                  className="absolute inset-0 rounded-full bg-[#DAA640] z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              % Revenue Share
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch min-w-0 max-w-full">
          <AnimatePresence mode="wait">
            {activeTiers.map((tier: any, index: number) => (
              <motion.div
                key={`${billingCycle}-${tier.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`flex flex-col h-full ${tier.featured ? "lg:scale-105 z-10" : ""} ${index === 2 ? "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto w-full lg:max-w-none" : ""} min-w-0 max-w-full`}
              >
                <div
                  className={`relative h-full bg-[#07153B] backdrop-blur-md border rounded-2xl transition-all duration-300 flex flex-col justify-between min-w-0 max-w-full overflow-hidden ${
                    tier.featured ? "border-[#DAA640] shadow-[0_0_30px_rgba(218,166,64,0.2)]" : "border-slate-800"
                  }`}
                >
                  <CardContent className="p-5 sm:p-6 lg:p-8 flex flex-col h-full justify-between space-y-6 sm:space-y-8 min-w-0 max-w-full">
                    <div>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mb-1">
                            {tier.name}
                          </h3>
                          <p className="text-[10px] text-[#DAA640] font-bold uppercase tracking-wider font-mono">
                            {billingCycle === "oneTime" ? "System Build" : billingCycle === "monthly" ? "Growth Retainer" : "Performance Share"}
                          </p>
                        </div>

                        {tier.featured && (
                          <span className="bg-[#DAA640] text-[#020E28] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full font-mono">
                            Most Popular
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-300 mb-6 min-h-12 leading-relaxed font-sans">
                        {tier.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6 border-y border-slate-700/60 py-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-slate-400">From</span>
                          <span className="text-3xl sm:text-4xl font-bold font-sans text-white">
                            £{tier.price}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#DAA640] uppercase tracking-wider font-semibold block mt-1 font-mono">
                          {tier.interval}
                        </span>
                        {(tier as any).milestoneBreakdown && (
                          <div className="mt-2.5 p-2 rounded-lg bg-[#020E28] border border-slate-800 text-[11px] text-slate-300 leading-relaxed flex items-center gap-2 font-mono">
                            <span className="text-[#DAA640] font-bold shrink-0">⚡</span>
                            <span>{(tier as any).milestoneBreakdown}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        {tier.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="text-[#DAA640] text-sm shrink-0 mt-0.5 font-bold">✦</span>
                            <span className="text-xs text-slate-200 leading-normal font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      size="lg"
                      className={`w-full py-5 text-xs font-bold mt-6 rounded-xl transition-all ${
                        tier.featured
                          ? "bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] text-[#020E28] hover:from-[#EBB755] hover:to-[#DAA640]"
                          : "border border-[#DAA640]/30 bg-[#020E28] text-white hover:bg-[#DAA640] hover:text-[#020E28]"
                      }`}
                    >
                      <Link href="/book">
                        <span>Book Your Free 15-Minute Audit</span>
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Homepage subtle link or Standalone Detailed Matrix */}
        {isHomepage ? (
          <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-[#DAA640]">
              ✦ 100% Code Ownership & Zero Recurring Lock-In Contracts
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link
              href="/pricing"
              className="font-mono text-[11px] text-slate-300 hover:text-[#DAA640] transition-colors underline underline-offset-4"
            >
              View Full Feature-by-Feature Comparison Matrix →
            </Link>
          </div>
        ) : (
          /* Detailed Comparison Matrix for Standalone Page */
          <div className="mt-12 relative z-10 max-w-6xl mx-auto">
            <div className="text-center">
              <button
                onClick={() => setIsMatrixOpen(!isMatrixOpen)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#DAA640]/30 bg-[#07153B] text-xs font-bold uppercase tracking-wider text-white hover:text-[#DAA640] hover:border-[#DAA640] transition-all duration-300 shadow-lg cursor-pointer"
              >
                <span>{isMatrixOpen ? "Hide Detailed Feature Comparison" : "Compare Features in Detail"}</span>
                <motion.div
                  animate={{ rotate: isMatrixOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} className="text-[#DAA640]" />
                </motion.div>
              </button>
            </div>

            <AnimatePresence>
              {isMatrixOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-8"
                >
                  <div className="relative group">
                    {/* Mobile Tab Switcher */}
                    <div className="md:hidden space-y-4">
                      <div className="flex bg-[#07153B] p-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-center">
                        <button
                          onClick={() => setActiveMobileTier("essential")}
                          className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                            activeMobileTier === "essential"
                              ? "bg-[#DAA640] text-[#020E28] font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Essential
                        </button>
                        <button
                          onClick={() => setActiveMobileTier("pro")}
                          className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                            activeMobileTier === "pro"
                              ? "bg-[#DAA640] text-[#020E28] font-bold"
                              : "text-[#DAA640] font-medium"
                          }`}
                        >
                          Pro Builder
                        </button>
                        <button
                          onClick={() => setActiveMobileTier("custom")}
                          className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                            activeMobileTier === "custom"
                              ? "bg-[#DAA640] text-[#020E28] font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Full Custom
                        </button>
                      </div>

                      <div className="bg-[#07153B] border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
                        {comparisonCategories.map((cat, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#DAA640] border-b border-slate-700/60 pb-2 flex items-center justify-between">
                              <span>{cat.category}</span>
                            </div>
                            <div className="space-y-2.5">
                              {cat.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs p-3 rounded-xl bg-[#020E28] border border-slate-800 gap-1.5">
                                  <span className="font-medium text-slate-200">{item.name}</span>
                                  <span className="text-[#DAA640] font-semibold leading-relaxed">
                                    {item[activeMobileTier]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Matrix Table */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#DAA640]/25 bg-[#07153B] shadow-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-[#020E28] text-white">
                            <th className="p-4 sm:p-5 font-sans font-bold text-sm">Feature Comparison</th>
                            <th className="p-4 sm:p-5 font-mono text-[11px] text-slate-300 text-center">Essential Storefront (£495)</th>
                            <th className="p-4 sm:p-5 font-mono text-[11px] text-[#DAA640] text-center bg-[#DAA640]/10 font-bold">Pro Order Builder (£895)</th>
                            <th className="p-4 sm:p-5 font-mono text-[11px] text-slate-300 text-center">Full Custom Build (£1,495)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-slate-300">
                          {comparisonCategories.map((cat, idx) => (
                            <React.Fragment key={idx}>
                              <tr className="bg-[#020E28]/60">
                                <td colSpan={4} className="p-3 px-5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#DAA640]">
                                  {cat.category}
                                </td>
                              </tr>
                              {cat.items.map((item, itemIdx) => (
                                <tr key={itemIdx} className="hover:bg-slate-800/40 transition-colors">
                                  <td className="p-4 font-medium text-slate-200">{item.name}</td>
                                  <td className="p-4 text-center">{item.essential}</td>
                                  <td className="p-4 text-center font-semibold text-[#DAA640] bg-[#DAA640]/5">{item.pro}</td>
                                  <td className="p-4 text-center">{item.custom}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}

