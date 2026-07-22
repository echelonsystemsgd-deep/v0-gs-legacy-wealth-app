"use client"

import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight, User, Mail, Phone, Linkedin, Globe, Building2,
  CheckCircle2, Loader2, ExternalLink, AlertCircle, TrendingUp,
  Clock, Target, ChevronRight, Shield, HelpCircle, X, ChevronDown
} from "lucide-react"

// ---------------------------------------------------------------------------
// Calendly config
// ---------------------------------------------------------------------------
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/gslegacywealth/30min"

const CALENDLY_PARAMS = new URLSearchParams({
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color:       process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color:    process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C5A059",
  hide_landing_page_details: "1",
  hide_gdpr_banner: "1",
})

const PERSONAL_EMAIL_DOMAINS = [
  "gmail.com","yahoo.com","hotmail.com","outlook.com","icloud.com",
  "aol.com","zoho.com","protonmail.com","proton.me","mail.com",
  "yandex.com","gmx.com","fastmail.com","live.com","msn.com",
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Stage = 1 | 2 | 3

type Challenge = "No website yet" | "Outdated website" | "Not getting leads" | "Want to modernise / add AI features"
type Revenue   = "Under £5,000" | "£5,000 – £20,000" | "£20,000 – £50,000" | "£50,000+"
type Timeline  = "Immediately" | "Within 1 month" | "1 – 3 months" | "Just researching"

interface IdentityData {
  fullName: string
  email: string
  phone: string
  companyName: string
  websiteUrl: string
  linkedinUrl: string
  gdprConsent: boolean
}

interface QualData {
  serviceInterested: string
  biggestChallenge: Challenge | ""
  monthlyRevenue: Revenue | ""
  desiredOutcome: string
  startTimeline: Timeline | ""
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------
const serviceOptions: { value: string; label: string; description: string }[] = [
  { value: "High-Yield Digital Infrastructure",    label: "Web Infrastructure",  description: "Bespoke luxury web presence" },
  { value: "Autonomous Pipeline Routing",          label: "Pipeline Routing",    description: "CRM bookings and lead triage" },
  { value: "Relational Cloud Data Architecture",   label: "Database Design",     description: "Supabase relational backend state" },
  { value: "Autonomic Multi-Agent Systems",        label: "AI & Automation",     description: "Autonomous lead qualifiers and sync" },
  { value: "Unsure / Consultation",                label: "Unsure / Consultation",description: "Discuss best strategy and fit" },
]

const challengeOptions: { value: Challenge; label: string; description: string }[] = [
  { value: "No website yet",                        label: "No website yet",      description: "Brand new website from scratch" },
  { value: "Outdated website",                      label: "Outdated website",    description: "Premium modern redesign update" },
  { value: "Not getting leads",                     label: "Not getting leads",   description: "Site exists but isn't converting" },
  { value: "Want to modernise / add AI features",   label: "Add AI & automation", description: "AI chatbots, calendars or CRM sync" },
]

const revenueOptions: { value: Revenue; label: string; description: string }[] = [
  { value: "Under £5,000",      label: "Under £5,000 / mo",      description: "Early-stage growth systems" },
  { value: "£5,000 – £20,000",  label: "£5,000 – £20,000 / mo",  description: "Scale and capture more leads" },
  { value: "£20,000 – £50,000", label: "£20,000 – £50,000 / mo", description: "Advanced custom systems & AI" },
  { value: "£50,000+",          label: "£50,000+ / mo",           description: "Optimise at scale & automate" },
]

const timelineOptions: { value: Timeline; label: string; description: string }[] = [
  { value: "Immediately",     label: "Immediately",     description: "Ready to kick off right away" },
  { value: "Within 1 month",  label: "Within 1 month",  description: "Aligning budget or assets" },
  { value: "1 – 3 months",    label: "1 – 3 months",    description: "Strategic quarterly roadmap" },
  { value: "Just researching", label: "Just researching", description: "Gathering information and fits" },
]

// ---------------------------------------------------------------------------
// Contextual toast messages
// ---------------------------------------------------------------------------
const CHALLENGE_TOASTS: Record<Challenge, string> = {
  "No website yet":                      "Starting fresh — we specialise in full-stack builds from zero to live.",
  "Outdated website":                    "Most-requested brief — our average redesign turnaround is 4–6 weeks.",
  "Not getting leads":                   "Our most common brief — we have a proven conversion framework for this.",
  "Want to modernise / add AI features": "High demand right now — AI integrations are our fastest-growing service.",
}

const REVENUE_TOASTS: Record<Revenue, string> = {
  "Under £5,000":      "Early stage — we will find the best entry point and maximum ROI for your budget.",
  "£5,000 – £20,000":  "Good fit — we have a tailored onboarding track for this growth stage.",
  "£20,000 – £50,000": "Strong fit — qualifies for our Growth Systems package.",
  "£50,000+":          "Top tier — priority allocation and a dedicated lead strategist.",
}

const TIMELINE_TOASTS: Record<Timeline, string> = {
  "Immediately":      "We have availability this week — slots are limited, book quickly.",
  "Within 1 month":   "Perfect — gives us time to fully prepare a bespoke strategy for your call.",
  "1 – 3 months":     "Strategic — we will map out a quarterly roadmap during your session.",
  "Just researching": "No pressure — we will send you a resource pack after the call.",
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function cleanUkPhoneDigits(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('44') && digits.length >= 12) {
    digits = digits.slice(2)
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  return digits
}

function formatUkPhonePayload(input: string): string {
  const digits = cleanUkPhoneDigits(input)
  return digits ? `+44${digits}` : ""
}

function validateIdentity(d: IdentityData): Partial<Record<keyof IdentityData, string>> {
  const e: Partial<Record<keyof IdentityData, string>> = {}
  if (!d.fullName.trim()) e.fullName = "Full name is required."
  if (!d.email.trim()) {
    e.email = "Email is required."
  } else {
    const lower = d.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) {
      e.email = "Please enter a valid email address."
    }
  }
  if (!d.phone.trim()) {
    e.phone = "Phone number is required."
  } else {
    const digits = cleanUkPhoneDigits(d.phone)
    if (digits.length < 10 || digits.length > 11) {
      e.phone = "Please enter a valid 10 to 11-digit UK phone number."
    }
  }
  if (!d.companyName.trim()) e.companyName = "Company name is required."
  if (!d.gdprConsent) e.gdprConsent = "You must accept to continue."
  return e
}

function validateQual(d: QualData): Partial<Record<keyof QualData, string>> {
  const e: Partial<Record<keyof QualData, string>> = {}
  if (!d.serviceInterested) e.serviceInterested = "Please select a service you are interested in."
  if (!d.biggestChallenge) e.biggestChallenge = "Please select your biggest priority."
  if (!d.monthlyRevenue) e.monthlyRevenue = "Please select your monthly revenue."
  if (!d.desiredOutcome.trim()) e.desiredOutcome = "Please describe a successful outcome."
  if (!d.startTimeline) e.startTimeline = "Please select your timeline."
  return e
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated gold progress bar */
function ProgressBar({ stage, pct }: { stage: Stage; pct: number }) {
  const labels = ["Identity", "Assessment", "Schedule"]

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">
          Stage {stage} of 3 — <span className="text-accent-gold">{labels[stage - 1]}</span>
        </span>
        <span className="font-mono font-bold text-accent-gold">{pct}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-accent-gold/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-gold/70 to-accent-gold"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      {/* Stage dots */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              stage > s ? "bg-accent-gold" : stage === s ? "bg-accent-gold ring-2 ring-accent-gold/30" : "bg-accent-gold/20"
            }`} />
            {s < 3 && <div className={`flex-1 h-px w-8 transition-colors duration-300 ${stage > s ? "bg-accent-gold/50" : "bg-accent-gold/15"}`} />}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Radio selection card */
function RadioCard({ selected, onClick, label, description, className = "" }: {
  selected: boolean; onClick: () => void; label: string; description: string; className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-gold/30 ${
        selected
          ? "border-accent-gold bg-accent-gold/10"
          : "border-border-brand/20 bg-background/40 hover:border-accent-gold/40 hover:bg-accent-gold/5"
      } ${className}`}
    >
      <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
        selected ? "border-accent-gold bg-accent-gold" : "border-accent-gold/40"
      }`}>
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-bg-primary" />}
      </div>
      <div className="min-w-0">
        <p className={`text-xs font-semibold leading-tight ${selected ? "text-accent-gold" : "text-foreground"}`}>{label}</p>
        <p className="text-[10px] text-text-secondary leading-tight mt-1">{description}</p>
      </div>
    </button>
  )
}

/** Reusable text input with label */
function FieldInput({ id, label, icon, type = "text", placeholder, value, onChange, error, optional, hint }: {
  id: string; label: string; icon: React.ReactNode; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string; optional?: boolean; hint?: string
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-foreground flex items-center gap-1.5">
        {icon}{label}
        {optional && <span className="text-muted-foreground font-normal">(optional)</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-background/60 border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all ${
          error ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

/** Calendly skeleton */
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

/** Calendly fallback */
function CalendlyFallback({ url, onRetry }: { url: string; onRetry?: () => void }) {
  return (
    <div className="glass rounded-2xl p-10 border border-accent-gold/20 text-center space-y-5">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-gold/10 border border-accent-gold/20 mx-auto">
        <AlertCircle size={22} className="text-accent-gold" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Calendar could not load</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Usually caused by an ad-blocker or slow connection. Book directly on Calendly.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {onRetry && (
          <button type="button" onClick={onRetry}
            className="inline-flex items-center justify-center bg-accent-gold text-bg-primary text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Try Again
          </button>
        )}
        <a href={url} target="_blank" rel="noopener noreferrer" id="calendly-fallback-link"
          className="inline-flex items-center gap-1.5 text-accent-gold underline underline-offset-4 text-xs font-semibold hover:opacity-80 transition-opacity">
          Open booking calendar <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inner component
// ---------------------------------------------------------------------------
function BookingFlowInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<Stage>(1)
  const [showServicesModal, setShowServicesModal] = useState(false)

  // Stage 1 — Identity
  const [identity, setIdentity] = useState<IdentityData>({
    fullName: "", email: "", phone: "", companyName: "",
    websiteUrl: "", linkedinUrl: "", gdprConsent: false,
  })
  const [identityErrors, setIdentityErrors] = useState<Partial<Record<keyof IdentityData, string>>>({})
  const [identitySubmitting, setIdentitySubmitting] = useState(false)
  const [identityError, setIdentityError] = useState<string | null>(null)

  // Stage 2 — Qualification
  const [qual, setQual] = useState<QualData>({
    serviceInterested: "", biggestChallenge: "", monthlyRevenue: "", desiredOutcome: "", startTimeline: "",
  })
  const [qualErrors, setQualErrors] = useState<Partial<Record<keyof QualData, string>>>({})
  const [qualSubmitting, setQualSubmitting] = useState(false)
  const [qualError, setQualError] = useState<string | null>(null)

  // Stage 3 — Calendly
  const [calendlyHeight, setCalendlyHeight] = useState("700px")
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)
  const [calendlyTimedOut, setCalendlyTimedOut] = useState(false)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Prefill service selector from URL parameters
  useEffect(() => {
    const serviceParam = searchParams?.get("service")
    if (serviceParam) {
      const mapping: Record<string, string> = {
        "authority-platform": "High-Yield Digital Infrastructure",
        "conversion-funnel": "Autonomous Pipeline Routing",
        "database-architecture": "Relational Cloud Data Architecture",
        "ai-agents": "Autonomic Multi-Agent Systems"
      }
      if (mapping[serviceParam]) {
        setQual((p) => ({ ...p, serviceInterested: mapping[serviceParam] }))
      }
    }
  }, [searchParams])

  // Helpers
  const updateIdentity = <K extends keyof IdentityData>(key: K, value: IdentityData[K]) => {
    setIdentity((p) => ({ ...p, [key]: value }))
    if (identityErrors[key]) setIdentityErrors((p) => ({ ...p, [key]: undefined }))
  }

  const updateQual = <K extends keyof QualData>(key: K, value: QualData[K]) => {
    setQual((p) => ({ ...p, [key]: value }))
    if (qualErrors[key]) setQualErrors((p) => ({ ...p, [key]: undefined }))
  }

  const scrollTop = () => containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  // ── Stage 1 submit ────────────────────────────────────────────────────────
  const handleIdentitySubmit = async () => {
    setIdentityError(null)
    const errors = validateIdentity(identity)
    if (Object.keys(errors).length > 0) {
      setIdentityErrors(errors)
      scrollTop()
      return
    }
    setIdentitySubmitting(true)
    try {
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: identity.fullName,
          email: identity.email,
          phone: formatUkPhonePayload(identity.phone),
          business_name: identity.companyName,
          linkedin_url: identity.linkedinUrl || null,
          industry: "General",
          tier: "General Lead",
          gdpr_consent: identity.gdprConsent,
          source_page: typeof window !== "undefined" ? window.location.pathname : "/book",
        }),
      })
    } catch {
      // Non-blocking — proceed regardless of API result
    } finally {
      setIdentitySubmitting(false)
      setStage(2)
      scrollTop()
    }
  }

  // ── Stage 2 submit ────────────────────────────────────────────────────────
  const handleQualSubmit = async () => {
    setQualError(null)
    const errors = validateQual(qual)
    if (Object.keys(errors).length > 0) {
      setQualErrors(errors)
      scrollTop()
      return
    }
    setQualSubmitting(true)
    const notes = [
      `Service Interested: ${qual.serviceInterested}`,
      `Biggest Challenge: ${qual.biggestChallenge}`,
      `Monthly Revenue: ${qual.monthlyRevenue}`,
      `Start Timeline: ${qual.startTimeline}`,
      `Desired Outcome: ${qual.desiredOutcome}`,
    ].join("\n")
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "booking_form",
          name: identity.fullName,
          email: identity.email,
          phone: formatUkPhonePayload(identity.phone),
          business_name: identity.companyName,
          website: identity.websiteUrl || null,
          linkedin_url: identity.linkedinUrl || null,
          notes,
          service_interested: qual.serviceInterested,
        }),
      })
      if (!res.ok) {
        const r = await res.json()
        throw new Error(r.error || "Failed to submit.")
      }
    } catch (err: any) {
      setQualError(err.message || "Failed to submit. Please try again.")
      setQualSubmitting(false)
      return
    }
    setQualSubmitting(false)
    setStage(3)
    scrollTop()
  }

  // ── Calendly URL builder ──────────────────────────────────────────────────
  const buildCalendlyUrl = useCallback(() => {
    const params = new URLSearchParams(CALENDLY_PARAMS)
    params.set("name", identity.fullName)
    params.set("email", identity.email)
    params.set("phone_number", formatUkPhonePayload(identity.phone))
    params.set("a1", identity.websiteUrl)
    params.set("a2", qual.biggestChallenge)
    params.set("a3", qual.monthlyRevenue)
    params.set("a4", qual.startTimeline)
    return `${CALENDLY_URL}?${params.toString()}`
  }, [identity, qual])

  // ── Calendly postMessage listener ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || !e.data?.event) return
      if (e.data.event === "calendly.page_height") {
        const h = e.data.payload?.height
        if (h) {
          setCalendlyHeight(`${h}px`)
          setCalendlyLoaded(true)
          if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null }
        }
      }
      if (e.data.event === "calendly.event_scheduled") {
        toast.success("Your call is booked! Check your email for confirmation.", { duration: 6000, id: "calendly-booked" })
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  // ── Stage 3: start fallback timer ─────────────────────────────────────────
  useEffect(() => {
    if (stage !== 3) return
    setCalendlyLoaded(false)
    setCalendlyTimedOut(false)
    fallbackTimerRef.current = setTimeout(() => setCalendlyTimedOut(true), 15000)
    return () => { if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null } }
  }, [stage, retryCount])

  // Dynamic completion percentage calculation
  const getProgressPct = () => {
    if (stage === 3) return 100
    if (stage === 2) {
      const stage2Count =
        (qual.serviceInterested ? 1 : 0) +
        (qual.biggestChallenge ? 1 : 0) +
        (qual.monthlyRevenue ? 1 : 0) +
        (qual.desiredOutcome.trim() ? 1 : 0) +
        (qual.startTimeline ? 1 : 0)
      return 33 + Math.round((stage2Count / 5) * 33)
    }
    // stage === 1
    const stage1Count =
      (identity.fullName.trim() ? 1 : 0) +
      (identity.email.trim() ? 1 : 0) +
      (identity.phone.trim() ? 1 : 0) +
      (identity.companyName.trim() ? 1 : 0) +
      (identity.gdprConsent ? 1 : 0)
    return Math.round((stage1Count / 5) * 33)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      <ProgressBar stage={stage} pct={getProgressPct()} />

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 1 — IDENTITY
            ═══════════════════════════════════════════════════════════════════ */}
        {stage === 1 && (
          <motion.div key="stage1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-2xl p-6 sm:p-8 border border-border-brand/20 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-border-brand/10">
              <div className="w-8 h-8 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center shrink-0">
                <User size={14} className="text-accent-gold" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground leading-tight">Your Details</h2>
                <p className="text-xs text-muted-foreground">Step 1 of 3 — we use this to prepare for your session</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FieldInput id="fullName" label="Full Name" icon={<User size={11} className="text-accent-gold" />}
                  placeholder="e.g. Mercian Partner" value={identity.fullName}
                  onChange={(v) => updateIdentity("fullName", v)} error={identityErrors.fullName} />
              </div>
              <FieldInput id="email" label="Business Email" icon={<Mail size={11} className="text-accent-gold" />}
                type="email" placeholder="e.g. director@mercianwealth.com" value={identity.email}
                onChange={(v) => updateIdentity("email", v)} error={identityErrors.email} />
              <div className="space-y-1">
                <label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone size={11} className="text-accent-gold" /> Phone Number
                </label>
                <div className={`flex items-center bg-background/60 border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent-gold/30 transition-all ${
                  identityErrors.phone ? "border-red-500/60" : "border-border-brand/20 focus-within:border-accent-gold/40 hover:border-accent-gold/40"
                }`}>
                  <div className="bg-accent-gold/10 text-accent-gold font-mono font-semibold text-xs px-3 py-2.5 border-r border-border-brand/20 select-none shrink-0 flex items-center gap-1">
                    <span className="text-xs">🇬🇧</span>
                    <span>+44</span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="7123 456789"
                    value={identity.phone}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^\d\s-]/g, '')
                      if (val.startsWith('0')) val = val.slice(1)
                      updateIdentity("phone", val)
                    }}
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                  />
                </div>
                {identityErrors.phone ? (
                  <p className="text-xs text-red-400">{identityErrors.phone}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground/80 leading-snug mt-1">
                    Mercian Wealth operates exclusively with United Kingdom based businesses.
                  </p>
                )}
              </div>
              <FieldInput id="companyName" label="Company Name" icon={<Building2 size={11} className="text-accent-gold" />}
                placeholder="e.g. Mercian Holdings" value={identity.companyName}
                onChange={(v) => updateIdentity("companyName", v)} error={identityErrors.companyName} />
              <FieldInput id="websiteUrl" label="Website URL" icon={<Globe size={11} className="text-accent-gold" />}
                type="url" placeholder="e.g. https://mercianwealth.com" value={identity.websiteUrl}
                onChange={(v) => updateIdentity("websiteUrl", v)} error={identityErrors.websiteUrl} optional />
              <div className="sm:col-span-2">
                <FieldInput id="linkedinUrl" label="LinkedIn Profile" icon={<Linkedin size={11} className="text-accent-gold" />}
                  type="url" placeholder="e.g. https://linkedin.com/company/mercian-wealth" value={identity.linkedinUrl}
                  onChange={(v) => updateIdentity("linkedinUrl", v)} error={identityErrors.linkedinUrl} optional
                  hint="Strongly encouraged — helps us prepare for your call" />
              </div>
            </div>

            {/* GDPR consent */}
            <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              identity.gdprConsent ? "border-accent-gold/30 bg-accent-gold/5" : "border-border-brand/20 bg-background/40"
            } ${identityErrors.gdprConsent ? "border-red-500/40" : ""}`}>
              <button
                type="button"
                onClick={() => updateIdentity("gdprConsent", !identity.gdprConsent)}
                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all mt-0.5 ${
                  identity.gdprConsent ? "bg-accent-gold border-accent-gold" : "border-accent-gold/40 bg-transparent"
                }`}
                aria-label="GDPR consent checkbox"
              >
                {identity.gdprConsent && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div>
                <p className="text-xs text-foreground leading-relaxed">
                  I agree to be contacted by Mercian Wealth regarding my enquiry. I have read and accept the{" "}
                  <a href="/privacy" target="_blank" className="text-accent-gold underline underline-offset-2 hover:opacity-80">
                    Privacy Policy
                  </a>.{" "}
                  <span className="text-red-400">*</span>
                </p>
                {identityErrors.gdprConsent && (
                  <p className="text-xs text-red-400 mt-1">{identityErrors.gdprConsent}</p>
                )}
              </div>
            </div>

            {identityError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{identityError}</div>
            )}

            <Button type="button" size="lg" disabled={identitySubmitting} onClick={handleIdentitySubmit}
              className="w-full flex items-center justify-center gap-2 font-bold">
              {identitySubmitting
                ? <><Loader2 size={16} className="animate-spin" />Saving…</>
                : <>Continue to Assessment <ChevronRight size={16} /></>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your data is encrypted and never sold. Only reviewed by our team.
            </p>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 2 — ASSESSMENT
            ═══════════════════════════════════════════════════════════════════ */}
        {stage === 2 && (
          <motion.div key="stage2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            {/* Identity recap banner */}
            <div className="glass rounded-xl p-4 border border-accent-gold/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Details saved, {identity.fullName.split(" ")[0]}!</p>
                  <p className="text-xs text-muted-foreground">{identity.email}</p>
                </div>
              </div>
              <button type="button" onClick={() => setStage(1)}
                className="text-xs text-accent-gold underline underline-offset-2 hover:opacity-70 shrink-0">
                Edit
              </button>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8 border border-border-brand/20 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-border-brand/10">
                <div className="w-8 h-8 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center shrink-0">
                  <Target size={14} className="text-accent-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-foreground leading-tight">Assessment</h2>
                  <p className="text-xs text-muted-foreground">Step 2 of 3 — helps us prepare a bespoke strategy</p>
                </div>
              </div>

              {/* Service Interested In */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Target size={11} className="text-accent-gold" />Service Interested In
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowServicesModal(true)}
                    className="text-xs text-accent-gold hover:opacity-80 flex items-center gap-1 transition-opacity"
                  >
                    <HelpCircle size={12} />
                    Unsure?
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {serviceOptions.map((opt, idx) => (
                    <RadioCard
                      key={opt.value}
                      selected={qual.serviceInterested === opt.value}
                      onClick={() => updateQual("serviceInterested", opt.value)}
                      label={opt.label}
                      description={opt.description}
                      className={idx === 4 ? "sm:col-span-2" : ""}
                    />
                  ))}
                </div>
                {qualErrors.serviceInterested && <p className="text-xs text-red-400">{qualErrors.serviceInterested}</p>}
              </div>

              {/* Biggest Bottleneck */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <AlertCircle size={11} className="text-accent-gold" />Biggest Operational Bottleneck
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {challengeOptions.map((opt) => (
                    <RadioCard key={opt.value}
                      selected={qual.biggestChallenge === opt.value}
                      onClick={() => {
                        updateQual("biggestChallenge", opt.value)
                        toast(CHALLENGE_TOASTS[opt.value], {
                          duration: 3000,
                          id: "challenge-toast",
                          className: "border border-accent-gold/20 bg-bg-secondary",
                        })
                      }}
                      label={opt.label} description={opt.description}
                    />
                  ))}
                </div>
                {qualErrors.biggestChallenge && <p className="text-xs text-red-400">{qualErrors.biggestChallenge}</p>}
              </div>

              {/* Monthly Revenue */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <TrendingUp size={11} className="text-accent-gold" />Approximate Monthly Revenue
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {revenueOptions.map((opt) => (
                    <RadioCard key={opt.value}
                      selected={qual.monthlyRevenue === opt.value}
                      onClick={() => {
                        updateQual("monthlyRevenue", opt.value)
                        toast(REVENUE_TOASTS[opt.value], {
                          duration: 3000,
                          id: "revenue-toast",
                          className: "border border-accent-gold/20 bg-bg-secondary",
                        })
                      }}
                      label={opt.label} description={opt.description}
                    />
                  ))}
                </div>
                {qualErrors.monthlyRevenue && <p className="text-xs text-red-400">{qualErrors.monthlyRevenue}</p>}
              </div>

              {/* Desired Outcome */}
              <div className="space-y-1">
                <label htmlFor="desiredOutcome" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-accent-gold" />What does a successful outcome look like?
                </label>
                <textarea
                  id="desiredOutcome" rows={3} maxLength={300}
                  placeholder="e.g. A redesigned site launching leads directly into our CRM within 60 days"
                  value={qual.desiredOutcome}
                  onChange={(e) => updateQual("desiredOutcome", e.target.value)}
                  className={`w-full bg-background/60 border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-gold/30 transition-all resize-none ${
                    qualErrors.desiredOutcome ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
                  }`}
                />
                <div className="flex justify-between">
                  {qualErrors.desiredOutcome ? <p className="text-xs text-red-400">{qualErrors.desiredOutcome}</p> : <span />}
                  <span className="text-xs text-muted-foreground">{qual.desiredOutcome.length}/300</span>
                </div>
              </div>

              {/* Start Timeline */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock size={11} className="text-accent-gold" />Desired Start Timeline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {timelineOptions.map((opt) => (
                    <RadioCard key={opt.value}
                      selected={qual.startTimeline === opt.value}
                      onClick={() => {
                        updateQual("startTimeline", opt.value)
                        toast(TIMELINE_TOASTS[opt.value], {
                          duration: 3000,
                          id: "timeline-toast",
                          className: "border border-accent-gold/20 bg-bg-secondary",
                        })
                      }}
                      label={opt.label} description={opt.description}
                    />
                  ))}
                </div>
                {qualErrors.startTimeline && <p className="text-xs text-red-400">{qualErrors.startTimeline}</p>}
              </div>
            </div>

            {qualError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{qualError}</div>
            )}

            <Button type="button" size="lg" disabled={qualSubmitting} onClick={handleQualSubmit}
              className="w-full flex items-center justify-center gap-2 font-bold">
              {qualSubmitting
                ? <><Loader2 size={16} className="animate-spin" />Submitting…</>
                : <>Submit & View Calendar <ArrowRight size={16} /></>}
            </Button>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Only qualified enquiries receive confirmation. Reviewed within 1 business day.
            </p>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            STAGE 3 — SCHEDULE
            ═══════════════════════════════════════════════════════════════════ */}
        {stage === 3 && (
          <motion.div key="stage3"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Success banner */}
            <div className="glass rounded-2xl p-5 border border-accent-gold/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Application received, {identity.fullName.split(" ")[0]}!</p>
                  <p className="text-xs text-text-secondary">Pick a time below — your details are pre-filled.</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setStage(2)}
                className="text-xs border-accent-gold/35 text-accent-gold hover:bg-accent-gold/10 hover:text-white transition-all shrink-0">
                Edit Details
              </Button>
            </div>

            {/* Selection tags */}
            <div className="flex flex-wrap gap-2">
              {qual.serviceInterested && (
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {qual.serviceInterested}
                </span>
              )}
              {qual.biggestChallenge && (
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {qual.biggestChallenge}
                </span>
              )}
              {qual.monthlyRevenue && (
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {qual.monthlyRevenue}/mo
                </span>
              )}
              {qual.startTimeline && (
                <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold">
                  {qual.startTimeline}
                </span>
              )}
            </div>

            {/* Calendly embed */}
            <div className="relative rounded-2xl overflow-hidden border border-border-brand/20 shadow-2xl calendly-widget-wrapper"
              role="region" aria-label="Calendly booking calendar" style={{ background: "#0A0A0A" }}>
              <AnimatePresence>
                {!calendlyLoaded && !calendlyTimedOut && (
                  <motion.div key="skeleton" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10">
                    <CalendlySkeleton />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {calendlyTimedOut && !calendlyLoaded && (
                  <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary">
                    <CalendlyFallback url={buildCalendlyUrl()}
                      onRetry={() => { setCalendlyTimedOut(false); setCalendlyLoaded(false); setRetryCount((p) => p + 1) }} />
                  </motion.div>
                )}
              </AnimatePresence>
              <iframe key={retryCount} src={buildCalendlyUrl()} width="100%" className="relative z-0"
                style={{ height: calendlyHeight, minWidth: "320px", border: "none" }}
                title="Book your strategy session — Mercian Wealth" loading="lazy"
                onLoad={() => {
                  setCalendlyLoaded(true)
                  if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null }
                }}
              />
            </div>

            <button onClick={() => { setStage(2); setCalendlyLoaded(false); setCalendlyTimedOut(false) }}
              className="text-xs text-text-secondary hover:text-accent-gold transition-colors underline underline-offset-2">
              ← Go back and edit my details
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services explanation modal */}
      <AnimatePresence>
        {showServicesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass border border-accent-gold/20 rounded-2xl p-6 relative overflow-hidden text-left"
            >
              <button
                type="button"
                onClick={() => setShowServicesModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
              
              <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-accent-gold" size={18} />
                Our Solutions Overview
              </h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                <div>
                  <h4 className="text-xs font-bold text-accent-gold uppercase tracking-wider">High-Yield Digital Infrastructure</h4>
                  <p className="text-xs text-text-secondary mt-1">Bespoke Next.js platforms designed to project absolute category dominance. Built without templates, engineered for prestige.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-accent-gold uppercase tracking-wider">Autonomous Pipeline Routing</h4>
                  <p className="text-xs text-text-secondary mt-1">Custom CRM bookings and synchronized lead orchestration that triages, captures, and schedules prospects in under 1 second.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-accent-gold uppercase tracking-wider">Relational Cloud Data Architecture</h4>
                  <p className="text-xs text-text-secondary mt-1">High-throughput cloud storage engines and database schemas engineered for sub-millisecond querying and complete data sovereignty.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-accent-gold uppercase tracking-wider">Autonomic Multi-Agent Systems</h4>
                  <p className="text-xs text-text-secondary mt-1">Automated pipelines that qualify, capture, and nurture leads 24/7/365. Replacing manual drag with software leverage.</p>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={() => setShowServicesModal(false)}
                className="w-full mt-6 text-xs font-bold"
              >
                Close Overview
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Export with Suspense boundary
// ---------------------------------------------------------------------------
export function BookingFlow() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-gold/60" />
      </div>
    }>
      <BookingFlowInner />
    </Suspense>
  )
}
