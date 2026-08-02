"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, CheckCircle2, Clock, Sparkles, ShoppingBag, Wrench, Calendar, CreditCard, ArrowRight } from "lucide-react"

export function InteractivePhoneDemo() {
  const [activeNiche, setActiveNiche] = useState<"bakery" | "service">("bakery")
  
  // Interactive Order Builder Form States
  const [selectedOption, setSelectedOption] = useState("3-Tier Wedding Cake (£220)")
  const [selectedDate, setSelectedDate] = useState("This Saturday (14th)")
  const [isSimulating, setIsSimulating] = useState(false)

  const [notification, setNotification] = useState<{
    title: string
    body: string
    time: string
    amount: string
    webhook: string
  }>({
    title: "New Custom Order Paid!",
    body: "Sarah M. submitted order for 3-Tier Wedding Cake (£220) for This Saturday (14th).",
    time: "Just now",
    amount: "£110.00 Deposit Paid",
    webhook: "Make.com Webhook Triggered"
  })

  const bakeryOptions = [
    { name: "3-Tier Birthday Cake", deposit: "£110.00 Deposit", price: "£220 total" },
    { name: "Artisan Catering Platter", deposit: "£140.00 Deposit", price: "£280 total" },
    { name: "Box of 24 Custom Cupcakes", deposit: "£35.00 Deposit", price: "£70 total" },
  ]

  const serviceOptions = [
    { name: "Emergency Boiler Repair", deposit: "£85.00 Call-out", price: "£170 est." },
    { name: "Full Electrical Inspection", deposit: "£95.00 Booking", price: "£190 est." },
    { name: "Bespoke Joinery Quote", deposit: "£50.00 Consult", price: "£100 est." },
  ]

  const triggerTestSubmit = () => {
    setIsSimulating(true)
    setTimeout(() => {
      const currentList = activeNiche === "bakery" ? bakeryOptions : serviceOptions
      const match = currentList.find(o => o.name === selectedOption) || currentList[0]

      setNotification({
        title: activeNiche === "bakery" ? "New Bakery Deposit Paid!" : "New Service Lead Captured!",
        body: `Customer submitted request for ${selectedOption} scheduled for ${selectedDate}.`,
        time: "Just now",
        amount: match.deposit,
        webhook: "Make.com Webhook Triggered"
      })
      setIsSimulating(false)
    }, 500)
  }

  return (
    <section id="demo" suppressHydrationWarning className="relative py-24 bg-[#090D16] overflow-hidden border-t border-slate-800/60">
      {/* Background Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Real 3-Tap Interactive Order Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Test The 3-Tap Order Builder Yourself
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Select an order option below, click <strong>"Submit Test Order"</strong>, and watch the live smartphone on the right trigger an instant WhatsApp alert via Make.com!
          </p>
        </div>

        {/* Niche Selector Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            suppressHydrationWarning
            onClick={() => {
              setActiveNiche("bakery")
              setSelectedOption(bakeryOptions[0].name)
            }}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeNiche === "bakery"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-105"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60"
            }`}
          >
            <ShoppingBag size={18} />
            <span>Bakery & Food Artisan Demo</span>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => {
              setActiveNiche("service")
              setSelectedOption(serviceOptions[0].name)
            }}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeNiche === "service"
                ? "bg-gradient-to-r from-sky-400 to-blue-600 text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.35)] scale-105"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60"
            }`}
          >
            <Wrench size={18} />
            <span>Local Services Booking Demo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive 3-Tap Form Controls */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Customer Order Form Widget</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                Live Interactive Widget
              </span>
            </div>

            {/* Tap 1: Select Item */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-[11px] flex items-center justify-center border border-sky-400/40">1</span>
                <span>STEP 1: SELECT ORDER / SERVICE PACKAGE</span>
              </label>
              <div className="space-y-2">
                {(activeNiche === "bakery" ? bakeryOptions : serviceOptions).map((opt, idx) => (
                  <button
                    key={opt.name}
                    onClick={() => setSelectedOption(opt.name)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all border ${
                      selectedOption === opt.name
                        ? "bg-sky-500/15 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 font-normal">0{idx + 1}.</span>
                      <span>{opt.name}</span>
                    </span>
                    <span className="text-amber-400 font-mono text-[11px]">{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tap 2: Custom Date Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[11px] flex items-center justify-center border border-amber-400/40">2</span>
                <span>STEP 2: SELECT YOUR DATE / APPOINTMENT</span>
              </label>
              
              <div className="space-y-2">
                {/* Custom Date Input */}
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate.startsWith("20") ? selectedDate : ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        const d = new Date(e.target.value)
                        const formatted = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                        setSelectedDate(formatted)
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-bold text-white focus:outline-none focus:border-amber-400 font-mono cursor-pointer"
                  />
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-2">
                  {["Tomorrow", "This Saturday", "Next Tuesday"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedDate(preset)}
                      className={`p-2 rounded-lg text-[11px] font-semibold text-center transition-all border ${
                        selectedDate === preset
                          ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold"
                          : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <div className="text-[11px] font-mono text-amber-400 flex items-center justify-between px-1">
                    <span>Selected Date:</span>
                    <span className="font-bold underline">{selectedDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tap 3: Submit Order */}
            <div className="pt-2">
              <button
                onClick={triggerTestSubmit}
                disabled={isSimulating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 hover:from-emerald-300 hover:to-sky-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(52,211,153,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="w-6 h-6 rounded-full bg-slate-950/30 text-slate-950 font-mono text-xs flex items-center justify-center border border-slate-950/40">3</span>
                <span>STEP 3: SUBMIT TEST ORDER & PAY DEPOSIT</span>
                <ArrowRight size={16} />
              </button>
              <span className="text-[11px] text-slate-500 text-center block mt-2 font-mono">
                Clicking above immediately triggers the WhatsApp alert on the phone mockup →
              </span>
            </div>
          </div>

          {/* Right Column: Smartphone Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[320px] sm:w-[350px] h-[640px] bg-slate-950 rounded-[45px] p-4 border-[8px] border-slate-800 shadow-[0_0_50px_rgba(56,189,248,0.2)] flex flex-col justify-between overflow-hidden">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-slate-900 rounded-full" />
              </div>

              {/* Lockscreen Header */}
              <div className="pt-8 px-4 text-center z-10">
                <div className="text-5xl font-extralight text-white font-mono tracking-tight mb-1">09:41</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">Saturday, October 14</div>
              </div>

              {/* Animated Notification Card */}
              <div className="relative px-2 my-auto z-20">
                <AnimatePresence mode="wait">
                  {notification && (
                    <motion.div
                      key={notification.body}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                      className="p-4 rounded-2xl bg-slate-900/95 border border-sky-500/40 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                            WA
                          </div>
                          <span className="text-xs font-bold text-slate-200">WhatsApp Alert</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{notification.time}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{notification.title}</span>
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
                        {notification.body}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                        <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          {notification.amount}
                        </span>
                        <span className="text-sky-400 font-mono text-[10px] uppercase font-bold">
                          [ Instant Lead Telemetry ]
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isSimulating && (
                  <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold animate-pulse">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Processing Instant Webhook...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Footer Bar */}
              <div className="pb-2 text-center z-10">
                <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
