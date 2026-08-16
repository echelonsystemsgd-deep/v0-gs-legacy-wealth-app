"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, Clock, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function InteractiveRoiCalculator() {
  const [weeklyHours, setWeeklyHours] = useState(12)
  const [monthlyRevenue, setMonthlyRevenue] = useState(6500)

  // Calculations
  const hourlyValuation = 25 // £25/hr estimate for artisan/owner manual labor
  const annualHoursSaved = Math.round(weeklyHours * 0.8 * 52) // 80% admin automated
  const annualTimeValue = annualHoursSaved * hourlyValuation
  const annualRevenueCaptured = Math.round(monthlyRevenue * 12 * 0.18) // 18% extra orders captured via 24/7 storefront & deposits
  const totalAnnualValue = annualTimeValue + annualRevenueCaptured

  return (
    <section className="relative py-20 lg:py-28 bg-[#020E28] overflow-hidden border-t border-[#DAA640]/15">
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#DAA640]/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DAA640]/10 border border-[#DAA640]/25 text-[#DAA640] text-xs font-mono font-semibold tracking-wider uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Calculate Your Saved Time & Extra Revenue
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            See how eliminating manual order notes and automated deposit collection impacts your bottom line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-[#07153B] border border-[#DAA640]/20 backdrop-blur-xl flex flex-col justify-between min-w-0 max-w-full">
            <div className="space-y-6 sm:space-y-8">
              {/* Slider 1: Weekly Hours */}
              <div>
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3">
                  <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#DAA640] shrink-0" />
                    <span>Weekly Manual Admin Hours</span>
                  </label>
                  <span className="self-start xs:self-auto text-sm sm:text-base font-bold font-mono text-[#DAA640] bg-[#DAA640]/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-[#DAA640]/25">
                    {weeklyHours} hrs/week
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="1"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full h-2 bg-[#020E28] rounded-lg appearance-none cursor-pointer accent-[#DAA640]"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono mt-2">
                  <span>4 hrs (Light)</span>
                  <span>18 hrs (Moderate)</span>
                  <span>35 hrs (Heavy)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Revenue */}
              <div>
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3">
                  <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#DAA640] shrink-0" />
                    <span>Estimated Monthly Revenue (£)</span>
                  </label>
                  <span className="self-start xs:self-auto text-sm sm:text-base font-bold font-mono text-[#DAA640] bg-[#DAA640]/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-[#DAA640]/25">
                    £{monthlyRevenue.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="500"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-[#020E28] rounded-lg appearance-none cursor-pointer accent-[#DAA640]"
                />
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono mt-2">
                  <span>£2,000</span>
                  <span>£12,000</span>
                  <span>£25,000+</span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-5 border-t border-[#DAA640]/15 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#DAA640] shrink-0" />
              <span>Guaranteed 24/7 order capture with zero contract lock-in</span>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0C1D4D] via-[#07153B] to-[#020E28] border border-[#DAA640]/30 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden min-w-0 max-w-full">
            <div className="absolute top-0 right-0 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#DAA640] bg-[#DAA640]/10 border-b border-l border-[#DAA640]/20 rounded-bl-xl">
              Annual Impact
            </div>

            <div className="space-y-5 pt-3 sm:pt-4">
              <div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Annual Admin Time Saved
                </span>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1.5 flex-wrap">
                  <span>{annualHoursSaved} Hours</span>
                  <span className="text-[11px] sm:text-xs text-[#DAA640] font-normal font-sans">(~{Math.round(annualHoursSaved / 8)} full work days)</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Est. Extra Revenue Captured (+18%)
                </span>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#DAA640] font-mono">
                  +£{annualRevenueCaptured.toLocaleString()} / year
                </div>
              </div>

              <div className="pt-4 border-t border-[#DAA640]/20">
                <span className="text-[10px] sm:text-xs font-bold text-[#DAA640] uppercase tracking-widest block mb-1">
                  Total Annual Value Unlocked
                </span>
                <motion.div
                  key={totalAnnualValue}
                  initial={{ scale: 0.96, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-white font-mono tracking-tight break-words"
                >
                  £{totalAnnualValue.toLocaleString()}
                </motion.div>
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <Button
                asChild
                size="lg"
                className="w-full py-5 sm:py-6 text-sm sm:text-base font-bold bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] hover:from-[#EBB755] hover:to-[#DAA640] text-[#020E28] shadow-[0_0_25px_rgba(218,166,64,0.3)] transition-all border-0 rounded-xl"
              >
                <Link href={`/book?roi_revenue=${monthlyRevenue}&roi_hours=${weeklyHours}&roi_value=${totalAnnualValue}`} className="flex items-center justify-center gap-2">
                  <span>Book 15-Min Quick Audit</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
