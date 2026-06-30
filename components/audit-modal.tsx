'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ClipboardCheck, ShieldCheck, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
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

type ModalStep = 'form' | 'calendly' | 'success'

export const AuditModal: React.FC = () => {
  const { isOpen, tier, closeModal } = useAuditModal()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [industry, setIndustry] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Multi-step modal state
  const [modalStep, setModalStep] = useState<ModalStep>('form')
  const [calendlyUrl, setCalendlyUrl] = useState('')
  const [iframeLoading, setIframeLoading] = useState(true)

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null)
      setFirstName('')
      setLastName('')
      setEmail('')
      setGdprConsent(false)
      setIndustry(industries[0])
      setModalStep('form')
      setCalendlyUrl('')
      setIframeLoading(true)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || !lastName || !gdprConsent) {
      setErrorMsg('Please complete all required fields and accept the terms.')
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
      first_name: firstName,
      last_name: lastName,
      email,
      industry,
      tier: tier || 'General Lead',
      gdpr_consent: gdprConsent,
      source_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : 'none',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'none',
      ...utmParams,
    }

    // Prepare Calendly Redirect URL with pre-fills & branding params
    const baseCalendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/gslegacywealth/30min'
    const redirectUrl = new URL(baseCalendlyUrl)
    redirectUrl.searchParams.set('name', `${firstName} ${lastName}`)
    redirectUrl.searchParams.set('email', email)
    redirectUrl.searchParams.set('background_color', process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR || '0A0A0A')
    redirectUrl.searchParams.set('text_color', process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR || 'F0EDE6')
    redirectUrl.searchParams.set('primary_color', process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR || 'C9A227')
    redirectUrl.searchParams.set('hide_landing_page_details', '1')
    redirectUrl.searchParams.set('hide_gdpr_banner', '1')
    Object.entries(utmParams).forEach(([k, v]) => {
      redirectUrl.searchParams.set(k, v)
    })

    // Triage Rule: Only high-tier clients (Operations Machine / Revenue Engine)
    // from non-custom industries qualify for instant calendar access
    const isQualified = 
      (tier === 'Operations Machine' || tier === 'Revenue Engine') && 
      (industry !== 'Other / Custom')

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

      // Progress based on triage check
      if (isQualified) {
        setCalendlyUrl(redirectUrl.toString())
        setModalStep('calendly')
      } else {
        setModalStep('success')
      }
    } catch (err: any) {
      console.error('[AuditModal] Submission failed, applying triage fallback:', err)
      // Fallback check on client side so the user isn't broken
      if (isQualified) {
        setCalendlyUrl(redirectUrl.toString())
        setModalStep('calendly')
      } else {
        setModalStep('success')
      }
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

          {/* Modal Container - scales based on step */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              maxWidth: modalStep === 'calendly' ? '900px' : '576px' // max-w-4xl vs max-w-xl
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full bg-[#0d0d0d] border border-[#d4af37]/20 rounded-xl overflow-hidden shadow-2xl z-10 text-white flex flex-col transition-all duration-300"
            style={{
              height: modalStep === 'calendly' ? 'min(calc(100vh - 2rem), 780px)' : 'auto'
            }}
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

            {/* Step 1: Lead Capture Form */}
            {modalStep === 'form' && (
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
                  {/* Names */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="first_name">
                        First Name *
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold" htmlFor="last_name">
                        Last Name *
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full h-10 px-3 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                      I agree to be contacted by GS Legacy Wealth regarding my audit request. I have read and agree to the{' '}
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
            )}

            {/* Step 2: Inline Calendly Scheduler (Embedded iframe) */}
            {modalStep === 'calendly' && (
              <div className="flex flex-col flex-1 h-full relative overflow-hidden bg-[#0a0a0a]">
                {iframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0a0a] text-center p-6 space-y-4">
                    <Loader2 size={36} className="text-[#d4af37] animate-spin" />
                    <div>
                      <h4 className="font-serif text-white font-bold text-base">Aligning Calendars</h4>
                      <p className="text-xs text-gray-500 max-w-xs mt-1">Connecting securely to our synchronization gateway...</p>
                    </div>
                  </div>
                )}
                <div className="flex-1 w-full h-full min-h-[450px]">
                  <iframe
                    src={calendlyUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    onLoad={() => setIframeLoading(false)}
                    className="w-full h-full bg-[#0a0a0a]"
                    title="Calendly Scheduler"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Machiavellian Staged/Queued Success State */}
            {modalStep === 'success' && (
              <div className="p-8 sm:p-10 flex flex-col items-center text-center space-y-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37] animate-pulse">
                  <Sparkles size={28} />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-extrabold">
                    System Telemetry Staged
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Operational Review Initiated
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed border-y border-white/5 py-6">
                  <p>
                    GS Legacy Wealth operates under strict bandwidth calibrations. We only allocate active developer channels where a minimum of <strong>3x operational leverage</strong> is guaranteed.
                  </p>
                  <p>
                    Your diagnostic data has been securely logged. An initial roadmap calibration report has been staged for transmission to your corporate address: <strong className="text-white font-mono">{email}</strong>.
                  </p>
                  <p className="text-[11px] text-gray-500">
                    If telemetry confirms compatibility with our cohort schedule, an integration key will be unlocked and dispatched to you.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-white/5 border border-white/10 hover:border-[#d4af37]/45 text-white hover:text-[#d4af37] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 w-full sm:w-auto"
                >
                  Exit Calibration Protocol
                </button>
              </div>
            )}

            {/* Footer lock note (Hidden during Calendly to save screen estate) */}
            {modalStep !== 'calendly' && (
              <div className="px-6 py-4 bg-[#0a0a0a] border-t border-white/5 flex items-center gap-2 justify-center text-[10px] text-gray-500">
                <ShieldCheck size={12} className="text-[#d4af37]" />
                <span>Bespoke systems deployment. Your data remains strictly confidential.</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
