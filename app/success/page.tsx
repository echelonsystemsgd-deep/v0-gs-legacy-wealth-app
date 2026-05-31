'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Clock, Shield, Star, CheckCircle, Calendar, Sparkles, Loader2 } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Clock, text: '30-min strategy focus session' },
  { icon: Shield, text: 'Completely confidential & non-binding' },
  { icon: Star, text: 'Exclusive review of your brand' },
]

export default function SuccessPage() {
  const supabase = createClient()
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/gslegacywealth/30min')
  const [loading, setLoading] = useState(true)
  const calendlyContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadConfig() {
      const { data } = await supabase
        .from('website_content')
        .select('*')
        .eq('section_key', 'system_config')
        .single()

      if (data && data.content && data.content.calendly_url) {
        setCalendlyUrl(data.content.calendly_url)
      }
      setLoading(false)
    }
    loadConfig()
  }, [supabase])

  // Initialize the inline widget once Calendly script is loaded or URL changes
  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).Calendly && calendlyContainerRef.current) {
        // Clean out any previous widgets before rendering
        calendlyContainerRef.current.innerHTML = ''
        ;(window as any).Calendly.initInlineWidget({
          url: `${calendlyUrl}?background_color=050505&text_color=F5F5F5&primary_color=D4AF37&hide_gdpr_banner=1&hide_landing_page_details=1`,
          parentElement: calendlyContainerRef.current,
          resize: true,
        })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [loading, calendlyUrl])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).Calendly && calendlyContainerRef.current) {
            calendlyContainerRef.current.innerHTML = ''
            ;(window as any).Calendly.initInlineWidget({
              url: `${calendlyUrl}?background_color=050505&text_color=F5F5F5&primary_color=D4AF37&hide_gdpr_banner=1&hide_landing_page_details=1`,
              parentElement: calendlyContainerRef.current,
              resize: true,
            })
          }
        }}
      />

      {/* Decorative gradient canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Top Nav Bar */}
      <header className="relative z-10 border-b border-gold/10 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/GS_Legacy_Wealth-removebg-preview.png"
                alt="GS Legacy Wealth"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-gold hidden sm:block">
              GS Legacy Wealth
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-1">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Confirmation & Info */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xxs font-bold uppercase tracking-widest text-green-400">
                <CheckCircle size={11} /> Application Submitted
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                One Final Step: <br />
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                  Schedule Call
                </span>
              </h1>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Your application details have been registered in our queue. Use the calendar on the right to lock in your strategy session instantly.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3.5 border-t border-gold/10 pt-6">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Quote review */}
            <div className="glass rounded-2xl p-5 border border-gold/15 space-y-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                &ldquo;Their AI systems have completely streamlined our booking and enquiry workflow. The ROI was clear within weeks.&rdquo;
              </p>
              <p className="text-xxs text-muted-foreground font-semibold">— Marcus V., Managing Director, V-Capital</p>
            </div>
          </div>

          {/* Right Column: Calendly Embed container */}
          <div className="lg:col-span-7">
            <div className="glass rounded-3xl border border-gold/15 p-1 min-h-[650px] shadow-2xl relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={32} className="text-gold animate-spin" />
                  <p className="text-sm text-muted-foreground animate-pulse">Initializing scheduler...</p>
                </div>
              ) : null}
              {/* Calendly Inline Widget Anchor */}
              <div
                ref={calendlyContainerRef}
                className="w-full rounded-2xl overflow-hidden bg-transparent"
                style={{ height: '650px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gold/10 py-6 text-center text-xs text-muted-foreground relative z-10 glass">
        <p>© 2026 GS Legacy Wealth AI. All rights reserved.</p>
      </footer>
    </main>
  )
}
