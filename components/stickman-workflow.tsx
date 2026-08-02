"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Sparkles, MessageSquare, Zap, Database, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function StickmanWorkflow() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 0,
      title: "1. Customer Orders Online (24/7)",
      subtitle: "Your sub-second mobile storefront takes custom cake specs or service requests and collects 50% upfront deposits while you bake or sleep.",
      image: "/stickman_baker_order.png",
      badge: "24/7 Lead Capture & Deposits",
      icon: Zap,
    },
    {
      id: 1,
      title: "2. Instant WhatsApp Alert Pings Your Phone",
      subtitle: "Triggered instantly via automated cloud webhooks. Complete customer order summary delivered to the phone you already use every day.",
      image: "/stickman_speed_automation.png",
      badge: "Instant WhatsApp Webhook",
      icon: MessageSquare,
    },
    {
      id: 2,
      title: "3. Secure CRM Database Logs the Lead",
      subtitle: "Zero lost notes or lost WhatsApp messages. All customer details, order specs, and invoice records are automatically saved in your CRM.",
      image: "/stickman_crm_autopilot.png",
      badge: "Secure CRM Autopilot",
      icon: Database,
    },
    {
      id: 3,
      title: "4. You Reclaim 10+ Hours Every Single Week",
      subtitle: "No more scrawling order specs on scrap paper at 6 AM or chasing bank transfers over text. Focus on your craft while automation does the work.",
      image: "/stickman_relax_saved_time.png",
      badge: "Saved Admin Time & Freedom",
      icon: Clock,
    },
  ]

  return (
    <section className="relative py-24 bg-[#090D16] overflow-hidden border-t border-slate-800/60">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Speed & Automation Win Every Time</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            How Your Business Runs On Autopilot
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Click through the steps below to watch how customer enquiries convert into paid deposits and WhatsApp alerts.
          </p>
        </div>

        {/* Interactive Step Navigator Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isActive = activeStep === idx
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 border ${
                  isActive
                    ? "bg-slate-900 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)] scale-[1.02]"
                    : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isActive ? "bg-sky-400/20 text-sky-400" : "bg-slate-800 text-slate-400"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${isActive ? "bg-amber-400/20 text-amber-400" : "bg-slate-800 text-slate-500"}`}>
                    Step 0{idx + 1}
                  </span>
                </div>
                <h4 className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-400"}`}>
                  {step.badge}
                </h4>
              </button>
            )
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div className="p-8 lg:p-12 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Text Information Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold uppercase">
                  <span>Step 0{activeStep + 1} of 04</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {steps[activeStep].title}
                </h3>

                <p className="text-slate-300 text-base leading-relaxed font-sans">
                  {steps[activeStep].subtitle}
                </p>

                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  >
                    <Link href="/book" className="flex items-center gap-2">
                      <span>Book 15-Min Quick Audit</span>
                      <ArrowRight size={18} />
                    </Link>
                  </Button>

                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-mono font-bold underline underline-offset-4"
                  >
                    Next Step →
                  </button>
                </div>
              </div>

              {/* Stickman Character Illustration Display */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 p-4 shadow-2xl flex items-center justify-center">
                  <Image
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
