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

  if (isHomepage) {
    return (
      <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary scroll-mt-28 lg:scroll-mt-36">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

          {/* Section Header */}
          <div className="text-center mb-10 lg:mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold font-mono">
              [ {SITE_COPY.homepage.modelHint.eyebrow} ]
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4 leading-tight">
              {SITE_COPY.homepage.modelHint.headline}
            </h2>
            <p className="font-sans text-sm sm:text-base text-text-primary opacity-80 max-w-xl mx-auto leading-relaxed">
              {SITE_COPY.homepage.modelHint.description}
            </p>
          </div>

          {/* Billing Switcher Header (3 Tabs) */}
          <div className="flex justify-center mb-12 lg:mb-16 relative z-20">
            <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white/5 p-1.5 rounded-2xl sm:rounded-full border border-white/10 relative">
              <button
                suppressHydrationWarning
                onClick={() => setBillingCycle("oneTime")}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                  billingCycle === "oneTime" ? "text-white font-bold" : "text-white/40 hover:text-white/70"
                }`}
              >
                {billingCycle === "oneTime" && (
                  <motion.div
                    layoutId="homepageBillingBg"
                    className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                One-Time Setup
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                  billingCycle === "monthly" ? "text-white font-bold" : "text-white/40 hover:text-white/70"
                }`}
              >
                {billingCycle === "monthly" && (
                  <motion.div
                    layoutId="homepageBillingBg"
                    className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                Monthly Retainer
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setBillingCycle("revenueShare")}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 cursor-pointer ${
                  billingCycle === "revenueShare" ? "text-white font-bold" : "text-white/40 hover:text-white/70"
                }`}
              >
                {billingCycle === "revenueShare" && (
                  <motion.div
                    layoutId="homepageBillingBg"
                    className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                % Revenue Share
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 items-stretch min-w-0 max-w-full">
            <AnimatePresence>
              {activeTiers.map((tier: any, index: number) => (
                <motion.div
                  key={`homepage-${billingCycle}-${tier.name}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`flex flex-col h-full ${tier.featured ? "lg:scale-105 z-10" : ""} ${index === 2 ? "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto w-full lg:max-w-none" : ""} min-w-0 max-w-full`}
                >
                  <div
                    className={`relative h-full bg-bg-tertiary/40 backdrop-blur-md border rounded-xl transition-all duration-300 flex flex-col justify-between min-w-0 max-w-full overflow-hidden ${
                      tier.featured ? "border-accent-gold shadow-2xl" : "border-white/10"
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
                            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-wider font-mono">
                              {billingCycle === "oneTime" ? "System Build" : "Growth Retainer"}
                            </p>
                          </div>

                          {tier.featured && (
                            <span className="bg-accent-gold text-bg-primary px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full font-mono">
                              Most Popular
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-primary opacity-90 mb-6 min-h-12 leading-relaxed">
                          {tier.description}
                        </p>

                        {/* Price */}
                        <div className="mb-6 border-y border-white/10 py-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-text-primary opacity-80">From</span>
                            <span className="text-4xl font-bold font-serif text-white">
                              £{tier.price}
                            </span>
                          </div>
                          <span className="text-[10px] text-accent-gold uppercase tracking-wider font-semibold block mt-1 font-mono">
                            {tier.interval}
                          </span>
                          {billingCycle === "oneTime" && (tier as any).milestoneBreakdown && (
                            <div className="mt-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-white/85 leading-relaxed flex items-center gap-2">
                              <span className="text-accent-gold font-bold font-sans text-xs shrink-0">％</span>
                              <span>{(tier as any).milestoneBreakdown}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                          {tier.features.map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="text-accent-gold text-sm shrink-0 mt-0.5">✦</span>
                              <span className="text-xs text-text-primary opacity-95 leading-normal font-medium">
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
                        variant={tier.featured ? "default" : "outline"}
                        className="w-full py-5 text-xs font-semibold"
                      >
                        <Link href="/book">
                          <span>Book your free 15 minute audit</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Single Subtle Trust / Link Line */}
          <div className="pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-text-secondary">
            <span className="font-mono text-[11px] text-accent-gold">
              ✦ Target bandwidth savings estimated per pipeline automation
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link
              href="/pricing"
              className="font-mono text-[11px] text-text-primary hover:text-accent-gold transition-colors underline underline-offset-4"
            >
              Calculate Projected Bandwidth ROI on Dedicated Pricing Page →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Full Retainer / Interactive Pricing view (Standalone page)
  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden bg-bg-primary">
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ROI Estimator */}
        <motion.div
          id="roi-calculator"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 glass rounded-xl p-4 sm:p-6 lg:p-10 bg-bg-tertiary/10 border border-white/5 min-w-0 max-w-full overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-accent shrink-0">
              <Calculator size={20} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-accent-gold font-bold">Deficit Diagnostics</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Quantify Your System Deficit</h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center min-w-0 max-w-full">

            {/* Output Panel — appears FIRST on mobile, right column on desktop */}
            <div className="lg:col-span-5 bg-bg-tertiary/40 rounded-xl p-4 sm:p-6 border border-white/5 space-y-4 sm:space-y-6 order-first lg:order-last min-w-0 max-w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                <div className="p-3.5 sm:p-4 bg-bg-primary rounded-lg border border-white/5 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock size={12} className="text-accent shrink-0" />
                    <span className="truncate">Annual Time Reclaimed</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground truncate">
                    <RollingNumber value={annualHoursSaved} suffix=" Hrs" />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-bg-primary rounded-lg border border-white/5 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Zap size={12} className="text-accent shrink-0" />
                    <span className="truncate">Est. Growth Lift (15%)</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground truncate">
                    <RollingNumber value={projectedRevenueGrowth} prefix="£" />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-gradient-to-br from-accent-purple/10 to-transparent rounded-lg border border-accent-purple/20 min-w-0">
                <div className="text-[11px] sm:text-xs text-accent uppercase tracking-wider font-bold mb-1 text-accent-gold break-words">Total Est. Annual Value Unlocked</div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-accent-gold">
                  <RollingNumber value={totalValueUnlocked} prefix="£" />
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed opacity-75 break-words">
                  Interactive projection model based on estimated benchmark averages (£75/hr admin labor value & 15% conversion lift).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 p-3 bg-secondary/40 rounded-lg text-xs min-w-0">
                <span className="text-muted-foreground shrink-0">Recommended Alignment:</span>
                <span className="flex items-center gap-1.5 font-bold text-accent text-accent-gold min-w-0 truncate">
                  <Crown size={12} className="shrink-0" />
                  {recommendedTier} System Tier
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full font-bold shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:shadow-accent-gold/30 py-4 sm:py-5 text-xs sm:text-sm h-auto whitespace-normal"
              >
                <Link href="/book" className="flex items-center justify-center gap-2 text-center py-1">
                  <span className="leading-snug">Book your free 15 minute audit</span>
                  <ArrowRight size={16} className="shrink-0" />
                </Link>
              </Button>
            </div>

            {/* Inputs — appears SECOND on mobile, left column on desktop */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-last lg:order-first min-w-0 max-w-full">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plug in your monthly revenue and weekly manual admin hours. The math is simple: manual operations cost your business £75/hour in lost productivity and leak up to 15% of your potential pipeline conversion. Adjust the sliders to see what is currently slipping through the cracks.
              </p>

              {/* Revenue Input */}
              <div className="space-y-3 min-w-0">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Current Monthly Revenue</span>
                  <span className="text-accent font-bold font-serif text-base text-accent-gold">
                    £{revenue.toLocaleString()}
                  </span>
                </div>

                {/* Mobile Stepper */}
                <div className="flex md:hidden items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 min-w-0 w-full">
                  <button
                    onClick={() => setRevenue(Math.max(5000, revenue - 5000))}
                    aria-label="Decrease revenue"
                    className="w-11 h-11 shrink-0 flex items-center justify-center text-xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-bold font-serif text-lg sm:text-xl text-white tracking-tight text-center flex-1 min-w-0 truncate px-1">
                    £{revenue.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setRevenue(Math.min(100000, revenue + 5000))}
                    aria-label="Increase revenue"
                    className="w-11 h-11 shrink-0 flex items-center justify-center text-xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Desktop Slider */}
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="hidden md:block w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, var(--color-accent-purple) 0%, var(--color-accent-purple) ${((revenue - 5000) / 95000) * 100}%, var(--color-bg-primary) ${((revenue - 5000) / 95000) * 100}%, var(--color-bg-primary) 100%)`
                  }}
                />
              </div>

              {/* Manual Hours Input */}
              <div className="space-y-3 min-w-0">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Weekly Hours Spent on Manual Admin</span>
                  <span className="text-accent font-bold font-serif text-base text-accent-gold">
                    {manualHours} Hours
                  </span>
                </div>

                {/* Mobile Stepper */}
                <div className="flex md:hidden items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 min-w-0 w-full">
                  <button
                    onClick={() => setManualHours(Math.max(2, manualHours - 1))}
                    aria-label="Decrease hours"
                    className="w-11 h-11 shrink-0 flex items-center justify-center text-xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-bold font-serif text-lg sm:text-xl text-white tracking-tight text-center flex-1 min-w-0 truncate px-1">
                    {manualHours} hrs/wk
                  </span>
                  <button
                    onClick={() => setManualHours(Math.min(40, manualHours + 1))}
                    aria-label="Increase hours"
                    className="w-11 h-11 shrink-0 flex items-center justify-center text-xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Desktop Slider */}
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={manualHours}
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  className="hidden md:block w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, var(--color-accent-purple) 0%, var(--color-accent-purple) ${((manualHours - 2) / 38) * 100}%, var(--color-bg-primary) ${((manualHours - 2) / 38) * 100}%, var(--color-bg-primary) 100%)`
                  }}
                />
              </div>
            </div>

          </div>
        </motion.div>

        {/* Section Header & Subtitle */}
        <div className="text-center mb-16 relative z-10">
          <p className="text-xs uppercase tracking-widest text-accent-gold font-bold mb-3 font-mono">
            [ TRANSPARENT PRICING & PACKAGES ]
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Digital Storefronts & <span className="bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent italic">Automated Growth Engines</span>
          </h2>

          <p className="font-sans text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Choose between One-Time Setup, Flat Monthly Retainer, or Performance % Revenue Share. Transparent pricing with zero hidden fees.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 relative z-10 items-stretch">
          <AnimatePresence mode="wait">
            {activeTiers.map((tier: any, index: number) => {
              const isRecommended = recommendedTier === tier.tag
              return (
                <motion.div
                  key={`${billingCycle}-${tier.name}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col h-full ${index === 2 ? "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto w-full lg:max-w-none" : ""}`}
                >
                  <div
                    className={`relative h-full bg-bg-tertiary border border-border hover:border-accent-gold/45 rounded-xl transition-all duration-300 ${
                      tier.featured ? "border-accent-gold lg:scale-105 z-10 bg-bg-tertiary" : ""
                    }`}
                  >
                    <CardContent className="p-8 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-white mb-1">
                              {tier.name}
                            </h3>
                            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-wider font-mono">
                              System Package
                            </p>
                          </div>
                          
                          {tier.featured && (
                            <span className="bg-accent-gold text-bg-primary px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full font-mono">
                              Most Popular
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-6 min-h-12 leading-relaxed">
                          {tier.description}
                        </p>

                        <div className="mb-8 border-y border-border py-5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base text-muted-foreground">From</span>
                            <span className="text-4xl sm:text-5xl font-bold font-serif text-white tracking-tight">
                              £{tier.price}
                            </span>
                          </div>
                          <span className="text-xs text-accent uppercase tracking-widest font-semibold block mt-1 font-mono">
                            {tier.interval}
                          </span>
                        </div>

                        <div className="space-y-4 mb-10">
                          {tier.features.map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                                <ShieldCheck size={12} className="text-accent-gold" />
                              </div>
                              <span className="text-sm text-[#F0EDE6] opacity-80 font-medium leading-normal">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        asChild
                        size="lg"
                        variant={tier.featured ? "default" : "outline"}
                        className="w-full group font-bold"
                      >
                        <Link href={`/book?tier=${tier.tag}`}>
                          <span>{tier.cta}</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Detailed Comparison Matrix */}
        <div className="mb-20 relative z-10 max-w-6xl mx-auto">
          <div className="text-center">
            <button
              onClick={() => setIsMatrixOpen(!isMatrixOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent-gold/30 bg-accent-purple/30 text-xs font-bold uppercase tracking-wider text-white hover:text-accent-gold hover:border-accent-gold hover:bg-accent-purple/50 transition-all duration-300 shadow-lg"
            >
              <span>{isMatrixOpen ? "Hide Detailed Feature Comparison" : "Compare Features in Detail"}</span>
              <motion.div
                animate={{ rotate: isMatrixOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={14} className="text-accent-gold" />
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
                  {/* Mobile Tab Switcher (< 768px) */}
                  <div className="md:hidden space-y-4">
                    <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 text-xs font-semibold text-center">
                      <button
                        onClick={() => setActiveMobileTier("authoritySuite")}
                        className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                          activeMobileTier === "authoritySuite"
                            ? "bg-accent-purple text-white font-bold shadow-md border border-accent-gold/30"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        Launch Catalyst
                      </button>
                      <button
                        onClick={() => setActiveMobileTier("operationsMachine")}
                        className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                          activeMobileTier === "operationsMachine"
                            ? "bg-accent-purple text-white font-bold shadow-md border border-accent-gold/30"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        System Leverage
                      </button>
                      <button
                        onClick={() => setActiveMobileTier("revenueEngine")}
                        className={`flex-1 py-2.5 px-2 rounded-lg transition-all ${
                          activeMobileTier === "revenueEngine"
                            ? "bg-accent-purple text-white font-bold shadow-md border border-accent-gold/30"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        Enterprise Partner
                      </button>
                    </div>

                    <div className="bg-[#0D0716] border border-white/10 rounded-2xl p-5 space-y-6 shadow-xl">
                      {comparisonCategories.map((cat, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold border-b border-accent-gold/20 pb-2 flex items-center justify-between">
                            <span>{cat.category}</span>
                            <span className="text-[10px] text-white/40 font-normal">
                              {activeMobileTier === "authoritySuite" ? "Launch Catalyst" : activeMobileTier === "operationsMachine" ? "System Leverage" : "Enterprise Partner"}
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {cat.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs p-3 rounded-xl bg-white/[0.03] border border-white/5 gap-1.5">
                                <span className="font-medium text-white/90">{item.name}</span>
                                <span className="text-accent-gold font-semibold leading-relaxed">
                                  {item[activeMobileTier]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Comparison Table (>= 768px) */}
                  <div className="hidden md:block bg-[#0D0716] border border-white/10 rounded-2xl p-6 overflow-x-auto shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-4 px-5 text-xs uppercase tracking-widest text-accent-gold font-bold w-1/3 sticky left-0 bg-[#0D0716] z-20 border-r border-white/10">Feature Category</th>
                          <th className="py-4 px-4 text-xs uppercase tracking-widest text-white/80 font-bold text-center w-1/6">Launch Catalyst</th>
                          <th className="py-4 px-4 text-xs uppercase tracking-widest text-accent-gold font-bold text-center w-1/6 bg-accent-purple/10 border-x border-accent-gold/20">System Leverage</th>
                          <th className="py-4 px-4 text-xs uppercase tracking-widest text-white/80 font-bold text-center w-1/6">Enterprise Partner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonCategories.map((cat, idx) => (
                          <React.Fragment key={idx}>
                            <tr className="bg-white/[0.02]">
                              <td colSpan={4} className="py-3.5 px-5 text-xs font-mono font-bold uppercase text-accent-gold tracking-widest sticky left-0 bg-[#0D0716] z-10 border-r border-white/10">
                                {cat.category}
                              </td>
                            </tr>
                            {cat.items.map((item, itemIdx) => (
                              <tr key={itemIdx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-5 text-sm font-medium text-white sticky left-0 bg-[#0D0716] z-10 border-r border-white/10">{item.name}</td>
                                <td className="py-4 px-4 text-xs text-white/70 text-center leading-relaxed">{item.authoritySuite}</td>
                                <td className="py-4 px-4 text-xs text-accent-gold font-semibold text-center leading-relaxed bg-accent-purple/10 border-x border-accent-gold/20">{item.operationsMachine}</td>
                                <td className="py-4 px-4 text-xs text-white/70 text-center leading-relaxed">{item.revenueEngine}</td>
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

        <p className="text-center text-sm text-muted-foreground relative z-10">
          Looking for a custom enterprise integration?{' '}
          <Link
            href="/book?tier=Revenue%20Engine"
            className="text-accent-gold hover:underline font-semibold"
          >
            Start the conversation.
          </Link>
        </p>
      </div>
    </section>
  )
}
