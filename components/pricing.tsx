"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Crown, Calculator, ChevronDown, Clock, Zap, ShieldCheck, ArrowRight, Sparkles, Check } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { PricingTier } from "@/lib/pricing"
import { SITE_COPY } from "@/lib/site-copy"
import { LOCAL_PRICING_TIERS } from "@/components/local/local-pricing"

// Helper component to smoothly animate output values when dragging sliders
function RollingNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let start = displayValue
    const end = value
    if (start === end) return

    const range = end - start
    const duration = 250 // Fast 250ms roll animation for slider changes
    const stepTime = 15
    const steps = Math.ceil(duration / stepTime)
    const increment = range / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      start += increment
      if (currentStep >= steps) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.round(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

const setupTiers = SITE_COPY.pricingPage.setupTiers
const retainerTiers = SITE_COPY.pricingPage.retainerTiers

const comparisonCategories = [
  {
    category: "Core Design & Strategy",
    items: [
      { name: "Custom Design", authoritySuite: "Bespoke Next.js Art-Direction", operationsMachine: "Bespoke Art-Direction + Custom UI", revenueEngine: "Elite Art-Direction + Product Branding" },
      { name: "Page Limit", authoritySuite: "Up to 5 Custom Pages", operationsMachine: "Up to 10 Custom Pages", revenueEngine: "Unlimited Custom Pages" },
      { name: "Custom Copywriting", authoritySuite: "Conversion-Focused Copywriting", operationsMachine: "Persuasive Copywriting & Micro-copy", revenueEngine: "Complete Authority Brand Copywriting" },
      { name: "Mobile Optimisation", authoritySuite: "✓ Full (95+ Mobile PageSpeed)", operationsMachine: "✓ Full + Dynamic Web App UI", revenueEngine: "✓ Elite Fluid Design" },
    ]
  },
  {
    category: "AI & Smart Systems",
    items: [
      { name: "AI Chat Concierge", authoritySuite: "—", operationsMachine: "—", revenueEngine: "✓ Custom-Trained AI Agent Concierge" },
      { name: "CRM Integration", authoritySuite: "Calendly intake routing", operationsMachine: "✓ Autonomic Lead & CRM Automations", revenueEngine: "✓ Enterprise Custom Pipeline Automations" },
      { name: "Calendar & Booking Sync", authoritySuite: "✓ Calendly integration", operationsMachine: "✓ Automated intake routing & syncing", revenueEngine: "✓ VIP scheduling with custom routing" },
      { name: "Client & Admin Portals", authoritySuite: "—", operationsMachine: "✓ Secure Client & Admin Dashboards", revenueEngine: "✓ White-labeled multi-portal dashboards" },
      { name: "Custom Automation Workflows", authoritySuite: "—", operationsMachine: "✓ Automated Billing & Invoices (Stripe)", revenueEngine: "✓ Custom CRM + Outbound Cold Outreach" },
    ]
  },
  {
    category: "SEO & Growth",
    items: [
      { name: "SEO Optimisation", authoritySuite: "Core SEO Blueprint & Schema Setup", operationsMachine: "Advanced Strategy, Local & Global Schema", revenueEngine: "Comprehensive Search Engine Dominance Plan" },
      { name: "Speed & Performance", authoritySuite: "95+ Guaranteed", operationsMachine: "95+ Guaranteed + Caching System", revenueEngine: "98+ Max Speed Guarantee" },
      { name: "Brand Identity Suite", authoritySuite: "Logo placement & layout palette", operationsMachine: "Cohesive brand UI kit", revenueEngine: "✓ Full Identity Suite (Logos, Slide Decks)" },
    ]
  },
  {
    category: "Support & Iterations",
    items: [
      { name: "Post-Launch Support", authoritySuite: "30 Days Support", operationsMachine: "90 Days Support", revenueEngine: "90 Days + Dedicated Support Channel" },
      { name: "Revision Policy", authoritySuite: "3 Rounds (Design Phase)", operationsMachine: "Unlimited (Prior to Build)", revenueEngine: "Bespoke Ongoing Adjustments" },
      { name: "Turnaround / Support Channel", authoritySuite: "Email Support (24h)", operationsMachine: "Dedicated Portal Support (24h)", revenueEngine: "Priority VIP Developer Slack (4h response)" },
    ]
  }
]

interface PricingProps {
  isHomepage?: boolean
  /** Optional: live tiers fetched server-side from Supabase. Falls back to hardcoded arrays if omitted. */
  setupTiers?: PricingTier[]
  retainerTiers?: PricingTier[]
}

export function Pricing({ isHomepage = false, setupTiers: propSetupTiers, retainerTiers: propRetainerTiers }: PricingProps) {
  const searchParams = useSearchParams()
  const [billingCycle, setBillingCycle] = useState<"oneTime" | "monthly" | "revenueShare">("oneTime")
  const [activeAudience, setActiveAudience] = useState<"enterprise" | "local">("enterprise")
  const [revenue, setRevenue] = useState(25000)
  const [manualHours, setManualHours] = useState(15)
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)
  const [activeMobileTier, setActiveMobileTier] = useState<"authoritySuite" | "operationsMachine" | "revenueEngine">("operationsMachine")

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const param = searchParams?.get("audience")
        const referrer = document.referrer || ""
        const sessionVal = sessionStorage.getItem("mercian_audience")

        if (param === "local" || referrer.includes("/local") || sessionVal === "local") {
          setActiveAudience("local")
          sessionStorage.removeItem("mercian_audience")
        } else if (param === "enterprise") {
          setActiveAudience("enterprise")
        }
      }
    } catch {}
  }, [searchParams])

  const handleAudienceChange = (audience: "enterprise" | "local") => {
    setActiveAudience(audience)
    try {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.set("audience", audience)
        window.history.replaceState({}, "", url.toString())
      }
    } catch {}
  }

  const oneTimeTiers = (SITE_COPY.pricingPage as any).oneTimeTiers || []
  const monthlyTiers = (SITE_COPY.pricingPage as any).monthlyTiers || []
  const revenueShareTiers = (SITE_COPY.pricingPage as any).revenueShareTiers || []

  const activeTiers = 
    billingCycle === "oneTime"
      ? (propSetupTiers && propSetupTiers.length > 0 ? propSetupTiers : oneTimeTiers)
      : billingCycle === "monthly"
      ? (propRetainerTiers && propRetainerTiers.length > 0 ? propRetainerTiers : monthlyTiers)
      : revenueShareTiers

  // Calculators
  const annualHoursSaved = Math.round(manualHours * 0.75 * 52)
  const timeValue = annualHoursSaved * 75
  const projectedRevenueGrowth = Math.round(revenue * 0.15 * 12)
  const totalValueUnlocked = timeValue + projectedRevenueGrowth

  const recommendedTier = 
    revenue < 15000 
      ? "Launch Catalyst" 
      : revenue >= 15000 && revenue < 50000 
      ? "System Leverage" 
      : "Enterprise Partner"

  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden bg-[#0B0F17]">
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-[#D9A74A]/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-[#D9A74A]/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header (if isHomepage) */}
        {isHomepage && (
          <div className="text-center mb-10 lg:mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A74A] font-mono">
              [ {SITE_COPY.homepage.modelHint.eyebrow} ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4 leading-tight">
              {SITE_COPY.homepage.modelHint.headline}
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              {SITE_COPY.homepage.modelHint.description}
            </p>
          </div>
        )}

        {/* Billing Switcher Header (3 Tabs) */}
        <div className="flex justify-center mb-12 lg:mb-16 relative z-20">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-slate-900/80 p-1 sm:p-1.5 rounded-full border border-slate-800 relative shadow-lg max-w-full min-w-0">
            <button
              suppressHydrationWarning
              onClick={() => setBillingCycle("oneTime")}
              className={`px-3 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                billingCycle === "oneTime" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {billingCycle === "oneTime" && (
                <motion.div
                  layoutId="pricingBillingBg"
                  className="absolute inset-0 rounded-full bg-[#D9A74A] z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              One-Time Setup
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                billingCycle === "monthly" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="pricingBillingBg"
                  className="absolute inset-0 rounded-full bg-[#D9A74A] z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              Monthly Retainer
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setBillingCycle("revenueShare")}
              className={`px-3 sm:px-7 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                billingCycle === "revenueShare" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              {billingCycle === "revenueShare" && (
                <motion.div
                  layoutId="pricingBillingBg"
                  className="absolute inset-0 rounded-full bg-[#D9A74A] z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              % Revenue Share
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (Rendered ONCE) */}
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
                  className={`relative h-full bg-[#1E293B]/70 backdrop-blur-md border rounded-2xl transition-all duration-300 flex flex-col justify-between min-w-0 max-w-full overflow-hidden ${
                    tier.featured ? "border-[#D9A74A] shadow-[0_0_30px_rgba(217,167,74,0.2)]" : "border-slate-800"
                  }`}
                >
                  <CardContent className="p-5 sm:p-6 lg:p-8 flex flex-col h-full justify-between space-y-6 sm:space-y-8 min-w-0 max-w-full">
                    <div>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-white mb-1">
                            {tier.name}
                          </h3>
                          <p className="text-[10px] text-[#D9A74A] font-bold uppercase tracking-wider font-mono">
                            {billingCycle === "oneTime" ? "System Build" : billingCycle === "monthly" ? "Growth Retainer" : "Performance Share"}
                          </p>
                        </div>

                        {tier.featured && (
                          <span className="bg-[#D9A74A] text-slate-950 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full font-mono">
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
                          <span className="text-4xl font-bold font-serif text-white">
                            £{tier.price}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#D9A74A] uppercase tracking-wider font-semibold block mt-1 font-mono">
                          {tier.interval}
                        </span>
                        {(tier as any).milestoneBreakdown && (
                          <div className="mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed flex items-center gap-2 font-mono">
                            <span className="text-[#D9A74A] font-bold shrink-0">⚡</span>
                            <span>{(tier as any).milestoneBreakdown}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        {tier.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="text-[#D9A74A] text-sm shrink-0 mt-0.5">✦</span>
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
                      className={`w-full py-5 text-xs font-semibold mt-6 ${
                        tier.featured
                          ? "bg-[#D9A74A] text-slate-950 hover:bg-[#E5A93C]"
                          : "border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
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
            <span className="font-mono text-[11px] text-[#D9A74A]">
              ✦ Target bandwidth savings estimated per pipeline automation
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link
              href="/pricing"
              className="font-mono text-[11px] text-slate-300 hover:text-[#D9A74A] transition-colors underline underline-offset-4"
            >
              Calculate Projected Bandwidth ROI on Dedicated Pricing Page →
            </Link>
          </div>
        ) : (
          /* Detailed Comparison Matrix for Standalone Page */
          <div className="mt-12 relative z-10 max-w-6xl mx-auto">
            <div className="text-center">
              <button
                onClick={() => setIsMatrixOpen(!isMatrixOpen)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D9A74A]/30 bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-white hover:text-[#D9A74A] hover:border-[#D9A74A] transition-all duration-300 shadow-lg"
              >
                <span>{isMatrixOpen ? "Hide Detailed Feature Comparison" : "Compare Features in Detail"}</span>
                <motion.div
                  animate={{ rotate: isMatrixOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} className="text-[#D9A74A]" />
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
                      <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-center">
                        <button
                          onClick={() => setActiveMobileTier("authoritySuite")}
                          className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                            activeMobileTier === "authoritySuite"
                              ? "bg-[#D9A74A] text-slate-950 font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Essential Storefront
                        </button>
                        <button
                          onClick={() => setActiveMobileTier("operationsMachine")}
                          className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                            activeMobileTier === "operationsMachine"
                              ? "bg-[#D9A74A] text-slate-950 font-bold"
                              : "text-[#D9A74A] font-medium"
                          }`}
                        >
                          Pro Order Builder
                        </button>
                        <button
                          onClick={() => setActiveMobileTier("revenueEngine")}
                          className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                            activeMobileTier === "revenueEngine"
                              ? "bg-[#D9A74A] text-slate-950 font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Autonomic Scale
                        </button>
                      </div>

                      <div className="bg-[#1E293B]/80 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
                        {comparisonCategories.map((cat, idx) => (
                          <div key={idx} className="space-y-3">
                            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A74A] border-b border-slate-700/60 pb-2 flex items-center justify-between">
                              <span>{cat.category}</span>
                            </div>
                            <div className="space-y-2.5">
                              {cat.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800 gap-1.5">
                                  <span className="font-medium text-slate-200">{item.name}</span>
                                  <span className="text-[#D9A74A] font-semibold leading-relaxed">
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
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/70 shadow-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/80 text-white">
                            <th className="p-4 sm:p-5 font-serif text-sm">Feature Comparison</th>
                            <th className="p-4 sm:p-5 font-mono text-[11px] text-slate-300 text-center">Essential Storefront</th>
                            <th className="p-4 sm:p-5 font-mono text-[11px] text-[#D9A74A] text-center bg-[#D9A74A]/10">Pro Order Builder</th>
                            <th className="p-4 sm:p-5 font-mono text-[11px] text-slate-300 text-center">Autonomic Scale</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {comparisonCategories.map((cat, idx) => (
                            <React.Fragment key={idx}>
                              <tr className="bg-slate-900/40">
                                <td colSpan={4} className="p-3 px-5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#D9A74A]">
                                  {cat.category}
                                </td>
                              </tr>
                              {cat.items.map((item, itemIdx) => (
                                <tr key={itemIdx} className="hover:bg-slate-800/40 transition-colors">
                                  <td className="p-4 font-medium text-slate-200">{item.name}</td>
                                  <td className="p-4 text-center">{item.authoritySuite}</td>
                                  <td className="p-4 text-center font-semibold text-[#D9A74A] bg-[#D9A74A]/5">{item.operationsMachine}</td>
                                  <td className="p-4 text-center">{item.revenueEngine}</td>
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
