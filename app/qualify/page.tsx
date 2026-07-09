"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ArrowRight, ShieldCheck, ClipboardCheck, Sparkles } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

export default function QualifyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // URL State
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})

  // Dropdown States
  const [hasWebsite, setHasWebsite] = useState("Yes, but it needs redesign / better copy")
  const [monthlyRevenue, setMonthlyRevenue] = useState("£5,000 – £20,000 / month")
  const [primaryInterest, setPrimaryInterest] = useState("Premium Web Design & Copywriting")

  // Safe client-side URL parsing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      setEmail(searchParams.get("email"))
      setName(searchParams.get("name"))
      setPhone(searchParams.get("phone"))

      const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      const utms: Record<string, string> = {}
      utmKeys.forEach((key) => {
        const val = searchParams.get(key)
        if (val) utms[key] = val
      })
      setUtmParams(utms)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg("Session expired. Please start from the homepage.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const response = await fetch("/api/qualify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          has_website: hasWebsite,
          monthly_revenue: monthlyRevenue,
          primary_interest: primaryInterest,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Failed to submit diagnostics.")
      }

      // Vetting gate triage
      const isQueued = monthlyRevenue === "Under £5,000 / month"

      const successParams = new URLSearchParams()
      successParams.set("status", isQueued ? "queued" : "qualified")
      successParams.set("email", email)
      
      if (!isQueued) {
        if (name) successParams.set("name", name)
        if (phone) successParams.set("phone", phone)
      }

      // Forward UTM params
      Object.entries(utmParams).forEach(([k, v]) => {
        successParams.set(k, v)
      })

      router.push(`/success?${successParams.toString()}`)
    } catch (err: any) {
      console.error("[QualifyPage] Submission failed:", err)
      setErrorMsg(err.message || "An unexpected error occurred.")
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-gold/5 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-accent-gold/3 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-accent-gold/10 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-16 flex items-center py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 transition-transform group-hover:scale-105 duration-300">
              <BrandLogo fill className="object-contain" priority />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent-gold">
              Mercian Wealth
            </span>
          </Link>
        </div>
      </header>

      {/* Main Form Area */}
      <div className="relative z-10 mx-auto max-w-lg px-4 py-12 md:py-20 flex-1 flex flex-col justify-center w-full">

        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.push("/book")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent-gold transition-colors mb-6 group"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="w-full glass border border-accent-gold/15 rounded-3xl p-6 sm:p-10 bg-bg-tertiary/20 relative shadow-2xl overflow-hidden text-white">
          {/* Top gold line decoration */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

          {/* Header Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37]">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                Step 2 of 2: Systems Diagnostic
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                Operational Telemetry
              </h1>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Please answer these diagnostic questions to calibrate your system audit and review compatibility with our cohort schedule.
          </p>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Active Website */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="website_status">
                Do you currently have an active website?
              </label>
              <div className="relative">
                <select
                  id="website_status"
                  disabled={isSubmitting}
                  value={hasWebsite}
                  onChange={(e) => setHasWebsite(e.target.value)}
                  className="w-full h-11 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]/50 appearance-none transition-colors disabled:opacity-50"
                >
                  <option value="Yes, but it needs redesign / better copy">Yes, but it needs redesign / better copy</option>
                  <option value="Yes, but it's not generating leads">Yes, but it's not generating leads</option>
                  <option value="No, I need a new build from scratch">No, I need a new build from scratch</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="revenue_bracket">
                What is your current monthly business revenue?
              </label>
              <div className="relative">
                <select
                  id="revenue_bracket"
                  disabled={isSubmitting}
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                  className="w-full h-11 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]/50 appearance-none transition-colors disabled:opacity-50"
                >
                  <option value="Under £5,000 / month">Under £5,000 / month</option>
                  <option value="£5,000 – £20,000 / month">£5,000 – £20,000 / month</option>
                  <option value="£20,000 – £50,000 / month">£20,000 – £50,000 / month</option>
                  <option value="£50,000+ / month">£50,000+ / month</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Primary Focus */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="primary_focus">
                What is your primary system interest / focus?
              </label>
              <div className="relative">
                <select
                  id="primary_focus"
                  disabled={isSubmitting}
                  value={primaryInterest}
                  onChange={(e) => setPrimaryInterest(e.target.value)}
                  className="w-full h-11 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]/50 appearance-none transition-colors disabled:opacity-50"
                >
                  <option value="Premium Web Design & Copywriting">Premium Web Design & Copywriting</option>
                  <option value="AI Chatbots & Automated Workflows">AI Chatbots & Automated Workflows</option>
                  <option value="High-Ticket B2B Lead Acquisition">High-Ticket B2B Lead Acquisition</option>
                  <option value="Custom Database & CRM Integrations">Custom Database & CRM Integrations</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-6 bg-gradient-to-r from-[#d4af37] to-[#aa8417] hover:from-[#aa8417] hover:to-[#886510] text-black font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#d4af37]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Calibration & Book Session</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-accent-gold/10 py-6 text-center text-xs text-muted-foreground relative z-10 glass">
        <p>© {new Date().getFullYear()} Mercian Wealth. All rights reserved.</p>
      </footer>
    </main>
  )
}
