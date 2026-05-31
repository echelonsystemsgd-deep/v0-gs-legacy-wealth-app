'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="glass rounded-2xl border border-gold/15 p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto">
          <CheckCircle2 size={26} className="text-green-400" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">Check Your Inbox</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            We&apos;ve sent a password reset link to <span className="text-foreground font-medium">{email}</span>.
            Check your email and click the link to set a new password.
          </p>
        </div>
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl border border-gold/15 p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground">Reset Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your admin email and we&apos;ll send a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail size={13} className="text-gold" /> Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gslegacywealth.com"
            className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          id="forgot-password-submit"
          className="w-full bg-gradient-to-r from-gold to-gold-light text-background font-bold text-sm py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
        </button>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft size={12} /> Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
