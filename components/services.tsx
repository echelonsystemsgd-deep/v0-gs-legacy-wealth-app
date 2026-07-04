"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, FileText, Zap, X, ShieldCheck, Database, GitMerge } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    title: "High-Yield Digital Infrastructure",
    description: "Web presence and Next.js platforms designed to project absolute category dominance. Built without templates, engineered for prestige.",
    icon: Globe,
    outcome: "+238% Conversion Increase",
  },
  {
    title: "Autonomous Pipeline Routing",
    description: "Custom CRM bookings and synchronized lead orchestration that triages, captures, and schedules prospects in under 1 second.",
    icon: GitMerge,
    outcome: "97% Lead Response Speed",
  },
  {
    title: "Relational Cloud Data Architecture",
    description: "High-throughput cloud storage engines and database schemas engineered for sub-millisecond querying and complete data sovereignty.",
    icon: Database,
    outcome: "100% Data Sovereignty",
  },
  {
    title: "Autonomic Multi-Agent Systems",
    description: "Automated pipelines that qualify, capture, and nurture leads 24/7/365. Replacing manual drag with software leverage.",
    icon: Zap,
    outcome: "30+ Hours Reclaimed Weekly",
  },
]

const serviceDetails = [
  {
    title: "High-Yield Digital Infrastructure",
    tagline: "Engineering Category Dominance.",
    overview: "A custom website is not a marketing cost; it is your ultimate digital asset. Standard templates signal mediocrity. We build pixel-perfect, custom-designed, lightning-fast digital estates that establish your market position without compromise.",
    features: [
      { name: "Custom Art Direction", description: "Tailored styling aligned with elite luxury standards, designed from scratch for your brand." },
      { name: "Zero-Template Next.js Codebase", description: "Pure, high-performance React engineering delivering perfect mobile speeds (98+)." },
      { name: "SEO Schema Blueprint", description: "Hard-coded schemas and semantic HTML structure to command organic visibility." },
      { name: "Telemetric Auditing", description: "Integrated conversion tracking to monitor interaction accuracy and lead flow." },
    ],
    ctaText: "Apply for Platform Build",
    ctaHref: "/book?service=authority-platform",
    icon: Globe,
  },
  {
    title: "Autonomous Pipeline Routing",
    tagline: "Direct Pipeline Architecture.",
    overview: "Traffic without conversion is vanity. We design focused, distraction-free scheduling and qualification experiences engineered to guide high-intent visitors straight to your CRM with zero leakage.",
    features: [
      { name: "Frictionless Vetting Flows", description: "Short-form qualification steps that validate leads and intent in real-time." },
      { name: "Dynamic Targeting Copy", description: "Persuasive, premium copywriting focused entirely on high-ticket decision makers." },
      { name: "Speed Optimization", description: "Instant page load delivery that prevents lead drop-off and attrition." },
      { name: "Direct Routing Pipeline", description: "Automated routing that delivers hot prospects straight into your sales pipeline." },
    ],
    ctaText: "Secure Funnel Alignment",
    ctaHref: "/book?service=conversion-funnel",
    icon: GitMerge,
  },
  {
    title: "Relational Cloud Data Architecture",
    tagline: "High-Throughput Storage Engines.",
    overview: "Scalable backend infrastructure structured on Supabase to manage complex business state, files, and users. Engineered for perfect latency and absolute data sovereignty.",
    features: [
      { name: "Bespoke Database Schema Design", description: "Custom relational tables and security policies aligned with your operational requirements." },
      { name: "Sub-Millisecond Query Speeds", description: "Performance optimized querying that eliminates database latency bottlenecks." },
      { name: "Secure Cloud Storage Buckets", description: "Fully encrypted object storage pipelines for seamless document and asset management." },
      { name: "Automated Backup Protocols", description: "Redundant snapshot backups securing total data sovereignty and recovery." },
    ],
    ctaText: "Request Database Alignment",
    ctaHref: "/book?service=database-architecture",
    icon: Database,
  },
  {
    title: "Autonomic Multi-Agent Systems",
    tagline: "Operational Leverage 24/7.",
    overview: "Human drag in qualification and data transfer is an unnecessary operational tax. We build autonomous agents and background pipelines that triage, route, and engage leads instantly.",
    features: [
      { name: "Bespoke AI Concierge", description: "Dynamic chat agents trained on your specific business knowledge to qualify queries instantly." },
      { name: "Instant Lead Routing", description: "Webhook integrations linking capture events to CRM and Slack in less than 5 seconds." },
      { name: "Continuous Nurture Scripts", description: "Automated, high-context follow-up sequences that prevent lead decay indefinitely." },
      { name: "System Telemetry", description: "Dedicated admin dashboards to track lead flow and system performance in real-time." },
    ],
    ctaText: "Request Autonomic Integration",
    ctaHref: "/book?service=ai-agents",
    icon: Zap,
  },
]

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
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
            Our Services
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Custom Architectures Engineered for Leverage
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
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full"
              >
                <Card className="h-full bg-bg-tertiary border border-border-brand/40 hover:border-accent-gold hover:shadow-[0_0_30px_rgba(109,40,217,0.15)] transition-all duration-300 rounded-xl group">
                  <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4">
                      {/* Gold icon */}
                      <div className="inline-flex items-center justify-center p-3 border border-accent-gold/30 bg-transparent text-accent-gold rounded-lg">
                        <IconComponent className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-sans font-semibold text-xl text-white">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="font-sans text-sm text-text-primary opacity-80 leading-relaxed min-h-[44px]">
                        {service.description}
                      </p>

                      {/* Distributed Outcome Stat */}
                      <div className="pt-2">
                        <span className="font-mono text-xs font-bold text-accent-gold uppercase tracking-wider block">
                          Target Yield: {service.outcome}
                        </span>
                      </div>
                    </div>

                    {/* Learn More Link */}
                    <div>
                      <button
                        onClick={() => setActiveService(index)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-gold hover:underline transition-all bg-transparent border-none p-0 cursor-pointer focus:outline-none text-left"
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
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-gold hover:underline"
            >
              View all services <span className="text-lg">→</span>
            </Link>
          </div>
        )}

        {/* Timing Objection Callout */}
        <p className="text-center text-xs text-text-secondary mt-12 max-w-lg mx-auto leading-relaxed">
          Standard development cycles take 3 to 6 months of back-and-forth friction. Our clinical Execution Protocol delivers custom operational systems fully verified in under 28 days.
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
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative w-full max-w-2xl bg-bg-tertiary border border-border-brand/45 rounded-2xl overflow-hidden glass shadow-2xl p-6 sm:p-8 md:p-10 z-10 text-text-primary max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveService(null)}
                  className="absolute top-4 right-4 text-text-secondary hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                {/* Service Header */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                    <IconComp className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-bold block">
                      {detail.tagline}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                      {detail.title}
                    </h3>
                  </div>
                </div>

                {/* Service Body */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">Overview</h4>
                    <p className="text-sm text-text-primary/90 leading-relaxed font-medium">
                      {detail.overview}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-4">Clinical Capabilities</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {detail.features.map((feat, idx) => (
                        <div key={idx} className="p-3 bg-bg-primary/40 border border-white/5 rounded-lg space-y-1.5 hover:border-accent-gold/20 transition-all duration-300">
                          <div className="flex items-center gap-1.5">
                            <span className="text-accent-gold text-xs">✦</span>
                            <span className="text-xs font-bold text-white">{feat.name}</span>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-relaxed">
                            {feat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center sm:justify-between">
                    <span className="text-[10px] text-accent-gold uppercase tracking-wider font-semibold">
                      vetted alignments only • 28-day delivery guarantee
                    </span>
                    <Button
                      asChild
                      className="w-full sm:w-auto font-bold bg-accent-purple text-white hover:bg-accent-purple/90 border-0"
                      onClick={() => setActiveService(null)}
                    >
                      <Link href={detail.ctaHref}>
                        <span>{detail.ctaText}</span>
                      </Link>
                    </Button>
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
