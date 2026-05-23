"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  User,
  Mail,
  Globe,
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Sparkles,
  Crown,
  Zap,
  Settings,
} from "lucide-react"

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
type Tier = "Launch" | "Legacy" | "Elite" | "Custom"
type Obstacle = "Design Upgrade" | "Automation Systems" | "Full Brand Takeover" | "Other"

interface FormData {
  fullName: string
  email: string
  websiteUrl: string
  companyName: string
  selectedTier: Tier | ""
  topObstacle: Obstacle | ""
}

// -------------------------------------------------------------------
// Tier option config
// -------------------------------------------------------------------
const tierOptions: { value: Tier; label: string; price: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "Launch",
    label: "Launch",
    price: "£1,500",
    icon: <Zap size={16} />,
    description: "Premium 3-page digital presence",
  },
  {
    value: "Legacy",
    label: "Legacy",
    price: "£3,500",
    icon: <Crown size={16} />,
    description: "AI-powered full system build",
  },
  {
    value: "Elite",
    label: "Elite",
    price: "£7,000",
    icon: <Sparkles size={16} />,
    description: "Complete brand & automation takeover",
  },
  {
    value: "Custom",
    label: "Custom",
    price: "Let's Talk",
    icon: <Settings size={16} />,
    description: "Enterprise or bespoke requirements",
  },
]

const obstacleOptions: { value: Obstacle; label: string; description: string }[] = [
  {
    value: "Design Upgrade",
    label: "Design Upgrade",
    description: "My brand looks outdated and doesn't convert",
  },
  {
    value: "Automation Systems",
    label: "Automation Systems",
    description: "I need AI workflows to save time & capture leads",
  },
  {
    value: "Full Brand Takeover",
    label: "Full Brand Takeover",
    description: "I need a complete identity & digital overhaul",
  },
  {
    value: "Other",
    label: "Something Else",
    description: "I have a unique challenge to discuss",
  },
]

// -------------------------------------------------------------------
// Validation helper
// -------------------------------------------------------------------
function validateForm(data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {}
  if (!data.fullName.trim()) errors.fullName = "Full name is required."
  if (!data.email.trim()) {
    errors.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address."
  }
  if (!data.companyName.trim()) errors.companyName = "Company / brand name is required."
  if (!data.selectedTier) errors.selectedTier = "Please select an investment tier."
  if (!data.topObstacle) errors.topObstacle = "Please select your primary objective."
  return errors
}

