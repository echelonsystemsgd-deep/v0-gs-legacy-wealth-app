"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calculator, Clock, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react"
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
    <section className="relative py-24 bg-[#0B0F19] overflow-hidden border-t border-slate-800/60">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Calculate Your Saved Time & Extra Revenue
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            See how eliminating manual order notes and automated deposit collection impacts your bottom line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-8">
              {/* Slider 1: Weekly Hours */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Weekly Hours Spent on Manual Admin & Orders</span>
                  </label>
                  <span className="text-lg font-bold font-mono text-sky-400 bg-sky-400/10 px-3 py-1 rounded-lg border border-sky-400/20">
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
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2">
                  <span>4 hrs (Light)</span>
                  <span>18 hrs (Moderate)</span>
                  <span>35 hrs (Heavy)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Revenue */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>Estimated Monthly Revenue (£)</span>
                  </label>
                  <span className="text-lg font-bold font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
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
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-2">
                  <span>£2,000</span>
                  <span>£12,000</span>
                  <span>£25,000+</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Flexible Options: One-Time Build, Monthly Retainer, or Performance % Revenue Share</span>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-b from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/30 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border-b border-l border-sky-500/20 rounded-bl-xl">
              Annual Telemetry Impact
            </div>

            <div className="space-y-6 pt-4">
              <div className="relative w-full h-32 my-1 pointer-events-none flex justify-center">
                <Image
                  src="/stickman_relax_saved_time.png"
                  alt="Stickman Relaxing Saved Time"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Annual Admin Time Saved
                </span>
                <div className="text-3xl font-extrabold text-white font-mono flex items-baseline gap-2">
                  <span>{annualHoursSaved} Hours</span>
                  <span className="text-xs text-emerald-400 font-normal font-sans">(~{Math.round(annualHoursSaved / 8)} full work days)</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Est. Extra Revenue Captured (+18%)
                </span>
                <div className="text-2xl font-bold text-amber-400 font-mono">
                  +£{annualRevenueCaptured.toLocaleString()} / year
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-1">
                  Total Annual Value Unlocked
                </span>
                <motion.div
                  key={totalAnnualValue}
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 font-mono tracking-tight"
                >
                  £{totalAnnualValue.toLocaleString()}
                </motion.div>
              </div>
            </div>

            <div className="pt-8">
              <Button
                asChild
                size="lg"
                className="w-full py-6 text-base font-bold bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all"
              >
                <Link href="/book" className="flex items-center justify-center gap-2">
                  <span>Book 15-Min Quick Audit</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
