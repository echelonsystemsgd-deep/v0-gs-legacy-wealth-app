'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Bell,
  UserRound,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/book?tab=book', label: 'Book a Session', icon: CalendarDays },
  { href: '/dashboard/book?tab=my-bookings', label: 'My Bookings', icon: CalendarRange },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
]

const accountItems = [
  { href: '/dashboard?tab=profile', label: 'Profile Settings', icon: UserRound },
]

export function UserSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Check if link is active
  const checkActive = (href: string) => {
    const [path, query] = href.split('?')
    if (pathname !== path) return false
    if (!query) {
      // If link has no query, but current URL has tab=profile, then this link (e.g. /dashboard) is NOT active
      if (searchParams.get('tab') === 'profile') return false
      return true
    }
    const params = new URLSearchParams(query)
    for (const [key, val] of params.entries()) {
      if (searchParams.get(key) !== val) return false
    }
    return true
  }

  return (
    <>
      {/* Floating Toggle Button for Mobile */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-2.5 left-4 z-45 p-2 rounded-xl bg-card border border-gold/15 text-gold hover:bg-gold/5 transition-all cursor-pointer flex items-center justify-center shadow-lg"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-25 transition-opacity duration-300"
        />
      )}

      <aside className={`flex flex-col h-screen w-64 border-r border-gold/10 bg-[#0A0A0A]/95 backdrop-blur-md fixed inset-y-0 z-30 transition-[left] duration-300 lg:left-0 ${isOpen ? 'left-0' : 'left-[-256px]'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/GS_Legacy_Wealth-removebg-preview.png"
                alt="GS Legacy Wealth"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-foreground leading-tight">GS Legacy</p>
              <p className="text-xxs text-gold/70 font-semibold uppercase tracking-widest font-sans">Sandbox Suite</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg border border-gold/15 text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = checkActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${isActive ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'}`}
                />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-gold/50" />}
              </Link>
            )
          })}

          <div className="pt-4 pb-1.5 px-3">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase select-none">
              Account
            </p>
          </div>

          {accountItems.map(({ href, label, icon: Icon }) => {
            const isActive = checkActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors ${isActive ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'}`}
                />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-gold/50" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer / Sign Out */}
        <div className="px-3 py-4 border-t border-gold/10">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all mb-1 font-sans"
          >
            View Public Site →
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={16} className="shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
