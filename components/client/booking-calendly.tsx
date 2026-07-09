'use client'
 
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, ExternalLink, Shield, CheckCircle2, Clock, Star, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
 
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/mercianwealth/30min"
 
const CALENDLY_PARAMS = {
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color:       process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color:    process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C5A059",
  hide_landing_page_details: "1",
  hide_gdpr_banner: "1",
}
 
interface ClientBookingCalendlyProps {
  fullName: string
  email: string
  website: string
}
 
export function ClientBookingCalendly({ fullName, email, website }: ClientBookingCalendlyProps) {
  const [calendlyHeight, setCalendlyHeight] = useState("700px")
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)
  const [calendlyTimedOut, setCalendlyTimedOut] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
 
  const buildCalendlyUrl = useCallback(() => {
    const params = new URLSearchParams(CALENDLY_PARAMS)
    params.set("name", fullName)
    params.set("email", email)
    if (website) {
      params.set("a1", website)
    }
    return `${CALENDLY_URL}?${params.toString()}`
  }, [fullName, email, website])
 
  // Handle Calendly messages
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
            if (fallbackTimerRef.current) {
              clearTimeout(fallbackTimerRef.current)
              fallbackTimerRef.current = null
            }
          }
          break
        }
        case "calendly.event_scheduled": {
          toast.success("Your sync session is scheduled! 🎉 Check your email for confirmation.", {
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
 
  // Fallback timer
  useEffect(() => {
    setCalendlyLoaded(false)
    setCalendlyTimedOut(false)
 
    fallbackTimerRef.current = setTimeout(() => {
      setCalendlyTimedOut(true)
    }, 12000)
 
    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
    }
  }, [retryCount])
 
  return (
    <div className="grid lg:grid-cols-[1fr_2.2fr] gap-12 items-start w-full">
      {/* Left Column: Visual Signals */}
      <div className="lg:sticky lg:top-24 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gold">
            Partner Alignment
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Review & Strategy Session
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Select an available time slot for your project roadmap check-in. Your account details have been automatically synced to bypass qualification vetting.
          </p>
        </div>
 
        {/* Trust Badges */}
        <div className="space-y-3 pt-2">
          {[
            { icon: Clock, text: "30-minute sync session" },
            { icon: Shield, text: "Automated pre-fill details" },
            { icon: Star, text: "Direct line to build architects" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-gold" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{text}</span>
            </div>
          ))}
        </div>
 
        {/* Social Proof Snippet */}
        <div className="glass rounded-xl p-5 border border-gold/10 space-y-2 bg-[#0E0E0F]/50">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-gold text-gold" />
            ))}
          </div>
          <p className="text-xs text-foreground italic leading-relaxed">
            &ldquo;Syncing weekly with the engineering team kept our launch timeline accurate to the day.&rdquo;
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold">— Daniel K., Kensington Advisory</p>
        </div>
      </div>
 
      {/* Right Column: Calendly Embed */}
      <div className="space-y-4">
        {/* Verification banner */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/15 bg-gold/[0.02]">
          <CheckCircle2 size={14} className="text-gold shrink-0" />
          <p className="text-xxs text-muted-foreground">
            Authenticated as <span className="text-gold font-semibold">{fullName}</span> ({email}). Vetting bypassed.
          </p>
        </div>
 
        <div
          className="relative rounded-2xl overflow-hidden border border-gold/10 shadow-2xl min-h-[650px] calendly-widget-wrapper"
          style={{ background: "#0A0A0A" }}
        >
          {/* Skeleton loading state */}
          {!calendlyLoaded && !calendlyTimedOut && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 py-32 bg-[#0A0A0A] z-10">
              <Loader2 size={24} className="animate-spin text-gold" />
              <p className="text-xs text-muted-foreground font-mono">Loading sync calendar...</p>
            </div>
          )}
 
          {/* Fallback layout */}
          {calendlyTimedOut && !calendlyLoaded && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-[#0A0A0A] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto">
                <AlertCircle size={20} className="text-gold" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-foreground">Calendar couldn't load</p>
                <p className="text-xxs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  This can happen due to strict browser tracking protections. You can still load the calendar directly on Calendly.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCalendlyTimedOut(false);
                    setCalendlyLoaded(false);
                    setRetryCount(prev => prev + 1);
                  }}
                  className="px-3.5 py-1.5 bg-gold text-background text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Retry Load
                </button>
                <a
                  href={buildCalendlyUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold hover:underline text-xs font-bold"
                >
                  Open Calendly <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
 
          <iframe
            key={retryCount}
            src={buildCalendlyUrl()}
            width="100%"
            className="relative z-0"
            style={{ height: calendlyHeight, minWidth: "320px", border: "none" }}
            title="Sovereign Partner Sync Scheduler"
            loading="lazy"
            onLoad={() => {
              setCalendlyLoaded(true)
              if (fallbackTimerRef.current) {
                clearTimeout(fallbackTimerRef.current)
                fallbackTimerRef.current = null
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
