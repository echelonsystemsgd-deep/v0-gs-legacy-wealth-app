"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useWebsiteContent } from "@/hooks/use-website-content"
import { SpeedGapVisualizer } from "@/components/speed-gap-visualizer"
import { useAuditModal } from "@/components/audit-modal-context"

export function Hero() {
  const { openModal } = useAuditModal()
  const { getSection } = useWebsiteContent()
  const data = getSection('hero', {
    eyebrow: "Bespoke Digital Infrastructure & Autonomic Systems",
    headline: "We Build Digital Systems for Category Leaders. The Rest Chase Them.",
    subheadline: "We do not build generic templates. We engineer high-performance visual platforms and automated pipelines for enterprises that require absolute leverage. Selectively aligned. Flawlessly executed.",
    primaryCtaText: "Request System Integration Audit",
    secondaryCtaText: "Deployed System Registry",
    trustItems: [
      "10+ Bespoke Deployments",
      "Autonomic Orchestrations",
      "Fluid Mobile Architecture",
      "Guaranteed Throughput"
    ]
  })

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-bg-primary">
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(109, 40, 217, 0.12) 0%, rgba(10, 10, 10, 0) 70%)"
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">
            [ {data.eyebrow} ]
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.15] text-balance mb-8 max-w-4xl"
        >
          {data.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-base sm:text-lg text-text-primary opacity-90 max-w-[580px] leading-relaxed mb-10"
        >
          {data.subheadline}
        </motion.p>

        {/* Two CTA Buttons Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center gap-4 mb-16 w-full justify-center"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-7 flex items-center gap-2 justify-center"
              onClick={() => openModal()}
            >
              {data.primaryCtaText}
              <ArrowRight size={16} />
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-7"
            >
              <Link href="/portfolio">{data.secondaryCtaText}</Link>
            </Button>
          </div>
          <Link href="/process" className="text-xs text-text-secondary hover:text-accent-gold transition-colors underline underline-offset-4 mt-2 mb-6">
            Unsure of your requirements? Review our Execution Protocol →
          </Link>

          <div className="w-full max-w-md pt-4">
            <SpeedGapVisualizer />
          </div>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-text-secondary border-t border-border-brand/20 pt-8 w-full max-w-3xl"
        >
          {Array.isArray(data.trustItems) && data.trustItems.map((item: string, idx: number) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="text-accent-gold">✦</span> {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
