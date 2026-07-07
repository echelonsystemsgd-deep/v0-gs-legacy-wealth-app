"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function FAQHome() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const data = SITE_COPY.homepage.faq

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary border-t border-white/5">
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 70% 80%, rgba(109, 40, 217, 0.06) 0%, rgba(10, 10, 10, 0) 60%)"
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">
            [ {data.eyebrow} ]
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            {data.headline}
          </h2>
          <p className="font-sans text-sm text-text-primary opacity-70 mt-4 max-w-lg mx-auto">
            {data.description}
          </p>
        </div>

        {/* Custom Framer Motion Accordion Stack */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array.isArray(data.faqs) && data.faqs.map((faq: any, index: number) => {
            const isOpen = index === expandedIndex
            return (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-300 ${
                  isOpen ? "border-accent-gold bg-bg-tertiary/30" : "border-border-brand/20 bg-bg-tertiary/10 hover:border-border-brand/40"
                }`}
              >
                {/* Header Toggle */}
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <HelpCircle size={16} className={isOpen ? "text-accent-gold" : "text-accent-purple/80"} />
                    <span className="font-sans font-semibold text-sm sm:text-base text-white hover:text-accent-gold transition-colors duration-200">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-secondary shrink-0"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {/* Expanding Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 border-t border-white/5">
                        <p className="font-sans text-xs sm:text-sm text-text-primary opacity-80 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
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
