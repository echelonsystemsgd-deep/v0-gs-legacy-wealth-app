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
    <section id="process" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Our Proven </span>
            <span className="text-gradient-gold">4-Step Process</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A refined approach that delivers exceptional results for every client.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-gold/30 to-transparent z-0" />
              )}

              <div className="relative p-6 lg:p-8 rounded-2xl bg-background/50 border border-gold/10 hover:border-gold/30 transition-all duration-300 h-full">
                <div className="mb-6">
                  <span className="font-serif text-5xl lg:text-6xl font-bold text-gradient-gold opacity-40 group-hover:opacity-60 transition-opacity">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