// -------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// -------------------------------------------------------------------
function BookingFlowInner() {
  const searchParams = useSearchParams()
  const tierParam = searchParams.get("tier") as Tier | null

  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    websiteUrl: "",
    companyName: "",
    selectedTier: tierParam && ["Launch", "Legacy", "Elite", "Custom"].includes(tierParam) ? tierParam : "",
    topObstacle: "",
  })

  // Sync tier from URL when it changes
  useEffect(() => {
    if (tierParam && ["Launch", "Legacy", "Elite", "Custom"].includes(tierParam)) {
      setFormData((prev) => ({ ...prev, selectedTier: tierParam }))
    }
  }, [tierParam])

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // Clear error on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    // Simulate async lead capture (webhook / email would fire here)
    await new Promise((res) => setTimeout(res, 900))
    setIsSubmitting(false)
    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // -------------------------------------------------------------------
  // Build Calendly URL with pre-fill and custom styling
  // -------------------------------------------------------------------
  const calendlyBase = "https://calendly.com/gs-legacy/strategy"
  const calendlyParams = new URLSearchParams({
    background_color: "050505",
    text_color: "F5F5F5",
    primary_color: "D4AF37",
    hide_landing_page_details: "1",
    hide_gdpr_banner: "1",
    name: formData.fullName,
    email: formData.email,
    a1: formData.websiteUrl,
    a2: formData.selectedTier,
  })
  const calendlyUrl = `${calendlyBase}?${calendlyParams.toString()}`

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ---- Step Indicator ---- */}
      <div className="flex items-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <motion.div
              animate={{
                backgroundColor: step >= s ? "rgb(212, 175, 55)" : "rgba(212,175,55,0.15)",
                borderColor: step >= s ? "rgb(212, 175, 55)" : "rgba(212,175,55,0.3)",
              }}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300"
            >
              {step > s ? (
                <CheckCircle2 size={18} className="text-background" />
              ) : (
                <span
                  className={`text-sm font-bold font-serif ${step >= s ? "text-background" : "text-gold/60"}`}
                >
                  {s}
                </span>
              )}
            </motion.div>
            <span
              className={`text-sm font-semibold tracking-wide transition-colors ${
                step >= s ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s === 1 ? "Qualification" : "Schedule Call"}
            </span>
            {s < 2 && <ChevronRight size={16} className="text-gold/40 shrink-0" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ================================================================
            STEP 1 — Qualification Form
            ================================================================ */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Tell Us About Your Brand
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This takes 60 seconds. Your details pre-fill the scheduler — no double entry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* -- Contact Details -- */}
              <div className="glass rounded-2xl p-6 border border-gold/15 space-y-5">
                <p className="text-xs uppercase tracking-widest text-gold font-bold">Contact Details</p>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User size={14} className="text-gold" /> Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="e.g. James Morgan"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/40 transition-all ${
                      errors.fullName ? "border-red-500/60" : "border-gold/15 hover:border-gold/30"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail size={14} className="text-gold" /> Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. james@yourbrand.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/40 transition-all ${
                      errors.email ? "border-red-500/60" : "border-gold/15 hover:border-gold/30"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Company + Website — side by side on md+ */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="companyName" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Building2 size={14} className="text-gold" /> Company / Brand
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Morgan Ventures"
                      value={formData.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/40 transition-all ${
                        errors.companyName ? "border-red-500/60" : "border-gold/15 hover:border-gold/30"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Globe size={14} className="text-gold" /> Website{" "}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://yourbrand.com"
                      value={formData.websiteUrl}
                      onChange={(e) => updateField("websiteUrl", e.target.value)}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* -- Tier Selection -- */}
              <div className="glass rounded-2xl p-6 border border-gold/15 space-y-4">
                <p className="text-xs uppercase tracking-widest text-gold font-bold">Investment Tier</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tierOptions.map((tier) => {
                    const selected = formData.selectedTier === tier.value
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        id={`tier-${tier.value}`}
                        onClick={() => updateField("selectedTier", tier.value)}
                        className={`relative text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                          selected
                            ? "border-gold bg-gold/10 glow-gold/20"
                            : "border-gold/15 bg-background/40 hover:border-gold/40 hover:bg-gold/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`flex items-center gap-1.5 text-sm font-bold font-serif ${selected ? "text-gold" : "text-foreground"}`}>
                            {tier.icon} {tier.label}
                          </span>
                          <span className="text-xs font-bold text-gold">{tier.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">{tier.description}</p>
                        {selected && (
                          <motion.div
                            layoutId="tierSelectedDot"
                            className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gold"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
                {errors.selectedTier && (
                  <p className="text-xs text-red-400">{errors.selectedTier}</p>
                )}
              </div>

              {/* -- Top Obstacle -- */}
              <div className="glass rounded-2xl p-6 border border-gold/15 space-y-4">
                <p className="text-xs uppercase tracking-widest text-gold font-bold">Primary Objective</p>
                <div className="space-y-3">
                  {obstacleOptions.map((opt) => {
                    const selected = formData.topObstacle === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        id={`obstacle-${opt.value.replace(/\s+/g, "-")}`}
                        onClick={() => updateField("topObstacle", opt.value)}
                        className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                          selected
                            ? "border-gold bg-gold/10"
                            : "border-gold/15 bg-background/40 hover:border-gold/40 hover:bg-gold/5"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                            selected ? "border-gold bg-gold" : "border-gold/40"
                          }`}
                        >
                          {selected && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${selected ? "text-gold" : "text-foreground"}`}>
                            {opt.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{opt.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {errors.topObstacle && (
                  <p className="text-xs text-red-400">{errors.topObstacle}</p>
                )}
              </div>

              {/* -- Submit -- */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                id="booking-submit"
                className="w-full bg-gradient-to-r from-gold to-gold-light text-background font-bold text-base py-6 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Securing your spot…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue to Schedule
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Your details are captured instantly — even if you close the next page.
              </p>
            </form>
          </motion.div>
        )}

        {/* ================================================================
            STEP 2 — Calendly Embed
            ================================================================ */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Success Banner */}
            <div className="glass rounded-2xl p-5 border border-gold/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Details captured, {formData.fullName.split(" ")[0]}!</p>
                <p className="text-xs text-muted-foreground">
                  Now pick a time below. Your name and email are already pre-filled.
                </p>
              </div>
            </div>

            {/* Selected Summary */}
            <div className="flex flex-wrap gap-2">
              {formData.selectedTier && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-xs font-bold text-gold">
                  <Crown size={11} /> {formData.selectedTier} Tier
                </span>
              )}
              {formData.topObstacle && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/40 border border-border text-xs font-medium text-foreground">
                  {formData.topObstacle}
                </span>
              )}
            </div>

            {/* Calendly iframe */}
            <div className="relative rounded-2xl overflow-hidden border border-gold/20 bg-[#050505] shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Loader2 size={24} className="text-gold/40 animate-spin" />
              </div>
              <iframe
                src={calendlyUrl}
                width="100%"
                height="700"
                frameBorder="0"
                title="Schedule a Strategy Call"
                className="relative z-10"
                style={{ minHeight: "700px" }}
              />
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs text-muted-foreground hover:text-gold transition-colors underline underline-offset-2"
            >
              ← Go back and edit my details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// -------------------------------------------------------------------
// Exported wrapper — wraps inner in Suspense for useSearchParams
// -------------------------------------------------------------------
export function BookingFlow() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gold/60" />
        </div>
      }
    >
      <BookingFlowInner />
    </Suspense>
  )
}
