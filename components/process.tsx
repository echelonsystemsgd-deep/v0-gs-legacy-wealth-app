"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function Process() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0)

  const data = {
    eyebrow: "Our Process",
    headline: "7-Day Launch Process",
    steps: SITE_COPY.processPage.steps
  }

  return (
    <section id="process" className="relative py-20 lg:py-28 overflow-hidden bg-[#020E28]">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#DAA640]/30 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DAA640] font-mono">
            [ {data.eyebrow} ]
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3">
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
                className={`border rounded-2xl transition-colors duration-300 overflow-hidden ${
                  isOpen ? "border-[#DAA640] bg-[#07153B] shadow-xl" : "border-slate-800 bg-[#07153B]/50 hover:border-slate-700"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-5 sm:gap-6">
                    <span className={`font-mono text-2xl sm:text-3xl font-extrabold ${isOpen ? "text-[#DAA640]" : "text-slate-500"}`}>
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-sans font-bold text-base sm:text-lg text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 sm:mt-0.5">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#DAA640]"
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
                      <div className="px-6 pb-6 sm:px-8 sm:pb-7 pt-0 border-t border-slate-700/60 space-y-4">
                        <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed pt-4">
                          {step.details}
                        </p>
                        
                        {/* Deliverables Box */}
                        <div className="p-4 bg-[#020E28] border border-[#DAA640]/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-[#DAA640]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                              DELIVERABLE:
                            </span>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#DAA640]">
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
