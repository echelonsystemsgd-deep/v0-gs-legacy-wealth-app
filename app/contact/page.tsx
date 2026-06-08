'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    email: '',
    website: '',
    biggest_challenge: '',
    preferred_contact_time: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.biggest_challenge) {
      setErrorMsg('Please select your biggest challenge.')
      return
    }
    if (!form.preferred_contact_time) {
      setErrorMsg('Please select a preferred contact time.')
      return
    }
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.from('leads').insert({
      name: form.name,
      business_name: form.business_name,
      email: form.email,
      website: form.website || null,
      notes: `Challenge: ${form.biggest_challenge} | Preferred time: ${form.preferred_contact_time}`,
      source: 'contact',
      status: 'New'
    })

    setLoading(false)
    if (error) {
      setErrorMsg(error.message || 'An error occurred while submitting your inquiry. Please try again.')
    } else {
      setSuccess(true)
      // Redirect to the success booking landing page after 2.5 seconds
      setTimeout(() => {
        router.push('/success')
      }, 2500)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-24 md:py-32 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copy & Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-xxs font-bold uppercase tracking-widest text-gold">
              <Sparkles size={11} /> Elite Client Intake
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-none text-foreground">
              Let&apos;s Build Your <br />
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                Digital Legacy
              </span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md leading-relaxed">
              We design and engineer bespoke web platforms and intelligent workflows for high-end brands. Fill out the application, and we will get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-4 border-t border-gold/10 pt-6">
            {[
              { icon: <Mail size={16} className="text-gold" />, label: 'Inquiries', val: 'agency@gslegacywealth.ai' },
              { icon: <Phone size={16} className="text-gold" />, label: 'Direct Office', val: '+1 (555) 019-2831' },
              { icon: <MapPin size={16} className="text-gold" />, label: 'Location', val: 'London, United Kingdom' },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-center gap-3.5 text-sm">
                <div className="w-9 h-9 rounded-full bg-card border border-gold/15 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xxs font-bold text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
                  <p className="text-foreground font-medium mt-0.5">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl border border-gold/15 p-6 md:p-10 shadow-2xl relative overflow-hidden">
            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <CheckCircle2 size={36} className="animate-scale-up" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Inquiry Received</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Thank you for applying. We are redirecting you to schedule your official strategy session.
                </p>
                <Loader2 size={20} className="text-gold animate-spin mt-4" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">Project Brief Application</h2>

                {errorMsg && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Business Name *</label>
                    <input
                      required
                      type="text"
                      value={form.business_name}
                      onChange={(e) => setForm((p) => ({ ...p, business_name: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Work Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Current Website URL</label>
                    <input
                      type="url"
                      placeholder="https://"
                      value={form.website}
                      onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Biggest Challenge *</label>
                    <select
                      required
                      value={form.biggest_challenge}
                      onChange={(e) => setForm((p) => ({ ...p, biggest_challenge: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    >
                      <option value="" disabled>Select your biggest challenge</option>
                      <option value="No website yet">No website yet</option>
                      <option value="Outdated website">Outdated website</option>
                      <option value="Not getting leads">Not getting leads</option>
                      <option value="Want to modernise / add AI features">Want to modernise / add AI features</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Preferred Contact Time *</label>
                  <div className="inline-flex w-full items-center bg-background/60 border border-gold/15 rounded-xl p-1 gap-1">
                    {(['Morning', 'Afternoon', 'Evening'] as const).map((time) => {
                      const selected = form.preferred_contact_time === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, preferred_contact_time: time }))}
                          className={`flex-1 text-center py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/20 active:scale-95 touch-manipulation ${
                            selected
                              ? 'bg-gradient-to-r from-gold to-gold-light text-background shadow-sm font-bold'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Submit Application
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    No commitment. We&apos;ll review your business and give you honest feedback in 20 minutes — completely free.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
