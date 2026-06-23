'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldAlert, ArrowRight, Home, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function UnauthorizedPage() {
  const router = useRouter()
  const [dashboardUrl, setDashboardUrl] = useState('/')

  useEffect(() => {
    const checkRole = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (profile?.role === 'admin') {
            setDashboardUrl('/admin')
          } else if (profile?.role === 'client') {
            setDashboardUrl('/client')
          } else {
            setDashboardUrl('/dashboard')
          }
        } else {
          setDashboardUrl('/login')
        }
      } catch (err) {
        console.error('Error resolving dashboard URL:', err)
        setDashboardUrl('/')
      }
    }
    checkRole()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0EDE6] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[35%] left-[35%] w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="max-w-xl w-full relative z-10 text-center space-y-8">
        {/* Shield Icon Container */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
          <ShieldAlert size={28} className="text-gold" />
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-widest text-gold uppercase">Security Alert</p>
          <h1 className="text-3xl font-serif font-bold text-foreground">Access Restricted</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Your account does not have administrative privileges required to access this directory. 
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
          <Link
            href={dashboardUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-background font-bold text-sm px-5 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-300"
          >
            Dashboard <ArrowRight size={15} />
          </Link>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gold/15 hover:border-gold/35 bg-background/50 hover:bg-background/80 text-foreground hover:text-gold font-bold text-sm px-5 py-3 rounded-xl transition-all duration-300"
          >
            <Home size={15} className="text-gold" /> Back to Home
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gold/15 hover:border-gold/35 bg-background/50 hover:bg-background/80 text-foreground hover:text-gold font-bold text-sm px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer"
          >
            <LogOut size={15} className="text-gold" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
