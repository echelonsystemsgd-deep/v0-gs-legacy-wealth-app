"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowRight,
  User,
  Mail,
  Building2,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from "lucide-react"

interface ContactFormData {
  fullName: string
  email: string
  companyName: string
  phone: string
  message: string
}

function validateContactForm(data: ContactFormData): Partial<Record<keyof ContactFormData, string>> {
  const errors: Partial<Record<keyof ContactFormData, string>> = {}
  if (!data.fullName.trim()) errors.fullName = "Full name is required."
  if (!data.email.trim()) {
    errors.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address."
  }
  if (!data.message.trim()) errors.message = "Message details are required."
  return errors
}

export function ContactForm() {
  const supabase = createClient()
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

    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.fullName,
        email: formData.email,
        business_name: formData.companyName || "N/A (Contact Form)",
        website: null,
        notes: `Message: ${formData.message}${formData.phone ? `\nPhone: ${formData.phone}` : ''}`,
        status: 'New',
        source: 'contact_form',
      })

      if (error) {
        throw error
      }

      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit. Please try again or email us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-3xl p-8 sm:p-12 border border-gold/30 text-center space-y-6 bg-[#130D24]/40"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Message Received</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                Thank you for reaching out. A senior member of our digital team will review your inquiry and reply within 12 hours.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-3xl p-6 sm:p-10 border border-gold/15 bg-[#130D24]/10 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User size={14} className="text-[#C9A227]" /> Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.fullName ? "border-red-500/60" : "border-gold/15 hover:border-gold/30"
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail size={14} className="text-[#C9A227]" /> Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. john@yourbrand.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.email ? "border-red-500/60" : "border-gold/15 hover:border-gold/30"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Company & Phone Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="companyName" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building2 size={14} className="text-[#C9A227]" /> Company / Brand
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone size={14} className="text-[#C9A227]" /> Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +44 7700 900077"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MessageSquare size={14} className="text-[#C9A227]" /> How can we help? *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your brand, what services you need, and any technical hurdles you are trying to overcome."
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none ${
                    errors.message ? "border-red-500/60" : "border-gold/15 hover:border-gold/30"
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
                className="w-full bg-primary hover:bg-primary/95 text-white border border-[#C9A227] rounded-none py-6 text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
