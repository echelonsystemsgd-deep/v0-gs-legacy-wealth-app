"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

import {
  ArrowRight,
  User,
  Mail,
  Building2,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  X,
  ShieldCheck,
} from "lucide-react"

interface ContactFormData {
  fullName: string
  email: string
  companyName: string
  phone: string
  message: string
}

function cleanUkPhoneDigits(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('44') && digits.length >= 12) {
    digits = digits.slice(2)
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }
  return digits
}

function formatUkPhonePayload(input: string): string | null {
  const digits = cleanUkPhoneDigits(input)
  return digits ? `+44 ${digits}` : null
}

function validateContactForm(data: ContactFormData): Partial<Record<keyof ContactFormData, string>> {
  const errors: Partial<Record<keyof ContactFormData, string>> = {}
  if (!data.fullName.trim()) errors.fullName = "Full name is required."
  if (!data.email.trim()) {
    errors.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address."
  }
  if (data.phone.trim()) {
    const digits = cleanUkPhoneDigits(data.phone)
    if (digits.length < 10 || digits.length > 11) {
      errors.phone = "Please enter a valid 10 to 11-digit UK phone number."
    }
  }
  if (!data.message.trim()) errors.message = "Message details are required."
  return errors
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    message: "",
  })

  const updateField = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validateContactForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    // Capture UTM tracking parameters from current page URL
    let utmParams: Record<string, string> = {}
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      utmKeys.forEach((key) => {
        const val = searchParams.get(key)
        if (val) utmParams[key] = val
      })
    }

    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact_form',
          name: formData.fullName,
          email: formData.email,
          business_name: formData.companyName || "N/A (Contact Form)",
          phone: formatUkPhonePayload(formData.phone),
          notes: formData.message,
          referrer: typeof document !== 'undefined' ? document.referrer : 'none',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'none',
          ...utmParams,
        }),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit. Please try again.")
      }

      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit. Please try again or email us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Contact Form Container (Always Visible) */}
      <div className="glass rounded-3xl p-6 sm:p-10 border border-border-brand/20 bg-bg-tertiary/10 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User size={14} className="text-accent-gold" /> Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Mercian Partner"
              value={formData.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all ${
                errors.fullName ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
              }`}
            />
            {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail size={14} className="text-accent-gold" /> Email Address *
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g. director@mercianwealth.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all ${
                errors.email ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
              }`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Company & Phone Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="companyName" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Building2 size={14} className="text-accent-gold" /> Company / Brand
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="e.g. Mercian Holdings"
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className="w-full bg-background/60 border border-border-brand/20 hover:border-accent-gold/40 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone size={14} className="text-accent-gold" /> Phone Number
              </label>
              <div className={`flex items-center bg-background/60 border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent-purple/40 transition-all ${
                errors.phone ? "border-red-500/60" : "border-border-brand/20 focus-within:border-accent-gold/40 hover:border-accent-gold/40"
              }`}>
                <div className="bg-accent-gold/10 text-accent-gold font-mono font-semibold text-xs px-3.5 py-3 border-r border-border-brand/20 select-none shrink-0 flex items-center gap-1">
                  <span className="text-xs">🇬🇧</span>
                  <span>+44</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="7123 456789"
                  value={formData.phone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^\d\s-]/g, '')
                    if (val.startsWith('0')) val = val.slice(1)
                    updateField("phone", val)
                  }}
                  className="w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
              </div>
              {errors.phone ? (
                <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground/80 leading-snug mt-1">
                  Mercian Wealth operates exclusively with United Kingdom based businesses.
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare size={14} className="text-accent-gold" /> How can we help? *
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us about your brand, what services you need, and any technical hurdles you are trying to overcome."
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-accent-purple/40 transition-all resize-none ${
                errors.message ? "border-red-500/60" : "border-border-brand/20 hover:border-accent-gold/40"
              }`}
            />
            {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
          </div>

          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full py-6 text-sm disabled:opacity-60 font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Sending Message...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send Inquiry
                <ArrowRight size={16} />
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Floating Success Modal Popup */}
      <AnimatePresence>
        {submitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSubmitted(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0d0d0d] border border-[#d4af37]/25 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6 z-10 text-white"
            >
              {/* Top gold line decoration */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

              {/* Close Icon Button */}
              <button
                onClick={() => setSubmitted(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mx-auto h-16 w-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37]">
                <ShieldCheck size={28} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-extrabold">
                  Transmission Secure
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Message Securing Logged
                </h3>
              </div>

              <div className="text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-5 space-y-4">
                <p>
                  Your diagnostic details have been encrypted and routed directly to our founder assessment channel.
                </p>
                <p>
                  To preserve founder-level code quality and direct execution, we operate under tight cohort limits. A principal engineer will assess your inquiry and reply via WhatsApp or corporate email within <strong>12 hours</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    fullName: "",
                    email: "",
                    companyName: "",
                    phone: "",
                    message: "",
                  })
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa8417] hover:from-[#aa8417] hover:to-[#886510] text-black font-semibold rounded-lg text-xs uppercase tracking-wider transition-all duration-300"
              >
                Return to Command Center
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
