"use client"

import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Building2,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react"

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/mercianwealth/30min"

const CALENDLY_PARAMS = new URLSearchParams({
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color:       process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color:    process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C9A227",
  hide_landing_page_details: "1",
  hide_gdpr_banner: "1",
})

const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com",
  "aol.com","zoho.com","protonmail.com","proton.me","mail.com",
  "yandex.com","gmx.com","fastmail.com","live.com","msn.com",
]

type Challenge = "No website yet" | "Outdated website" | "Not getting leads" | "Want to modernise / add AI features"
type Revenue = "Under £5,000" | "£5,000 – £20,000" | "£20,000 – £50,000" | "£50,000+"
type Timeline = "Immediately" | "Within 1 month" | "1 – 3 months" | "Just researching"

interface FormData {
  fullName: string
  email: string
  phone: string
  companyName: string
  websiteUrl: string
  linkedinUrl: string
  biggestChallenge: Challenge | ""
  monthlyRevenue: Revenue | ""
  desiredOutcome: string
  startTimeline: Timeline | ""
}

const challengeOptions = [
  { value: "No website yet" as Challenge, label: "No website yet", description: "I need a brand new website built from scratch" },
  { value: "Outdated website" as Challenge, label: "Outdated website", description: "My design and copy need a premium modern update" },
  { value: "Not getting leads" as Challenge, label: "Not getting leads", description: "My site exists but isn't converting traffic into clients" },
  { value: "Want to modernise / add AI features" as Challenge, label: "Add AI & automation", description: "I want to integrate AI chatbots, calendars or CRM automation" },
]

const revenueOptions = [
  { value: "Under £5,000" as Revenue, label: "Under £5,000 / month", description: "Early-stage or solopreneur seeking initial growth systems" },
  { value: "£5,000 – £20,000" as Revenue, label: "£5,000 – £20,000 / month", description: "Established brand ready to scale operations and lead capture" },
  { value: "£20,000 – £50,000" as Revenue, label: "£20,000 – £50,000 / month", description: "High-growth business ready for advanced custom systems & AI" },
  { value: "£50,000+" as Revenue, label: "£50,000+ / month", description: "Enterprise leader seeking to optimise at scale & automate fully" },
]

const timelineOptions = [
  { value: "Immediately" as Timeline, label: "Immediately", description: "I am ready to kick off development right away" },
  { value: "Within 1 month" as Timeline, label: "Within 1 month", description: "Aligning budget, assets, or internal stakeholders" },
  { value: "1 – 3 months" as Timeline, label: "1 – 3 months", description: "Mapping out strategic quarterly goals" },
  { value: "Just researching" as Timeline, label: "Just researching", description: "Gathering information and looking at potential partners" },
]

function validateAll(data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {}
  if (!data.fullName.trim()) errors.fullName = "Full name is required."
  if (!data.email.trim()) {
    errors.email = "Email is required."
  } else {
    const emailLower = data.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
      errors.email = "Please enter a valid email address."
    } else {
      const domain = emailLower.split("@")[1]
      if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
        errors.email = "Please use a business email address — personal email domains are not accepted."
      }
    }
  }
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required."
  } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number."
  }
  if (!data.companyName.trim()) errors.companyName = "Company / brand name is required."
  if (!data.biggestChallenge) errors.biggestChallenge = "Please select your biggest priority."
  if (!data.monthlyRevenue) errors.monthlyRevenue = "Please select your monthly revenue."
  if (!data.desiredOutcome.trim()) errors.desiredOutcome = "Please describe what a successful outcome looks like."
  if (!data.startTimeline) errors.startTimeline = "Please select your timeline."
  return errors
}

function CalendlySkeleton() {
  return (
    <div className="calendly-skeleton rounded-2xl" style={{ minHeight: "700px" }} aria-label="Loading booking calendar…">
      <div className="flex flex-col items-center justify-center h-full gap-4 py-32 opacity-60">
        <Loader2 size={28} className="animate-spin text-accent-gold/60" />
        <p className="text-xs text-muted-foreground tracking-wide">Loading your booking calendar…</p>
      </div>
    </div>
  )
}

