"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Smartphone, CreditCard, MessageSquare, Star, ShieldCheck, Activity, CheckCircle2 } from "lucide-react"

interface NodeSpec {
  id: string
  title: string
  subtitle: string
  icon: any
  latency: string
  throughput: string
  mechanism: string
  specs: string[]
}

const nodes: NodeSpec[] = [
  {
    id: "storefront",
    title: "1. Instant Mobile Storefront",
    subtitle: "Sub-1s Mobile Load Speed & 3-Tap UI",
    icon: Smartphone,
    latency: "< 1.0s",
    throughput: "100% Mobile Ready",
    mechanism: "High-speed, custom-designed mobile storefront engineered so local customers view your offerings, select specs, and book in seconds without bouncing away.",
    specs: ["Sub-1s Mobile Speed", "Google Local SEO", "3-Tap Fast Checkout"]
  },
  {
    id: "deposit",
    title: "2. 24/7 Upfront Deposit Capture",
    subtitle: "Stripe, Apple Pay & Google Pay",
    icon: CreditCard,
    latency: "Instant",
    throughput: "50% Upfront Paid",
    mechanism: "Secures non-refundable deposits automatically before dates are locked into your calendar. Eliminates unpaid no-shows and late-night bank transfer chasing.",
    specs: ["Card & Apple Pay", "Zero Unpaid No-Shows", "Instant Order Receipt"]
  },
  {
    id: "dispatch",
    title: "3. Sub-60s WhatsApp & Phone Alerts",
    subtitle: "Direct Order Ping to Your Smartphone",
    icon: MessageSquare,
    latency: "< 60s",
    throughput: "Instant Dispatch",
    mechanism: "Full customer details, custom order specifications, and confirmed deposit amounts arrive straight on your phone the second an order is completed.",
    specs: ["Instant WhatsApp Alert", "Calendar Auto-Sync", "Zero Lost Enquiries"]
  },
  {
    id: "reviews",
    title: "4. Automated 5-Star Review Engine",
    subtitle: "Post-Service Google Review Collection",
    icon: Star,
    latency: "Automated",
    throughput: "5.0★ Local Rank",
    mechanism: "Dispatches a friendly automated review link directly to satisfied customers after their job is completed, steadily building your Google rankings on autopilot.",
    specs: ["1-Tap Review Link", "Private Feedback Filter", "Dominates Local Search"]
  }
]

const CYCLE_DURATION = 3500 // ms per node

