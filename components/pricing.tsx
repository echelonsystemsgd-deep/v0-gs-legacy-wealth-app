"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Crown, HelpCircle, Calculator, ChevronDown, RefreshCw, Zap, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"
// -------------------------------------------------------------
// Interactive 3D Tilt Card Component
// -------------------------------------------------------------
function TiltCard({ children, featured }: { children: React.ReactNode; featured: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [showGlare, setShowGlare] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const relativeX = mouseX / width - 0.5
    const relativeY = mouseY / height - 0.5

    x.set(relativeX)
    y.set(relativeY)

    setGlarePosition({ x: mouseX, y: mouseY })
  }

  const handleMouseEnter = () => {
    setShowGlare(true)
  }

  const handleMouseLeave = () => {
    setShowGlare(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative h-full bg-secondary/20 backdrop-blur-md border border-gold/10 hover:border-gold/30 rounded-2xl transition-colors duration-300 ${
        featured ? "border-gold/40 glow-gold md:scale-105 z-10 bg-secondary/40" : ""
      }`}
    >
      {showGlare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-20"
          style={{
            background: `radial-gradient(circle 150px at ${glarePosition.x}px ${glarePosition.y}px, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0) 80%)`,
          }}
        />
      )}
      <div style={{ transform: "translateZ(10px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  )
}

// -------------------------------------------------------------
// Pricing Data
// -------------------------------------------------------------
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
    cta: "Start Your Project",
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
    cta: "Scale Your Brand",
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
    cta: "Request Consultation",
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
    cta: "Secure Ascent Support",
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
    cta: "Accelerate with Sovereign",
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
    cta: "Partner at Apex Level",
    featured: false,
    tag: "Elite"
  },
]

// -------------------------------------------------------------
// Detailed Comparison Data
// -------------------------------------------------------------
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

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"setup" | "retainer">("setup")
  const [revenue, setRevenue] = useState(25000)
  const [manualHours, setManualHours] = useState(15)
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)

  const activeTiers = billingCycle === "setup" ? setupTiers : retainerTiers

  // Calculators
  const annualHoursSaved = Math.round(manualHours * 0.75 * 52)
  const timeValue = annualHoursSaved * 75 // £75/hr value
  const projectedRevenueGrowth = Math.round(revenue * 0.15 * 12)
  const totalValueUnlocked = timeValue + projectedRevenueGrowth

  // recommended package logic
  const recommendedTier = 
    revenue < 15000 
      ? "Launch" 
      : revenue >= 15000 && revenue < 50000 
      ? "Legacy" 
      : "Elite"

  return (
    <section id="pricing" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      {/* Decorative Orbs */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* -------------------------------------------------------------
            ROI & Automation Value Estimator (Calculator)
            ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 glass rounded-3xl p-6 sm:p-10 border border-gold/15 glow-gold/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <Calculator size={20} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Interactive Estimator</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Bespoke System Return Calculator</h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Inputs */}
            <div className="lg:col-span-7 space-y-8">
              <p className="text-sm text-muted-foreground">
                Luxury platforms are digital investments. Slide the inputs below to calculate how much time and potential revenue our custom design and AI automations can unlock for your brand.
              </p>
              
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Current Monthly Revenue</span>
                  <span className="text-gold font-bold font-serif text-base">£{revenue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((revenue - 5000) / 95000) * 100}%, #1a1a1a ${((revenue - 5000) / 95000) * 100}%, #1a1a1a 100%)`
                  }}
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-foreground">Weekly Hours Spent on Manual Admin</span>
                  <span className="text-gold font-bold font-serif text-base">{manualHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={manualHours}
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((manualHours - 2) / 38) * 100}%, #1a1a1a ${((manualHours - 2) / 38) * 100}%, #1a1a1a 100%)`
                  }}
                />
              </div>
            </div>

            {/* Visual Gauges */}
            <div className="lg:col-span-5 bg-card/60 rounded-2xl p-6 border border-gold/10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock size={12} className="text-gold" />
                    <span>Annual Time Reclaimed</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    {annualHoursSaved} <span className="text-xs text-muted-foreground">Hrs</span>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Zap size={12} className="text-gold" />
                    <span>Est. Growth Lift (15%)</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif text-foreground">
                    £{projectedRevenueGrowth.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-gold/10 to-transparent rounded-xl border border-gold/20">
                <div className="text-xs text-gold uppercase tracking-wider font-bold mb-1">Total Est. Annual Value Unlocked</div>
                <div className="text-3xl font-bold font-serif text-gradient-gold">
                  £{totalValueUnlocked.toLocaleString()}
                </div>
                <p className="text-xxs text-muted-foreground mt-2 leading-tight">
                  Value computed by applying 15% website conversion lift and valuation of manual hours saved at £75/hr.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-xl text-xs">
                <span className="text-muted-foreground">Recommended Alignment:</span>
                <span className="flex items-center gap-1.5 font-bold text-gold">
                  <Crown size={12} />
                  {recommendedTier} System Tier
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* -------------------------------------------------------------
            Billing Cycle Switcher (Setup vs Retainer)
            ------------------------------------------------------------- */}
        <div className="text-center mb-12 relative z-10">
          <p className="text-xs uppercase tracking-widest text-gold font-bold mb-3">Tailored Options</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Strategic </span>
            <span className="text-gradient-gold">Investment Models</span>
          </h2>
          
          <div className="inline-flex items-center bg-secondary/60 p-1.5 rounded-full border border-gold/10 relative">
            <button
              onClick={() => setBillingCycle("setup")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 ${
                billingCycle === "setup"
                  ? "text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              One-Time Setup
            </button>
            <button
              onClick={() => setBillingCycle("retainer")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 relative z-10 ${
                billingCycle === "retainer"
                  ? "text-primary-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Continuous Growth Support
            </button>

            {/* Sliding Gold Background */}
            <motion.div
              layoutId="billingToggleBg"
              className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-gradient-to-r from-gold to-gold-light"
              animate={{
                x: billingCycle === "setup" ? 0 : "99%",
                width: billingCycle === "setup" ? "142px" : "228px"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        {/* -------------------------------------------------------------
            Pricing Grid (Framer Motion Animation)
            ------------------------------------------------------------- */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 relative z-10 items-stretch">
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
                  className="flex flex-col h-full"
                >
                  <TiltCard featured={tier.featured}>
                    <CardContent className="p-8 flex flex-col h-full justify-between">
                      <div>
                        {/* Featured Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                              {tier.name}
                            </h3>
                            <p className="text-xxs text-gold font-bold uppercase tracking-wider">
                              {billingCycle === "setup" ? "System Build" : "Growth Retainer"}
                            </p>
                          </div>
                          
                          {tier.featured && (
                            <span className="bg-gradient-to-br from-gold to-gold-light text-primary-foreground px-3 py-1 rounded-full text-xxs font-extrabold flex items-center gap-1 glow-gold">
                              <Crown size={10} />
                              Most Popular
                            </span>
                          )}
                          
                          {!tier.featured && isRecommended && (
                            <span className="border border-gold/30 bg-gold/5 text-gold px-3 py-1 rounded-full text-xxs font-bold">
                              Calculated Fit
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-6 min-h-12 leading-relaxed">
                          {tier.description}
                        </p>

                        {/* Pricing */}
                        <div className="mb-8 border-y border-gold/10 py-5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base text-muted-foreground">From</span>
                            <span className="text-4xl sm:text-5xl font-bold font-serif text-foreground tracking-tight">
                              £{tier.price}
                            </span>
                          </div>
                          <span className="text-xs text-gold uppercase tracking-widest font-semibold block mt-1">
                            {tier.interval}
                          </span>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-10">
                          {tier.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="h-5 w-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 border border-gold/25">
                                <Check size={12} className="text-gold" />
                              </div>
                              <span className="text-sm text-muted-foreground font-medium leading-normal">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        asChild
                        size="lg"
                        variant={tier.featured ? "default" : "outline"}
                        className={`w-full group rounded-xl transition-all duration-300 font-bold ${
                          tier.featured
                            ? "bg-gradient-to-r from-gold to-gold-light hover:scale-102 hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] text-black font-extrabold tracking-wide"
                            : "hover:border-gold hover:text-gold"
                        }`}
                      >
                        <Link href={`/book?tier=${tier.tag}`}>
                          <span>{tier.cta}</span>
                        </Link>
                      </Button>
                    </CardContent>
                  </TiltCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* -------------------------------------------------------------
            Expandable Comparison Grid
            ------------------------------------------------------------- */}
        <div className="mb-20 relative z-10 max-w-4xl mx-auto">
          <div className="text-center">
            <button
              onClick={() => setIsMatrixOpen(!isMatrixOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold/20 bg-secondary/30 text-xs font-bold uppercase tracking-wider text-foreground hover:text-gold hover:border-gold/40 hover:bg-secondary/50 transition-all duration-300"
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
                <div className="glass rounded-2xl p-6 border border-gold/15 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gold/15">
                        <th className="py-4 text-xs uppercase tracking-widest text-gold font-bold w-1/3">Feature Category</th>
                        <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-bold text-center w-1/6">Launch Setup</th>
                        <th className="py-4 text-xs uppercase tracking-widest text-gold font-bold text-center w-1/6">Legacy System</th>
                        <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-bold text-center w-1/6">Elite Suite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonCategories.map((cat, idx) => (
                        <tr key={idx} className="contents">
                          <tr className="bg-gold/5">
                            <td colSpan={4} className="py-3 px-2 text-xs font-bold uppercase text-gold tracking-widest">
                              {cat.category}
                            </td>
                          </tr>
                          {cat.items.map((item, itemIdx) => (
                            <tr key={itemIdx} className="border-b border-border hover:bg-secondary/10 transition-colors">
                              <td className="py-4 px-2 text-sm font-medium text-foreground">{item.name}</td>
                              <td className="py-4 text-sm text-muted-foreground text-center">{item.launch}</td>
                              <td className="py-4 text-sm text-gold font-semibold text-center">{item.legacy}</td>
                              <td className="py-4 text-sm text-muted-foreground text-center">{item.elite}</td>
                            </tr>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground px-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-gold" />
                      All core designs include speed and performance guarantees.
                    </span>
                    <Link href="/book" className="text-gold hover:underline">
                      Request custom specs
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-muted-foreground relative z-10">
          Looking for a custom enterprise integration? <Link href="/book" className="text-gold hover:underline font-semibold">Start the conversation.</Link>
        </p>
      </div>
    </section>
  )
}
