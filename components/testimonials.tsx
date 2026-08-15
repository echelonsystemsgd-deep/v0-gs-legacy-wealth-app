"use client"

import { motion } from "framer-motion"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_COPY } from "@/lib/site-copy"

export function Testimonials() {
  const data = SITE_COPY.homepage.testimonials

  return (
    <section id="telemetry" className="relative py-24 lg:py-32 overflow-hidden bg-[#0B0F17]">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D9A74A] font-mono">
            [ {data.eyebrow} ]
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {data.headline}
          </h2>
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A74A]/10 border border-[#D9A74A]/25 text-xs text-[#D9A74A] font-mono">
            <Star className="w-3.5 h-3.5 fill-[#D9A74A] stroke-none" />
            <span>{data.guarantee}</span>
          </div>
        </div>

        {/* Client Testimonial Cards Grid (Named Roles & Specific Businesses) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl border border-slate-800 bg-[#1E293B]/60 space-y-4 shadow-xl relative"
          >
            <div className="flex items-center gap-1 text-[#D9A74A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-[#D9A74A] stroke-none" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
              "We used to lose 3–4 cake orders every weekend because I couldn't reply to Instagram DMs while baking. Now clients place custom specs and pay deposits on WhatsApp automatically."
            </p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Sarah M.</p>
                <p className="text-[11px] text-slate-400 font-mono">Artisan Cake Designer, London</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified Client
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl border border-slate-800 bg-[#1E293B]/60 space-y-4 shadow-xl relative"
          >
            <div className="flex items-center gap-1 text-[#D9A74A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-[#D9A74A] stroke-none" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
              "The 3-tap order builder and instant SMS alerts completely eliminated our late-night quote chasing. Setup took less than a week."
            </p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Marcus T.</p>
                <p className="text-[11px] text-slate-400 font-mono">Gourmet Catering Owner, Berkshire</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified Client
              </span>
            </div>
          </motion.div>
        </div>

        {/* Partnership & Growth Cohort Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#D9A74A]/30 bg-[#1E293B]/50 backdrop-blur-md shadow-2xl space-y-8 text-left relative overflow-hidden min-w-0 max-w-full"
        >
          <div className="relative z-10 space-y-8">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {data.cohortCard.badge}
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                LOCAL BAKERIES & SERVICES PIPELINE
              </span>
            </div>

            {/* Headline & Paragraphs */}
            <div className="space-y-5">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                {data.cohortCard.title}
              </h3>
              
              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                {data.cohortCard.paragraph1}
              </p>

              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                {data.cohortCard.paragraph2}
              </p>

              <p className="font-sans text-sm sm:text-base text-[#D9A74A] font-semibold leading-relaxed border-l-2 border-[#D9A74A] pl-4 py-1">
                {data.cohortCard.paragraph3}
              </p>
            </div>

            {/* Strategy Session Enquiry CTA Box */}
            <div className="p-5 rounded-xl border border-[#D9A74A]/25 bg-[#D9A74A]/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {data.cohortCard.enquiryCtaText}
              </p>
              <Button asChild size="sm" className="shrink-0 px-6 py-3 text-xs font-semibold min-h-[44px] bg-[#D9A74A] text-slate-950 hover:bg-[#E5A93C]">
                <Link href="/book" className="flex items-center gap-2">
                  Request Alignment <ArrowRight size={14} />
                </Link>
              </Button>
            </div>

            {/* Trust Bullet Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-start sm:justify-between gap-3 sm:gap-4 text-xs text-slate-400">
              {data.trustPoints.map((point, idx) => (
                <span key={idx} className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px]">
                  <span className="text-[#D9A74A]">✦</span> {point}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

