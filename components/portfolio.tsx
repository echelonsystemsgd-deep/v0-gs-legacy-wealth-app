"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, X, Loader2, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { SITE_COPY } from "@/lib/site-copy"

type PortfolioItem = {
  title: string
  category: string
  gradient: string
  href?: string | null
  image?: string | null
  underConstruction: boolean
  metric?: string | null
}

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    title: "Stamp Valuation App",
    category: "AI Computer Vision · Case Study",
    gradient: "from-blue-500/20 to-cyan-500/20",
    href: null,
    image: "/stamp-app-preview.png",
    underConstruction: true,
    metric: "Target Latency: < 1s",
  },
  {
    title: "Caker St. London Bakery",
    category: "E-Commerce & Ordering · Case Study",
    gradient: "from-rose-500/20 to-amber-500/20",
    href: null,
    image: "/caker-st-preview.png",
    underConstruction: true,
    metric: "Interactive Cake Concierge",
  },
  {
    title: "Grand Wedding Cakes",
    category: "Luxury Bridal Atelier · Case Study",
    gradient: "from-amber-500/20 to-orange-500/20",
    href: null,
    image: "/grand-wedding-cakes-preview.png",
    underConstruction: true,
    metric: "Tier Architecture & White-Glove Setup",
  },
]

