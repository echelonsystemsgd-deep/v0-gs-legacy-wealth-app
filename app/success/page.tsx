"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Clock, Shield, Star, CheckCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const CALENDLY_PARAMS = new URLSearchParams({
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color: process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color: process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C5A059",
  hide_landing_page_details: "1",
  hide_gdpr_banner: "1",
})

const TRUST_ITEMS = [
  { icon: Clock, text: "30-minute clinical evaluation" },
  { icon: Shield, text: "Candid operational analysis" },
  { icon: Star, text: "Strictly limited allocations" },
]

export default function SuccessPage() {
  const [calendlyBaseUrl, setCalendlyBaseUrl] = useState(
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/gslegacywealth/30min"
  )
  const [loading, setLoading] = useState(true)
  const [calendlyHeight, setCalendlyHeight] = useState("650px")

  // Client-side query parameters state
  const [status, setStatus] = useState<string | null>(null)
  const [leadEmail, setLeadEmail] = useState<string | null>(null)
  const [leadName, setLeadName] = useState<string | null>(null)
  const [leadPhone, setLeadPhone] = useState<string | null>(null)
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})

  // Parse URL search parameters on mount (safe for static HTML generation)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      setStatus(searchParams.get("status") || "qualified") // default to qualified if not specified
      setLeadEmail(searchParams.get("email"))
      setLeadName(searchParams.get("name"))
      setLeadPhone(searchParams.get("phone"))

      const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
      const utms: Record<string, string> = {}
      utmKeys.forEach((key) => {
        const val = searchParams.get(key)
        if (val) utms[key] = val
      })
      setUtmParams(utms)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    async function loadConfig() {
      const { data } = await supabase
        .from("website_content")
        .select("*")
        .eq("section_key", "system_config")
        .single()

      if (data?.content?.calendly_url) {
        setCalendlyBaseUrl(data.content.calendly_url)
      }
      setLoading(false)
    }
    loadConfig()
  }, [])

  useEffect(() => {
    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return
      if (e.data?.event === "calendly.page_height") {
        const h = e.data.payload?.height
        if (h) setCalendlyHeight(`${h}px`)
      }
    }
    window.addEventListener("message", handleCalendlyMessage)
    return () => window.removeEventListener("message", handleCalendlyMessage)
  }, [])

  const buildCalendlyUrl = useCallback(() => {
    const params = new URLSearchParams(CALENDLY_PARAMS)
    if (leadName) params.set("name", leadName)
    if (leadEmail) params.set("email", leadEmail)
    if (leadPhone) params.set("phone_number", leadPhone)
    Object.entries(utmParams).forEach(([k, v]) => {
      params.set(k, v)
    })
    return `${calendlyBaseUrl}?${params.toString()}`
  }, [calendlyBaseUrl, leadName, leadEmail, leadPhone, utmParams])

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 transition-transform group-hover:scale-105 duration-300">
              <BrandLogo fill className="object-contain" priority />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent-gold hidden sm:block">
              Mercian Wealth
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-gold transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Dynamic Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-1 flex flex-col justify-center w-full">
        {status === "queued" ? (
          /* QUEUED/STAGED LAYOUT */
          <div className="max-w-2xl mx-auto w-full glass border border-accent-gold/15 rounded-3xl p-8 sm:p-12 text-center space-y-8 bg-bg-tertiary/20 relative shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold to-transparent" />
            
            <div className="mx-auto h-16 w-16 rounded-full bg-accent-gold/10 border border-accent-gold/25 flex items-center justify-center text-accent-gold animate-pulse">
              <Sparkles size={28} />
            </div>
            
            <div className="space-y-2">
              <span className="text-xxs uppercase tracking-[0.25em] text-accent-gold font-extrabold">
                System Telemetry Staged
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Operational Review Initiated
              </h1>
            </div>

            <div className="space-y-5 text-sm text-muted-foreground leading-relaxed border-y border-white/5 py-8">
              <p>
                Mercian Wealth operates under strict bandwidth calibrations. We only allocate active developer channels where a minimum of <strong>3x operational leverage</strong> is guaranteed.
              </p>
              <p>
                Your diagnostic data has been securely logged. An initial roadmap calibration report has been staged for transmission to your corporate address:{" "}
                <strong className="text-foreground font-mono">{leadEmail || "your email"}</strong>.
              </p>
              <p className="text-xs opacity-60">
                If telemetry confirms compatibility with our cohort schedule, an integration key will be unlocked and dispatched to you.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3.5 bg-accent-gold text-black font-semibold rounded-lg text-sm transition-all duration-300 hover:bg-[#aa8417] text-center"
              >
                Return to Command Center
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-3.5 bg-white/5 border border-white/10 hover:border-accent-gold/45 text-foreground hover:text-accent-gold text-sm font-semibold rounded-lg transition-all duration-300 text-center"
              >
                Explore Deployed Systems
              </Link>
            </div>

            <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground opacity-60 pt-4">
              <ShieldCheck size={12} className="text-accent-gold" />
              <span>Bespoke systems deployment. Your data remains strictly confidential.</span>
            </div>
          </div>
        ) : (
          /* STANDARD QUALIFIED BOOKING LAYOUT */
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xxs font-bold uppercase tracking-widest text-green-400">
                  <CheckCircle size={11} /> Qualification Submitted
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Request Your{" "}
                  <span className="text-gradient-gold">Alignment Session</span>
                </h1>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Your application is registered. Select a time below to request your clinical evaluation session. We confirm all bookings within one business day.
                </p>
              </div>

              <div className="space-y-3.5 border-t border-accent-gold/10 pt-6">
                {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-gold/10 border border-accent-gold/25 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-accent-gold" />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-accent-gold/15 overflow-hidden shadow-2xl calendly-widget-wrapper relative min-h-[min(60vh,650px)]">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-bg-primary z-10">
                    <Loader2 size={32} className="text-accent-gold animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading scheduler…</p>
                  </div>
                ) : (
                  <iframe
                    src={buildCalendlyUrl()}
                    width="100%"
                    title="Schedule alignment session — Mercian Wealth"
                    loading="lazy"
                    style={{ height: calendlyHeight, minWidth: "320px", border: "none" }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-accent-gold/10 py-6 text-center text-xs text-muted-foreground relative z-10 glass">
        <p>© {new Date().getFullYear()} Mercian Wealth. All rights reserved.</p>
      </footer>
    </main>
  )
}
