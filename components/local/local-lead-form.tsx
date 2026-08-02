"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle2, AlertCircle, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react"

export function LocalLeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    niche: "Bakery / Artisan Food",
    packageChoice: "Catering & Order Engine (£895 setup)",
    notes: "",
    gdprConsent: true,
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    try {
      const payload = {
        source: "local_business_form",
        lead_type: "local_business",
        source_url: "https://mercianwealth.com/local",
        local_business_niche: formData.niche,
        name: formData.name,
        business_name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        service_interested: formData.packageChoice,
        notes: `Local Business Intake — Niche: ${formData.niche} | Package: ${formData.packageChoice} | Notes: ${formData.notes || "None"}`,
      }

      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit lead")
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error("Local form error:", err)
      setErrorMsg(err.message || "Something went wrong. Please try again or WhatsApp us directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact-local" className="py-16 sm:py-24 bg-[#090410] border-t border-accent-gold/20 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <ShoppingBag size={14} />
            <span>Launch Your Local Growth Engine</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Claim Your Local Setup Slot
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Fill in your details below. We'll audit your local search presence and call/WhatsApp you within 12 hours with a live preview.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#07050B] p-6 sm:p-10 rounded-3xl border border-accent-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative">
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Application Received!</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. We've recorded your local setup request for <strong className="text-accent-gold">{formData.businessName}</strong>. Our local digital team will reach out via WhatsApp/Phone shortly.
              </p>
              <div className="pt-4 text-xs font-mono text-white/50">
                Ref: LOC-{Math.floor(1000 + Math.random() * 9000)} | Response SLA &lt; 12 hours
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Grid 1: Name & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-sm text-white outline-none focus:border-accent-gold transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Sweet Artisan Bakery"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-sm text-white outline-none focus:border-accent-gold transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Grid 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@sweetartisan.co.uk"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-sm text-white outline-none focus:border-accent-gold transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="07700 900123"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-sm text-white outline-none focus:border-accent-gold transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Grid 3: Business Type & Package Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                    Type of Local Business
                  </label>
                  <select
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-xs text-white outline-none focus:border-accent-gold font-sans"
                  >
                    <option value="Bakery / Artisan Food" className="bg-bg-secondary text-white">Bakery / Artisan Food</option>
                    <option value="Confectioner / Chocolatier" className="bg-bg-secondary text-white">Confectioner / Chocolatier</option>
                    <option value="Independent Cafe / Deli" className="bg-bg-secondary text-white">Independent Cafe / Deli</option>
                    <option value="Independent Retail Store" className="bg-bg-secondary text-white">Independent Retail Store</option>
                    <option value="Local Professional Service" className="bg-bg-secondary text-white">Local Professional Service</option>
                    <option value="Other Business" className="bg-bg-secondary text-white">Other Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                    Interested Package
                  </label>
                  <select
                    value={formData.packageChoice}
                    onChange={(e) => setFormData({ ...formData, packageChoice: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-xs text-white outline-none focus:border-accent-gold font-sans"
                  >
                    <option value="Catering & Order Engine (£895 setup)" className="bg-bg-secondary text-white">Catering & Order Engine (£895 setup - Recommended)</option>
                    <option value="Local Storefront (£495 setup)" className="bg-bg-secondary text-white">Local Storefront (£495 setup)</option>
                    <option value="Full Local Domination (£1,495 setup)" className="bg-bg-secondary text-white">Full Local Domination (£1,495 setup)</option>
                  </select>
                </div>
              </div>

              {/* Notes / Questions */}
              <div>
                <label className="block text-xs font-mono font-bold text-accent-gold uppercase tracking-wider mb-2">
                  Any Specific Requirements or Questions? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. We need custom cake order deposits and weekend pickup scheduling."
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-sm text-white outline-none focus:border-accent-gold transition-colors font-sans resize-none"
                />
              </div>

              {/* Lightweight GDPR Consent */}
              <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  id="gdpr"
                  checked={formData.gdprConsent}
                  onChange={(e) => setFormData({ ...formData, gdprConsent: e.target.checked })}
                  className="rounded border-white/20 text-accent-gold focus:ring-accent-gold accent-accent-gold"
                />
                <label htmlFor="gdpr" className="cursor-pointer">
                  I agree to receive a digital preview and callback regarding my local growth package.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold text-sm bg-accent-gold text-black hover:bg-amber-300 rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Submit & Request Free Digital Audit</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  )
}