function CalendlyFallback({ url, onRetry }: { url: string; onRetry?: () => void }) {
  return (
    <div className="glass rounded-2xl p-10 border border-accent-gold/20 text-center space-y-5">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-gold/10 border border-accent-gold/20 mx-auto">
        <AlertCircle size={22} className="text-accent-gold" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Calendar couldn't load</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          This is usually caused by an ad-blocker or a slow connection. You can still book directly on Calendly.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {onRetry && (
          <button type="button" onClick={onRetry} className="inline-flex items-center justify-center bg-accent-gold text-bg-primary text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Try Again
          </button>
        )}
        <a href={url} target="_blank" rel="noopener noreferrer" id="calendly-fallback-link" className="inline-flex items-center gap-1.5 text-accent-gold underline underline-offset-4 text-xs font-semibold hover:opacity-80 transition-opacity">
          Open booking calendar
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

function RadioCard({ selected, onClick, label, description }: { selected: boolean; onClick: () => void; label: string; description: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 ${selected ? "border-accent-gold bg-accent-gold/10" : "border-border-brand/20 bg-background/40 hover:border-accent-gold/40 hover:bg-accent-gold/5"}`}
    >
      <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${selected ? "border-accent-gold bg-accent-gold" : "border-accent-gold/40"}`}>
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-bg-primary" />}
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-semibold leading-tight ${selected ? "text-accent-gold" : "text-foreground"}`}>{label}</p>
        <p className="text-xs text-text-secondary leading-tight mt-0.5">{description}</p>
      </div>
    </button>
  )
}

function FieldInput({ id, label, icon, type = "text", placeholder, value, onChange, error, optional, hint }: {
  id: string; label: string; icon: React.ReactNode; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string; optional?: boolean; hint?: string
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-foreground flex items-center gap-1.5">
        {icon}
        {label}
        {optional && <span className="text-muted-foreground font-normal">(optional)</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-background/60 border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all ${error ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function BookingFlowInner() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const [calendlyHeight, setCalendlyHeight] = useState("700px")
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)
  const [calendlyTimedOut, setCalendlyTimedOut] = useState(false)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const [formData, setFormData] = useState<FormData>({
    fullName: "", email: "", phone: "", companyName: "",
    websiteUrl: "", linkedinUrl: "", biggestChallenge: "",
    monthlyRevenue: "", desiredOutcome: "", startTimeline: "",
  })

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async () => {
    setSubmitError(null)
    const fieldErrors = validateAll(formData)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    setIsSubmitting(true)
    const notesSummary = [
      `Biggest Challenge: ${formData.biggestChallenge}`,
      `Monthly Revenue: ${formData.monthlyRevenue}`,
      `Start Timeline: ${formData.startTimeline}`,
      `Desired Outcome: ${formData.desiredOutcome}`,
    ].join("\n")
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "booking_form",
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.companyName,
          website: formData.websiteUrl || null,
          linkedin_url: formData.linkedinUrl || null,
          notes: notesSummary,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to record qualification details. Please try again.")
      setIsSubmitting(false)
      setStep(2)
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } catch (err: any) {
      setIsSubmitting(false)
      setSubmitError(err.message || "Failed to submit. Please try again or book directly.")
    }
  }

  const buildCalendlyUrl = useCallback(() => {
    const params = new URLSearchParams(CALENDLY_PARAMS)
    params.set("name", formData.fullName)
    params.set("email", formData.email)
    params.set("phone_number", formData.phone)
    params.set("a1", formData.websiteUrl)
    params.set("a2", formData.biggestChallenge)
    params.set("a3", formData.monthlyRevenue)
    params.set("a4", formData.startTimeline)
    return `${CALENDLY_URL}?${params.toString()}`
  }, [formData])

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
            if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null }
          }
          break
        }
        case "calendly.event_scheduled": {
          toast.success("Your call is booked! Check your email for confirmation.", { duration: 6000, id: "calendly-booked" })
          break
        }
      }
    }
    window.addEventListener("message", handleCalendlyMessage)
    return () => window.removeEventListener("message", handleCalendlyMessage)
  }, [])

  useEffect(() => {
    if (step !== 2) return
    setCalendlyLoaded(false)
    setCalendlyTimedOut(false)
    fallbackTimerRef.current = setTimeout(() => setCalendlyTimedOut(true), 15000)
    return () => { if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null } }
  }, [step, retryCount])

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      {/* Step Indicator */}
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
                <span className={`text-sm font-bold font-serif ${step >= s ? "text-bg-primary" : "text-accent-gold/60"}`}>{s}</span>
              )}
            </motion.div>
            <span className={`text-sm font-semibold tracking-wide transition-colors ${step >= s ? "text-foreground" : "text-text-secondary"}`}>
              {s === 1 ? "Vetting" : "Schedule Session"}
            </span>
            {s < 2 && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-gold/40 shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 - Unified Single-Page Assessment */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-1">Tell us about your business</h2>
              <p className="text-sm text-muted-foreground">Complete the form below. We review all applications within 1 business day.</p>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT: Contact Details */}
              <div className="glass rounded-2xl p-6 border border-border-brand/20 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
                    <User size={12} className="text-accent-gold" />
                  </div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Contact Details</h3>
                </div>

                <FieldInput id="fullName" label="Full Name" icon={<User size={12} className="text-accent-gold" />} placeholder="e.g. Gurtej Singh" value={formData.fullName} onChange={(v) => updateField("fullName", v)} error={errors.fullName} />
                <FieldInput id="email" label="Business Email" icon={<Mail size={12} className="text-accent-gold" />} type="email" placeholder="e.g. gurtej@yourbrand.com" value={formData.email} onChange={(v) => updateField("email", v)} error={errors.email} />
                <FieldInput id="phone" label="Phone Number" icon={<Phone size={12} className="text-accent-gold" />} type="tel" placeholder="e.g. +44 7123 456789" value={formData.phone} onChange={(v) => updateField("phone", v)} error={errors.phone} />
                <FieldInput id="companyName" label="Company Name" icon={<Building2 size={12} className="text-accent-gold" />} placeholder="e.g. GS Ventures" value={formData.companyName} onChange={(v) => updateField("companyName", v)} error={errors.companyName} />
                <FieldInput id="websiteUrl" label="Website URL" icon={<Globe size={12} className="text-accent-gold" />} type="url" placeholder="e.g. https://yourbrand.com" value={formData.websiteUrl} onChange={(v) => updateField("websiteUrl", v)} error={errors.websiteUrl} optional />
                <FieldInput id="linkedinUrl" label="LinkedIn Profile" icon={<Linkedin size={12} className="text-accent-gold" />} type="url" placeholder="e.g. https://linkedin.com/in/username" value={formData.linkedinUrl} onChange={(v) => updateField("linkedinUrl", v)} error={errors.linkedinUrl} optional hint="Strongly encouraged — helps us prepare for your call" />
              </div>

              {/* RIGHT: Qualification */}
              <div className="glass rounded-2xl p-6 border border-border-brand/20 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
                    <Target size={12} className="text-accent-gold" />
                  </div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Qualification</h3>
                </div>

                {/* Biggest Bottleneck */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-accent-gold" />
                    Biggest Operational Bottleneck
                  </label>
                  <div className="space-y-2">
                    {challengeOptions.map((opt) => (
                      <RadioCard key={opt.value} selected={formData.biggestChallenge === opt.value} onClick={() => updateField("biggestChallenge", opt.value)} label={opt.label} description={opt.description} />
                    ))}
                  </div>
                  {errors.biggestChallenge && <p className="text-xs text-red-400">{errors.biggestChallenge}</p>}
                </div>

                {/* Monthly Revenue */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-accent-gold" />
                    Approximate Monthly Revenue
                  </label>
                  <div className="space-y-2">
                    {revenueOptions.map((opt) => (
                      <RadioCard key={opt.value} selected={formData.monthlyRevenue === opt.value} onClick={() => updateField("monthlyRevenue", opt.value)} label={opt.label} description={opt.description} />
                    ))}
                  </div>
                  {errors.monthlyRevenue && <p className="text-xs text-red-400">{errors.monthlyRevenue}</p>}
                </div>

                {/* Desired Outcome */}
                <div className="space-y-1">
                  <label htmlFor="desiredOutcome" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-accent-gold" />
                    What does a successful outcome look like?
                  </label>
                  <textarea
                    id="desiredOutcome" rows={3} maxLength={300}
                    placeholder="e.g. A fully redesigned site launching leads directly into our CRM within 60 days"
                    value={formData.desiredOutcome}
                    onChange={(e) => updateField("desiredOutcome", e.target.value)}
                    className={`w-full bg-background/60 border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all resize-none ${errors.desiredOutcome ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"}`}
                  />
                  <div className="flex justify-between items-center">
                    {errors.desiredOutcome ? <p className="text-xs text-red-400">{errors.desiredOutcome}</p> : <span />}
                    <span className="text-xs text-muted-foreground">{formData.desiredOutcome.length}/300</span>
                  </div>
                </div>

                {/* Start Timeline */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Clock size={12} className="text-accent-gold" />
                    Desired Start Timeline
                  </label>
                  <div className="space-y-2">
                    {timelineOptions.map((opt) => (
                      <RadioCard key={opt.value} selected={formData.startTimeline === opt.value} onClick={() => updateField("startTimeline", opt.value)} label={opt.label} description={opt.description} />
                    ))}
                  </div>
                  {errors.startTimeline && <p className="text-xs text-red-400">{errors.startTimeline}</p>}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{submitError}</div>
            )}

            {/* CTA */}
            <div className="space-y-3">
              <Button type="button" size="lg" disabled={isSubmitting} onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 text-base font-bold py-4">
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" />Submitting…</>
                ) : (
                  <>Submit & View Calendar<ArrowRight size={18} /></>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Only qualified enquiries will receive confirmation. We review all applications within 1 business day.
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2 - Calendly Embed */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.4 }} className="space-y-6">
            {/* Success Banner */}
            <div className="glass rounded-2xl p-5 border border-accent-gold/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Details captured, {formData.fullName.split(" ")[0]}!</p>
                  <p className="text-xs text-text-secondary">Now pick a time below. Your details are pre-filled.</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)} className="text-xs border-accent-gold/35 text-accent-gold hover:bg-accent-gold/10 hover:text-white transition-all shrink-0">
                Edit Details
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.biggestChallenge && (
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">{formData.biggestChallenge}</span>
              )}
              {formData.monthlyRevenue && (
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">{formData.monthlyRevenue}/mo</span>
              )}
            </div>

            {/* Calendly */}
            <div className="relative rounded-2xl overflow-hidden border border-border-brand/20 shadow-2xl calendly-widget-wrapper" role="region" aria-label="Calendly booking calendar" style={{ background: "#0A0A0A" }}>
              <AnimatePresence>
                {!calendlyLoaded && !calendlyTimedOut && (
                  <motion.div key="skeleton" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10">
                    <CalendlySkeleton />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {calendlyTimedOut && !calendlyLoaded && (
                  <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary">
                    <CalendlyFallback url={buildCalendlyUrl()} onRetry={() => { setCalendlyTimedOut(false); setCalendlyLoaded(false); setRetryCount((prev) => prev + 1) }} />
                  </motion.div>
                )}
              </AnimatePresence>
              <iframe key={retryCount} src={buildCalendlyUrl()} width="100%" className="relative z-0" style={{ height: calendlyHeight, minWidth: "320px", border: "none" }} title="Book your strategy session — Mercian Wealth" loading="lazy"
                onLoad={() => { setCalendlyLoaded(true); if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null } }}
              />
            </div>

            <button onClick={() => { setStep(1); setCalendlyLoaded(false); setCalendlyTimedOut(false) }} className="text-xs text-text-secondary hover:text-accent-gold transition-colors underline underline-offset-2">
              ← Go back and edit my details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BookingFlow() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 size={28} className="animate-spin text-gold/60" /></div>}>
      <BookingFlowInner />
    </Suspense>
  )
}
