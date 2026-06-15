'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ContactPage() {
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('gslegacywealth@gmail.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    const { error } = await supabase.from('leads').insert({
      name: form.name,
      business_name: 'N/A',
      email: form.email,
      notes: `Subject: ${form.subject}\n\n${form.message}`,
      source: 'contact_page',
      status: 'New'
    })
    setLoading(false)
    if (error) {
      setErrorMsg('Something went wrong. Please email us directly at gslegacywealth@gmail.com')
    } else {
      setSuccess(true)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Get In{" "}
              <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              General enquiries, partnerships, or quick questions — we are here. For strategy sessions, use our{" "}
              <Link href="/book" className="text-gold underline underline-offset-4 hover:text-gold/80 transition-colors">
                dedicated booking page
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid lg:grid-cols-12 gap-12 items-start">

        {/* Left Column: Contact Channels */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-5 space-y-6 lg:sticky lg:top-32"
        >
          {/* Email Card */}
          <div className="glass rounded-2xl border border-gold/15 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Direct Email</p>
                <p className="text-sm font-medium text-foreground">Agency Enquiries</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gold/5 border border-gold/20 hover:border-gold/40 hover:bg-gold/10 transition-all group cursor-pointer"
            >
              <span className="text-sm font-mono text-foreground group-hover:text-gold transition-colors">
                gslegacywealth@gmail.com
              </span>
              {copied ? (
                <Check size={14} className="text-gold shrink-0" />
              ) : (
                <Copy size={14} className="text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
              )}
            </button>
            {copied && (
              <p className="text-[11px] text-gold text-center animate-fade-in">✓ Copied to clipboard!</p>
            )}
          </div>

          {/* Office Hours Card */}
          <div className="glass rounded-2xl border border-gold/15 p-6 space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Response Time</p>
                <p className="text-sm font-medium text-foreground">Office Hours</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="text-foreground font-medium">9:00 – 18:00 GMT</span>
              </div>
              <div className="flex justify-between">
                <span>Weekends</span>
                <span className="text-foreground font-medium">By Appointment</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span>Avg. Reply Time</span>
                <span className="text-gold font-semibold">Under 2 hours</span>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="glass rounded-2xl border border-gold/15 p-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-gold" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">London, United Kingdom</p>
              <p className="text-xs text-muted-foreground mt-0.5">Serving clients globally</p>
            </div>
          </div>

          {/* Book a Call Nudge */}
          <Link
            href="/book"
            className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 hover:border-gold/40 transition-all group"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">Ready to grow?</p>
              <p className="text-sm text-foreground font-medium mt-0.5">Book a Strategy Call →</p>
            </div>
            <ArrowRight size={18} className="text-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="glass rounded-3xl border border-gold/15 p-6 md:p-10 shadow-2xl relative overflow-hidden">
            {success ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Inquiry Received</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Thank you for reaching out. Our team will respond to your inquiry within 2 hours during office hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-1">Send an Enquiry</h2>
                  <p className="text-xs text-muted-foreground">All enquiries are reviewed by our team personally.</p>
                </div>

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
                      onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Subject *</label>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    placeholder="e.g. Partnership inquiry, general question..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Send Enquiry
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Not looking to book a call — just a friendly inquiry.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
