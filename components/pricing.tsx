"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Crown, Calculator, ChevronDown, Clock, Zap, ShieldCheck } from "lucide-react"
import Link from "next/link"
import type { PricingTier } from "@/lib/pricing"
import { useAuditModal } from "@/components/audit-modal-context"

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

const setupTiers = [
  {
    name: "Authority Suite",
    price: "2,750",
    interval: "£687.50 deposit to initiate",
    milestoneBreakdown: "4 milestone stages of 25% (£687.50) linked to build progress",
    description: "A luxury digital front-office that projects absolute authority. Engineered without templates to secure and convert elite clients.",
    features: [
      "Bespoke Next.js Authority Platform (5 Pages)",
      "Calendly Scheduling Integration",
      "Stripe Payment Gateway Integration",
      "Core SEO Blueprint & Schema Setup",
      "Supercharged Speed Profile (95+ Mobile)",
      "30 Days Dedicated Post-Launch Support",
    ],
    cta: "Request Alignment",
    featured: false,
    tag: "Authority Suite"
  },
  {
    name: "Operations Machine",
    price: "5,500",
    interval: "£1,375 deposit to initiate",
    milestoneBreakdown: "4 milestone stages of 25% (£1,375) linked to build progress",
    description: "Your complete digital systems layer. We replace manual administrative overhead with custom software leverage so your business runs on autopilot.",
    features: [
      "Everything in Authority Suite (up to 10 Pages)",
      "Custom Backend Admin Dashboard",
      "Custom Secure Client Portal Integration",
      "Autonomic Lead & CRM Automations",
      "Automated Stripe Billing & Invoices",
      "90 Days Dedicated Post-Launch Support",
    ],
    cta: "Initiate Audit",
    featured: true,
    tag: "Operations Machine"
  },
  {
    name: "Revenue Engine",
    price: "9,800",
    interval: "£2,450 deposit to initiate",
    milestoneBreakdown: "4 milestone stages of 25% (£2,450) linked to build progress",
    description: "The ultimate growth and automation infrastructure. We build a high-performance brand platform, launch your automated cold email prospecting system, and engineer your AI lead triage.",
    features: [
      "Everything in Operations Machine (Unlimited Pages)",
      "Bespoke Cold Email Outreach System",
      "Custom-Trained AI Agent Concierge",
      "Full Brand Identity Suite (Logos, Guidelines)",
      "Priority VIP Developer Slack Support",
      "Weekly Growth & Scaling Roadmaps",
    ],
    cta: "Initiate Audit",
    featured: false,
    tag: "Revenue Engine"
  },
]

