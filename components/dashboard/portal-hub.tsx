'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Terminal, ShieldAlert, Briefcase, Settings } from 'lucide-react'
import Image from 'next/image'

export function PortalHub() {
  const pathname = usePathname()
  const supabase = createClient()
  const [role, setRole] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string>('')

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, avatar_url, full_name')
            .eq('id', user.id)
            .single()

          if (profile) {
            setRole(profile.role)
            setAvatarUrl(profile.avatar_url)
            setFullName(profile.full_name || '')
          }
        }
      } catch (err) {
        console.error('Error fetching user profile for PortalHub:', err)
      }
    }
    getProfile()
  }, [supabase])

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const navItems = [
    {
      href: '/',
      label: 'Home Website',
      icon: Home,
      active: pathname === '/',
    },
    {
      href: '/dashboard',
      label: 'Vetting Terminal',
      icon: Terminal,
      active: pathname.startsWith('/dashboard'),
    },
  ]

  if (role === 'client' || role === 'admin') {
    navItems.push({
      href: '/client',
      label: 'Sovereign Partner Console',
      icon: Briefcase,
      active: pathname.startsWith('/client'),
    })
  }

  if (role === 'admin') {
    navItems.push({
      href: '/admin',
      label: 'Operations & Infrastructure Terminal',
      icon: ShieldAlert,
      active: pathname.startsWith('/admin'),
    })
  }

  const profileLink = role === 'admin' ? '/admin/settings' : (role === 'client' ? '/profile' : '/dashboard?tab=profile')

  return (
    <aside className="w-[72px] shrink-0 bg-[#050505] border-r border-gold/10 flex flex-col items-center py-4 justify-between select-none z-30 h-screen sticky top-0 hidden lg:flex">
      {/* Top Stack */}
      <div className="flex flex-col gap-3.5 items-center w-full">
        {/* Brand GS Logo Icon */}
        <Link href="/" className="relative group flex items-center justify-center w-full h-12 mb-2">
          <div className="absolute left-0 w-1 h-5 bg-gold rounded-r-md transition-all scale-0 group-hover:scale-100" />
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/25 transition-all duration-300 group-hover:border-gold group-hover:rounded-xl">
            <Image
              src="/MercianWealthlogo.jpeg"
              alt="Mercian Wealth"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <span className="absolute left-20 bg-[#0D0D0D] text-foreground text-xs font-semibold px-3 py-1.5 rounded-md border border-gold/20 shadow-xl opacity-0 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
            Mercian Wealth
          </span>
        </Link>

        <div className="w-8 h-px bg-gold/10" />

        {/* Dynamic Nav Items */}
        {navItems.map((item) => {
          const isItemActive = item.active
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group flex items-center justify-center w-full h-12"
            >
              {/* Left Active indicator notch */}
              <div
                className={`absolute left-0 w-1 bg-gold rounded-r-md transition-all duration-300 ${
                  isItemActive ? 'h-10 scale-100' : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'
                }`}
              />

              {/* Icon Container */}
              <div
                className={`w-10 h-10 rounded-full hover:rounded-xl flex items-center justify-center portal-icon border transition-all duration-200 ${
                  isItemActive
                    ? 'portal-icon-active text-[#0A0A0A] border-gold bg-gold'
                    : 'bg-[#0D0D0D] text-gold/80 hover:text-foreground border-gold/10 hover:border-gold/30'
                }`}
              >
                <Icon size={18} />
              </div>

              {/* Tooltip */}
              <span className="absolute left-20 bg-[#0D0D0D] text-foreground text-xs font-semibold px-3 py-1.5 rounded-md border border-gold/20 shadow-xl opacity-0 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Bottom Stack - Profile & Settings */}
      <div className="flex flex-col gap-3.5 items-center w-full">
        <div className="w-8 h-px bg-gold/10" />

        <Link
          href={profileLink}
          className="relative group flex items-center justify-center w-full h-12"
        >
          {/* Active indicator for Settings/Profile */}
          <div
            className={`absolute left-0 w-1 bg-gold rounded-r-md transition-all duration-300 ${
              isActive(profileLink) ? 'h-8 scale-100' : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'
            }`}
          />

          <div
            className={`w-10 h-10 rounded-full hover:rounded-xl flex items-center justify-center portal-icon border overflow-hidden transition-all duration-200 ${
              isActive(profileLink)
                ? 'portal-icon-active text-[#0A0A0A] border-gold bg-gold'
                : 'bg-[#0D0D0D] text-gold/80 hover:text-foreground border-gold/10 hover:border-gold/30'
            }`}
          >
            {avatarUrl ? (
              <div className="relative w-full h-full">
                <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
              </div>
            ) : (
              <span className="text-xs font-bold font-serif uppercase">
                {fullName ? fullName[0] : <Settings size={16} />}
              </span>
            )}
          </div>

          <span className="absolute left-20 bg-[#0D0D0D] text-foreground text-xs font-semibold px-3 py-1.5 rounded-md border border-gold/20 shadow-xl opacity-0 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
            {fullName || 'Console settings'}
          </span>
        </Link>
      </div>
    </aside>
  )
}
