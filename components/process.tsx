"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"
import { useWebsiteContent } from "@/hooks/use-website-content"

export function Process() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0)
  const { getSection } = useWebsiteContent()

  const data = getSection('process', {
    eyebrow: "Our Process",
    headline: "The Execution Protocol",
    steps: [
      {
        number: "01",
        title: "Forensic Operational Audit",
        sub: "Identifying system leakage and administrative drag.",
        details: "We dissect your operations to isolate where human friction costs you margins. We do not do casual chats; we execute a forensic analysis of your current systems.",
        deliverable: "Automation Opportunity Report"
      },
      {
        number: "02",
        title: "Architecture & Blueprint",
        sub: "Designing custom pipelines built for leverage.",
        details: "We map out the system architecture, CRM pipeline routes, and design blueprints. You receive an absolute layout showing exactly where manual labor is permanently replaced.",
        deliverable: "Bespoke System Architecture Blueprint"
      },
      {
        number: "03",
        title: "Bespoke Integration & Build",
        sub: "Developing customized assets with zero templates.",
        details: "We code your custom high-converting web presence and build automated pipelines. Zero template boilerplate. We build for maximum throughput and test for absolute resilience.",
        deliverable: "Verified Production Platform & AI Hub Sync"
      },
      {
        number: "04",
        title: "Telemetric Handover",
        sub: "Transitioning control with full telemetry setups.",
        details: "We deploy the systems live under full validation. You receive complete telemetry dashboards and operational training. We don't hand over a draft; we deliver a high-yield asset.",
        deliverable: "Scalable Infrastructure & 30-Day Launch Care"
      }
    ]
  })

  return (
    <section id="process" className="relative py-24 lg:py-32 overflow-hidden bg-bg-secondary">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border-brand/35 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            {data.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            {data.headline}
          </h2>
        </div>

        {/* Vertical Accordion Stack */}
        <div className="space-y-4">
          {Array.isArray(data.steps) && data.steps.map((step: any, index: number) => {
            const isOpen = index === expandedIndex
            return (
              <div 
                key={index} 
                className={`border transition-colors duration-300 ${
                  isOpen ? "border-accent-gold bg-bg-tertiary/30" : "border-border-brand/20 bg-bg-tertiary/10 hover:border-border-brand/40"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left"
                >
                  <div className="flex items-center gap-6">
                    <span className={`font-serif text-2xl sm:text-3xl font-bold ${isOpen ? "text-accent-gold" : "text-accent-purple"}`}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-sans font-semibold text-base sm:text-lg text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs text-text-primary opacity-60 mt-1 sm:mt-0.5">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-secondary"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                {/* Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-8 sm:pb-8 pt-0 border-t border-white/5 space-y-4">
                        <p className="font-sans text-sm text-text-primary opacity-80 leading-relaxed pt-4">
                          {step.details}
                        </p>
                        
                        {/* Deliverables Box */}
                        <div className="p-4 bg-bg-primary/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-accent-gold" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                              DELIVERABLE:
                            </span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-accent-gold">
                            {step.deliverable}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
