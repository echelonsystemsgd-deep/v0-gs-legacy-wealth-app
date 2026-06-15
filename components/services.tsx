"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    title: "AI-Powered Business Websites",
    description:
      "Stunning websites enhanced with AI features that engage visitors and convert them into clients.",
    deliverables: [
      "Custom Luxury Design",
      "Next.js Performance",
      "AI Feature Integration",
      "Mobile Optimisation",
    ],
  },
  {
    title: "High-Converting Landing Pages",
    description:
      "Strategic landing pages designed to capture leads and drive high-ticket sales.",
    deliverables: [
      "Direct Response Copy",
      "A/B Testing Ready",
      "Lead Magnet Setup",
      "CRM Integration",
    ],
  },
  {
    title: "Automated Lead Generation",
    description:
      "Smart automation that captures, qualifies, and nurtures leads while you sleep.",
    deliverables: [
      "AI Chat Concierge",
      "Lead Scoring Logic",
      "Email Automation",
      "Analytics Dashboard",
    ],
  },
  {
    title: "Booking & CRM Automation",
    description:
      "Seamless scheduling and client management systems that save hours every week.",
    deliverables: [
      "Calendly Integration",
      "Client Portal Setup",
      "Automated Follow-ups",
      "Payment Processing",
    ],
  },
  {
    title: "Branding & Digital Presence",
    description:
      "Cohesive brand identity that positions you as the premium choice in your market.",
    deliverables: [
      "Visual Identity Suite",
      "Typography & Colors",
      "Social Media Assets",
      "Brand Guidelines",
    ],
  },
  {
    title: "Luxury Website Redesigns",
    description:
      "Transform your existing website into a premium digital asset that commands attention.",
    deliverables: [
      "UX/UI Audit",
      "SEO Migration",
      "Performance Boost",
      "Modern Tech Stack",
    ],
  },
]

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Services({ limit }: { limit?: number }) {
  const displayServices = limit ? services.slice(0, limit) : services;
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">What We </span>
            <span className="text-gradient-gold">Build</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium digital solutions engineered to create authority, automate growth, and generate revenue.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/60 border border-border hover:border-primary/45 transition-all duration-300">
                <CardContent className="p-5 sm:p-6 lg:p-8 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-accent">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  {!limit && service.deliverables && (
                    <div className="pt-4 space-y-2 border-t border-border mt-4">
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">Includes:</p>
                      <ul className="space-y-2">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {limit && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
            >
              <Link href="/services">View All Services</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
