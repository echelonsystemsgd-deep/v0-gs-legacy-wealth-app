"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Crown } from "lucide-react"
import Link from "next/link"

const features = [
  "Premium Custom Website",
  "Mobile Optimisation",
  "AI Chat Integration",
  "Booking System",
  "Lead Capture System",
  "Speed Optimisation",
  "SEO Foundations",
  "Luxury UI Design",
  "30 Days Support",
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">The Signature </span>
            <span className="text-gradient-gold">Website Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            One premium offer designed to deliver maximum impact for your business.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <Card className="relative bg-background/50 border-gold/30 glow-gold overflow-hidden">
            {/* Premium Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-light text-primary-foreground px-4 py-2 rounded-bl-2xl">
              <div className="flex items-center gap-2">
                <Crown size={16} />
                <span className="text-sm font-semibold">Premium</span>
              </div>
            </div>

            <CardContent className="p-8 lg:p-10">
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Legacy Growth System
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Everything you need to dominate your industry online
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-muted-foreground">Starting From</span>
                  <span className="font-serif text-5xl font-bold text-gradient-gold">
                    £1,500
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-gold" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-gold to-gold-light text-primary-foreground hover:opacity-90 glow-gold-intense py-6 text-base"
              >
                <Link href="#contact">Apply to Work With Us</Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Limited availability. We only take on select clients each month.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
