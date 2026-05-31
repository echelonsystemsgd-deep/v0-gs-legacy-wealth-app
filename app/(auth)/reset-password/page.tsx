'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Failed to update password. The reset link may have expired.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="glass rounded-2xl border border-gold/15 p-8 space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground">Set New Password</h2>
        <p className="text-sm text-muted-foreground">Choose a strong, secure password.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock size={13} className="text-gold" /> New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock size={13} className="text-gold" /> Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
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
          id="reset-password-submit"
          className="w-full bg-gradient-to-r from-gold to-gold-light text-background font-bold text-sm py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
