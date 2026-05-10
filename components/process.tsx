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

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Process({ limit }: { limit?: number }) {
  const displaySteps = limit ? steps.slice(0, limit) : steps;
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
          {displaySteps.map((step, index) => (
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

              <motion.div
                className="relative p-6 lg:p-8 rounded-2xl bg-secondary border border-gold/10 transition-all duration-500 h-full overflow-hidden"
                whileInView={{
                  borderColor: "rgba(255, 215, 0, 0.4)",
                  boxShadow: "0 0 20px rgba(255, 215, 0, 0.1)",
                }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Glow Background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0"
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />

                <div className="relative z-10 mb-6">
                  <span className="font-serif text-5xl lg:text-6xl font-bold text-gradient-gold opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    {step.number}
                  </span>
                </div>
                <h3 className="relative z-10 font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-gold transition-colors">
                  {step.title}
                </h3>
                <p className="relative z-10 text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {limit && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/30 hover:bg-gold/10"
            >
              <Link href="/process">Explore Full Process</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
