"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { SITE_COPY } from "@/lib/site-copy"

export function Testimonials() {
  const data = SITE_COPY.homepage.testimonials

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            {data.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            {data.headline}
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-accent-gold">
            <Star className="w-4 h-4 fill-accent-gold stroke-none" />
            <span className="text-sm font-semibold">{data.guarantee}</span>
          </div>
        </div>

        {/* Before/After Transformation Chart */}
        <div className="mb-20 glass rounded-2xl p-6 sm:p-10 border border-white/5 bg-bg-tertiary/10 max-w-4xl mx-auto">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white text-center mb-8">
            {data.transformationHeadline}
          </h3>
          <div className="space-y-4 font-sans text-left">
            {data.transformations.map((trans, index) => (
              <div key={index} className="grid sm:grid-cols-2 gap-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">{trans.beforeLabel}</p>
                  <p className="text-xs text-text-primary opacity-80 leading-relaxed">
                    {trans.beforeText}
                  </p>
                </div>
                <div className="border-l border-white/5 sm:pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent-gold mb-1">{trans.afterLabel}</p>
                  <p className="text-xs text-[#F0EDE6] opacity-95 leading-relaxed font-semibold">
                    {trans.afterText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.list.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-bg-tertiary border border-border-brand/20 border-t-[3px] border-t-accent-gold rounded-xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(109,40,217,0.1)]">
                <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full text-left">
                  
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