function PremiumMockup({ item }: { item: PortfolioItem }) {
  if (item.title === "Caker St. London Bakery" || item.title.includes("Caker St")) {
    return (
      <div className="absolute inset-2 sm:inset-4 bg-[#140608] rounded-xl border border-rose-950/60 overflow-hidden shadow-2xl flex flex-col font-sans">
        <div className="flex items-center justify-between px-3 py-2 bg-[#1f0a0d] border-b border-rose-900/30 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          </div>
          <div className="h-3.5 bg-rose-950/50 border border-rose-900/30 rounded-full px-3 text-[7px] text-amber-200/60 flex items-center justify-center font-mono">
            caker-st-prototype.vercel.app
          </div>
          <div className="w-4" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-[#1a070a] to-[#0d0304]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-tight text-white font-serif">CAKER ST.</span>
              <span className="text-[6px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full">LONDON</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[6px] text-emerald-400 font-bold">★ 4.9 Trustpilot</span>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-white leading-tight">Artisan Celebration Cakes Delivered Across England</h4>
            <p className="text-[7px] text-rose-200/70 leading-relaxed max-w-[90%]">Handcrafted character, birthday & wedding cakes. 100% Eggless & Halal options with chilled UK delivery.</p>
          </div>
          <div className="bg-[#240c11] border border-rose-900/40 rounded p-2 flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[6px] text-amber-400/90 block font-mono font-bold">INTERACTIVE CONCIERGE</span>
              <span className="text-[8px] font-bold text-white">Find Your Dream Cake in 30s</span>
            </div>
            <div className="h-4 px-2 bg-amber-400 text-slate-950 rounded flex items-center justify-center font-bold text-[7px]">
              Shop Cakes →
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (item.title === "Grand Wedding Cakes" || item.title.includes("Grand Wedding")) {
    return (
      <div className="absolute inset-2 sm:inset-4 bg-[#0d0f14] rounded-xl border border-amber-900/30 overflow-hidden shadow-2xl flex flex-col font-sans">
        <div className="flex items-center justify-between px-3 py-2 bg-[#141824] border-b border-amber-900/20 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          </div>
          <div className="h-3.5 bg-white/5 border border-white/10 rounded-full px-3 text-[7px] text-amber-200/60 flex items-center justify-center font-mono">
            grand-wedding-cakes-prototype.vercel.app
          </div>
          <div className="w-4" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-[#161a29] to-[#0d101a]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-serif font-semibold tracking-wider text-amber-200">GRAND WEDDING CAKES</span>
            </div>
            <span className="text-[6px] uppercase tracking-widest text-[#DAA640] border border-[#DAA640]/30 bg-[#DAA640]/10 px-1.5 py-0.5 rounded-full font-mono">LUXURY ATELIER</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-serif font-medium text-white leading-tight">Grand Cakes For Your Greatest Celebration</h4>
            <p className="text-[7px] text-white/60 leading-relaxed max-w-[88%]">Bespoke multi-tier luxury wedding cakes handcrafted in London with couture sugar florals & white-glove styling.</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-[#1c2236] border border-white/5 rounded p-1 text-center">
              <span className="text-[6px] text-white/40 block font-mono">Drop Off</span>
              <span className="text-[8px] font-serif font-bold text-amber-300">From £450</span>
            </div>
            <div className="bg-[#1c2236] border border-[#DAA640]/30 rounded p-1 text-center bg-[#DAA640]/5">
              <span className="text-[6px] text-[#DAA640] block font-mono font-bold">Silver Tier</span>
              <span className="text-[8px] font-serif font-bold text-white">From £750</span>
            </div>
            <div className="bg-[#1c2236] border border-white/5 rounded p-1 text-center">
              <span className="text-[6px] text-white/40 block font-mono">Gold Tier</span>
              <span className="text-[8px] font-serif font-bold text-amber-300">From £1k</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-4 lg:inset-6 bg-card rounded-xl border border-border overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-accent-gold/20 rounded w-2/3" />
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-4/5" />
      </div>
    </div>
  )
}

function RequestSystemSchemaModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return
    setIsSubmitting(true)
    setErrorMsg(null)

    // Capture UTM tracking parameters from current page URL
    let utmParams: Record<string, string> = {}
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      utmKeys.forEach((key) => {
        const val = searchParams.get(key)
        if (val) utmParams[key] = val
      })
    }

    try {
      const res = await fetch('/api/portfolio/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          project_name: item.title,
          referrer: typeof document !== 'undefined' ? document.referrer : 'none',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'none',
          ...utmParams,
        }),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit request. Please try again.")
      }

      setSubmitted(true)
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="schema-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

        <motion.div
          key="schema-window"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-bg-tertiary border border-primary/20 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 transition-colors rounded-full p-1.5 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-accent-gold mb-6">
            <Lock size={28} />
          </div>

          <h3 className="font-serif text-2xl font-bold text-text-primary mb-3">
            Book A Live Demonstration
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Every system is built to suit the exact workflow of a local business. Rather than browsing generic templates, book a 15-minute call to see a live demonstration tailored to your exact industry.
          </p>

          {errorMsg && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg text-left">
              {errorMsg}
            </div>
          )}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 px-4 bg-primary/10 border border-primary/20 rounded-xl text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center mx-auto text-accent-gold">
                <svg className="w-6 h-6 animate-bounce text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-serif text-lg font-bold text-accent-gold">Request Received</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your request for the sanitized blueprints and case study of <strong>{item.title}</strong> has been secured. We will transmit the walkthrough details directly to <strong>{email}</strong> shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {SITE_COPY.portfolioPage.nameLabel} *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-primary/45 focus:border-primary/60 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    {SITE_COPY.portfolioPage.emailLabel} *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-primary/45 focus:border-primary/60 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-gold text-bg-primary font-bold hover:bg-accent-gold/90 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin text-bg-primary" />
                ) : (
                  <>
                     <span>{SITE_COPY.portfolioPage.submitBtnText}</span>
                     <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-accent-gold transition-colors underline underline-offset-4 cursor-pointer"
            >
              Go Back to Portfolio
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function PrototypePreviewModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [loading, setLoading] = useState(true)

  return (
    <AnimatePresence>
      <motion.div
        key="preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

        <motion.div
          key="preview-window"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full h-full md:h-[85vh] md:max-w-6xl bg-bg-tertiary md:border md:border-white/10 rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="text-left">
                <h4 className="font-serif text-sm font-bold text-white leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] uppercase tracking-wider text-accent-gold font-semibold leading-none mt-0.5">
                  {item.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent-gold hover:underline flex items-center gap-1 mr-2 font-mono"
                >
                  <span>Open External</span>
                  <ArrowRight size={12} />
                </a>
              )}
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white hover:bg-white/10 transition-colors rounded-full p-1.5 cursor-pointer"
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Prototype Banner */}
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 py-2 px-4 text-center text-[10px] md:text-xs font-semibold font-sans flex items-center justify-center gap-1.5 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Demo · Sandbox Preview Mode</span>
          </div>

          {/* Interactive Frame or Showcase Box */}
          <div className="flex-1 relative bg-black/40 overflow-hidden">
            {item.href ? (
              <>
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg-tertiary z-20 transition-opacity duration-300">
                    <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
                    <p className="text-xs text-muted-foreground font-mono">
                      Loading prototype viewport...
                    </p>
                  </div>
                )}
                <iframe
                  src={item.href}
                  className="w-full h-full border-none bg-white"
                  onLoad={() => setLoading(false)}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
                {item.image && (
                  <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-serif font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{item.category}</p>
                  {item.metric && (
                    <p className="text-xs font-bold text-accent-gold font-mono uppercase">
                      Telemetry: {item.metric}
                    </p>
                  )}
                </div>
                <Button
                  asChild
                  className="bg-accent-gold text-bg-primary font-bold hover:bg-accent-gold/90"
                >
                  <Link href="/contact">
                    Book Live Bespoke Walkthrough →
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function Portfolio({ limit }: { limit?: number }) {
  const supabase = createClient()
  const [requestSchemaModal, setRequestSchemaModal] = useState<PortfolioItem | null>(null)
  const [previewPrototype, setPreviewPrototype] = useState<PortfolioItem | null>(null)
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO)

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('is_archived', false)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            title: d.project_name,
            category: d.badge_type || d.industry || (d.under_construction ? 'Architecture Case Study' : 'Interactive Sandbox'),
            gradient: d.gradient || 'from-blue-500/20 to-indigo-500/20',
            href: d.website_link || d.live_demo_url || null,
            image: d.cover_image,
            underConstruction: Boolean(d.under_construction),
            metric: d.metric || d.case_study_metrics || null,
          }))
          setItems(mapped)
        }
      } catch (err: any) {
        console.warn('Live portfolio items unavailable, using built-in showcase assets:', err?.message || err)
      }
    }
    loadPortfolio()
  }, [supabase])

  const displayItems = limit ? items.slice(0, limit) : items

  return (
    <>
      <section id="portfolio" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
              Selected Work
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Websites That Mean Business
            </h2>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-16">
            {displayItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-[#DAA640]/20 hover:border-[#DAA640] transition-all duration-300 bg-[#07153B] aspect-[16/10] sm:aspect-[16/10]"
              >
                {/* Visual Image / Mockup background */}
                <div className="w-full h-full relative z-10">
                  {item.image ? (
                    <div className="absolute inset-2 sm:inset-4 rounded-xl border border-slate-700/60 overflow-hidden shadow-2xl flex flex-col bg-[#020E28]">
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#07153B] border-b border-slate-700/50 shrink-0">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500/70" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                          <div className="w-2 h-2 rounded-full bg-green-500/70" />
                        </div>
                      </div>
                      <div className="relative flex-1">
                        <Image
                           src={item.image}
                           alt={item.title}
                           fill
                           className="object-cover object-top"
                           sizes="(max-width: 768px) 100vw, 50vw"
                           priority={index === 0}
                        />
                      </div>
                    </div>
                  ) : (
                    <PremiumMockup item={item} />
                  )}
                </div>

                {/* Hover Reveal Slide-Up Overlay — Desktop only */}
                <div className="absolute inset-0 bg-[#020E28]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden md:flex flex-col justify-center items-center p-8 text-center space-y-4">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-3">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <p className="text-xs uppercase tracking-widest text-[#DAA640] font-semibold">
                        {item.category}
                      </p>
                      {!item.underConstruction ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
                          Live Interactive Sandbox
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#DAA640] bg-[#DAA640]/10 border border-[#DAA640]/30 px-2.5 py-0.5 rounded-full font-mono">
                          Architecture Case Study
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-2xl font-extrabold text-white">
                      {item.title}
                    </h3>
                    {item.metric && (
                      <p className="text-xs font-mono font-bold text-[#DAA640] uppercase tracking-wider">
                        Benchmark: {item.metric}
                      </p>
                    )}
                    <div className="pt-2">
                      {!item.underConstruction ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewPrototype(item)}
                          className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-[#020E28] transition-all"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Launch Live Sandbox →
                          </span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRequestSchemaModal(item)}
                          className="border-[#DAA640]/40 text-white hover:bg-[#DAA640] hover:text-[#020E28] transition-all"
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">
                            View Blueprint →
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom Bar — always visible, hidden on desktop */}
                <div className="absolute bottom-0 left-0 right-0 z-20 flex md:hidden items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-[#020E28]/90 border-t border-[#DAA640]/30 backdrop-blur-sm min-w-0 max-w-full">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5 min-w-0 flex-wrap">
                      <p className="text-[10px] uppercase tracking-widest text-[#DAA640] font-semibold leading-none truncate max-w-full">
                        {item.category} {item.metric ? `· ${item.metric}` : ''}
                      </p>
                      {!item.underConstruction ? (
                        <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-mono">
                          Live Sandbox
                        </span>
                      ) : (
                        <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider text-[#DAA640] bg-[#DAA640]/10 border border-[#DAA640]/30 px-1.5 py-0.5 rounded-full font-mono">
                          Case Study
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-xs sm:text-sm font-bold text-white truncate">
                      {item.title}
                    </h3>
                  </div>
                  {!item.underConstruction ? (
                    <button
                      className="shrink-0 ml-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#020E28] bg-emerald-400 px-3 py-1.5 rounded-lg active:opacity-80 transition-opacity cursor-pointer"
                      onClick={() => setPreviewPrototype(item)}
                    >
                      Test Sandbox →
                    </button>
                  ) : (
                    <button
                      className="shrink-0 ml-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#020E28] bg-[#DAA640] px-3 py-1.5 rounded-lg active:opacity-80 transition-opacity cursor-pointer"
                      onClick={() => setRequestSchemaModal(item)}
                    >
                      View Blueprint →
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Button */}
          {limit && (
            <div className="text-center">
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-sm font-bold tracking-wider uppercase"
              >
                <Link href="/portfolio" className="flex items-center gap-2">
                  View Full Portfolio
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Request System Schema Modal */}
      {requestSchemaModal && (
        <RequestSystemSchemaModal item={requestSchemaModal} onClose={() => setRequestSchemaModal(null)} />
      )}

      {/* Prototype Preview Modal */}
      {previewPrototype && (
        <PrototypePreviewModal item={previewPrototype} onClose={() => setPreviewPrototype(null)} />
      )}
    </>
  )
}
