"use client"

import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

import {
  ArrowRight,
  User,
  Mail,
  Globe,
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  Clock,
  ShieldAlert,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Calendly config — sourced from env vars so no URL/colour is hardcoded
// ---------------------------------------------------------------------------
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/gslegacywealth/30min"

const CALENDLY_PARAMS = new URLSearchParams({
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color: process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color: process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C9A227",
  hide_landing_page_details: "1",
  hide_gdpr_banner: "1",
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Challenge =
  | "No website yet"
  | "Outdated website"
  | "Not getting leads"
  | "Want to modernise / add AI features"

type Revenue =
  | "Under £5,000"
  | "£5,000 – £20,000"
  | "£20,000 – £50,000"
  | "£50,000+"

type Timeline =
  | "Immediately"
  | "Within 1 month"
  | "1 – 3 months"
  | "Just researching"

interface FormData {
  fullName: string
  email: string
  companyName: string
  websiteUrl: string
  biggestChallenge: Challenge | ""
  monthlyRevenue: Revenue | ""
  startTimeline: Timeline | ""
}

const challengeOptions: {
  value: Challenge
  label: string
  description: string
}[] = [
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

const revenueOptions: {
  value: Revenue
  label: string
  description: string
}[] = [
  {
    value: "Under £5,000",
    label: "Under £5,000 / month",
    description: "Early-stage or solopreneur seeking initial growth systems",
  },
  {
    value: "£5,000 – £20,000",
    label: "£5,000 – £20,000 / month",
    description: "Established brand ready to scale operations and lead capture",
  },
  {
    value: "£20,000 – £50,000",
    label: "£20,000 – £50,000 / month",
    description: "High-growth business ready for advanced custom systems & AI",
  },
  {
    value: "£50,000+",
    label: "£50,000+ / month",
    description: "Enterprise leader seeking to optimise at scale & automate fully",
  },
]

const timelineOptions: {
  value: Timeline
  label: string
  description: string
}[] = [
  {
    value: "Immediately",
    label: "Immediately",
    description: "I am ready to kick off development right away",
  },
  {
    value: "Within 1 month",
    label: "Within 1 month",
    description: "Aligning budget, assets, or internal stakeholders",
  },
  {
    value: "1 – 3 months",
    label: "1 – 3 months",
    description: "Mapping out strategic quarterly goals",
  },
  {
    value: "Just researching",
    label: "Just researching",
    description: "Gathering information and looking at potential partners",
  },
]

// ---------------------------------------------------------------------------
// Validation helper per sub-step
// ---------------------------------------------------------------------------
function validateSubStep(
  subStep: number,
  data: FormData
): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {}
  if (subStep === 1) {
    if (!data.fullName.trim()) errors.fullName = "Full name is required."
    if (!data.email.trim()) {
      errors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address."
    }
  } else if (subStep === 2) {
    if (!data.companyName.trim()) {
      errors.companyName = "Company / brand name is required."
    }
  } else if (subStep === 3) {
    if (!data.biggestChallenge) {
      errors.biggestChallenge = "Please select your biggest priority."
    }
  } else if (subStep === 4) {
    if (!data.monthlyRevenue) {
      errors.monthlyRevenue = "Please select your monthly revenue."
    }
  } else if (subStep === 5) {
    if (!data.startTimeline) {
      errors.startTimeline = "Please select your timeline."
    }
  }
  return errors
}

// ---------------------------------------------------------------------------
// CalendlySkeleton — shown while widget.js loads or calendar paints
// ---------------------------------------------------------------------------
function CalendlySkeleton() {
  return (
    <div
      className="calendly-skeleton rounded-2xl"
      style={{ minHeight: "700px" }}
      aria-label="Loading booking calendar…"
    >
      <div className="flex flex-col items-center justify-center h-full gap-4 py-32 opacity-60">
        <Loader2 size={28} className="animate-spin text-accent-gold/60" />
        <p className="text-xs text-muted-foreground tracking-wide">
          Loading your booking calendar…
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CalendlyFallback — shown after 8 s if widget never fires page_height
// ---------------------------------------------------------------------------
function CalendlyFallback({ url }: { url: string }) {
  return (
    <div className="glass rounded-2xl p-10 border border-accent-gold/20 text-center space-y-5">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-gold/10 border border-accent-gold/20 mx-auto">
        <AlertCircle size={22} className="text-accent-gold" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">
          Calendar couldn't load
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          This is usually caused by an ad-blocker or a slow connection. You can
          still book directly on Calendly.
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        id="calendly-fallback-link"
        className="inline-flex items-center gap-2 text-accent-gold underline underline-offset-4 text-sm font-semibold hover:opacity-80 transition-opacity"
      >
        Open booking calendar
        <ExternalLink size={14} />
      </a>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inner component — must live inside <Suspense> because it reads route state
// ---------------------------------------------------------------------------
function BookingFlowInner() {
  const [step, setStep] = useState<1 | 2>(1)
  const [subStep, setSubStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDisqualified, setIsDisqualified] = useState(false)
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Calendly widget state
  const [calendlyHeight, setCalendlyHeight] = useState("700px")
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)
  const [calendlyTimedOut, setCalendlyTimedOut] = useState(false)
  // True once the container div is actually in the DOM (callback ref fires)
  const [containerReady, setContainerReady] = useState(false)

  const calendlyContainerRef = useRef<HTMLDivElement>(null)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Callback ref — fires the instant the container <div> mounts or unmounts.
  // This solves the AnimatePresence mode="wait" timing race: the container is
  // not in the DOM when useEffect([step]) first runs, so we track readiness
  // explicitly and re-trigger init when it becomes true.
  const setCalendlyRef = useCallback((node: HTMLDivElement | null) => {
    ;(calendlyContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    setContainerReady(!!node)
  }, [])

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    companyName: "",
    websiteUrl: "",
    biggestChallenge: "",
    monthlyRevenue: "",
    startTimeline: "",
  })

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const handleNext = () => {
    setSubmitError(null)
    const stepErrors = validateSubStep(subStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    if (subStep < 5) {
      setSubStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Sub-step 5 next triggers full form submission
      submitForm()
    }
  }

  const handleBack = () => {
    if (subStep > 1) {
      setSubStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // ── Form submit ────────────────────────────────────────────────────────────
  const submitForm = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    // Build notes block summarizing the multi-page details
    const notesSummary = `Biggest Challenge: ${formData.biggestChallenge}\nMonthly Revenue: ${formData.monthlyRevenue}\nStart Timeline: ${formData.startTimeline}`

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "booking_form",
          name: formData.fullName,
          email: formData.email,
          business_name: formData.companyName,
          website: formData.websiteUrl || null,
          notes: notesSummary,
        }),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(
          result.error ||
            "Failed to record qualification details. Please try again."
        )
      }

      setIsSubmitting(false)

      // Q4 revenue threshold check (Under £5,000 is disqualified)
      if (formData.monthlyRevenue === "Under £5,000") {
        setIsDisqualified(true)
      } else {
        setStep(2)
      }
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      setIsSubmitting(false)
      setSubmitError(
        err.message || "Failed to submit. Please try again or book directly."
      )
    }
  }

  // ── Build the Calendly URL with brand params + prefill ────────────────────
  const buildCalendlyUrl = useCallback(() => {
    const params = new URLSearchParams(CALENDLY_PARAMS)
    params.set("name", formData.fullName)
    params.set("email", formData.email)
    params.set("a1", formData.websiteUrl)
    params.set("a2", formData.biggestChallenge)
    params.set("a3", formData.monthlyRevenue)
    params.set("a4", formData.startTimeline)
    return `${CALENDLY_URL}?${params.toString()}`
  }, [formData])

  // ── Global postMessage handler (height + event_scheduled) ─────────────────
  useEffect(() => {
    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return
      if (!e.data?.event) return

      switch (e.data.event) {
        case "calendly.page_height": {
          const h = e.data.payload?.height
          if (h) {
            setCalendlyHeight(`${h}px`)
            setCalendlyLoaded(true)
            // Cancel fallback timer — widget loaded successfully
            if (fallbackTimerRef.current) {
              clearTimeout(fallbackTimerRef.current)
              fallbackTimerRef.current = null
            }
          }
          break
        }
        case "calendly.event_scheduled": {
          toast.success("Your call is booked! 🎉 Check your email for confirmation.", {
            duration: 6000,
            id: "calendly-booked",
          })
          break
        }
      }
    }

    window.addEventListener("message", handleCalendlyMessage)
    return () => window.removeEventListener("message", handleCalendlyMessage)
  }, [])

  // ── Initialise / re-initialise widget when step → 2 AND container is mounted
  // containerReady becomes true via the callback ref the moment the <div> paints.
  // This eliminates the AnimatePresence mode="wait" race where the container
  // is not yet in the DOM when step changes.
  useEffect(() => {
    if (step !== 2 || !containerReady || !calendlyContainerRef.current) return

    // Reset state for fresh init
    setCalendlyLoaded(false)
    setCalendlyTimedOut(false)

    // Clear any previous widget instance to avoid duplicate iframes
    calendlyContainerRef.current.innerHTML = ""

    const calendlyUrl = buildCalendlyUrl()

    const doInit = () => {
      if (!calendlyContainerRef.current) return
      // Note: `resize` is NOT a valid Calendly API option — omit it.
      // Height changes are handled via the postMessage "calendly.page_height" event.
      ;(window as any).Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: calendlyContainerRef.current,
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
      })
    }

    // Unified cleanup refs — always cleaned up regardless of which branch runs
    let pollInterval: ReturnType<typeof setInterval> | null = null

    // Start 15-second fallback timer (give iframe enough time to paint)
    fallbackTimerRef.current = setTimeout(() => {
      setCalendlyTimedOut(true)
    }, 15000)

    // If widget.js is already on window (afterInteractive loads it promptly),
    // init immediately. Otherwise poll every 100 ms until it appears.
    if (typeof window !== "undefined" && (window as any).Calendly) {
      doInit()
    } else {
      pollInterval = setInterval(() => {
        if ((window as any).Calendly) {
          clearInterval(pollInterval!)
          pollInterval = null
          doInit()
        }
      }, 100)
    }

    // Single unified cleanup — runs on unmount OR when step changes away from 2
    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
      if (pollInterval) {
        clearInterval(pollInterval)
        pollInterval = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, containerReady])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Step Indicator (Hidden if disqualified) ── */}
      {!isDisqualified && (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                animate={{
                  backgroundColor:
                    step >= s ? "rgb(201, 162, 39)" : "rgba(201, 162, 39, 0.15)",
                  borderColor:
                    step >= s ? "rgb(201, 162, 39)" : "rgba(201, 162, 39, 0.3)",
                }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300"
              >
                {step > s ? (
                  <CheckCircle2 size={18} className="text-bg-primary" />
                ) : (
                  <span
                    className={`text-sm font-bold font-serif ${
                      step >= s ? "text-bg-primary" : "text-accent-gold/60"
                    }`}
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
                {s === 1 ? `Vetting` : "Schedule Session"}
              </span>
              {s < 2 && (
                <ChevronRight size={16} className="text-accent-gold/40 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ================================================================
            STEP 1 — Qualification Form (Multi-page)
            ================================================================ */}
        {step === 1 && !isDisqualified && (
          <motion.div
            key={`substep-${subStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Numbered Progress Header */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-accent-gold">
                <span>Question {subStep} of 5</span>
                <span>{Math.round((subStep / 5) * 100)}% Complete</span>
              </div>
              <div className="w-full h-1 bg-background border border-border-brand/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-gold"
                  initial={{ width: `${((subStep - 1) / 5) * 100}%` }}
                  animate={{ width: `${(subStep / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content Pages */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-border-brand/20 space-y-6">
              {/* PAGE 1: Contact Details */}
              {subStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-1">
                      Who should we ask for?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      We'll pre-fill these on the booking calendar to save you time.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <User size={14} className="text-accent-gold" /> Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Gurtej Singh"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all ${
                        errors.fullName
                          ? "border-red-500/60"
                          : "border-border-brand/20 hover:border-accent-gold/40"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Mail size={14} className="text-accent-gold" /> Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. gurtej@yourbrand.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all ${
                        errors.email
                          ? "border-red-500/60"
                          : "border-border-brand/20 hover:border-accent-gold/40"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 2: Brand Context */}
              {subStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-1">
                      Tell us about your brand
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Let us research your current digital presence before the call.
                    </p>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="companyName"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Building2 size={14} className="text-accent-gold" /> Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="e.g. GS Ventures"
                      value={formData.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all ${
                        errors.companyName
                          ? "border-red-500/60"
                          : "border-border-brand/20 hover:border-accent-gold/40"
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  {/* Website URL */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="websiteUrl"
                      className="text-sm font-medium text-foreground flex items-center gap-2"
                    >
                      <Globe size={14} className="text-accent-gold" /> Website URL{" "}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      placeholder="e.g. https://yourbrand.com"
                      value={formData.websiteUrl}
                      onChange={(e) => updateField("websiteUrl", e.target.value)}
                      className="w-full bg-background/60 border border-border-brand/20 hover:border-accent-gold/40 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* PAGE 3: Challenge */}
              {subStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-1">
                      What is your primary priority?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Select the option that best matches your immediate requirements.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {challengeOptions.map((opt) => {
                      const selected = formData.biggestChallenge === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField("biggestChallenge", opt.value)}
                          className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 ${
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
                    <p className="text-xs text-red-400 mt-1">{errors.biggestChallenge}</p>
                  )}
                </div>
              )}

              {/* PAGE 4: Monthly Revenue */}
              {subStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <TrendingUp size={22} className="text-accent-gold" /> Current monthly revenue
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      This helps us gauge project scale and customize our operational framework.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {revenueOptions.map((opt) => {
                      const selected = formData.monthlyRevenue === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField("monthlyRevenue", opt.value)}
                          className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 ${
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
                  {errors.monthlyRevenue && (
                    <p className="text-xs text-red-400 mt-1">{errors.monthlyRevenue}</p>
                  )}
                </div>
              )}

              {/* PAGE 5: Timeline */}
              {subStep === 5 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <Clock size={20} className="text-accent-gold" /> Desired launch timeline
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Helps us schedule our development velocity and resource availability.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {timelineOptions.map((opt) => {
                      const selected = formData.startTimeline === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField("startTimeline", opt.value)}
                          className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 ${
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
                  {errors.startTimeline && (
                    <p className="text-xs text-red-400 mt-1">{errors.startTimeline}</p>
                  )}
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                  {submitError}
                </div>
              )}
            </div>

            {/* Back / Next Buttons */}
            <div className="flex items-center justify-between gap-4">
              {subStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex items-center gap-2 border-border-brand/20 text-foreground hover:bg-background/40"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              ) : (
                <div /> // Placeholder to push Next button to right
              )}

              <Button
                type="button"
                size="lg"
                disabled={isSubmitting}
                onClick={handleNext}
                className="flex items-center gap-2 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting…
                  </>
                ) : subStep === 5 ? (
                  <>
                    Submit Qualification
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ================================================================
            DISQUALIFIED STATE — Polite criteria redirection page
            ================================================================ */}
        {isDisqualified && (
          <motion.div
            key="disqualified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="glass rounded-2xl p-8 sm:p-10 border border-accent-gold/20 text-center space-y-6 max-w-xl mx-auto shadow-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/5 border border-accent-gold/20 mx-auto">
              <ShieldAlert size={28} className="text-accent-gold" />
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Thank You, {formData.fullName.split(" ")[0]}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We appreciate you taking the time to share your details. To maintain the elite quality of our custom AI integrations, we are currently only partnering with businesses generating a minimum revenue of <strong className="text-accent-gold font-semibold">£5,000/month</strong>.
              </p>
              <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
                We've saved your details and will keep you updated if our partnership capacity or structure changes. Let's stay in touch.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link href="/">
                  Return to Homepage
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 border-accent-gold/25 text-accent-gold hover:bg-accent-gold/10">
                <Link href="/portfolio">
                  Browse Portfolio
                </Link>
              </Button>
            </div>
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
                <p className="text-sm font-bold text-foreground">
                  Details captured, {formData.fullName.split(" ")[0]}!
                </p>
                <p className="text-xs text-text-secondary">
                  Now pick a time below. Your details are pre-filled.
                </p>
              </div>
            </div>

            {/* Selected Info Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.biggestChallenge && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {formData.biggestChallenge}
                </span>
              )}
              {formData.monthlyRevenue && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {formData.monthlyRevenue}/mo
                </span>
              )}
            </div>

            {/* ── Calendly widget area ── */}
            <div
              className="relative rounded-2xl overflow-hidden border border-border-brand/20 bg-bg-primary shadow-2xl calendly-widget-wrapper"
              role="region"
              aria-label="Calendly booking calendar"
            >
              {/* Skeleton overlay — visible until first page_height event fires */}
              <AnimatePresence>
                {!calendlyLoaded && !calendlyTimedOut && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10"
                  >
                    <CalendlySkeleton />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fallback overlay — shown after timeout, sits on top of container */}
              <AnimatePresence>
                {calendlyTimedOut && !calendlyLoaded && (
                  <motion.div
                    key="fallback"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary"
                  >
                    <CalendlyFallback url={CALENDLY_URL} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/*
                Calendly JS widget ALWAYS renders into this div.
                It must never be conditionally unmounted — the ref must stay
                stable so initInlineWidget always has a valid parentElement.
              */}
              <div
                ref={setCalendlyRef}
                className="calendly-inline-widget relative z-0"
                style={{ minWidth: "320px", height: calendlyHeight }}
              />
            </div>

            <button
              onClick={() => {
                setStep(1)
                setSubStep(5)
                setCalendlyLoaded(false)
                setCalendlyTimedOut(false)
              }}
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

// ---------------------------------------------------------------------------
// Exported wrapper — Suspense boundary for any future useSearchParams usage
// ---------------------------------------------------------------------------
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
