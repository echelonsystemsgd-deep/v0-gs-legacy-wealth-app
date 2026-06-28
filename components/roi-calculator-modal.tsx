"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calculator, Clock, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function RollingNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    let start = displayValue
    const end = value
    if (start === end) return

    const range = end - start
    const duration = 250 // Fast 250ms roll animation
    const stepTime = 15
    const steps = Math.ceil(duration / stepTime)
    const increment = range / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      start += increment
      if (currentStep >= steps) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.round(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>
}

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [revenue, setRevenue] = useState(25000)
  const [manualHours, setManualHours] = useState(15)

  // Calculations
  const annualHoursSaved = Math.round(manualHours * 0.75 * 52)
  const timeValue = annualHoursSaved * 75
  const projectedRevenueGrowth = Math.round(revenue * 0.15 * 12)
  const totalValueUnlocked = timeValue + projectedRevenueGrowth

  const recommendedTier = 
    revenue < 15000 
      ? "Authority Suite" 
      : revenue >= 15000 && revenue < 50000 
      ? "Operations Machine" 
      : "Revenue Engine"

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent scroll background when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] md:max-h-[90vh] bg-bg-tertiary border border-border-brand/45 rounded-2xl overflow-hidden glass shadow-2xl z-10 text-text-primary flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Scrollable Content Wrapper */}
            <div className="overflow-y-auto p-6 sm:p-8 md:p-10 flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-gold">
                  <Calculator size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-bold block">
                    Interactive Projection
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Bespoke System Return Calculator
                  </h3>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                
                {/* Inputs Column */}
                <div className="space-y-6">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Systems we deploy are designed to generate clear operational leverage. Adjust the parameters below to project the efficiency and potential revenue gains unlocked by custom automation.
                  </p>

                  {/* Revenue Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-white">Current Monthly Revenue</span>
                      <span className="text-accent-gold font-serif text-sm font-bold">
                        £{revenue.toLocaleString()}
                      </span>
                    </div>

                    {/* Desktop Slider */}
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="5000"
                      value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      className="w-full h-1 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, var(--color-accent-purple) 0%, var(--color-accent-purple) ${((revenue - 5000) / 95000) * 100}%, var(--color-bg-primary) ${((revenue - 5000) / 95000) * 100}%, var(--color-bg-primary) 100%)`
                      }}
                    />

                    {/* Mobile Stepper Buttons */}
                    <div className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg p-0.5">
                      <button
                        onClick={() => setRevenue(Math.max(5000, revenue - 5000))}
                        aria-label="Decrease revenue"
                        className="px-3 py-1.5 text-sm font-bold text-accent-gold hover:bg-white/5 rounded transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold text-text-secondary">
                        Adjust Revenue
                      </span>
                      <button
                        onClick={() => setRevenue(Math.min(100000, revenue + 5000))}
                        aria-label="Increase revenue"
                        className="px-3 py-1.5 text-sm font-bold text-accent-gold hover:bg-white/5 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Manual Hours Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-white">Weekly Hours on Manual Admin</span>
                      <span className="text-accent-gold font-serif text-sm font-bold">
                        {manualHours} Hours
                      </span>
                    </div>

                    {/* Desktop Slider */}
                    <input
                      type="range"
                      min="2"
                      max="40"
                      step="1"
                      value={manualHours}
                      onChange={(e) => setManualHours(Number(e.target.value))}
                      className="w-full h-1 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-accent-purple focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, var(--color-accent-purple) 0%, var(--color-accent-purple) ${((manualHours - 2) / 38) * 100}%, var(--color-bg-primary) ${((manualHours - 2) / 38) * 100}%, var(--color-bg-primary) 100%)`
                      }}
                    />

                    {/* Mobile Stepper Buttons */}
                    <div className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg p-0.5">
                      <button
                        onClick={() => setManualHours(Math.max(2, manualHours - 1))}
                        aria-label="Decrease hours"
                        className="px-3 py-1.5 text-sm font-bold text-accent-gold hover:bg-white/5 rounded transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold text-text-secondary">
                        Adjust Hours
                      </span>
                      <button
                        onClick={() => setManualHours(Math.min(40, manualHours + 1))}
                        aria-label="Increase hours"
                        className="px-3 py-1.5 text-sm font-bold text-accent-gold hover:bg-white/5 rounded transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculations & Recommended CTA Column */}
                <div className="bg-bg-primary/50 border border-white/5 rounded-xl p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3 bg-bg-secondary/40 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mb-1">
                        <Clock size={10} className="text-accent-gold" />
                        <span>Reclaimed Time</span>
                      </div>
                      <div className="text-lg font-bold font-serif text-white">
                        <RollingNumber value={annualHoursSaved} suffix=" Hrs" />
                      </div>
                      <span className="text-[8px] text-text-secondary block leading-none mt-0.5">yearly projection</span>
                    </div>

                    <div className="p-3 bg-bg-secondary/40 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mb-1">
                        <Zap size={10} className="text-accent-gold" />
                        <span>Est. Growth Lift</span>
                      </div>
                      <div className="text-lg font-bold font-serif text-white">
                        <RollingNumber value={projectedRevenueGrowth} prefix="£" />
                      </div>
                      <span className="text-[8px] text-text-secondary block leading-none mt-0.5">15% conversion lift</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-accent-purple/10 to-transparent rounded-lg border border-accent-purple/20">
                    <span className="text-[9px] uppercase tracking-wider text-accent-gold font-bold block mb-1">
                      Total Est. Value Unlocked
                    </span>
                    <div className="text-2xl font-bold font-serif text-accent-gold">
                      <RollingNumber value={totalValueUnlocked} prefix="£" />
                    </div>
                    <p className="text-[9px] text-text-secondary mt-1.5 leading-tight">
                      Valuation includes manual hours at £75/hr and direct conversion increases.
                    </p>
                  </div>

                  {/* Recommended Tier Display */}
                  <div className="flex items-center justify-between p-2.5 bg-bg-secondary/70 rounded-lg text-[10px]">
                    <span className="text-text-secondary">System Alignment:</span>
                    <span className="flex items-center gap-1 font-bold text-accent-gold">
                      <Crown size={10} />
                      {recommendedTier}
                    </span>
                  </div>

                  {/* Booking Button */}
                  <Button
                    asChild
                    size="lg"
                    variant="default"
                    className="w-full font-bold"
                    onClick={onClose}
                  >
                    <Link href={`/book?tier=${recommendedTier}`}>
                      <span>Apply for Vetted Integration</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
