"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Bottleneck() {
  const [isOrdered, setIsOrdered] = useState(false)

  // SVG Coordinates for Chaos vs Order state
  const nodes = [
    { id: 1, chaos: { x: 80, y: 120 }, order: { x: 50, y: 200 } },
    { id: 2, chaos: { x: 220, y: 80 }, order: { x: 170, y: 200 } },
    { id: 3, chaos: { x: 340, y: 150 }, order: { x: 290, y: 200 } },
    { id: 4, chaos: { x: 120, y: 280 }, order: { x: 200, y: 110 } },
    { id: 5, chaos: { x: 280, y: 320 }, order: { x: 200, y: 290 } },
  ]

  return (
    <section id="bottleneck" className="relative py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(109, 40, 217, 0.08) 0%, rgba(10, 10, 10, 0) 60%)"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Visual Chaos vs Order */}
          <div className="lg:col-span-6 flex flex-col items-center space-y-8">
            <div className="w-full text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                The Bottleneck
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 leading-tight">
                Is your business outgrowing your systems?
              </h2>
            </div>

            {/* SVG Visualizer Container */}
            <div className="relative w-full max-w-lg min-h-[440px] sm:min-h-[460px] md:aspect-square bg-[#111318] border border-white/5 p-6 rounded-none shadow-2xl flex flex-col justify-between items-center overflow-hidden group">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isOrdered ? "bg-[#C9A227] animate-pulse" : "bg-red-500 animate-pulse"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0EDE6] opacity-70">
                  System Mode: {isOrdered ? "Automated & Connected" : "Manual Chaos"}
                </span>
              </div>

              {/* Interactive Node Graph */}
              <div className="flex-1 w-full flex items-center justify-center pt-8 pb-4">
                <svg viewBox="0 0 400 400" className="w-full h-full max-h-[220px] xs:max-h-[260px] sm:max-h-[320px]">
                  {/* Connection Lines */}
                  {isOrdered ? (
                    // Order Lines (Structured single pipeline flowing to hub)
                    <>
                      <motion.line x1="50" y1="200" x2="170" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      <motion.line x1="170" y1="200" x2="290" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                      <motion.line x1="200" y1="110" x2="170" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      <motion.line x1="200" y1="290" x2="170" y2="200" stroke="rgba(201, 162, 39, 0.4)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      
                      {/* Flow pulse dots */}
                      <motion.circle r="4" fill="#C9A227" animate={{ cx: [50, 170], cy: [200, 200] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                      <motion.circle r="4" fill="#C9A227" animate={{ cx: [200, 170], cy: [110, 200] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                      <motion.circle r="4" fill="#C9A227" animate={{ cx: [200, 170], cy: [290, 200] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                    </>
                  ) : (
                    // Chaos Lines (Messy intersections crossing everywhere)
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
                    <motion.g
                      key={node.id}
                      animate={{
                        cx: isOrdered ? node.order.x : node.chaos.x,
                        cy: isOrdered ? node.order.y : node.chaos.y,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    >
                      <motion.circle
                        cx={isOrdered ? node.order.x : node.chaos.x}
                        cy={isOrdered ? node.order.y : node.chaos.y}
                        r={isOrdered ? "12" : "8"}
                        fill={isOrdered ? "#130D24" : "#0A0A0A"}
                        stroke={isOrdered ? "#C9A227" : "#ef4444"}
                        strokeWidth="2"
                        className="transition-colors duration-300"
                      />
                    </motion.g>
                  ))}
                  
                  {/* Central Hub in Order state */}
                  {isOrdered && (
                    <motion.circle
                      cx="170"
                      cy="200"
                      r="16"
                      fill="#6D28D9"
                      stroke="#C9A227"
                      strokeWidth="2.5"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </svg>
              </div>

              {/* Toggle Switch */}
              <div className="w-full border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-4 items-center sm:justify-between bg-transparent relative z-20 shrink-0">
                <span className="text-xs font-semibold text-[#F0EDE6] opacity-80 text-center sm:text-left leading-relaxed">
                  {isOrdered ? "Experience absolute system control" : "Experience disjointed operations"}
                </span>
                <Button
                  onClick={() => setIsOrdered(!isOrdered)}
                  size="sm"
                  className={`w-full sm:w-auto rounded-none font-bold uppercase tracking-wider text-[10px] px-4 py-2 border transition-all shrink-0 ${
                    isOrdered 
                      ? "bg-[#6D28D9] border-[#C9A227] text-white hover:bg-[#5B21B6]" 
                      : "bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10"
                  }`}
                >
                  {isOrdered ? "Deactivate AI Hub" : "Activate AI Hub"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Problem Cards */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-sans text-base text-[#F0EDE6] opacity-80 leading-relaxed mb-6">
              When a business relies on manual effort for lead qualification, data transfer, and customer follow-ups, growth inevitably creates administrative friction. We replace manual bottlenecks with automated hubs so your team can focus on closing deals.
            </p>

            {/* Card 1 */}
            <div className={`p-6 border transition-all duration-300 ${isOrdered ? "bg-[#130D24]/30 border-[#C9A227]/20" : "bg-[#1C1313]/10 border-red-500/15"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 shrink-0 ${isOrdered ? "text-[#C9A227] bg-[#C9A227]/10" : "text-red-500 bg-red-500/10"}`}>
                  {isOrdered ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-semibold text-lg text-white">Slipping Leads</h3>
                  <p className="font-sans text-sm text-[#F0EDE6] opacity-80 leading-relaxed">
                    {isOrdered 
                      ? "Mechanism: We establish instant auto-engagement to capture leads. Benefit: 100% of leads engaged within 60 seconds."
                      : "Delayed response times cause high-value prospects to drop off and switch to faster competitors before you reply."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`p-6 border transition-all duration-300 ${isOrdered ? "bg-[#130D24]/30 border-[#C9A227]/20" : "bg-[#1C1313]/10 border-red-500/15"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 shrink-0 ${isOrdered ? "text-[#C9A227] bg-[#C9A227]/10" : "text-red-500 bg-red-500/10"}`}>
                  {isOrdered ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-semibold text-lg text-white">Wasted Hours</h3>
                  <p className="font-sans text-sm text-[#F0EDE6] opacity-80 leading-relaxed">
                    {isOrdered 
                      ? "Mechanism: We wire automated data pipelines from capture to CRM. Benefit: Reclaim 20+ administrative hours every week."
                      : "Your team loses hours every week to manual data entry, lead formatting, and repetitive dashboard busywork."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`p-6 border transition-all duration-300 ${isOrdered ? "bg-[#130D24]/30 border-[#C9A227]/20" : "bg-[#1C1313]/10 border-red-500/15"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 shrink-0 ${isOrdered ? "text-[#C9A227] bg-[#C9A227]/10" : "text-red-500 bg-red-500/10"}`}>
                  {isOrdered ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-semibold text-lg text-white">Missed Follow-Ups</h3>
                  <p className="font-sans text-sm text-[#F0EDE6] opacity-80 leading-relaxed">
                    {isOrdered 
                      ? "Mechanism: We configure smart CRM follow-ups and lead-nurtures. Benefit: Secure 60% of pipeline revenue that is normally lost."
                      : "Without structured automatic nurturing, warm leads are neglected and get lost in the sales pipeline."
                    }
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
