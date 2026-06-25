"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Clock, Shield, Star, CheckCircle, Loader2 } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const CALENDLY_PARAMS = new URLSearchParams({
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color: process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color: process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C9A227",
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
    return `${calendlyBaseUrl}?${params.toString()}`
  }, [calendlyBaseUrl])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-gold/5 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-accent-gold/3 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />
      </div>

      <header className="relative z-10 border-b border-accent-gold/10 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 transition-transform group-hover:scale-105 duration-300">
              <BrandLogo fill className="object-contain" priority />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent-gold hidden sm:block">
              GS Legacy Wealth
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-1">
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
                  <div className="w-8 h-8 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center shrink-0">
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
                  title="Schedule alignment session — GS Legacy Wealth"
                  loading="lazy"
                  style={{ height: calendlyHeight, minWidth: "320px", border: "none" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-accent-gold/10 py-6 text-center text-xs text-muted-foreground relative z-10 glass">
        <p>© {new Date().getFullYear()} GS Legacy Wealth. All rights reserved.</p>
      </footer>
    </main>
  )
}
