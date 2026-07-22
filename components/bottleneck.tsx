"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_COPY } from "@/lib/site-copy"

export function Bottleneck() {
  const [isOrdered, setIsOrdered] = useState(false)
  const data = SITE_COPY.homepage.bottleneck

  // SVG Coordinates for Chaos vs Order state
  const nodes = [
    { id: 1, chaos: { x: 80, y: 120 }, order: { x: 50, y: 200 } },
    { id: 2, chaos: { x: 220, y: 80 }, order: { x: 170, y: 200 } },
    { id: 3, chaos: { x: 340, y: 150 }, order: { x: 290, y: 200 } },
    { id: 4, chaos: { x: 120, y: 280 }, order: { x: 200, y: 110 } },
    { id: 5, chaos: { x: 280, y: 320 }, order: { x: 200, y: 290 } },
  ]

  return (
    <section id="bottleneck" className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(109, 40, 217, 0.08) 0%, rgba(10, 10, 10, 0) 60%)"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

        {/* ── Centered headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">
            [ {data.eyebrow} ]
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 leading-[1.1] text-balance">
            {data.headline}
          </h2>
          <p className="font-sans text-base text-text-primary opacity-75 leading-relaxed mt-6 max-w-2xl mx-auto">
            {data.subheadline}
          </p>
          <p className="font-sans text-sm text-accent-gold font-medium mt-4 max-w-2xl mx-auto">
            {data.goldSlogan}
          </p>

          {/* Commodity Trap Absorbed Callout Box */}
          <div className="mt-8 p-4 rounded-xl border border-accent-gold/30 bg-accent-gold/5 max-w-2xl mx-auto text-left flex items-start gap-3">
            <span className="text-accent-gold text-base shrink-0 mt-0.5">✦</span>
            <p className="text-xs sm:text-sm text-text-primary opacity-90 leading-relaxed font-medium">
              <strong className="text-accent-gold font-serif">A Note on Commodity Infrastructure:</strong> Off-the-shelf templates and budget web builders look economical until you calculate lost instructions. We build high-converting infrastructure engineered for absolute market leverage.
            </p>
          </div>
        </motion.div>

        {/* ── Visual + Cards side-by-side ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Interactive SVG Visualiser */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-lg h-auto bg-bg-tertiary border border-border-brand/20 p-5 sm:p-6 rounded-xl shadow-2xl flex flex-col justify-start items-center overflow-visible">
              <div className="w-full flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                <span className={`w-2.5 h-2.5 rounded-full ${isOrdered ? "bg-accent-gold animate-pulse" : "bg-red-500 animate-pulse"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary opacity-70">
                  {data.systemMode} {isOrdered ? data.modeAutomated : data.modeManual}
                </span>
              </div>

              {/* Interactive Node Graph */}
              <div className="w-full flex items-center justify-center py-2">
                <svg viewBox="0 0 400 400" className="w-full h-auto max-h-[220px] sm:max-h-[260px]">
                  {/* Connection Lines */}
                  {isOrdered ? (
                    <>
                      <motion.line x1="50" y1="200" x2="170" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      <motion.line x1="170" y1="200" x2="290" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                      <motion.line x1="200" y1="110" x2="170" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      <motion.line x1="200" y1="290" x2="170" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      {/* Flow pulse dots */}
                      <motion.circle r="4" fill="var(--color-accent-gold)" animate={{ cx: [50, 170], cy: [200, 200] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                      <motion.circle r="4" fill="var(--color-accent-gold)" animate={{ cx: [200, 170], cy: [110, 200] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                      <motion.circle r="4" fill="var(--color-accent-gold)" animate={{ cx: [200, 170], cy: [290, 200] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                    </>
                  ) : (
                    <>
                      <line x1="80" y1="120" x2="220" y2="80" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" />
                      <line x1="220" y1="80" x2="120" y2="280" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" />
                      <line x1="120" y1="280" x2="340" y2="150" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" />
                      <line x1="340" y1="150" x2="280" y2="320" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" />
                      <line x1="80" y1="120" x2="280" y2="320" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1" />
                    </>
                  )}

                  {/* Nodes */}
                  {nodes.map((node) => (
                    <motion.g key={node.id}>
                      <motion.circle
                         cx={isOrdered ? node.order.x : node.chaos.x}
                         cy={isOrdered ? node.order.y : node.chaos.y}
                         r={isOrdered ? "12" : "8"}
                         fill={isOrdered ? "var(--color-bg-tertiary)" : "var(--color-bg-primary)"}
                         stroke={isOrdered ? "var(--color-accent-gold)" : "#ef4444"}
                         strokeWidth="2"
                        animate={{
                          cx: isOrdered ? node.order.x : node.chaos.x,
                          cy: isOrdered ? node.order.y : node.chaos.y,
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      />
                    </motion.g>
                  ))}

                  {/* Central Hub in Order state */}
                  {isOrdered && (
                    <motion.circle
                       cx="170"
                       cy="200"
                       r="16"
                       fill="var(--color-accent-purple)"
                       stroke="var(--color-accent-gold)"
                       strokeWidth="2.5"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </svg>
              </div>

              {/* Toggle Switch */}
              <div className="w-full border-t border-white/10 pt-4 mt-4 flex flex-col sm:flex-row gap-4 items-center sm:justify-between bg-transparent relative z-20 shrink-0">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-xs font-semibold text-text-primary opacity-80 leading-relaxed">
                    {isOrdered ? "Experience absolute system control" : "Experience disjointed operations"}
                  </span>
                  <button
                    onClick={() => {
                      const el = document.getElementById("roi-calculator")
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    }}
                    className="text-[10px] text-accent-gold hover:underline mt-1 font-semibold block bg-transparent border-none p-0 cursor-pointer text-left focus:outline-none"
                  >
                    {data.diagnosticLink}
                  </button>
                </div>
                <Button
                  onClick={() => setIsOrdered(!isOrdered)}
                  size="sm"
                  variant={isOrdered ? "default" : "outline"}
                  className={`w-full sm:w-auto text-[10px] px-4 py-2 border transition-all shrink-0 ${
                    isOrdered 
                      ? "" 
                      : "bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                  }`}
                >
                  {isOrdered ? data.triggerBtnActive : data.triggerBtnInactive}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Problem / Solution Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Card 1 */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${isOrdered ? "bg-bg-tertiary/30 border-accent-gold/20" : "bg-[#1C1313]/10 border-red-500/15"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${isOrdered ? "text-accent-gold bg-accent-gold/10" : "text-red-500 bg-red-500/10"}`}>
                  {isOrdered ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-semibold text-lg text-white">{data.cards[0].title}</h3>
                  <p className="font-sans text-sm text-text-primary opacity-80 leading-relaxed">
                    {isOrdered 
                      ? "Mechanism: We establish instant auto-engagement to capture leads. Benefit: Every lead engaged within 60 seconds of enquiry."
                      : data.cards[0].description
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${isOrdered ? "bg-bg-tertiary/30 border-accent-gold/20" : "bg-[#1C1313]/10 border-red-500/15"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${isOrdered ? "text-accent-gold bg-accent-gold/10" : "text-red-500 bg-red-500/10"}`}>
                  {isOrdered ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-semibold text-lg text-white">{data.cards[1].title}</h3>
                  <p className="font-sans text-sm text-text-primary opacity-80 leading-relaxed">
                    {isOrdered 
                      ? "Mechanism: We wire automated data pipelines from capture to CRM. Benefit: Reclaim significant administrative hours back every week."
                      : data.cards[1].description
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${isOrdered ? "bg-bg-tertiary/30 border-accent-gold/20" : "bg-[#1C1313]/10 border-red-500/15"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${isOrdered ? "text-accent-gold bg-accent-gold/10" : "text-red-500 bg-red-500/10"}`}>
                  {isOrdered ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-semibold text-lg text-white">{data.cards[2].title}</h3>
                  <p className="font-sans text-sm text-text-primary opacity-80 leading-relaxed">
                    {isOrdered 
                      ? "Mechanism: We configure smart CRM follow-ups and lead-nurtures. Benefit: Recover pipeline revenue that is normally lost to silence."
                      : data.cards[2].description
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  )
}
