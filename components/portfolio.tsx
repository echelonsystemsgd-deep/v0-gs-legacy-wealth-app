"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Crown, X, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const portfolioItems = [
  {
    title: "Stamp Valuation App",
    category: "Web Application",
    gradient: "from-blue-500/20 to-cyan-500/20",
    href: "https://v0-stamp-valuation-app.vercel.app",
    image: "/stamp-app-preview.png",
  },
  {
    title: "Elite Fitness Studio",
    category: "Gym Website",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Prestige Properties",
    category: "Estate Agent Website",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Strategic Growth Co.",
    category: "Consultant Landing Page",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "AutoFlow Systems",
    category: "AI Automation Dashboard",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
]

type PortfolioItem = typeof portfolioItems[number]

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

export function Portfolio({ limit }: { limit?: number }) {
  const [activeModal, setActiveModal] = useState<PortfolioItem | null>(null)
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
            {displayItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-gold/10 hover:border-gold/30 transition-all duration-300 touch-manipulation"
              >
                {/* Legacy Partner Badge */}
                <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-background/80 backdrop-blur-md border border-gold/30 px-2 py-1 rounded-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  <Crown size={10} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Legacy Partner</span>
                </div>

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

                <div className={`aspect-[16/10] bg-gradient-to-br ${item.gradient} relative z-10`}>
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
                    /* Generic Wireframe Mockup */
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
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="h-12 bg-secondary rounded-lg" />
                          <div className="h-12 bg-secondary rounded-lg" />
                        </div>
                      </div>
                    </div>
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
                        onClick={() => setActiveModal(item)}
                      >
                        <span className="text-xs">View Live Site</span>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="shrink-0 h-8 rounded-full border-gold/30 hover:bg-gold/10 touch-manipulation">
                        <span className="text-xs">View Case Study</span>
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
                      onClick={() => setActiveModal(item)}
                    >
                      <span className="text-xs">View Live Site</span>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8 rounded-full w-full border-gold/30 touch-manipulation">
                      <span className="text-xs">View Case Study</span>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
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
    </>
  )
}
