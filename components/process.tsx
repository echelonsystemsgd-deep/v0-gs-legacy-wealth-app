"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Discovery & Audit",
    sub: "We map every workflow bottleneck in your business",
    details: "In a 30-minute deep-dive call, we dissect your operations step by step — identifying which processes are stealing the most time and money. We then produce a complete automation opportunity map ranked by impact and effort.",
    deliverable: "Automation Opportunity Report"
  },
  {
    number: "02",
    title: "Strategy & Blueprint",
    sub: "A custom roadmap built around your exact needs",
    details: "We map out the system architecture, CRM pipeline routes, and design blueprints. You receive a structured development scope showing exactly how inputs convert to outputs with clear ROI projections.",
    deliverable: "Bespoke System Architecture Blueprint"
  },
  {
    number: "03",
    title: "Build & Integrate",
    sub: "We build, test, and connect everything to your systems",
    details: "We code your custom high-converting web platform, build automated pipelines, implement AI chatbots, and wire integrations across your CRM, email, and calendars. Everything is rigorously tested for zero error rates.",
    deliverable: "Verified Production Platform & AI Hub Sync"
  },
  {
    number: "04",
    title: "Launch & Handover",
    sub: "Go live with full team training and documentation",
    details: "We deploy the systems live. We set up analytics, verify speed scores, and conduct training sessions with your team. You receive a walkthrough document detailing the architecture, guaranteeing zero operational friction.",
    deliverable: "Scalable Infrastructure & 30-Day Launch Care"
  },
]

export function Process() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0)

  return (
    <section id="process" className="relative py-24 lg:py-32 overflow-hidden bg-[#111318]">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
            Our Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            From Kickoff to Full Automation
          </h2>
        </div>

        {/* Vertical Accordion Stack */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isOpen = index === expandedIndex
            return (
              <div 
                key={index} 
                className={`border transition-colors duration-300 ${
                  isOpen ? "border-[#C9A227] bg-[#130D24]/30" : "border-white/5 bg-[#0D0B12]/20 hover:border-white/10"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left"
                >
                  <div className="flex items-center gap-6">
                    <span className={`font-serif text-2xl sm:text-3xl font-bold ${isOpen ? "text-[#C9A227]" : "text-[#6D28D9]"}`}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-sans font-semibold text-base sm:text-lg text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#F0EDE6] opacity-60 mt-1 sm:mt-0.5">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#A39E96]"
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
                        <p className="font-sans text-sm text-[#F0EDE6] opacity-80 leading-relaxed pt-4">
                          {step.details}
                        </p>
                        
                        {/* Deliverables Box */}
                        <div className="p-4 bg-[#0A0A0A]/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-[#C9A227]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A39E96]">
                              DELIVERABLE:
                            </span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#C9A227]">
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
