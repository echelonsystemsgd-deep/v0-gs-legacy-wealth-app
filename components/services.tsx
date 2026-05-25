"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Globe,
  Rocket,
  Bot,
  Calendar,
  Palette,
  RefreshCw,
  Check,
} from "lucide-react"

function GlareCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 215, 0, 0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

const services = [
  {
    icon: Globe,
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
    icon: Rocket,
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
    icon: Bot,
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
    icon: Calendar,
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
    icon: Palette,
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
    icon: RefreshCw,
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
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl -translate-y-1/2" />

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
              <GlareCard>
                <Card className="h-full bg-secondary/80 backdrop-blur-sm border-gold/10 hover:border-gold/30 hover:glow-gold transition-all duration-300 group">
                  <CardContent className="p-5 sm:p-6 lg:p-8 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold-light/10 flex items-center justify-center border border-gold/30 group-hover:border-gold/50 transition-colors">
                      <service.icon className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    {!limit && service.deliverables && (
                      <div className="pt-4 space-y-2 border-t border-gold/10 mt-4">
                        <p className="text-xs font-bold text-gold uppercase tracking-wider">Includes:</p>
                        <ul className="space-y-2">
                          {service.deliverables.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-gold shrink-0" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </GlareCard>
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
              className="border-gold/30 hover:bg-gold/10"
            >
              <Link href="/services">View All Services</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
