"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Crown } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Launch",
    price: "1,500",
    description: "Perfect for establishing a premium digital presence.",
    features: [
      "Custom Luxury Website",
      "Mobile Optimisation",
      "Basic SEO Foundations",
      "Speed Optimisation",
      "30 Days Support",
    ],
    cta: "Start Your Project",
    featured: false,
  },
  {
    name: "Legacy",
    price: "3,500",
    description: "Full AI-powered system designed for authority and automation.",
    features: [
      "Advanced Custom Website",
      "AI Chat Concierge Integration",
      "Automated Lead Capture",
      "CRM & Booking Automation",
      "Advanced SEO Strategy",
      "90 Days Support",
    ],
    cta: "Scale Your Brand",
    featured: true,
  },
  {
    name: "Elite",
    price: "7,000",
    description: "The ultimate digital transformation for market dominance.",
    features: [
      "Full Brand Identity Suite",
      "Custom AI Workflows",
      "Interactive Sales Assets",
      "Monthly Growth Consulting",
      "Priority VIP Support",
      "Unlimited Revisions",
    ],
    cta: "Request Consultation",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
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
            <span className="text-foreground">Strategic </span>
            <span className="text-gradient-gold">Investment Tiers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the level of impact and automation your brand requires to scale to the next level.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative h-full bg-secondary/50 backdrop-blur-sm border-gold/10 hover:border-gold/30 transition-all duration-300 ${tier.featured ? "border-gold/40 glow-gold md:scale-105 z-10" : ""}`}>
                {tier.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-gold to-gold-light text-primary-foreground px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1">
                    <Crown size={12} />
                    Most Popular
                  </div>
                )}
                
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6 h-10">{tier.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="text-4xl font-bold font-serif text-foreground">£{tier.price}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check size={16} className="text-gold mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant={tier.featured ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link href="/#contact">{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-12">
          Looking for a custom enterprise solution? <Link href="/#contact" className="text-gold hover:underline">Start the conversation.</Link>
        </p>
      </div>
    </section>
  )
}
