"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Script from "next/script"
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
} from "lucide-react"

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
type Challenge = "No website yet" | "Outdated website" | "Not getting leads" | "Want to modernise / add AI features"

interface FormData {
  fullName: string
  email: string
  websiteUrl: string
  companyName: string
  biggestChallenge: Challenge | ""
}

const challengeOptions: { value: Challenge; label: string; description: string }[] = [
  {
    value: "No website yet",
    label: "No website yet",
    description: "I need a brand new website built from scratch",
  },
  {
    value: "Outdated website",
    label: "Outdated website",
    description: "My design and copy need a premium modern update",
  },
  {
    value: "Not getting leads",
    label: "Not getting leads",
    description: "My site exists but isn't converting traffic into clients",
  },
  {
    value: "Want to modernise / add AI features",
    label: "Add AI & automation",
    description: "I want to integrate AI chatbots, calendars or CRM automation",
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
  if (!data.biggestChallenge) errors.biggestChallenge = "Please select your biggest challenge."
  return errors
}

// -------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// -------------------------------------------------------------------
function BookingFlowInner() {
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [calendlyHeight, setCalendlyHeight] = useState("700px")

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    websiteUrl: "",
    companyName: "",
    biggestChallenge: "",
  })

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // Clear error on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'booking_form',
          name: formData.fullName,
          email: formData.email,
          business_name: formData.companyName,
          website: formData.websiteUrl || null,
          notes: formData.biggestChallenge,
        }),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || "Failed to record qualification details. Please try again.")
      }

      setIsSubmitting(false)
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      setIsSubmitting(false)
      setSubmitError(err.message || "Failed to submit. Please try again or book directly.")
    }
  }

  // -------------------------------------------------------------------
  // Build Calendly URL with pre-fill and custom styling
  // -------------------------------------------------------------------
  const calendlyBase = "https://calendly.com/gslegacywealth/30min"
  const calendlyParams = new URLSearchParams({
    background_color: "0A0A0A",
    text_color: "F0EDE6",
    primary_color: "C9A227",
    hide_landing_page_details: "1",
    hide_gdpr_banner: "1",
    name: formData.fullName,
    email: formData.email,
    a1: formData.websiteUrl,
    a2: formData.biggestChallenge,
  })
  const calendlyUrl = `${calendlyBase}?${calendlyParams.toString()}`

  // Listen to Calendly's postMessage height events to adjust frame height dynamically
  useEffect(() => {
    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.origin === "https://calendly.com" && e.data && e.data.event === "calendly.page_height") {
        const height = e.data.payload.height
        setCalendlyHeight(`${height}px`)
      }
    }
    window.addEventListener("message", handleCalendlyMessage)
    return () => window.removeEventListener("message", handleCalendlyMessage)
  }, [])

  // Re-init the Calendly inline widget whenever step 2 is shown
  const calendlyContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (step !== 2) return
    // Give the DOM a tick to paint the container, then init
    const timer = setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        (window as any).Calendly &&
        calendlyContainerRef.current
      ) {
        ;(window as any).Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: calendlyContainerRef.current,
          resize: true, // Enable native auto-resize support in Calendly
          prefill: {
            name: formData.fullName,
            email: formData.email,
          },
        })
      }
    }, 300)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ---- Step Indicator ---- */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <motion.div
              animate={{
                backgroundColor: step >= s ? "rgb(201, 162, 39)" : "rgba(201, 162, 39, 0.15)",
                borderColor: step >= s ? "rgb(201, 162, 39)" : "rgba(201, 162, 39, 0.3)",
              }}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300"
            >
              {step > s ? (
                <CheckCircle2 size={18} className="text-bg-primary" />
              ) : (
                <span
                  className={`text-sm font-bold font-serif ${step >= s ? "text-bg-primary" : "text-accent-gold/60"}`}
                >
                  {s}
                </span>
              )}
            </motion.div>
            <span
              className={`text-sm font-semibold tracking-wide transition-colors ${
                step >= s ? "text-foreground" : "text-text-secondary"
              }`}
            >
              {s === 1 ? "Qualification" : "Schedule Call"}
            </span>
            {s < 2 && <ChevronRight size={16} className="text-accent-gold/40 shrink-0" />}
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
              <div className="glass rounded-2xl p-6 border border-border-brand/20 space-y-5">
                <p className="text-xs uppercase tracking-widest text-accent-gold font-bold">Contact Details</p>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User size={14} className="text-accent-gold" /> Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="e.g. James Morgan"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all ${
                      errors.fullName ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail size={14} className="text-accent-gold" /> Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. james@yourbrand.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all ${
                      errors.email ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
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
                      <Building2 size={14} className="text-accent-gold" /> Company / Brand
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Morgan Ventures"
                      value={formData.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all ${
                        errors.companyName ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Globe size={14} className="text-accent-gold" /> Website{" "}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://yourbrand.com"
                      value={formData.websiteUrl}
                      onChange={(e) => updateField("websiteUrl", e.target.value)}
                      className="w-full bg-background/60 border border-border-brand/20 hover:border-accent-gold/40 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* -- Biggest Challenge -- */}
              <div className="glass rounded-2xl p-6 border border-border-brand/20 space-y-4">
                <p className="text-xs uppercase tracking-widest text-accent-gold font-bold">Biggest Challenge</p>
                <div className="space-y-3">
                  {challengeOptions.map((opt) => {
                    const selected = formData.biggestChallenge === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        id={`challenge-${opt.value.replace(/\s+/g, "-")}`}
                        onClick={() => updateField("biggestChallenge", opt.value)}
                        className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-purple/40 ${
                          selected
                            ? "border-accent-gold bg-accent-gold/10"
                            : "border-border-brand/20 bg-background/40 hover:border-accent-gold/40 hover:bg-accent-gold/5"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                            selected ? "border-accent-gold bg-accent-gold" : "border-accent-gold/40"
                          }`}
                        >
                          {selected && <div className="w-1.5 h-1.5 rounded-full bg-bg-primary" />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${selected ? "text-accent-gold" : "text-foreground"}`}>
                            {opt.label}
                          </p>
                          <p className="text-xs text-text-secondary">{opt.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {errors.biggestChallenge && (
                  <p className="text-xs text-red-400">{errors.biggestChallenge}</p>
                )}
              </div>



              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                  {submitError}
                </div>
              )}

              {/* -- Submit -- */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                id="booking-submit"
                className="w-full py-6 text-base"
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
                No commitment. We&apos;ll review your business and give you honest feedback in 20 minutes — completely free.
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
            <div className="glass rounded-2xl p-5 border border-accent-gold/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Details captured, {formData.fullName.split(" ")[0]}!</p>
                <p className="text-xs text-text-secondary">
                  Now pick a time below. Your name and email are already pre-filled.
                </p>
              </div>
            </div>

            {/* Selected Summary */}
            <div className="flex flex-wrap gap-2">
              {formData.biggestChallenge && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {formData.biggestChallenge}
                </span>
              )}

            </div>

            {/* Calendly JS widget — official embed method */}
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
              onLoad={() => {
                if (
                  typeof window !== "undefined" &&
                  (window as any).Calendly &&
                  calendlyContainerRef.current
                ) {
                  ;(window as any).Calendly.initInlineWidget({
                    url: calendlyUrl,
                    parentElement: calendlyContainerRef.current,
                    prefill: {
                      name: formData.fullName,
                      email: formData.email,
                    },
                  })
                }
              }}
            />
            <div className="relative rounded-2xl overflow-hidden border border-border-brand/20 bg-bg-primary shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <Loader2 size={24} className="text-accent-gold/40 animate-spin" />
              </div>
              {/* The Calendly widget renders into this div */}
              <div
                ref={calendlyContainerRef}
                className="calendly-inline-widget relative z-10"
                data-url={calendlyUrl}
                style={{ minWidth: "320px", height: calendlyHeight }}
              />
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs text-text-secondary hover:text-accent-gold transition-colors underline underline-offset-2"
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
