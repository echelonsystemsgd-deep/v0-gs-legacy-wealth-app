"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Strategy",
    description: "Understanding the business, audience, and goals.",
  },
  {
    number: "02",
    title: "Design",
    description: "Crafting a premium user experience and visual identity.",
  },
  {
    number: "03",
    title: "Development",
    description: "Building fast, AI-enhanced, mobile-optimised systems.",
  },
  {
    number: "04",
    title: "Launch & Scale",
    description: "Deploying the site and helping optimise conversions.",
  },
]

export function Process() {
  return (
    <section id="process" className="relative py-24 lg:py-32 overflow-hidden bg-[#111318]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-3">
            Our Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            From Vision to Revenue in 4 Steps
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-[#C9A227]/30 z-0 hidden lg:block" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4"
              >
                {/* Step Circle/Number Container */}
                <div className="relative flex items-center justify-center bg-[#111318] w-20 h-20 border border-[#C9A227]/20 rounded-full hover:border-[#C9A227] transition-colors duration-300">
                  <span className="font-serif text-3xl font-bold text-[#6D28D9]">
                    {step.number}
                  </span>
                </div>

                {/* Text Details */}
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-sans font-semibold text-lg text-white">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-[#F0EDE6] opacity-80 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
