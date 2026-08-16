"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_COPY } from "@/lib/site-copy"
import { createClient } from "@/lib/supabase/client"

interface TestimonialRecord {
  id?: string
  client_name: string
  company: string | null
  testimonial: string
  badge?: string | null
  profile_image?: string | null
}

const STATIC_FALLBACK_TESTIMONIALS: TestimonialRecord[] = [
  {
    client_name: "Sarah M., Founder",
    company: "The Artisan Patisserie Group · London",
    testimonial: "We used to lose 4–5 bespoke orders every weekend due to missed calls and delayed replies. Mercian deployed an automated 24/7 storefront with WhatsApp notifications. We now capture 50% non-refundable deposits upfront before any job hits our calendar.",
    badge: "+38% Revenue Lift",
  },
  {
    client_name: "Marcus T., Managing Director",
    company: "Gourmet Events & Hospitality · Berkshire",
    testimonial: "The automated quote engine and instant phone dispatch completely eliminated our late-night quote chasing. Setup was completed in 6 business days and paid for itself within the first 3 weeks of operations.",
    badge: "14.5 Hrs Saved / Wk",
  },
]

export function Testimonials() {
  const data = SITE_COPY.homepage.testimonials
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(STATIC_FALLBACK_TESTIMONIALS)

  useEffect(() => {
    let isMounted = true
    const fetchLiveTestimonials = async () => {
      try {
        const supabase = createClient()
        const { data: liveData, error } = await supabase
          .from("testimonials")
          .select("id, client_name, company, testimonial, badge, profile_image")
          .eq("is_archived", false)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(4)

        if (!error && liveData && liveData.length >= 2 && isMounted) {
          setTestimonials(liveData)
        }
      } catch (err) {
        // Graceful fallback to static array
      }
    }

    fetchLiveTestimonials()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="telemetry" className="relative py-20 lg:py-28 overflow-hidden bg-[#020E28]">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DAA640] font-mono">
            [ {data.eyebrow} ]
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {data.headline}
          </h2>
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DAA640]/10 border border-[#DAA640]/25 text-xs text-[#DAA640] font-mono">
            <Star className="w-3.5 h-3.5 fill-[#DAA640] stroke-none" />
            <span>{data.guarantee}</span>
          </div>
        </div>

        {/* Client Testimonial Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-14 text-left">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl border border-[#DAA640]/25 bg-[#07153B] space-y-4 shadow-xl relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#DAA640]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#DAA640] stroke-none" />
                    ))}
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  "{item.testimonial}"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{item.client_name}</p>
                  {item.company && (
                    <p className="text-[11px] text-slate-400 font-mono">{item.company}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#DAA640]">
                  <ShieldCheck size={14} /> Verified Client
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partnership & Growth Cohort Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#DAA640]/30 bg-[#07153B]/90 backdrop-blur-md shadow-2xl space-y-7 text-left relative overflow-hidden min-w-0 max-w-full"
        >
          <div className="relative z-10 space-y-6">
            {/* Top Status Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {data.cohortCard.badge}
              </div>
              <span className="text-[10px] font-mono text-[#DAA640] uppercase tracking-widest font-semibold">
                STRICT 1 PARTNER PER POSTCODE CATEGORY
              </span>
            </div>

            {/* Headline & Paragraphs */}
            <div className="space-y-4">
              <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                {data.cohortCard.title}
              </h3>
              
              <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.cohortCard.paragraph1}
              </p>

              <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.cohortCard.paragraph2}
              </p>

              <p className="font-sans text-xs sm:text-sm text-[#EBB755] font-semibold leading-relaxed border-l-2 border-[#DAA640] pl-4 py-1">
                {data.cohortCard.paragraph3}
              </p>
            </div>

            {/* Strategy Session Enquiry CTA Box */}
            <div className="p-4 sm:p-5 rounded-xl border border-[#DAA640]/25 bg-[#DAA640]/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {data.cohortCard.enquiryCtaText}
              </p>
              <Button asChild size="sm" className="shrink-0 px-6 py-2.5 text-xs font-bold bg-[#DAA640] text-[#020E28] hover:bg-[#EBB755] transition-all rounded-lg">
                <Link href="/book" className="flex items-center gap-2">
                  Request Alignment <ArrowRight size={14} />
                </Link>
              </Button>
            </div>

            {/* Trust Bullet Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-start sm:justify-between gap-3 text-xs text-slate-400">
              {data.trustPoints.map((point, idx) => (
                <span key={idx} className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-slate-300">
                  <CheckCircle2 size={13} className="text-[#DAA640]" /> {point}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
