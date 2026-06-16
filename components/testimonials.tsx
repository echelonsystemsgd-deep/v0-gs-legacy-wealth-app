"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "James Carter",
    role: "Fitness Coach",
    content: "GS Legacy Wealth completely transformed my online presence. The website instantly made my business feel premium and elevated my high-ticket leads.",
  },
  {
    name: "Sophie Bennett",
    role: "Property Consultant",
    content: "The automation systems alone saved me hours every week. Clients constantly compliment the visual design and ease of booking.",
  },
  {
    name: "Daniel Hayes",
    role: "E-Commerce Founder",
    content: "The branding, design, and page structure were on another level. It feels like a high-end luxury consultancy now. The ROI has been immediate.",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] mb-3">
            Proof
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            What Our Clients Say
          </h2>
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
                  
                  {/* Testimonial Core */}
                  <div className="space-y-6">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-[#C9A227]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C9A227] stroke-none" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="font-sans text-sm text-[#F0EDE6] opacity-90 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="pt-6 border-t border-white/5">
                    <p className="font-sans font-semibold text-white text-base">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-xs text-[#C9A227] tracking-wider uppercase mt-1">
                      {testimonial.role}
                    </p>
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
