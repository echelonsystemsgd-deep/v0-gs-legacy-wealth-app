"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Crown, X, ExternalLink, Loader2, Wrench } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const portfolioItems = [
  {
    title: "Stamp Valuation App",
    category: "Web Application",
    gradient: "from-blue-500/20 to-cyan-500/20",
    href: "https://v0-stamp-valuation-app.vercel.app",
    image: "/stamp-app-preview.png",
    underConstruction: true,
  },
  {
    title: "Elite Fitness Studio",
    category: "Gym Website",
    gradient: "from-amber-500/20 to-orange-500/20",
    underConstruction: true,
  },
  {
    title: "Prestige Properties",
    category: "Estate Agent Website",
    gradient: "from-emerald-500/20 to-teal-500/20",
    underConstruction: true,
  },
  {
    title: "Strategic Growth Co.",
    category: "Consultant Landing Page",
    gradient: "from-blue-500/20 to-indigo-500/20",
    underConstruction: true,
  },
  {
    title: "AutoFlow Systems",
    category: "AI Automation Dashboard",
    gradient: "from-purple-500/20 to-pink-500/20",
    underConstruction: true,
  },
]

type PortfolioItem = typeof portfolioItems[number]

function PremiumMockup({ item }: { item: PortfolioItem }) {
  if (item.title === "Elite Fitness Studio") {
    return (
      <div className="absolute inset-4 lg:inset-6 bg-[#0E0E10] rounded-xl border border-white/5 overflow-hidden shadow-2xl flex flex-col font-sans">
        {/* Browser Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#16161A] border-b border-white/5 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
          <div className="h-3.5 bg-white/5 rounded-full px-4 text-[7px] text-white/30 flex items-center justify-center font-mono">
            elitefitness.com/dashboard
          </div>
          <div className="w-4" />
        </div>
        {/* Content Mockup */}
        <div className="flex-1 p-3 flex flex-col gap-2 justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-serif">ELITE FITNESS</span>
            <div className="w-6 h-3 bg-amber-500/20 border border-amber-500/30 rounded-full" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-white leading-tight">Sculpt Your Ultimate Physique</h4>
            <p className="text-[7px] text-white/50 leading-relaxed max-w-[80%]">High-intensity training programs for high-performers.</p>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="bg-[#16161A] border border-white/5 rounded p-1.5 text-center">
              <span className="text-[7px] text-white/40 block font-mono">Daily Active</span>
              <span className="text-[9px] font-bold text-amber-500">142</span>
            </div>
            <div className="bg-[#16161A] border border-white/5 rounded p-1.5 text-center">
              <span className="text-[7px] text-white/40 block font-mono">Booking Rate</span>
              <span className="text-[9px] font-bold text-amber-500">94%</span>
            </div>
            <div className="bg-[#16161A] border border-white/5 rounded p-1.5 text-center">
              <span className="text-[7px] text-white/40 block font-mono">Retention</span>
              <span className="text-[9px] font-bold text-amber-500">98%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (item.title === "Prestige Properties") {
    return (
      <div className="absolute inset-4 lg:inset-6 bg-[#0B0D0C] rounded-xl border border-white/5 overflow-hidden shadow-2xl flex flex-col font-sans">
        <div className="flex items-center justify-between px-3 py-2 bg-[#121614] border-b border-white/5 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
          <div className="h-3.5 bg-white/5 rounded-full px-4 text-[7px] text-white/30 flex items-center justify-center font-mono">
            prestigeproperties.com
          </div>
          <div className="w-4" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest font-serif">PRESTIGE</span>
            <span className="text-[6px] text-emerald-500/80 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-mono">ESTATES</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-white leading-tight">The Mayfair Penthouse</h4>
            <p className="text-[7px] text-white/50 leading-relaxed max-w-[85%]">Luxury architectural design with panoramic London views.</p>
          </div>
          <div className="bg-[#121614] border border-white/5 rounded p-2 flex justify-between items-center">
            <div>
              <span className="text-[6px] text-white/40 block font-mono">GUIDE PRICE</span>
              <span className="text-[9px] font-bold text-[#f5f5f7]">£4,250,000</span>
            </div>
            <div className="w-8 h-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded flex items-center justify-center">
              <span className="text-[6px] text-emerald-400 font-bold font-mono">INQUIRE</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (item.title === "Strategic Growth Co.") {
    return (
      <div className="absolute inset-4 lg:inset-6 bg-[#090A0F] rounded-xl border border-white/5 overflow-hidden shadow-2xl flex flex-col font-sans">
        <div className="flex items-center justify-between px-3 py-2 bg-[#12131C] border-b border-white/5 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
          <div className="h-3.5 bg-white/5 rounded-full px-4 text-[7px] text-white/30 flex items-center justify-center font-mono">
            strategicgrowth.co/dashboard
          </div>
          <div className="w-4" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest font-mono">STRATEGIC</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500/20 rounded-full" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[6px] text-blue-400 block font-bold tracking-wider font-mono">ANNUAL METRICS</span>
            <h4 className="text-[11px] font-bold text-white leading-tight">+238% Conversion Increase</h4>
          </div>
          {/* Mock Chart */}
          <div className="h-10 flex items-end gap-1 px-1 bg-white/5 rounded border border-white/5 py-1">
            <div className="bg-blue-500/20 w-full h-[30%] rounded-sm" />
            <div className="bg-blue-500/40 w-full h-[55%] rounded-sm" />
            <div className="bg-blue-500/60 w-full h-[45%] rounded-sm" />
            <div className="bg-blue-500/80 w-full h-[70%] rounded-sm" />
            <div className="bg-blue-500 w-full h-[95%] rounded-sm" />
          </div>
        </div>
      </div>
    )
  }

  if (item.title === "AutoFlow Systems") {
    return (
      <div className="absolute inset-4 lg:inset-6 bg-[#0E0B11] rounded-xl border border-white/5 overflow-hidden shadow-2xl flex flex-col font-sans">
        <div className="flex items-center justify-between px-3 py-2 bg-[#17121C] border-b border-white/5 shrink-0">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          </div>
          <div className="h-3.5 bg-white/5 rounded-full px-4 text-[7px] text-white/30 flex items-center justify-center font-mono">
            autoflow.ai/canvas
          </div>
          <div className="w-4" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest font-mono">AUTOFLOW</span>
            <span className="text-[6px] text-purple-400 bg-purple-500/10 border border-purple-500/25 px-1 py-0.5 rounded font-mono">AI CORE v2</span>
          </div>
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-white leading-tight">Automated Sales Funnel</h4>
            <p className="text-[7px] text-white/50 max-w-[90%] leading-relaxed">Sync leads directly to CRM and trigger custom email campaigns.</p>
          </div>
          {/* Visual node flowchart mockup */}
          <div className="flex gap-1 justify-between items-center text-center">
            <div className="bg-white/5 border border-purple-500/30 rounded p-1 flex-1">
              <span className="text-[6px] font-bold text-purple-400 block font-mono">TRIGGER</span>
              <span className="text-[5px] text-white/60">New Booking</span>
            </div>
            <div className="w-3 h-0.5 bg-purple-500/40" />
            <div className="bg-white/5 border border-purple-500/30 rounded p-1 flex-1">
              <span className="text-[6px] font-bold text-purple-400 block font-mono">AI AGENT</span>
              <span className="text-[5px] text-white/60">Qualify</span>
            </div>
            <div className="w-3 h-0.5 bg-purple-500/40" />
            <div className="bg-white/5 border border-purple-500/30 rounded p-1 flex-1">
              <span className="text-[6px] font-bold text-purple-400 block font-mono">CRM SYNC</span>
              <span className="text-[5px] text-white/60">Create Deal</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback wireframe
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
        <div className="h-4 bg-gold/20 rounded w-2/3" />
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-4/5" />
      </div>
    </div>
  )
}

function SitePreviewModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Modal Window */}
        <motion.div
          key="modal-window"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-6xl h-[85vh] flex flex-col rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Browser Chrome Bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0d0d0d] border-b border-white/10 shrink-0">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                aria-label="Close modal"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>

            {/* Address bar */}
            <div className="flex-1 mx-2 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center px-3 gap-2 min-w-0">
              <div className="w-3 h-3 shrink-0 text-gold/60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="text-xs text-white/40 truncate font-mono">
                {item.href?.replace("https://", "")}
              </span>
            </div>

            {/* Open in new tab */}
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-gold/60 hover:text-gold transition-colors shrink-0 px-2 py-1 rounded-md hover:bg-gold/5"
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">Open in tab</span>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Iframe area */}
          <div className="relative flex-1 bg-white">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a14] gap-3 z-10">
                <Loader2 size={28} className="text-gold animate-spin" />
                <p className="text-sm text-muted-foreground">Loading {item.title}...</p>
              </div>
            )}
            <iframe
              src={item.href}
              title={item.title}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function UnderConstructionModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("gslegacywealth@gmail.com")
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      // Fallback
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error } = await supabase.from("leads").insert({
        name: name || "Anonymous Visitor",
        business_name: "N/A (Portfolio Waitlist)",
        email: email,
        website: item.href || null,
        notes: `Waitlist registration for under-construction site: ${item.title}`,
        source: "portfolio_waitlist",
        status: "New"
      })
      if (error) {
        throw error
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
        key="construction-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

        {/* Modal Window */}
        <motion.div
          key="construction-window"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md bg-[#0a0a0f] border border-gold/20 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button in top corner */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 transition-colors rounded-full p-1.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Construction icon with pulsing gold background */}
          <div className="relative mx-auto w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-pulse">
            <Wrench size={28} />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#f5f5f7] mb-3">
            Currently Under Construction
          </h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            This platform is being crafted with precision to deliver a premium experience. In the meantime, inquiries are offline.
          </p>

          {errorMsg ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <div className="py-4 px-3 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <p className="text-xs font-serif text-gold uppercase tracking-widest leading-none font-bold">
                  Registry Offline
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our automated invitation queue is currently undergoing scheduled refinement. To secure early access and submit your inquiry, please contact our concierge team directly.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCopy}
                  className="w-full flex flex-col items-center justify-center gap-1 py-4 px-4 rounded-xl bg-gradient-to-r from-gold/10 to-gold/20 border border-gold/30 hover:border-gold/60 text-gold transition-all cursor-pointer relative overflow-hidden group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60 leading-none">
                    Concierge Desk Email
                  </span>
                  <span className="text-sm font-semibold font-mono tracking-wide text-foreground mt-1 group-hover:text-gold transition-colors">
                    gslegacywealth@gmail.com
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1 underline decoration-gold/30 group-hover:decoration-gold transition-all">
                    {copied ? "✓ Copied to clipboard!" : "Click to copy email"}
                  </span>
                </button>

                <a
                  href="mailto:gslegacywealth@gmail.com?subject=Inquiry%20regarding%20Portfolio"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                >
                  <span>Open Mail Client</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ) : submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 px-3 bg-gold/5 border border-gold/20 rounded-xl text-sm text-gold"
            >
              <p className="font-bold mb-1">Thank you for your interest!</p>
              <p className="text-xs text-muted-foreground">We will notify you as soon as this site is live.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-gold/35 focus:border-gold/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Your Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-gold/35 focus:border-gold/50 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Notify Me When Live</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer"
            >
              Go Back to Portfolio
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function Portfolio({ limit }: { limit?: number }) {
  const [activeModal, setActiveModal] = useState<PortfolioItem | null>(null)
  const [constructionModal, setConstructionModal] = useState<PortfolioItem | null>(null)
  const displayItems = limit ? portfolioItems.slice(0, limit) : portfolioItems

  return (
    <>
      <section id="portfolio" className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Designed to </span>
              <span className="text-gradient-gold">Command Attention.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of premium websites crafted for ambitious businesses.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {displayItems.map((item, index) => {
              const isLastSingle = displayItems.length % 2 !== 0 && index === displayItems.length - 1;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl border border-gold/10 hover:border-gold/30 transition-all duration-300 touch-manipulation ${
                    isLastSingle ? "sm:col-span-2" : ""
                  }`}
                >
                  {/* Legacy Partner Badge */}
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-background/80 backdrop-blur-md border border-gold/30 px-2 py-1 rounded-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <Crown size={10} className="text-gold" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Legacy Partner</span>
                  </div>

                  {/* Under Construction / Coming Soon Badge */}
                  {item.underConstruction && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-gold/30 px-2.5 py-1 rounded-full shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gold">Coming Soon</span>
                    </div>
                  )}

                  {/* Subtle GS Watermark */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none mix-blend-screen">
                    <span className="font-serif text-9xl font-bold text-gold">GS</span>
                  </div>

                  {/* Scanning Animation */}
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      className="absolute left-0 right-0 h-[1px] bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    />
                  </div>

                  <div className={`bg-gradient-to-br ${item.gradient} relative z-10 ${
                    isLastSingle ? "aspect-[16/10] sm:aspect-[32/10]" : "aspect-[16/10]"
                  }`}>
                    {item.image ? (
                      /* Real Screenshot Preview */
                      <div className="absolute inset-4 lg:inset-6 rounded-xl border border-border overflow-hidden shadow-2xl flex flex-col">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] border-b border-border/50 shrink-0">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/70" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                            <div className="w-2 h-2 rounded-full bg-green-500/70" />
                          </div>
                          <div className="flex-1 mx-2 h-4 bg-white/10 rounded-full text-[8px] text-white/40 flex items-center px-2 truncate">
                            {item.href?.replace("https://", "")}
                          </div>
                        </div>
                        <div className="relative flex-1">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                  ) : (
                    <PremiumMockup item={item} />
                  )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Desktop hover overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 z-20 hidden sm:block">
                    <div className="glass rounded-xl p-4 flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gold mb-1">{item.category}</p>
                        <h3 className="font-serif text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                      {item.href ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 h-8 rounded-full border-gold/30 hover:bg-gold/10 touch-manipulation"
                          onClick={() => item.underConstruction ? setConstructionModal(item) : setActiveModal(item)}
                        >
                          <span className="text-xs">{item.underConstruction ? "Coming Soon" : "View Live Site"}</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 h-8 rounded-full border-gold/30 hover:bg-gold/10 touch-manipulation"
                          onClick={() => item.underConstruction ? setConstructionModal(item) : undefined}
                        >
                          <span className="text-xs">{item.underConstruction ? "Coming Soon" : "View Case Study"}</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Mobile always-visible footer */}
                  <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050505] to-transparent z-10">
                    <p className="text-sm text-gold mb-1">{item.category}</p>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    {item.href ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full w-full border-gold/30 touch-manipulation"
                        onClick={() => item.underConstruction ? setConstructionModal(item) : setActiveModal(item)}
                      >
                        <span className="text-xs">{item.underConstruction ? "Coming Soon" : "View Live Site"}</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full w-full border-gold/30 touch-manipulation"
                        onClick={() => item.underConstruction ? setConstructionModal(item) : undefined}
                      >
                        <span className="text-xs">{item.underConstruction ? "Coming Soon" : "View Case Study"}</span>
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Button asChild size="lg" variant="outline">
              {limit ? (
                <Link href="/portfolio" className="flex items-center gap-2">
                  View Full Portfolio
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link href="/book" className="flex items-center gap-2">
                  Request a Custom Website
                  <ArrowRight size={18} />
                </Link>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Site Preview Modal */}
      {activeModal && (
        <SitePreviewModal item={activeModal} onClose={() => setActiveModal(null)} />
      )}

      {/* Under Construction Modal */}
      {constructionModal && (
        <UnderConstructionModal item={constructionModal} onClose={() => setConstructionModal(null)} />
      )}
    </>
  )
}
