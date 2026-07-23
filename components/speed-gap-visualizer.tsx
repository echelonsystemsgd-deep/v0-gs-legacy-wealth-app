"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Clock, Zap, ArrowRight, ShieldCheck } from "lucide-react"

export function SpeedGapVisualizer() {
  const [manualProgress, setManualProgress] = useState(0)
  const [autoProgress, setAutoProgress] = useState(0)
  const [manualStep, setManualStep] = useState(0)
  const [autoStep, setAutoStep] = useState(0)
  const [loopKey, setLoopKey] = useState(0)

  // Simulation Loop
  useEffect(() => {
    // Reset states
    setManualProgress(0)
    setAutoProgress(0)
    setManualStep(0)
    setAutoStep(0)

    // Autonomic Engine (Ticks very fast: reaches 100% in 2.5s)
    const autoIntervals = [
      setTimeout(() => { setAutoStep(1); setAutoProgress(25) }, 400),
      setTimeout(() => { setAutoStep(2); setAutoProgress(50) }, 900),
      setTimeout(() => { setAutoStep(3); setAutoProgress(75) }, 1400),
      setTimeout(() => { setAutoStep(4); setAutoProgress(100) }, 2000)
    ]

    // Manual Pipeline (Ticks very slow: reaches 100% in 7s)
    const manualIntervals = [
      setTimeout(() => { setManualStep(1); setManualProgress(33) }, 1200),
      setTimeout(() => { setManualStep(2); setManualProgress(66) }, 2800),
      setTimeout(() => { setManualStep(3); setManualProgress(100) }, 4500)
    ]

    // Reset loop after 8 seconds
    const loopTimeout = setTimeout(() => {
      setLoopKey(prev => prev + 1)
    }, 8500)

    return () => {
      autoIntervals.forEach(clearTimeout)
      manualIntervals.forEach(clearTimeout)
      clearTimeout(loopTimeout)
    }
  }, [loopKey])

  return (
    <div className="w-full max-w-lg mx-auto bg-bg-tertiary/10 border border-white/5 p-6 rounded-xl glass space-y-6 text-left relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold">System Simulation</span>
          <h4 className="font-serif text-lg font-bold text-white mt-1">The Cost of Manual Delay</h4>
        </div>

        {/* Comparison Stack */}
        <div className="space-y-4">
          
          {/* Card 1: Manual Process */}
          <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={12} />
                Manual Lead Pipeline
              </span>
              <span className="text-xxs text-text-secondary/60 flex items-center gap-1">
                <Clock size={10} />
                Elapsed: {manualStep === 0 ? "0s" : manualStep === 1 ? "15m" : manualStep === 2 ? "2h" : "12h+"}
              </span>
            </div>

            {/* Steps Visual */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-medium text-text-secondary/60 text-center">
              <div className={`p-1.5 rounded bg-white/[0.02] border transition-colors ${manualStep >= 1 ? "border-red-500/20 text-red-400 bg-red-500/5" : "border-transparent"}`}>
                1. Lead Enters
              </div>
              <div className={`p-1.5 rounded bg-white/[0.02] border transition-colors ${manualStep >= 2 ? "border-red-500/20 text-red-400 bg-red-500/5" : "border-transparent"}`}>
                2. Rep Emailed
              </div>
              <div className={`p-1.5 rounded bg-white/[0.02] border transition-colors ${manualStep >= 3 ? "border-red-500/50 text-red-500 bg-red-900/10 font-bold" : "border-transparent"}`}>
                3. Lead Decay
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-500" 
                style={{ width: `${manualProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Status Output */}
            <div className="h-auto min-h-[16px] flex items-center justify-between text-[10px]">
              <span className="text-text-secondary/80">Pipeline Status:</span>
              <span className={`font-bold transition-all duration-300 ${manualStep === 3 ? "text-red-500 animate-pulse" : "text-text-secondary/60"}`}>
                {manualStep === 0 && "Idle"}
                {manualStep === 1 && "Lead sitting in inbox..."}
                {manualStep === 2 && "Awaiting manual follow-up..."}
                {manualStep === 3 && "⚠️ 80% Lead Value Evaporated"}
              </span>
            </div>
          </div>

          {/* Card 2: Autonomic Engine */}
          <div className="p-4 bg-gradient-to-br from-accent-purple/10 to-transparent border border-accent-purple/20 rounded-lg space-y-3">
            <div className="flex justify-between items-center text-xs gap-2">
              <span className="font-bold text-accent-gold uppercase tracking-wider flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Zap size={12} className="animate-bounce shrink-0" />
                <span className="truncate sm:whitespace-normal">Mercian Wealth Autonomic Engine</span>
              </span>
              <span className="text-[10px] text-accent-gold/80 flex items-center gap-1 font-bold shrink-0">
                <Clock size={10} />
                Elapsed: {autoStep === 0 ? "0s" : autoStep === 1 ? "4s" : autoStep === 2 ? "12s" : autoStep === 3 ? "25s" : "45s"}
              </span>
            </div>

            {/* Steps Visual */}
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 text-[7.5px] sm:text-[8px] font-bold text-text-secondary/50 text-center">
              <div className={`p-1.5 rounded transition-all duration-300 text-center ${autoStep >= 1 ? "bg-accent-gold/10 border border-accent-gold/20 text-accent-gold" : "bg-white/[0.01] border border-transparent"}`}>
                Capture
              </div>
              <div className={`p-1.5 rounded transition-all duration-300 text-center ${autoStep >= 2 ? "bg-accent-gold/10 border border-accent-gold/20 text-accent-gold" : "bg-white/[0.01] border border-transparent"}`}>
                AI Qualify
              </div>
              <div className={`p-1.5 rounded transition-all duration-300 text-center ${autoStep >= 3 ? "bg-accent-gold/10 border border-accent-gold/20 text-accent-gold" : "bg-white/[0.01] border border-transparent"}`}>
                Sync CRM
              </div>
              <div className={`p-1.5 rounded transition-all duration-300 text-center ${autoStep >= 4 ? "bg-green-500/10 border border-green-500/40 text-green-400" : "bg-white/[0.01] border border-transparent"}`}>
                Booked
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-accent-purple to-accent-gold animate-pulse" 
                style={{ width: `${autoProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Status Output */}
            <div className="h-4 flex items-center justify-between text-[10px]">
              <span className="text-text-secondary/80">Pipeline Status:</span>
              <span className={`font-bold transition-all duration-300 ${autoStep === 4 ? "text-green-400 font-extrabold flex items-center gap-1" : "text-accent-gold"}`}>
                {autoStep === 0 && "Ready"}
                {autoStep === 1 && "Routing Lead data..."}
                {autoStep === 2 && "AI Agent qualifying intent..."}
                {autoStep === 3 && "Calendly sync dispatched..."}
                {autoStep === 4 && (
                  <>
                    <CheckCircle2 size={12} className="animate-pulse" />
                    🏆 Client Secured in 45s
                  </>
                )}
              </span>
            </div>
          </div>

        </div>

        {/* Copy Overlay */}
        <p className="text-xxs sm:text-xs text-text-primary/75 leading-relaxed text-center italic border-t border-white/5 pt-4">
          "You aren't losing deals to better products. You are losing to faster systems. While your team manually routes emails, our partners close deals in under 60 seconds."
        </p>

      </div>
    </div>
  )
}
