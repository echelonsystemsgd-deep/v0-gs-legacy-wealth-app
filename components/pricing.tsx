"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Crown, Calculator, ChevronDown, Clock, Zap, ShieldCheck } from "lucide-react"
import Link from "next/link"

const setupTiers = [
  {
    name: "Launch",
    price: "1,500",
    interval: "one-time investment",
    description: "Perfect for establishing a premium digital presence with elite speed.",
    features: [
      "Custom Luxury Website (3 Pages)",
      "Premium Mobile Optimisation",
      "Core SEO Blueprint Setup",
      "Speed Optimisation (90+ Mobile Score)",
      "30 Days Dedicated Post-Launch Support",
      "Elite UI Styling & Smooth Animations",
    ],
    cta: "Book Discovery Session",
    featured: false,
    tag: "Launch"
  },
  {
    name: "Legacy",
    price: "3,500",
    interval: "one-time investment",
    description: "Full AI-powered custom system designed for authority and automatic scaling.",
    features: [
      "Custom Authority Website (Up to 8 Pages)",
      "Custom AI Chat Concierge Integration",
      "Automated Lead Capture & Delivery Funnel",
      "CRM & Calendar Booking Sync",
      "Advanced Premium SEO Strategy & Copywriting",
      "90 Days Dedicated Post-Launch Support",
    ],
    cta: "Book Strategy Session",
    featured: true,
    tag: "Legacy"
  },
  {
    name: "Elite",
    price: "7,000",
    interval: "one-time investment",
    description: "The ultimate brand and automation takeover for absolute market dominance.",
    features: [
      "Complete Brand Identity Suite (Logos, Guidelines)",
      "Multi-System Bespoke AI Workflows",
      "Interactive Digital Sales & Pitch Assets",
      "Monthly Growth & Scaling Strategy",
      "Priority VIP Developer Access & Support",
      "Unlimited Fine-Tuning Revisions",
    ],
    cta: "Book Strategy Session",
    featured: false,
    tag: "Elite"
  },
]

const retainerTiers = [
  {
    name: "Ascent",
    price: "499",
    interval: "billed monthly",
    description: "Continuous hosting, top-tier performance audits, and priority developer hours.",
    features: [
      "Premium Dedicated Ultra-Fast Hosting",
      "Weekly Security & Speed Audits",
      "3 Hours Design & Copywriting Updates/mo",
      "Monthly Traffic & SEO Analytics Report",
      "24/7 Critical System Monitoring",
      "Same-Day Urgent Edits Turnaround",
    ],
    cta: "Book Discovery Session",
    featured: false,
    tag: "Launch"
  },
  {
    name: "Sovereign",
    price: "1,299",
    interval: "billed monthly",
    description: "Ongoing custom growth campaigns, advanced SEO, and bespoke AI tuning.",
    features: [
      "Everything in Ascent Support",
      "Continuous AI Chatbot Re-training & Updates",
      "1 Custom High-Converting Landing Page/mo",
      "Advanced SEO Content & Competitor Strategy",
      "Weekly Lead Funnel Optimization",
      "10 Dedicated Developer/Designer Hours/mo",
    ],
    cta: "Book Strategy Session",
    featured: true,
    tag: "Legacy"
  },
  {
    name: "Apex",
    price: "2,999",
    interval: "billed monthly",
    description: "Your complete external fractional Chief Technology & Marketing Team.",
    features: [
      "Everything in Sovereign Growth",
      "Weekly High-Level Growth Consulting Call",
      "Unlimited System & UI Adjustments",
      "New AI Workflow Builds & Automations",
      "Bespoke Cold Email/Marketing System setups",
      "Direct Slack Hotline to Core Founders",
    ],
    cta: "Book Strategy Session",
    featured: false,
    tag: "Elite"
  },
]

const comparisonCategories = [
  {
    category: "Core Design & Strategy",
    items: [
      { name: "Custom Elite Design", launch: "Luxury Template", legacy: "Bespoke Art-Direction", elite: "Masterful Masterpiece" },
      { name: "Page Limit", launch: "Up to 3", legacy: "Up to 8", elite: "Custom Tailored (Unlimited)" },
      { name: "Custom Copywriting", launch: "Basic Polish", legacy: "Persuasive Copy Included", elite: "Premium Authority Tone" },
      { name: "Mobile Optimisation", launch: "✓ Full", legacy: "✓ Full + Dynamic Features", elite: "✓ Elite Fluid Design" },
    ]
  },
  {
    category: "AI & Smart Systems",
    items: [
      { name: "AI Chat Concierge", launch: "—", legacy: "✓ Single Knowledge Base", elite: "✓ Complex Multi-agent Logic" },
      { name: "CRM Integration", launch: "—", legacy: "✓ Automatic Lead Routing", elite: "✓ Tailored API Integration" },
      { name: "Calendar & Booking Sync", launch: "—", legacy: "✓ Fully Automated", elite: "✓ VIP Priority Flow Setup" },
      { name: "Custom Automation Workflows", launch: "—", legacy: "—", elite: "✓ Up to 3 Core System Integrations" },
    ]
  },
  {
    category: "SEO & Growth",
    items: [
      { name: "SEO Optimization", launch: "Structural Setup", legacy: "Advanced Strategy & Schema", elite: "Comprehensive Dominance Plan" },
      { name: "Speed & Performance", launch: "90+ Guaranteed", legacy: "95+ Guaranteed", elite: "98+ Max Speed Guarantee" },
      { name: "Brand Identity Suite", launch: "—", legacy: "—", elite: "✓ Premium (Logos & Typography)" },
    ]
  },
  {
    category: "Support & Iterations",
    items: [
      { name: "Post-Launch Support", launch: "30 Days", legacy: "90 Days", elite: "VIP Support (Always Active)" },
      { name: "Revision Policy", launch: "3 Rounds", legacy: "Unlimited (Prior to Build)", elite: "Bespoke Ongoing Adjustments" },
      { name: "Turnaround / Support Channel", launch: "Email (48 Hours)", legacy: "Dedicated Portal (24 Hours)", elite: "Founder Slack (Instant Access)" },
    ]
  }
]

