"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, DollarSign, Clock, ShieldAlert, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LatencyCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState<number>(60)
  const [avgDealValue, setAvgDealValue] = useState<number>(8500)

  // Calculations
  // Manual lead delay loses approx 38% of actionable pipeline revenue
  const annualPipelinePotential = monthlyLeads * avgDealValue * 12
  const estimatedAnnualLeak = Math.round(annualPipelinePotential * 0.38)
  const hoursReclaimedPerYear = Math.round(monthlyLeads * 2.5 * 12)
  const speedToLeadIncrease = "14.4x"

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div id="roi-calculator" className="relative py-16 sm:py-24 bg-bg-secondary border-y border-accent-gold/15 overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 10, 0) 75%)"
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10 text-left">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent-gold">
            [ INTERACTIVE SYSTEM DIAGNOSTIC ]
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3">
            Calculate Your <span className="bg-gradient-to-r from-accent-gold via-amber-200 to-accent-gold bg-clip-text text-transparent">Latency Revenue Deficit</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-primary opacity-75 leading-relaxed mt-4">
            Slow response speeds and manual data entry bleed high-ticket pipeline revenue. Move the sliders to calculate your live estimated annual leak.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Sliders Area (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-bg-tertiary/40 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6 backdrop-blur-md flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Slider 1: Monthly Leads */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-xs sm:text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap size={16} className="text-accent-gold" />
                    Monthly Inbound Leads
                  </label>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-accent-gold">
                    {monthlyLeads} <span className="text-xs text-text-secondary">leads/mo</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                />
                <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                  <span>10 leads</span>
                  <span>150 leads</span>
                  <span>300 leads</span>
                </div>
              </div>

              {/* Slider 2: Average Deal Value */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-sans text-xs sm:text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign size={16} className="text-accent-gold" />
                    Average Deal / Client Value
                  </label>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-accent-gold">
                    {formatCurrency(avgDealValue)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={avgDealValue}
                  onChange={(e) => setAvgDealValue(Number(e.target.value))}
                  className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                />
                <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                  <span>$1,000</span>
                  <span>$25,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Live Output Banner inside slider card */}
              <div className="p-4 sm:p-5 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-gold block">
                    LIVE CALCULATED REVENUE LEAK
                  </span>
                  <span className="text-xs text-text-secondary">Based on {monthlyLeads} leads @ {formatCurrency(avgDealValue)}</span>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-accent-gold shrink-0">
                  {formatCurrency(estimatedAnnualLeak)}
                </span>
              </div>
            </div>

            {/* Context Note + Action Button */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-text-secondary leading-relaxed flex items-start gap-3">
                <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Based on Harvard Business Review speed-to-lead benchmark data: responding within 60 seconds yields a <strong className="text-white">391% increase</strong> in conversion versus a 30-minute delay.
                </span>
              </div>

              {/* Action Button inside diagnostic card */}
              <Button
                asChild
                size="lg"
                className="w-full font-bold shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:shadow-accent-gold/30 py-5 text-sm"
              >
                <Link href="/book" className="flex items-center justify-center gap-2">
                  <span>Plug Revenue Leak — Apply for Alignment</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>

          </div>

          {/* Results Summary Box (5 cols on desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-accent-purple/20 via-bg-tertiary/60 to-bg-tertiary border border-accent-gold/40 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 text-center flex flex-col justify-between">
            
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-gold">
                PROJECTED REVENUE RECOVERY
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-accent-gold tracking-tight">
                {formatCurrency(estimatedAnnualLeak)}
              </div>
              <p className="text-xs text-text-primary/70">Estimated Annual Revenue Evaporating to Speed Latency</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-text-secondary block">Hours Reclaimed</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-1">
                  <Clock size={14} className="text-accent-gold" />
                  {hoursReclaimedPerYear} hrs/yr
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-text-secondary block">Speed Multiple</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-green-400">
                  {speedToLeadIncrease}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                asChild
                size="lg"
                className="w-full font-bold shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:shadow-accent-gold/30 py-6 text-sm"
              >
                <Link href="/book" className="flex items-center justify-center gap-2">
                  <span>Schedule Autonomic Audit</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <p className="text-[10px] text-text-secondary/70">Zero commitment • 30-minute diagnostic session</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
