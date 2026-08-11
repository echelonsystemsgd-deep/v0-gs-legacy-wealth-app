"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { MessageSquare, X, Send, ShieldCheck } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  defaultMessage?: string
}

export function WhatsAppButton({
  phoneNumber = "447851055929",
  defaultMessage = "Hi Mercian Wealth, I'd like to inquire about your services.",
}: WhatsAppButtonProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [customText, setCustomText] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 1. Exclude on portal/admin/booking routes matching MOBILE_AUDIT_FIXES
  const excludedPrefixes = [
    '/admin',
    '/client',
    '/dashboard',
    '/forgot-password',
    '/login',
    '/reset-password',
    '/signup',
    '/book',
    '/success',
    '/unauthorized'
  ]
  const isExcluded = excludedPrefixes.some((prefix) => pathname?.startsWith(prefix))

  // 2. Hide when mobile navigation drawer is open (per MOBILE_AUDIT_FIXES spec)
  useEffect(() => {
    const checkMenu = () => {
      setIsMobileMenuOpen(document.body.classList.contains("mobile-menu-open"))
    }
    checkMenu()
    const observer = new MutationObserver(checkMenu)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  if (isExcluded || isMobileMenuOpen) return null

  const messageToSend = customText.trim() || defaultMessage
  const formattedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageToSend)}`

  return (
    <div className="hidden sm:flex fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-3 sm:left-6 sm:bottom-6 z-40 flex-col items-start gap-3 font-sans pointer-events-auto">
      {/* Premium Luxury Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-[calc(100vw-1.5rem)] sm:w-96 rounded-2xl bg-[#0B0F17]/95 backdrop-blur-2xl border border-accent-gold/40 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white overflow-hidden relative"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent-gold/10 border border-accent-gold/40 flex items-center justify-center text-[#25D366]">
                    <MessageSquare size={18} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-bg-secondary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-serif">
                    Mercian Wealth
                    <ShieldCheck size={14} className="text-accent-gold" />
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-emerald-400 font-medium tracking-wide">
                    Online | WhatsApp Priority Desk
                  </p>
                </div>
              </div>
              <button
                suppressHydrationWarning
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close chat window"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat greeting bubble */}
            <div className="space-y-3 mb-3.5">
              <div className="bg-bg-tertiary/90 border border-white/10 p-3 sm:p-3.5 rounded-xl rounded-tl-none text-xs text-text-primary space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-accent-gold text-[10px] uppercase tracking-wider">
                    Direct Inquiry Line
                  </span>
                  <span className="text-[9px] text-text-secondary">Instant Response</span>
                </div>
                <p className="leading-relaxed text-white/90 text-[11px] sm:text-xs">
                  Welcome to Mercian Wealth. Click below to initiate a private WhatsApp conversation with our team.
                </p>
              </div>
            </div>

            {/* Pre-filled Message Field */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  Pre-filled Message
                </label>
                <span className="text-[10px] text-accent-cyan font-mono">Editable</span>
              </div>
              <textarea
                suppressHydrationWarning
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={defaultMessage}
                rows={2}
                className="w-full bg-black/50 border border-white/15 focus:border-accent-gold rounded-xl p-2.5 sm:p-3 text-xs text-white placeholder-text-secondary outline-none transition-all duration-200 resize-none font-mono"
              />

              <a
                suppressHydrationWarning
                href={formattedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] via-emerald-600 to-teal-700 hover:from-[#20bd5a] hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.35)] hover:shadow-[0_0_35px_rgba(37,211,102,0.55)] transition-all duration-300 transform active:scale-[0.98]"
              >
                <span>Continue to WhatsApp</span>
                <Send size={13} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Pill Button (Bottom-Left) */}
      <motion.button
        suppressHydrationWarning
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 sm:gap-2.5 bg-[#0B0F17]/95 border border-accent-gold/40 hover:border-accent-gold p-1.5 sm:p-2.5 pr-3.5 sm:pr-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl text-white transition-all duration-300 cursor-pointer"
        aria-label="Toggle WhatsApp Chat Desk"
      >
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
          <MessageSquare size={14} className="sm:w-4 sm:h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
        </div>
        <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-white group-hover:text-accent-gold transition-colors">
          WhatsApp Desk
        </span>
      </motion.button>
    </div>
  )
}