const retainerTiers = [
  {
    name: "Pilot Support",
    price: "499",
    interval: "billed monthly",
    description: "Continuous hosting, top-tier performance audits, and priority developer hours.",
    features: [
      "Premium Dedicated Ultra-Fast CDN Hosting",
      "Weekly Security & Speed Audits",
      "3 Hours Design & Copywriting Updates/mo",
      "Monthly Traffic & SEO Analytics Report",
      "24/7 Critical System Monitoring",
      "Same-Day Urgent Edits Turnaround",
    ],
    cta: "Request Alignment",
    featured: false,
    tag: "Authority Suite"
  },
  {
    name: "Co-Pilot Growth",
    price: "1,290",
    interval: "billed monthly",
    description: "Custom scaling campaigns, search engine dominance, and continuous autonomic AI system tuning.",
    features: [
      "Everything in Pilot Support",
      "Continuous AI Agent Re-training & Updates",
      "1 Custom High-Converting Landing Page/mo",
      "Advanced SEO Content & Competitor Strategy",
      "Weekly Lead Funnel Optimisation",
      "10 Dedicated Developer/Designer Hours/mo",
    ],
    cta: "Initiate Audit",
    featured: true,
    tag: "Operations Machine"
  },
  {
    name: "Enterprise Autonomic Partner",
    price: "2,850",
    interval: "billed monthly",
    description: "Your complete external fractional Chief Technology & Marketing Team.",
    features: [
      "Everything in Co-Pilot Growth",
      "Weekly High-Level Growth Consulting Call",
      "Unlimited Minor System & UI Adjustments",
      "New AI Workflow Builds & Automations",
      "Bespoke Cold Email/Marketing System setups",
      "Direct Slack Hotline to Core Founders",
    ],
    cta: "Initiate Audit",
    featured: false,
    tag: "Revenue Engine"
  },
]

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
  const { openModal } = useAuditModal()
  const [billingCycle, setBillingCycle] = useState<"setup" | "retainer">("setup")
  const [revenue, setRevenue] = useState(25000)
  const [manualHours, setManualHours] = useState(15)
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)

  // Use props from server fetch when available; fall back to hardcoded module-level arrays
  const resolvedSetupTiers = propSetupTiers && propSetupTiers.length > 0 ? propSetupTiers : setupTiers
  const resolvedRetainerTiers = propRetainerTiers && propRetainerTiers.length > 0 ? propRetainerTiers : retainerTiers
  const activeTiers = billingCycle === "setup" ? resolvedSetupTiers : resolvedRetainerTiers

  // Calculators
  const annualHoursSaved = Math.round(manualHours * 0.75 * 52)
  const timeValue = annualHoursSaved * 75
  const projectedRevenueGrowth = Math.round(revenue * 0.15 * 12)
  const totalValueUnlocked = timeValue + projectedRevenueGrowth

  const recommendedTier = 
    revenue < 15000 
      ? "Authority Suite" 
      : revenue >= 15000 && revenue < 50000 
      ? "Operations Machine" 
      : "Revenue Engine"

  if (isHomepage) {
    return (
      <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
              Investment
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
              Bespoke Systems Architecture. Automated Pipeline Leverage.
            </h2>
            <p className="font-sans text-sm text-text-primary opacity-80 mt-4 max-w-xl mx-auto leading-relaxed">
              We don't build websites. We build automated client acquisition machines designed to return their implementation cost through direct throughput. If a system cannot demonstrate clear leverage, we will not build it.
            </p>
          </div>

          {/* ROI Estimator */}
          <motion.div
            id="roi-calculator"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 glass rounded-xl p-6 sm:p-10 bg-bg-tertiary/10 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-accent">
                <Calculator size={20} className="text-accent-gold animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-widest text-accent-gold font-bold block">Deficit Diagnostics</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Quantify Your System Deficit</h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center text-left">

              {/* Output Panel — appears FIRST on mobile, right column on desktop */}
              <div className="lg:col-span-5 bg-bg-tertiary/40 rounded-xl p-6 border border-white/5 space-y-6 order-first lg:order-last">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-primary rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock size={12} className="text-accent-gold" />
                      <span>Annual Time Reclaimed</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-serif text-white">
                      <RollingNumber value={annualHoursSaved} suffix=" Hrs" />
                    </div>
                  </div>

                  <div className="p-4 bg-bg-primary rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Zap size={12} className="text-accent-gold" />
                      <span>Est. Growth Lift (15%)</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-serif text-white">
                      <RollingNumber value={projectedRevenueGrowth} prefix="£" />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-accent-purple/10 to-transparent rounded-lg border border-accent-purple/20">
                  <div className="text-xs text-accent uppercase tracking-wider font-bold mb-1 text-accent-gold">Total Est. Annual Value Unlocked</div>
                  <div className="text-3xl font-bold font-serif text-accent-gold">
                    <RollingNumber value={totalValueUnlocked} prefix="£" />
                  </div>
                  <p className="text-xxs text-muted-foreground mt-2 leading-tight">
                    Value computed by applying 15% website conversion lift and valuation of manual hours saved at £75/hr.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg text-xs">
                  <span className="text-muted-foreground">Recommended Alignment:</span>
                  <span className="flex items-center gap-1.5 font-bold text-accent text-accent-gold">
                    <Crown size={12} />
                    {recommendedTier} System Tier
                  </span>
                </div>

                <Button
                  size="lg"
                  variant="default"
                  className="w-full py-4 text-xs font-bold"
                  onClick={() => openModal(recommendedTier)}
                >
                  <span>Apply for Vetted Integration</span>
                </Button>
              </div>

              {/* Inputs — appears SECOND on mobile, left column on desktop */}
              <div className="lg:col-span-7 space-y-8 order-last lg:order-first">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Plug in your monthly revenue and weekly manual admin hours. The math is simple: manual operations cost your business £75/hour in lost productivity and leak up to 15% of your potential pipeline conversion. Adjust the sliders to see what is currently slipping through the cracks.
                </p>

                {/* Revenue Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-foreground">Current Monthly Revenue</span>
                    <span className="text-accent font-bold font-serif text-base text-accent-gold hidden md:block">
                      £{revenue.toLocaleString()}
                    </span>
                  </div>

                  {/* Mobile Stepper */}
                  <div className="flex md:hidden items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setRevenue(Math.max(5000, revenue - 5000))}
                      aria-label="Decrease revenue"
                      className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold font-serif text-xl text-white tracking-tight">
                      £{revenue.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setRevenue(Math.min(100000, revenue + 5000))}
                      aria-label="Increase revenue"
                      className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
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
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-foreground">Weekly Hours Spent on Manual Admin</span>
                    <span className="text-accent font-bold font-serif text-base text-accent-gold hidden md:block">
                      {manualHours} Hours
                    </span>
                  </div>

                  {/* Mobile Stepper */}
                  <div className="flex md:hidden items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setManualHours(Math.max(2, manualHours - 1))}
                      aria-label="Decrease hours"
                      className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold font-serif text-xl text-white tracking-tight">
                      {manualHours} hrs/wk
                    </span>
                    <button
                      onClick={() => setManualHours(Math.min(40, manualHours + 1))}
                      aria-label="Increase hours"
                      className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
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

          {/* Billing Switcher Header */}
          <div className="text-center mb-12">
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/5 p-1.5 rounded-full border border-white/10 relative mt-2">
              <button
                onClick={() => setBillingCycle("setup")}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 ${
                  billingCycle === "setup" ? "text-white font-bold" : "text-white/40"
                }`}
              >
                {billingCycle === "setup" && (
                  <motion.div
                    layoutId="homepageBillingBg"
                    className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                One-Time Setup
              </button>
              <button
                onClick={() => setBillingCycle("retainer")}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 ${
                  billingCycle === "retainer" ? "text-white font-bold" : "text-white/40"
                }`}
              >
                {billingCycle === "retainer" && (
                  <motion.div
                    layoutId="homepageBillingBg"
                    className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                Monthly Retainer
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
            <AnimatePresence>
              {activeTiers.map((tier, index) => (
                <motion.div
                  key={`homepage-${billingCycle}-${tier.name}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`flex flex-col h-full ${tier.featured ? "lg:scale-105 z-10" : ""} ${index === 2 ? "sm:col-span-2 lg:col-span-1 max-w-md mx-auto w-full lg:max-w-none" : ""}`}
                >
                  <div
                    className={`relative h-full bg-bg-tertiary border rounded-xl transition-all duration-300 ${
                      tier.featured ? "border-accent-gold" : "border-white/5"
                    }`}
                  >
                    <CardContent className="p-8 flex flex-col h-full justify-between space-y-8">
                      <div>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-white mb-1">
                              {tier.name}
                            </h3>
                            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">
                              {billingCycle === "setup" ? "System Build" : "Growth Retainer"}
                            </p>
                          </div>

                          {tier.featured && (
                            <span className="bg-accent-gold text-bg-primary px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full">
                              Most Popular
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-primary opacity-80 mb-6 min-h-12 leading-relaxed">
                          {tier.description}
                        </p>

                        {/* Price */}
                        <div className="mb-6 border-y border-white/10 py-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-text-primary opacity-70">From</span>
                            <span className="text-4xl font-bold font-serif text-white">
                              £{tier.price}
                            </span>
                          </div>
                          <span className="text-[10px] text-accent-gold uppercase tracking-wider font-semibold block mt-1">
                            {tier.interval}
                          </span>
                          {billingCycle === "setup" && (tier as any).milestoneBreakdown && (
                            <div className="mt-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-white/70 leading-relaxed flex items-center gap-2">
                              <span className="text-accent-gold font-bold font-sans text-xs shrink-0">％</span>
                              <span>{(tier as any).milestoneBreakdown}</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                          {tier.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="text-accent-gold text-sm shrink-0 mt-0.5">✦</span>
                              <span className="text-xs text-text-primary opacity-85 leading-normal">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <Button
                        size="lg"
                        variant={tier.featured ? "default" : "outline"}
                        className="w-full py-5 text-xs"
                        onClick={() => openModal(tier.tag)}
                      >
                        <span>Initiate Audit</span>
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Under Link */}
          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-gold hover:underline"
            >
              View full pricing breakdown →
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
          className="mb-20 glass rounded-xl p-6 sm:p-10 bg-bg-tertiary/10 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-accent">
              <Calculator size={20} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-accent-gold font-bold">Deficit Diagnostics</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Quantify Your System Deficit</h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Output Panel — appears FIRST on mobile, right column on desktop */}
            <div className="lg:col-span-5 bg-bg-tertiary/40 rounded-xl p-6 border border-white/5 space-y-6 order-first lg:order-last">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-bg-primary rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock size={12} className="text-accent" />
                    <span>Annual Time Reclaimed</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    <RollingNumber value={annualHoursSaved} suffix=" Hrs" />
                  </div>
                </div>

                <div className="p-4 bg-bg-primary rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Zap size={12} className="text-accent" />
                    <span>Est. Growth Lift (15%)</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    <RollingNumber value={projectedRevenueGrowth} prefix="£" />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-accent-purple/10 to-transparent rounded-lg border border-accent-purple/20">
                <div className="text-xs text-accent uppercase tracking-wider font-bold mb-1 text-accent-gold">Total Est. Annual Value Unlocked</div>
                <div className="text-3xl font-bold font-serif text-accent-gold">
                  <RollingNumber value={totalValueUnlocked} prefix="£" />
                </div>
                <p className="text-xxs text-muted-foreground mt-2 leading-tight">
                  Value computed by applying 15% website conversion lift and valuation of manual hours saved at £75/hr.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg text-xs">
                <span className="text-muted-foreground">Recommended Alignment:</span>
                <span className="flex items-center gap-1.5 font-bold text-accent text-accent-gold">
                  <Crown size={12} />
                  {recommendedTier} System Tier
                </span>
              </div>
            </div>

            {/* Inputs — appears SECOND on mobile, left column on desktop */}
            <div className="lg:col-span-7 space-y-8 order-last lg:order-first">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plug in your monthly revenue and weekly manual admin hours. The math is simple: manual operations cost your business £75/hour in lost productivity and leak up to 15% of your potential pipeline conversion. Adjust the sliders to see what is currently slipping through the cracks.
              </p>

              {/* Revenue Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Current Monthly Revenue</span>
                  <span className="text-accent font-bold font-serif text-base text-accent-gold hidden md:block">
                    £{revenue.toLocaleString()}
                  </span>
                </div>

                {/* Mobile Stepper */}
                <div className="flex md:hidden items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setRevenue(Math.max(5000, revenue - 5000))}
                    aria-label="Decrease revenue"
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-bold font-serif text-xl text-white tracking-tight">
                    £{revenue.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setRevenue(Math.min(100000, revenue + 5000))}
                    aria-label="Increase revenue"
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
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
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Weekly Hours Spent on Manual Admin</span>
                  <span className="text-accent font-bold font-serif text-base text-accent-gold hidden md:block">
                    {manualHours} Hours
                  </span>
                </div>

                {/* Mobile Stepper */}
                <div className="flex md:hidden items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setManualHours(Math.max(2, manualHours - 1))}
                    aria-label="Decrease hours"
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-bold font-serif text-xl text-white tracking-tight">
                    {manualHours} hrs/wk
                  </span>
                  <button
                    onClick={() => setManualHours(Math.min(40, manualHours + 1))}
                    aria-label="Increase hours"
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-accent-gold border border-accent-gold/30 rounded-lg active:bg-accent-gold/20 transition-colors"
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

        {/* Switcher */}
        <div className="text-center mb-12 relative z-10">
          <p className="text-xs uppercase tracking-widest text-accent-gold font-bold mb-3">Tailored Options</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Strategic </span>
            <span className="text-gradient-gold">Systems Leverage</span>
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
            We don't build websites. We build automated client acquisition machines designed to return their implementation cost through direct throughput. If a system cannot demonstrate clear leverage, we will not build it.
          </p>
          
          <div className="inline-flex items-center bg-secondary/60 p-1.5 rounded-full border border-border relative">
            <button
              onClick={() => setBillingCycle("setup")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 ${
                billingCycle === "setup" ? "text-white font-bold" : "text-muted-foreground"
              }`}
            >
              {billingCycle === "setup" && (
                <motion.div
                  layoutId="activeBillingCycleBg"
                  className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              One-Time Setup
            </button>
            <button
              onClick={() => setBillingCycle("retainer")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 ${
                billingCycle === "retainer" ? "text-white font-bold" : "text-muted-foreground"
              }`}
            >
              {billingCycle === "retainer" && (
                <motion.div
                  layoutId="activeBillingCycleBg"
                  className="absolute inset-0 rounded-full bg-accent-purple z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              Continuous Growth Support
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 relative z-10 items-stretch">
          <AnimatePresence>
            {activeTiers.map((tier, index) => {
              const isRecommended = recommendedTier === tier.tag
              return (
                <motion.div
                  key={`${billingCycle}-${tier.name}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col h-full ${index === 2 ? "sm:col-span-2 lg:col-span-1 max-w-md mx-auto w-full lg:max-w-none" : ""}`}
                >
                  <div
                    className={`relative h-full bg-bg-tertiary border border-border hover:border-accent-gold/45 rounded-xl transition-all duration-300 ${
                      tier.featured ? "border-accent-gold md:scale-105 z-10 bg-bg-tertiary" : ""
                    }`}
                  >
                    <CardContent className="p-8 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-white mb-1">
                              {tier.name}
                            </h3>
                            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">
                              {billingCycle === "setup" ? "System Build" : "Growth Retainer"}
                            </p>
                          </div>
                          
                          {tier.featured && (
                            <span className="bg-accent-gold text-bg-primary px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full">
                              Most Popular
                            </span>
                          )}
                          
                          {!tier.featured && isRecommended && (
                            <span className="border border-accent-gold/30 bg-accent-gold/5 text-accent-gold px-3 py-1 rounded-full text-xxs font-bold">
                              Calculated Fit
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
                          <span className="text-xs text-accent uppercase tracking-widest font-semibold block mt-1">
                            {tier.interval}
                          </span>
                          {billingCycle === "setup" && (tier as any).milestoneBreakdown && (
                            <div className="mt-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-muted-foreground leading-relaxed flex items-center gap-2">
                              <span className="text-accent-gold font-bold font-sans text-xs shrink-0">％</span>
                              <span>{(tier as any).milestoneBreakdown}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 mb-10">
                          {tier.features.map((feature, i) => (
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
                        size="lg"
                        variant={tier.featured ? "default" : "outline"}
                        className="w-full group font-bold"
                        onClick={() => openModal(tier.tag)}
                      >
                        <span>{tier.cta}</span>
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Detailed Comparison Matrix */}
        <div className="mb-20 relative z-10 max-w-4xl mx-auto">
          <div className="text-center">
            <button
              onClick={() => setIsMatrixOpen(!isMatrixOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/20 bg-secondary/30 text-xs font-bold uppercase tracking-wider text-white hover:text-accent-gold hover:border-accent-gold/45 hover:bg-secondary/50 transition-all duration-300"
            >
              <span>{isMatrixOpen ? "Hide Detailed Features" : "Compare Features in Detail"}</span>
              <motion.div
                animate={{ rotate: isMatrixOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={14} />
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
                  <div className="glass rounded-2xl p-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-4 px-4 text-xs uppercase tracking-widest text-accent-gold font-bold w-1/3 sticky left-0 bg-bg-primary z-20 border-r border-border">Feature Category</th>
                          <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-bold text-center w-1/6">Authority Suite</th>
                          <th className="py-4 text-xs uppercase tracking-widest text-accent font-bold text-center w-1/6">Operations Machine</th>
                          <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-bold text-center w-1/6">Revenue Engine</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonCategories.map((cat, idx) => (
                          <React.Fragment key={idx}>
                            <tr className="bg-primary/5">
                              <td colSpan={4} className="py-3 px-4 text-xs font-bold uppercase text-accent-gold tracking-widest sticky left-0 bg-bg-primary z-10">
                                {cat.category}
                              </td>
                            </tr>
                            {cat.items.map((item, itemIdx) => (
                              <tr key={itemIdx} className="border-b border-border hover:bg-secondary/10 transition-colors">
                                <td className="py-4 px-4 text-sm font-medium text-white sticky left-0 bg-bg-primary z-10 border-r border-border">{item.name}</td>
                                <td className="py-4 text-sm text-muted-foreground text-center">{item.authoritySuite}</td>
                                <td className="py-4 text-sm text-accent-gold font-semibold text-center">{item.operationsMachine}</td>
                                <td className="py-4 text-sm text-muted-foreground text-center">{item.revenueEngine}</td>
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
          <button
            onClick={() => openModal('Revenue Engine')}
            className="text-accent-gold hover:underline font-semibold bg-transparent border-none p-0 inline cursor-pointer outline-none"
          >
            Start the conversation.
          </button>
        </p>
      </div>
    </section>
  )
}
