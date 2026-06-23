'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loginType, setLoginType] = useState<'client' | 'admin'>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message || 'Invalid credentials. Please check your email and password.')
      setLoading(false)
      return
    }

    const user = data?.user
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'client') {
        router.push('/client')
      } else {
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="glass rounded-2xl border border-gold/15 p-8 space-y-6">
      {/* Portal Tab Switcher */}
      <div className="grid grid-cols-2 gap-1.5 bg-background/50 p-1 rounded-xl border border-gold/10">
        <button
          type="button"
          onClick={() => {
            setLoginType('client')
            setError(null)
          }}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            loginType === 'client'
              ? 'bg-gradient-to-r from-gold/20 to-gold/10 text-gold border border-gold/20 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Client Login
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginType('admin')
            setError(null)
          }}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            loginType === 'admin'
              ? 'bg-gradient-to-r from-gold/20 to-gold/10 text-gold border border-gold/20 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Staff / Admin
        </button>
      </div>

      <div className="space-y-1.5 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          {loginType === 'client' ? 'Welcome Back' : 'Executive Access'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {loginType === 'client'
            ? 'Sign in to your client wealth dashboard'
            : 'Sign in to your administrative dashboard'}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail size={13} className="text-gold" /> Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={loginType === 'client' ? 'you@example.com' : 'admin@gslegacywealth.com'}
            className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lock size={13} className="text-gold" /> Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
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

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          id="login-submit"
          className="w-full bg-gradient-to-r from-gold to-gold-light text-background font-bold text-sm py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing In…
            </>
          ) : (
            loginType === 'client' ? 'Sign In to Client Portal' : 'Sign In to Admin Portal'
          )}
        </button>

        {/* Links Section */}
        <div className="flex flex-col gap-4 text-center border-t border-gold/10 pt-4 mt-2">
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-gold transition-colors underline underline-offset-2"
            >
              Forgot your password?
            </Link>
          </div>

          {loginType === 'client' && (
            <p className="text-xs text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-gold hover:text-gold-light transition-colors font-semibold underline underline-offset-2"
              >
                Create one here
              </Link>
            </p>
          )}

          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center justify-center gap-1.5"
          >
            ← Back to Homepage
          </Link>
        </div>
      </form>
    </div>
  )
}
