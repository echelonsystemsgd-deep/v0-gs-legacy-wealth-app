"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  defaultMessage?: string
}

export function WhatsAppButton({
  phoneNumber = "447851055929",
  defaultMessage = "Hi Mercian Wealth, I'd like to inquire about your services.",
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customText, setCustomText] = useState("")

  const formattedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    customText.trim() || defaultMessage
  )}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* Interactive Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="w-80 sm:w-96 rounded-2xl bg-bg-secondary/95 backdrop-blur-xl border border-accent-gold/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white overflow-hidden relative"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366]">
                    <MessageSquare size={20} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg-secondary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Mercian Wealth
                    <Sparkles size={12} className="text-accent-gold" />
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-medium">Online | Direct WhatsApp Desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close WhatsApp chat popup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated Chat Message Bubble */}
            <div className="space-y-3 mb-4">
              <div className="bg-bg-tertiary/80 border border-white/5 p-3.5 rounded-xl rounded-tl-none text-xs text-text-primary space-y-1">
                <p className="font-semibold text-accent-gold">Mercian Wealth Team</p>
                <p className="leading-relaxed">
                  Hi there! 👋 Looking for custom mobile storefronts, order automation, or wealth management solutions?
                </p>
                <p className="text-[10px] text-text-secondary text-right">Just now</p>
              </div>
            </div>

            {/* Pre-filled / Custom Message Input */}
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Your pre-filled question:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={defaultMessage}
                rows={2}
                className="w-full bg-bg-tertiary/50 border border-white/10 focus:border-accent-gold rounded-xl p-3 text-xs text-white placeholder-text-secondary outline-none transition-colors resize-none"
              />

              <a
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-emerald-600 hover:from-[#20bd5a] hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 transform active:scale-95"
              >
                <span>Open in WhatsApp</span>
                <Send size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-gradient-to-r from-[#25D366] to-emerald-600 border border-[#25D366]/40 text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300 flex items-center justify-center"
        aria-label="Open WhatsApp Chat"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>

        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageSquare size={24} className="text-white fill-white/20" />
        )}

        {/* Hover Tooltip when closed */}
        {!isOpen && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-bg-secondary/90 border border-white/10 text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Chat on WhatsApp 💬
          </span>
        )}
      </motion.button>
    </div>
  )
}
