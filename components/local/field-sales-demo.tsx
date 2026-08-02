"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, CheckCircle, Send, Cake, Calendar, CreditCard, Sparkles, MessageCircle, AlertCircle } from "lucide-react"

const cakeTypes = [
  { id: "artisan-sponge", name: "2-Tier Victoria Sponge", price: 65, deposit: 32.5 },
  { id: "custom-chocolate", name: "Deluxe Chocolate Fudge", price: 85, deposit: 42.5 },
  { id: "artisan-cupcakes", name: "24 Artisan Cupcake Platter", price: 50, deposit: 25.0 },
]

export function FieldSalesDemo() {
  const [selectedCake, setSelectedCake] = useState(cakeTypes[0])
  const [pickupDate, setPickupDate] = useState("Saturday, 11:00 AM")
  const [customerName, setCustomerName] = useState("Sarah Jenkins")
  const [isSimulating, setIsSimulating] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const handleSimulateOrder = () => {
    setIsSimulating(true)
    setShowNotification(false)

    setTimeout(() => {
      setIsSimulating(false)
      setShowNotification(true)
    }, 1200)
  }

  return (
    <section id="field-demo" className="py-16 sm:py-24 bg-[#090410] border-y border-accent-gold/20 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Smartphone size={14} className="animate-bounce" />
            <span>Interactive Mobile Demo — Try It On Your Phone</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            See How Orders Reach Your Phone in 2 Seconds
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Tap through this 30-second demo below to see what your customer experiences and how the instant WhatsApp alert dings on your phone.
          </p>
        </div>

        {/* Demo Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Step 1 & 2: Customer Ordering App Mockup (7 cols) */}
          <div className="lg:col-span-7 bg-[#07050B] p-5 sm:p-7 rounded-3xl border border-accent-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Cake className="text-accent-gold" size={20} />
                <span className="font-serif font-bold text-white text-base">Sweet Artisan Bakery</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                LIVE DEMO STOREFRONT
              </span>
            </div>

            {/* Cake Selection */}
            <div className="space-y-4 mb-6">
              <label className="text-xs font-mono font-bold text-accent-gold uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Select Custom Order:</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {cakeTypes.map((cake) => {
                  const active = selectedCake.id === cake.id
                  return (
                    <button
                      key={cake.id}
                      onClick={() => setSelectedCake(cake)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? "bg-accent-gold/15 border-accent-gold text-white font-semibold shadow-md"
                          : "bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? "border-accent-gold bg-accent-gold text-black" : "border-white/30"}`}>
                          {active && <CheckCircle size={12} />}
                        </div>
                        <span className="text-sm font-sans">{cake.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-accent-gold">£{cake.price}</span>
                        <span className="text-[10px] block text-text-secondary">£{cake.deposit} deposit</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Pickup Date & Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-mono font-bold text-accent-gold uppercase tracking-wider block mb-2">
                  2. Requested Pickup:
                </label>
                <select
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-accent-gold"
                >
                  <option value="Friday, 3:00 PM" className="bg-bg-secondary text-white">Friday, 3:00 PM</option>
                  <option value="Saturday, 11:00 AM" className="bg-bg-secondary text-white">Saturday, 11:00 AM</option>
                  <option value="Saturday, 2:00 PM" className="bg-bg-secondary text-white">Saturday, 2:00 PM</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-accent-gold uppercase tracking-wider block mb-2">
                  3. Customer Name:
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3 text-xs text-white outline-none focus:border-accent-gold font-sans"
                  placeholder="Enter name"
                />
              </div>
            </div>

            {/* Deposit Summary & Simulate Action Button */}
            <div className="p-4 rounded-2xl bg-accent-gold/5 border border-accent-gold/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-text-secondary block">Total Upfront Deposit:</span>
                <span className="text-2xl font-mono font-bold text-accent-gold">£{selectedCake.deposit.toFixed(2)}</span>
                <span className="text-[10px] text-white/50 block">Remaining £{(selectedCake.price - selectedCake.deposit).toFixed(2)} on pickup</span>
              </div>

              <button
                onClick={handleSimulateOrder}
                disabled={isSimulating}
                className="w-full sm:w-auto px-6 py-3.5 font-bold text-xs sm:text-sm bg-accent-gold text-black hover:bg-amber-300 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <span>Routing Order...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Simulate Order Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 3: Simulated WhatsApp Phone Notification Screen (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[340px] bg-black border-4 border-white/20 rounded-[40px] p-4 shadow-2xl relative overflow-hidden min-h-[440px] flex flex-col justify-between">
              
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-white/10 rounded-full mx-auto mb-4" />

              {/* Status Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/60 px-2 mb-4">
                <span>WhatsApp Alert</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Phone Content / Simulated WhatsApp Notification */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {showNotification ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="p-4 rounded-2xl bg-[#075E54]/90 border border-emerald-400/40 text-white shadow-2xl space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/20 pb-2">
                        <div className="flex items-center gap-2">
                          <MessageCircle size={18} className="text-emerald-300" />
                          <span className="font-bold text-xs text-emerald-200">NEW ONLINE ORDER RECEIVED</span>
                        </div>
                        <span className="text-[10px] text-white/60">Just now</span>
                      </div>

                      <div className="text-xs space-y-1 pt-1">
                        <p><strong className="text-accent-gold">Customer:</strong> {customerName}</p>
                        <p><strong className="text-accent-gold">Item:</strong> {selectedCake.name}</p>
                        <p><strong className="text-accent-gold">Pickup:</strong> {pickupDate}</p>
                        <p><strong className="text-emerald-300">Deposit Paid:</strong> £{selectedCake.deposit.toFixed(2)} (via Stripe)</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
                        <span>Status: Auto-Confirmed</span>
                        <span className="text-accent-gold font-bold">Ref: #SWT-{Math.floor(1000 + Math.random() * 9000)}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center p-6 border border-dashed border-white/20 rounded-2xl">
                      <Smartphone size={32} className="mx-auto text-white/30 mb-2" />
                      <p className="text-xs text-white/60 font-sans">
                        Tap <span className="text-accent-gold font-bold">"Simulate Order Submit"</span> to watch the WhatsApp alert arrive here in 2 seconds.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Phone Indicator Bar */}
              <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-4" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
