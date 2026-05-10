"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "James Carter",
    role: "Fitness Coach",
    content:
      "GS Legacy Wealth AI completely transformed my online presence. The website instantly made my business feel premium.",
    initials: "JC",
  },
  {
    name: "Sophie Bennett",
    role: "Property Consultant",
    content:
      "The automation systems alone saved me hours every week. Clients constantly compliment the site.",
    initials: "SB",
  },
  {
    name: "Daniel Hayes",
    role: "E-Commerce Founder",
    content:
      "The branding, design, and structure were on another level. It feels like a luxury brand now.",
    initials: "DH",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-foreground">Built for Businesses That Want </span>
            <span className="text-gradient-gold">More Than Just a Website.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-background/50 border-gold/10 hover:border-gold/30 transition-all duration-300 group">
                <CardContent className="p-6 lg:p-8 space-y-6">
                  <Quote className="w-10 h-10 text-gold/40 group-hover:text-gold/60 transition-colors" />
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {`"${testimonial.content}"`}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/10 flex items-center justify-center border border-gold/30">
                      <span className="text-sm font-semibold text-gold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