interface PricingProps {
  isHomepage?: boolean
}

export function Pricing({ isHomepage = false }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"setup" | "retainer">("setup")
  const [revenue, setRevenue] = useState(25000)
  const [manualHours, setManualHours] = useState(15)
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)

  const activeTiers = billingCycle === "setup" ? setupTiers : retainerTiers

  // Calculators
  const annualHoursSaved = Math.round(manualHours * 0.75 * 52)
  const timeValue = annualHoursSaved * 75
  const projectedRevenueGrowth = Math.round(revenue * 0.15 * 12)
  const totalValueUnlocked = timeValue + projectedRevenueGrowth

  const recommendedTier = 
    revenue < 15000 
      ? "Launch" 
      : revenue >= 15000 && revenue < 50000 
      ? "Legacy" 
      : "Elite"

  if (isHomepage) {
    return (
      <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-3">
              Investment
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Transparent Pricing. Premium Results.
            </h2>
          </div>

          {/* Pricing Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
            {setupTiers.map((tier, index) => {
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col h-full ${tier.featured ? "lg:scale-105 z-10" : ""}`}
                >
                  <div
                    className={`relative h-full bg-[#130D24] border rounded-none transition-all duration-300 ${
                      tier.featured ? "border-[#C9A227]" : "border-white/5"
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
                            <p className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider">
                              System Build
                            </p>
                          </div>
                          
                          {tier.featured && (
                            <span className="bg-[#C9A227] text-black px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider">
                              Most Popular
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#F0EDE6] opacity-80 mb-6 min-h-12 leading-relaxed">
                          {tier.description}
                        </p>

                        {/* Price */}
                        <div className="mb-6 border-y border-white/10 py-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-[#F0EDE6] opacity-70">From</span>
                            <span className="text-4xl font-bold font-serif text-white">
                              £{tier.price}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold block mt-1">
                            {tier.interval}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                          {tier.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="text-[#C9A227] text-sm shrink-0 mt-0.5">✦</span>
                              <span className="text-xs text-[#F0EDE6] opacity-85 leading-normal">
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
                        className={`w-full rounded-none transition-all duration-300 font-bold uppercase tracking-wider text-xs py-5 ${
                          tier.featured
                            ? "bg-[#6D28D9] text-white hover:bg-[#5B21B6] border border-[#C9A227]"
                            : "bg-transparent text-white border border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                        }`}
                      >
                        <Link href={`/book?tier=${tier.tag}`}>
                          <span>Book Strategy Session</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Under Link */}
          <div className="text-center">
            <Link 
              href="/book" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A227] hover:underline"
            >
              Not sure which plan? Book a free call and we'll advise.
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Full Retainer / Interactive Pricing view (Standalone page)
  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ROI Estimator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 glass rounded-3xl p-6 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-accent">
              <Calculator size={20} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-bold">Interactive Estimator</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Bespoke System Return Calculator</h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-8">
              <p className="text-sm text-muted-foreground">
                Luxury platforms are digital investments. Slide the inputs below to calculate how much time and potential revenue our custom design and AI automations can unlock for your brand.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Current Monthly Revenue</span>
                  <span className="text-accent font-bold font-serif text-base">£{revenue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #6D28D9 0%, #6D28D9 ${((revenue - 5000) / 95000) * 100}%, #1a1a1a ${((revenue - 5000) / 95000) * 100}%, #1a1a1a 100%)`
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Weekly Hours Spent on Manual Admin</span>
                  <span className="text-accent font-bold font-serif text-base">{manualHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={manualHours}
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #6D28D9 0%, #6D28D9 ${((manualHours - 2) / 38) * 100}%, #1a1a1a ${((manualHours - 2) / 38) * 100}%, #1a1a1a 100%)`
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#130D24]/40 rounded-2xl p-6 border border-border space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0A0A0A] rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock size={12} className="text-accent" />
                    <span>Annual Time Reclaimed</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    {annualHoursSaved} <span className="text-xs text-muted-foreground">Hrs</span>
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0A] rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Zap size={12} className="text-accent" />
                    <span>Est. Growth Lift (15%)</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    £{projectedRevenueGrowth.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#6D28D9]/10 to-transparent rounded-xl border border-[#6D28D9]/20">
                <div className="text-xs text-accent uppercase tracking-wider font-bold mb-1">Total Est. Annual Value Unlocked</div>
                <div className="text-3xl font-bold font-serif text-gradient-gold">
                  £{totalValueUnlocked.toLocaleString()}
                </div>
                <p className="text-xxs text-muted-foreground mt-2 leading-tight">
                  Value computed by applying 15% website conversion lift and valuation of manual hours saved at £75/hr.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-xl text-xs">
                <span className="text-muted-foreground">Recommended Alignment:</span>
                <span className="flex items-center gap-1.5 font-bold text-accent">
                  <Crown size={12} />
                  {recommendedTier} System Tier
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Switcher */}
        <div className="text-center mb-12 relative z-10">
          <p className="text-xs uppercase tracking-widest text-[#C9A227] font-bold mb-3">Tailored Options</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Strategic </span>
            <span className="text-gradient-gold">Investment Models</span>
          </h2>
          
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
                  className="absolute inset-0 rounded-full bg-primary z-[-1]"
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
                  className="absolute inset-0 rounded-full bg-primary z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              Continuous Growth Support
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 relative z-10 items-stretch">
          <AnimatePresence mode="wait">
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
                    className={`relative h-full bg-[#130D24] border border-border hover:border-primary/45 rounded-none transition-all duration-300 ${
                      tier.featured ? "border-[#C9A227] md:scale-105 z-10 bg-[#130D24]" : ""
                    }`}
                  >
                    <CardContent className="p-8 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-white mb-1">
                              {tier.name}
                            </h3>
                            <p className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider">
                              {billingCycle === "setup" ? "System Build" : "Growth Retainer"}
                            </p>
                          </div>
                          
                          {tier.featured && (
                            <span className="bg-[#C9A227] text-black px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider">
                              Most Popular
                            </span>
                          )}
                          
                          {!tier.featured && isRecommended && (
                            <span className="border border-primary/30 bg-primary/5 text-accent px-3 py-1 rounded-full text-xxs font-bold">
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
                        </div>

                        <div className="space-y-4 mb-10">
                          {tier.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                                <ShieldCheck size={12} className="text-[#C9A227]" />
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
                        className={`w-full group rounded-none transition-all duration-300 font-bold ${
                          tier.featured
                            ? "bg-primary text-white font-extrabold tracking-wide hover:bg-primary/95"
                            : "border-[#C9A227] text-white hover:bg-[#C9A227] hover:text-black"
                        }`}
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
        <div className="mb-20 relative z-10 max-w-4xl mx-auto">
          <div className="text-center">
            <button
              onClick={() => setIsMatrixOpen(!isMatrixOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/20 bg-secondary/30 text-xs font-bold uppercase tracking-wider text-white hover:text-[#C9A227] hover:border-primary/45 hover:bg-secondary/50 transition-all duration-300"
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
                          <th className="py-4 px-4 text-xs uppercase tracking-widest text-[#C9A227] font-bold w-1/3 sticky left-0 bg-[#0A0A0A] z-20 border-r border-border">Feature Category</th>
                          <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-bold text-center w-1/6">Launch Setup</th>
                          <th className="py-4 text-xs uppercase tracking-widest text-accent font-bold text-center w-1/6">Legacy System</th>
                          <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-bold text-center w-1/6">Elite Suite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonCategories.map((cat, idx) => (
                          <tr key={idx} className="contents">
                            <tr className="bg-primary/5">
                              <td colSpan={4} className="py-3 px-4 text-xs font-bold uppercase text-[#C9A227] tracking-widest sticky left-0 bg-[#0A0A0A] z-10">
                                {cat.category}
                              </td>
                            </tr>
                            {cat.items.map((item, itemIdx) => (
                              <tr key={itemIdx} className="border-b border-border hover:bg-secondary/10 transition-colors">
                                <td className="py-4 px-4 text-sm font-medium text-white sticky left-0 bg-[#0A0A0A] z-10 border-r border-border">{item.name}</td>
                                <td className="py-4 text-sm text-muted-foreground text-center">{item.launch}</td>
                                <td className="py-4 text-sm text-[#C9A227] font-semibold text-center">{item.legacy}</td>
                                <td className="py-4 text-sm text-muted-foreground text-center">{item.elite}</td>
                              </tr>
                            ))}
                          </tr>
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
          Looking for a custom enterprise integration? <Link href="/book" className="text-[#C9A227] hover:underline font-semibold">Start the conversation.</Link>
        </p>
      </div>
    </section>
  )
}