export function SystemBlueprint() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: 0.2 })
  const [hasStartedView, setHasStartedView] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeNode = nodes[selectedIndex]

  // Reset to Node 1 when entering view for the first time
  useEffect(() => {
    if (isInView && !hasStartedView) {
      setHasStartedView(true)
      setSelectedIndex(0)
    }
  }, [isInView, hasStartedView])

  const clearAll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  const startCycle = useCallback(() => {
    clearAll()
    setProgress(0)

    let elapsed = 0
    progressRef.current = setInterval(() => {
      elapsed += 50
      setProgress(Math.min((elapsed / CYCLE_DURATION) * 100, 100))
    }, 50)

    intervalRef.current = setTimeout(() => {
      setSelectedIndex((prev) => (prev + 1) % nodes.length)
    }, CYCLE_DURATION)
  }, [clearAll])

  useEffect(() => {
    if (hasStartedView && !isPaused) {
      startCycle()
    } else {
      clearAll()
    }
    return clearAll
  }, [selectedIndex, isPaused, hasStartedView, startCycle, clearAll])

  const handleManualSelect = (index: number) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    clearAll()
    setProgress(0)
    setIsPaused(true)
    setSelectedIndex(index)

    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 6000)
  }

  useEffect(() => {
    return () => {
      clearAll()
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [clearAll])

  return (
    <div id="system-blueprint" ref={containerRef} className="relative py-20 lg:py-28 bg-[#020E28] border-t border-[#DAA640]/15 text-left overflow-hidden max-w-full min-w-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 min-w-0 max-w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 min-w-0">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#DAA640]">
            [ THE 24/7 ORDER & REVENUE ENGINE ]
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3">
            How Your System Runs <span className="bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-white bg-clip-text text-transparent">On Autopilot</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed mt-4">
            Watch each stage execute automatically from customer inquiry to paid deposit and phone dispatch. Tap any stage to inspect the mechanics.
          </p>
        </div>

        {/* Node Blueprint Grid */}
        <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0 max-w-full">
          
          {/* Node Selector Column (5 cols on md+) */}
          <div className="md:col-span-5 space-y-3">
            {nodes.map((node, index) => {
              const IconComp = node.icon
              const isSelected = selectedIndex === index
              return (
                <button
                  key={node.id}
                  onClick={() => handleManualSelect(index)}
                  suppressHydrationWarning
                  className={`w-full p-4 sm:p-5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group cursor-pointer focus:outline-none ${
                    isSelected 
                      ? "bg-[#07153B] border-[#DAA640] shadow-[0_0_20px_rgba(218,166,64,0.18)]" 
                      : "bg-[#07153B]/50 border-slate-800 hover:border-slate-700 hover:bg-[#07153B]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg border transition-colors shrink-0 ${
                      isSelected ? "bg-[#DAA640]/15 border-[#DAA640] text-[#DAA640]" : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}>
                      <IconComp size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans font-bold text-sm text-white truncate">{node.title}</h4>
                      <p className="font-sans text-xs text-slate-400 mt-0.5 truncate">{node.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded ${
                      isSelected ? "bg-[#DAA640]/20 text-[#DAA640]" : "bg-slate-800 text-slate-400"
                    }`}>
                      {node.latency}
                    </span>
                    {isSelected && !isPaused && (
                      <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden" style={{ width: "60px" }}>
                        <motion.div
                          className="h-full bg-[#DAA640] rounded-full"
                          style={{ width: `${progress}%` }}
                          transition={{ duration: 0 }}
                        />
                      </div>
                    )}
                    {isSelected && isPaused && (
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">manual</span>
                    )}
                  </div>
                </button>
              )
            })}

            {/* Auto-cycle status indicator */}
            <div className="flex items-center gap-2 px-1 pt-1">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPaused ? "bg-slate-600" : "bg-[#DAA640] animate-pulse"}`} />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {isPaused ? "Paused — resuming in a moment" : "Live automation sequence cycling"}
              </span>
            </div>
          </div>

          {/* Active Node Detail Card (7 cols on md+) */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#07153B] border border-[#DAA640]/30 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-[#DAA640] animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#DAA640]">
                      STAGE SPECIFICATION
                    </span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    ● ACTIVE
                  </span>
                </div>

                {/* Node Title */}
                <div>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-white">{activeNode.title}</h3>
                  <p className="font-sans text-xs text-slate-300 mt-1">{activeNode.subtitle}</p>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-4 bg-[#020E28] border border-slate-700/60 p-4 rounded-xl font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Response Speed</span>
                    <span className="text-[#DAA640] font-bold text-base mt-0.5 block">{activeNode.latency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">System Capability</span>
                    <span className="text-[#DAA640] font-bold text-base mt-0.5 block">{activeNode.throughput}</span>
                  </div>
                </div>

                {/* Core Mechanism */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">How It Works</h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {activeNode.mechanism}
                  </p>
                </div>

                {/* Sub-Specs List */}
                <div className="border-t border-slate-700/60 pt-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Key Features Included</h4>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {activeNode.specs.map((spec, i) => (
                      <div key={i} className="p-2.5 bg-[#020E28] border border-slate-800 rounded-lg flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#DAA640] shrink-0" />
                        <span className="text-[11px] font-sans text-slate-200 font-medium">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  )
}
