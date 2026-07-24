"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

// Performance-optimized scroll-triggered count-up component
function CountUp({ end, duration = 1.5, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const totalMiliseconds = duration * 1000
    const incrementTime = 30
    const steps = Math.ceil(totalMiliseconds / incrementTime)
    const increment = end / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      start += increment
      if (currentStep >= steps) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const mockLogs = [
  "[SYSTEM] Lead engine active & listening...",
  "[WEBHOOK] Incoming lead packet received from Webform",
  "[AI AGENT] Extracting details: Name='Sophie Bennett', Intent='Systems Build'",
  "[AI CONCIERGE] Qualifying lead profiles against ICP metrics...",
  "[AI CONCIERGE] High-ticket classification MATCHED (ICP: 98%)",
  "[CRM] Syncing lead profile with Salesforce CRM...",
  "[CRM] Account created, Deal Stage updated to 'Call Booked'",
  "[CALENDAR] Dispatching strategy booking slot validation...",
  "[CALENDAR] Calendar synchronized successfully (Auto-confirmed)",
  "[SLACK] Dispatching sales notification to team #alerts",
  "[SUCCESS] Lead pipeline orchestration completed in 840ms",
  "--------------------------------------------------",
  "[SYSTEM] Monitoring active databases...",
  "[WEBHOOK] Incoming lead packet received from LinkedIn Form",
  "[AI AGENT] Extracting details: Name='David Chen', Intent='Sales Funnel'",
  "[AI CONCIERGE] Qualifying lead profiles against ICP metrics...",
  "[AI CONCIERGE] High-ticket classification MATCHED (ICP: 95%)",
  "[CRM] Syncing lead profile with HubSpot CRM...",
  "[CRM] Account created, Deal Stage updated to 'Proposal Sent'",
  "[SUCCESS] Lead pipeline orchestration completed in 720ms",
  "--------------------------------------------------",
]

export function Results() {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([])
  const terminalContainerRef = useRef<HTMLDivElement>(null)

  // System log rotation loop
  useEffect(() => {
    let index = 0
    // Load initial 3 lines immediately
    setVisibleLogs(mockLogs.slice(0, 3))
    index = 3

    const logTimer = setInterval(() => {
      setVisibleLogs((prev) => {
        const nextLogs = [...prev, mockLogs[index]]
        // Keep terminal clean by limiting to last 15 lines
        if (nextLogs.length > 15) {
          nextLogs.shift()
        }
        return nextLogs
      })
      index = (index + 1) % mockLogs.length
    }, 2000)

    return () => clearInterval(logTimer)
  }, [])

  // Auto-scroll terminal log to bottom
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTo({
        top: terminalContainerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [visibleLogs])

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-bg-primary border-y border-white/5">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Big Stats */}
          <div className="lg:col-span-6 space-y-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
                What Our Systems Are Built For
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
                Engineering For Measurable Outcomes
              </h2>
              <p className="font-sans text-sm text-text-primary opacity-70 mt-4">
                These are the outcomes our systems are architected to drive — built with precision, not guesswork.
              </p>
            </div>

            {/* Stats block 1 */}
            <div className="space-y-3">
              <div className="font-serif text-5xl sm:text-6xl font-bold text-accent-gold tracking-tight">
                <CountUp end={35} suffix="%" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Capture & Convert</p>
                <p className="font-sans text-sm text-text-primary opacity-80 mt-1 leading-relaxed max-w-md">
                  AI-automated lead capture systems are engineered to significantly boost qualified bookings — without extra headcount. This is the lift our architecture is designed to unlock.
                </p>
              </div>
            </div>

            {/* Stats block 2 */}
            <div className="space-y-3">
              <div className="font-serif text-5xl sm:text-6xl font-bold text-accent-gold tracking-tight">
                <CountUp end={40} suffix="+" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Hours Reclaimed</p>
                <p className="font-sans text-sm text-text-primary opacity-80 mt-1 leading-relaxed max-w-md">
                  Automating inventory syncs, data pipelines, and support workflows is built to reclaim entire work weeks — redirected to growth, not admin.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Terminal Console */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className="bg-bg-tertiary border border-border-brand/30 rounded-none overflow-hidden shadow-2xl flex flex-col h-[320px] font-mono text-[11px] text-text-primary relative">
              
              {/* Terminal Title Bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-bg-secondary border-b border-white/5 shrink-0 select-none">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[9px] uppercase tracking-wider text-text-secondary ml-4 font-sans font-bold">
                  System Engine Monitor
                </span>
              </div>

              {/* Console Logs area */}
              <div 
                ref={terminalContainerRef}
                className="flex-1 p-5 overflow-y-auto space-y-2 select-none scrollbar-thin"
              >
                {visibleLogs.map((log, index) => {
                  let colorClass = "text-white/60"
                  if (log.startsWith("[SUCCESS]")) colorClass = "text-green-400 font-bold"
                  if (log.startsWith("[AI CONCIERGE]") || log.startsWith("[AI AGENT]")) colorClass = "text-accent-gold"
                  if (log.startsWith("[CRM]") || log.startsWith("[CALENDAR]")) colorClass = "text-purple-400"
                  if (log.startsWith("[SYSTEM]")) colorClass = "text-blue-400"
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`leading-normal ${colorClass}`}
                    >
                      {log}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
