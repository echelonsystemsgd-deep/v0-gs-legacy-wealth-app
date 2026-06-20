"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, FileText, Zap } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "AI-Powered Business Websites",
    description: "Stunning websites enhanced with AI features that engage visitors and convert them into clients.",
    icon: Globe,
  },
  {
    title: "High-Converting Landing Pages",
    description: "Strategic landing pages designed to capture leads and drive high-ticket sales.",
    icon: FileText,
  },
  {
    title: "Automated Lead Generation",
    description: "Smart automation that captures, qualifies, and nurtures leads while you sleep.",
    icon: Zap,
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
            Premium Digital Solutions, Built to Perform
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
      </div>
    </section>
  )
}
