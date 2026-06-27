"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type TestimonialItem = {
  name: string
  role: string
  badge: string
  content: string
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "James Carter",
    role: "Fitness Coach",
    badge: "97% FRICTION REDUCTION",
    content: "GS Legacy Wealth completely transformed my online presence. What used to take 3 days of back-and-forth now happens in under an hour. The system reclaimed its implementation cost within the first 28 days.",
  },
  {
    name: "Sophie Bennett",
    role: "Property Consultant",
    badge: "30+ HRS/WK RECLAIMED",
    content: "We were skeptical about AI automation, but the results changed our mind completely. Our team recovered 30+ hours per week and customer response latency dropped to 45 seconds, improving deal capture rates by 40%.",
  },
  {
    name: "Daniel Hayes",
    role: "E-Commerce Founder",
    badge: "24/7 AUTONOMIC CAPTURE",
    content: "The lead automation system generates and qualifies leads around the clock. We closed 3 high-ticket client deals while on vacation — that's the power of this system.",
  },
]

export function Testimonials() {
  const supabase = createClient()
  const [items, setItems] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            name: d.name,
            role: d.role,
            badge: d.badge,
            content: d.content,
          }))
          setItems(mapped)
        }
      } catch (err) {
        console.error('Failed to load testimonials, using defaults:', err)
      }
    }
    loadTestimonials()
  }, [supabase])

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            Trusted by Ambitious Teams
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-accent-gold">
            <Star className="w-4 h-4 fill-accent-gold stroke-none" />
            <span className="text-sm font-semibold">100% successful integration rate across all audited clients</span>
          </div>
        </div>

        {/* Before/After Transformation Chart */}
        <div className="mb-20 glass rounded-2xl p-6 sm:p-10 border border-white/5 bg-bg-tertiary/10 max-w-4xl mx-auto">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white text-center mb-8">
            The Transformation Telemetry
          </h3>
          <div className="space-y-4 font-sans">
            {/* Row 1 */}
            <div className="grid sm:grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Before Integration</p>
                <p className="text-xs text-text-primary opacity-80 leading-relaxed">
                  Leads sitting unqualified in emails for 12-24 hours. Deal probability decays by 40%.
                </p>
              </div>
              <div className="border-l border-white/5 sm:pl-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent-gold mb-1">After Integration</p>
                <p className="text-xs text-[#F0EDE6] opacity-95 leading-relaxed font-semibold">
                  Immediate AI-concierge qualification and Calendly routing in 45 seconds. Uptime captured.
                </p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid sm:grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Before Integration</p>
                <p className="text-xs text-text-primary opacity-80 leading-relaxed">
                  Sales reps wasting 10-15 hours/week copying form data into CRM dashboards.
                </p>
              </div>
              <div className="border-l border-white/5 sm:pl-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent-gold mb-1">After Integration</p>
                <p className="text-xs text-[#F0EDE6] opacity-95 leading-relaxed font-semibold">
                  Direct webhook routes from capture to CRM system. 100% administrative drag eliminated.
                </p>
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Before Integration</p>
                <p className="text-xs text-text-primary opacity-80 leading-relaxed">
                  Leads forgotten after initial contact. Evaporated pipeline value.
                </p>
              </div>
              <div className="border-l border-white/5 sm:pl-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent-gold mb-1">After Integration</p>
                <p className="text-xs text-[#F0EDE6] opacity-95 leading-relaxed font-semibold">
                  Autonomic lead-nurturing sequences running 24/7/365. Persistent retention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-bg-tertiary border border-border-brand/20 border-t-[3px] border-t-accent-gold rounded-xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(109,40,217,0.1)]">
                <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                  
                  <div className="space-y-6">
                    {/* Outcome Badge */}
                    <div className="inline-flex px-3 py-1 border border-accent-gold/30 bg-transparent rounded-full">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-accent-gold">
                        {testimonial.badge}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-accent-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent-gold stroke-none" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="font-sans text-sm text-text-primary opacity-90 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                    {/* Initial Circle Icon */}
                    <div className="w-10 h-10 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center font-bold text-accent-gold font-serif text-sm">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="font-sans text-[10px] text-accent-gold tracking-wider uppercase">
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
