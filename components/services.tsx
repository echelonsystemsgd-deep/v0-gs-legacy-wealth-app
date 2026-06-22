"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, FileText, Zap } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "Bespoke Authority Platforms",
    description: "Web presence designed to project absolute category dominance. Built without templates, engineered for prestige.",
    icon: Globe,
    outcome: "+238% Conversion Increase",
  },
  {
    title: "High-Yield Conversion Funnels",
    description: "Digital architectures focused on a single outcome: turning high-intent traffic into qualified pipeline.",
    icon: FileText,
    outcome: "97% Lead Response Speed",
  },
  {
    title: "Autonomic Systems & AI Agents",
    description: "Automated pipelines that qualify, capture, and nurture leads 24/7/365. Replacing manual drag with software leverage.",
    icon: Zap,
    outcome: "30+ Hours Reclaimed Weekly",
  },
]

export function Services({ limit }: { limit?: number }) {
  const displayServices = limit ? services.slice(0, limit) : services

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

        {/* 3-Column Card Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {displayServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      <Link 
                        href={`/services#${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-gold hover:underline transition-all"
                      >
                        Learn More <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
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
    </section>
  )
}
