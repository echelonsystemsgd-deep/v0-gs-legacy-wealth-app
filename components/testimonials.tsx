"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "James Carter",
    role: "Fitness Coach",
    badge: "3 DAYS → 1 HOUR",
    content: "GS Legacy Wealth completely transformed my online presence. What used to take 3 days of back-and-forth now happens in under an hour. The ROI was clear within the first month.",
  },
  {
    name: "Sophie Bennett",
    role: "Property Consultant",
    badge: "30+ HRS/WK SAVED",
    content: "We were skeptical about AI automation, but the results changed our mind completely. Our team recovered 30+ hours per week and customer satisfaction scores jumped 40%.",
  },
  {
    name: "Daniel Hayes",
    role: "E-Commerce Founder",
    badge: "LEADS WHILE YOU SLEEP",
    content: "The lead automation system generates and qualifies leads around the clock. We closed 3 high-ticket client deals while on vacation — that's the power of this system.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            Trusted by Ambitious Teams
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[#C9A227]">
            <Star className="w-4 h-4 fill-[#C9A227] stroke-none" />
            <span className="text-sm font-semibold">5.0 rating from our early clients</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-[#130D24] border border-white/5 border-t-[3px] border-t-[#C9A227] rounded-none transition-all duration-300 hover:shadow-[0_10px_30px_rgba(109,40,217,0.15)]">
                <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                  
                  <div className="space-y-6">
                    {/* Outcome Badge */}
                    <div className="inline-flex px-3 py-1 border border-[#C9A227]/30 bg-transparent rounded-none">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-[#C9A227]">
                        {testimonial.badge}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-[#C9A227]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C9A227] stroke-none" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="font-sans text-sm text-[#F0EDE6] opacity-90 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                    {/* Initial Circle Icon */}
                    <div className="w-10 h-10 rounded-full bg-[#6D28D9]/20 border border-[#6D28D9]/40 flex items-center justify-center font-bold text-[#C9A227] font-serif text-sm">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="font-sans text-[10px] text-[#C9A227] tracking-wider uppercase">
                        {testimonial.role}
                      </p>
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
