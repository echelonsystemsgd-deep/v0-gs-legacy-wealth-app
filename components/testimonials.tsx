"use client"

import { motion } from "framer-motion"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_COPY } from "@/lib/site-copy"

export function Testimonials() {
  const data = SITE_COPY.homepage.testimonials

  return (
    <section id="telemetry" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold font-mono">
            [ {data.eyebrow} ]
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {data.headline}
          </h2>
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs text-accent-gold font-mono">
            <Star className="w-3.5 h-3.5 fill-accent-gold stroke-none" />
            <span>{data.guarantee}</span>
          </div>
        </div>

        {/* Option B Honest Positioning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl border border-accent-gold/30 bg-bg-tertiary/40 backdrop-blur-md shadow-2xl space-y-8 text-left relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none z-0 opacity-40"
            style={{
              background: "radial-gradient(circle at center, rgba(109, 40, 217, 0.25) 0%, rgba(0, 0, 0, 0) 70%)"
            }}
          />

          <div className="relative z-10 space-y-8">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {data.cohortCard.badge}
              </div>
              <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                Q3 DEPLOYMENT PIPELINE
              </span>
            </div>

            {/* Headline & Paragraphs */}
            <div className="space-y-5">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                {data.cohortCard.title}
              </h3>
              
              <p className="font-sans text-sm sm:text-base text-text-primary opacity-90 leading-relaxed">
                {data.cohortCard.paragraph1}
              </p>

              <p className="font-sans text-sm sm:text-base text-text-primary opacity-80 leading-relaxed">
                {data.cohortCard.paragraph2}
              </p>

              <p className="font-sans text-sm sm:text-base text-accent-gold font-semibold leading-relaxed border-l-2 border-accent-gold pl-4 py-1">
                {data.cohortCard.paragraph3}
              </p>
            </div>

            {/* Strategy Session Enquiry CTA Box */}
            <div className="p-5 rounded-xl border border-accent-gold/25 bg-accent-gold/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-text-primary opacity-90 leading-relaxed font-medium">
                {data.cohortCard.enquiryCtaText}
              </p>
              <Button asChild size="sm" className="shrink-0 px-6 py-2.5 text-xs font-semibold">
                <Link href="/book" className="flex items-center gap-2">
                  Request Alignment <ArrowRight size={14} />
                </Link>
              </Button>
            </div>

            {/* Trust Bullet Footer */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-start sm:justify-between gap-3 sm:gap-4 text-xs text-text-secondary">
              {data.trustPoints.map((point, idx) => (
                <span key={idx} className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px]">
                  <span className="text-accent-gold">✦</span> {point}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

