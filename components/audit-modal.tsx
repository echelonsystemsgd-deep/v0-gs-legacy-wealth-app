'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ClipboardCheck, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuditModal } from './audit-modal-context'

const industries = [
  'Agency / B2B Service',
  'Consulting / Coaching',
  'SaaS / Software',
  'E-commerce / Retail',
  'Real Estate / Construction',
  'Professional Services (Finance/Legal)',
  'Healthcare / Wellness',
  'Other / Custom',
]

export const AuditModal: React.FC = () => {
  const { isOpen, tier, closeModal } = useAuditModal()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [industry, setIndustry] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null)
      setFullName('')
      setEmail('')
      setPhone('')
      setCompanyName('')
      setLinkedinUrl('')
      setGdprConsent(false)
      setIndustry(industries[0])
    }
  }, [isOpen, tier])

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal])

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // List of blacklisted personal email domains
  const PERSONAL_EMAIL_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "zoho.com",
    "protonmail.com",
    "proton.me",
    "mail.com",
    "yandex.com",
    "gmx.com",
    "fastmail.com",
    "live.com",
    "msn.com",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !phone.trim() || !companyName.trim() || !gdprConsent) {
      setErrorMsg('Please complete all required fields and accept the terms.')
      return
    }

    if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone.trim())) {
      setErrorMsg('Please enter a valid phone number.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

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

    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      business_name: companyName.trim(),
      linkedin_url: linkedinUrl.trim() || null,
      industry,
      tier: tier || 'General Lead',
      gdpr_consent: gdprConsent,
      source_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'none',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'none',
      ...utmParams,
    }

    // Build the dynamic /qualify redirect path with query params
    const qualifyParams = new URLSearchParams()
    qualifyParams.set('email', email.trim())
    qualifyParams.set('name', fullName.trim())
    qualifyParams.set('phone', phone.trim())
    
    // Forward UTM params
    Object.entries(utmParams).forEach(([key, val]) => {
      qualifyParams.set(key, val)
    })

    const redirectUrl = `/qualify?${qualifyParams.toString()}`

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Server error occurred')
      }

      closeModal()
      window.location.href = redirectUrl
    } catch (err: any) {
      console.error('[AuditModal] Submission failed, applying redirect fallback:', err)
      // Fallback redirection to ensure scheduling flow works even if backend fails
      closeModal()
      window.location.href = redirectUrl
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-xl bg-[#0d0d0d] border border-[#d4af37]/20 rounded-xl overflow-hidden shadow-2xl z-10 text-white flex flex-col"
          >
            {/* Top gold line decoration */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8 flex-1">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37]">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                    {tier ? `Selected Tier: ${tier}` : 'Operational Audit'}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    Initiate Systems Audit
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Before scheduling your alignment session, please provide a few details to help our team prepare your bespoke operational roadmap.
              </p>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="full_name">
                    Full Name *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Email & Phone side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="email">
                      Corporate Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      disabled={isSubmitting}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +44 7123 456789"
                      className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Company Name & LinkedIn Profile side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="company_name">
                      Company Name *
                    </label>
                    <input
                      id="company_name"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="linkedin_url">
                      LinkedIn Profile <span className="text-[9px] text-gray-500 font-normal">(optional)</span>
                    </label>
                    <input
                      id="linkedin_url"
                      type="url"
                      disabled={isSubmitting}
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Industry Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="industry">
                    Industry / Business Type
                  </label>
                  <div className="relative">
                    <select
                      id="industry"
                      disabled={isSubmitting}
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]/50 appearance-none transition-colors disabled:opacity-50"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#141414] text-white">
                          {ind}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* GDPR Consent */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="gdpr_consent"
                    type="checkbox"
                    required
                    disabled={isSubmitting}
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-[#141414] text-[#d4af37] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
                  />
                  <label htmlFor="gdpr_consent" className="text-[11px] text-gray-400 leading-relaxed cursor-pointer select-none">
                    I agree to be contacted by Mercian Wealth regarding my audit request. I have read and agree to the{' '}
                    <a href="/privacy" target="_blank" className="text-[#d4af37] hover:underline">
                      Privacy Policy
                    </a>
                    . *
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 mt-4 bg-gradient-to-r from-[#d4af37] to-[#aa8417] hover:from-[#aa8417] hover:to-[#886510] text-black font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#d4af37]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Initiate Audit & Book Session</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer lock note */}
            <div className="px-6 py-4 bg-[#0a0a0a] border-t border-white/5 flex items-center gap-2 justify-center text-[10px] text-gray-500">
              <ShieldCheck size={12} className="text-[#d4af37]" />
              <span>Bespoke systems deployment. Your data remains strictly confidential.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
