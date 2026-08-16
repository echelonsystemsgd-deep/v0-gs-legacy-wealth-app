"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Zap, X, Database, GitMerge } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { SITE_COPY } from "@/lib/site-copy"

const icons = [Globe, GitMerge, Database, Zap]

const services = SITE_COPY.servicesPage.list.map((item, idx) => ({
  title: item.title,
  description: item.description,
  outcome: item.outcome,
  icon: icons[idx],
}))

const serviceDetails = SITE_COPY.servicesPage.list.map((item, idx) => ({
  title: item.title,
  tagline: item.tagline,
  overview: item.overview,
  features: item.features,
  ctaText: "Book your free 15 minute audit",
  ctaHref: "/book",
  icon: icons[idx],
}))

export function Services({ limit }: { limit?: number }) {
  const [activeService, setActiveService] = useState<number | null>(null)
  const displayServices = limit ? services.slice(0, limit) : services

  // Handle escape key to close modal
  useEffect(() => {
    if (activeService === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveService(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeService])

  // Prevent scroll background when open
  useEffect(() => {
    if (activeService !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [activeService])

  return (
    <section id="services" className="relative py-20 lg:py-28 overflow-hidden bg-[#020E28]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DAA640] mb-3 font-mono">
            [ Our Services ]
          </p>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Automated Systems Built for Local Growth
          </h2>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {displayServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full"
              >
                <Card className="h-full bg-[#07153B] border border-[#DAA640]/20 hover:border-[#DAA640] hover:shadow-[0_0_25px_rgba(218,166,64,0.18)] transition-all duration-300 rounded-2xl group">
                  <CardContent className="p-6 sm:p-7 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4">
                      {/* Gold icon */}
                      <div className="inline-flex items-center justify-center p-3 border border-[#DAA640]/30 bg-[#020E28] text-[#DAA640] rounded-xl">
                        <IconComponent className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-sans font-bold text-lg sm:text-xl text-white">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[44px]">
                        {service.description}
                      </p>

                      {/* Distributed Outcome Stat */}
                      <div className="pt-2">
                        <span className="font-mono text-xs font-bold text-[#DAA640] uppercase tracking-wider block">
                          {service.outcome}
                        </span>
                      </div>
                    </div>

                    {/* Learn More Link */}
                    <div>
                      <button
                        onClick={() => setActiveService(index)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DAA640] hover:underline transition-all bg-transparent border-none p-0 cursor-pointer focus:outline-none text-left font-mono"
                      >
                        Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* View All Services Link */}
        {limit && (
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-sm font-bold text-[#DAA640] hover:underline"
            >
              View all services <span className="text-lg">→</span>
            </Link>
          </div>
        )}

        {/* Timing Objection Callout */}
        <p className="text-center text-xs text-slate-400 mt-10 max-w-lg mx-auto leading-relaxed">
          {SITE_COPY.servicesPage.objectionCallout}
        </p>
      </div>

      {/* Service Detail Modals */}
      <AnimatePresence>
        {activeService !== null && (() => {
          const detail = serviceDetails[activeService]
          const IconComp = detail.icon
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveService(null)}
                className="absolute inset-0 bg-[#020E28]/85 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative w-full max-w-2xl bg-[#07153B] border border-[#DAA640]/30 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 md:p-10 z-10 text-white max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveService(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Service Header */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-[#020E28] border border-[#DAA640]/30 flex items-center justify-center text-[#DAA640]">
                    <IconComp className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#DAA640] font-bold block font-mono">
                      {detail.tagline}
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {detail.title}
                    </h3>
                  </div>
                </div>

                {/* Service Body */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Overview</h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {detail.overview}
                    </p>
                  </div>

                  <div className="border-t border-slate-700/60 pt-4">
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Key Features</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {detail.features.map((feat, idx) => (
                        <div key={idx} className="p-3 bg-[#020E28] border border-slate-700/50 rounded-xl space-y-1.5 hover:border-[#DAA640]/30 transition-all duration-300">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#DAA640] text-xs font-bold">✦</span>
                            <span className="text-xs font-bold text-white">{feat.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {feat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row gap-4 items-center sm:justify-between">
                    <span className="text-[10px] text-[#DAA640] uppercase tracking-wider font-semibold font-mono">
                      7-day launch protocol
                    </span>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setActiveService(null)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                      >
                        Close
                      </button>
                      <Button
                        asChild
                        className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold bg-[#DAA640] text-[#020E28] hover:bg-[#EBB755] transition-all rounded-lg"
                      >
                        <Link href={detail.ctaHref} onClick={() => setActiveService(null)}>
                          {detail.ctaText}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })()}
      </AnimatePresence>
    </section>
  )
}
