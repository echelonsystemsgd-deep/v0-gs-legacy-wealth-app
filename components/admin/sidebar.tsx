'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import {
  LayoutDashboard,
  Inbox,
  Users,
  FolderKanban,
  Calendar,
  Settings,
  ScrollText,
  LogOut,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Bell,
  Globe,
  Star,
  Image as ImageIcon,
  ShieldAlert,
  Briefcase,
  Terminal,
  ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/clients', label: 'Client Directory', icon: Users },
  { href: '/admin/messages', label: 'Message Desk', icon: MessageSquare },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/content', label: 'Content', icon: ScrollText },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
  { href: '/', label: 'View Public Site', icon: Globe },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Close sidebar on navigation change on mobile
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-2.5 z-50 p-2.5 rounded-xl bg-[#0A0A0A] border border-gold/35 text-gold hover:bg-gold/10 hover:text-gold-light transition-all duration-300 cursor-pointer flex items-center justify-center shadow-lg"
        style={{
          left: isOpen ? '268px' : '16px'
        }}
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-30 transition-opacity duration-300"
        />
      )}

      <aside className={`flex flex-col h-screen w-64 border-r border-gold/10 bg-[#0A0A0A]/95 backdrop-blur-md fixed inset-y-0 z-40 transition-[left] duration-300 lg:left-auto ${isOpen ? 'left-0' : 'left-[-256px]'} lg:relative lg:left-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10 shrink-0">
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
              <p className="text-xxs text-gold/70 font-semibold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Console Switcher */}
        <div className="px-4 py-3.5 border-b border-gold/10 relative shrink-0 z-50">
          <button
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-gold/15 hover:border-gold/30 hover:bg-white/[0.04] transition-all duration-200 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
                <ShieldAlert size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-gold/60 font-bold uppercase tracking-wider leading-none">Console</p>
                <p className="text-xs font-semibold text-foreground truncate mt-1">Operations Terminal</p>
              </div>
            </div>
            <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 shrink-0 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSwitcherOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsSwitcherOpen(false)} />
              <div className="absolute left-4 right-4 mt-1 bg-[#0F0F0F] border border-gold/20 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <p className="text-[8px] font-bold text-gold/40 px-2 py-1 uppercase tracking-widest leading-none mb-1">Available Terminals</p>
                
                <Link
                  href="/admin"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium transition-all"
                >
                  <ShieldAlert size={14} className="shrink-0 text-gold" />
                  <span>Operations Terminal</span>
                </Link>

                <Link
                  href="/client"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 text-xs font-medium transition-all"
                >
                  <Briefcase size={14} className="shrink-0 text-gold/70" />
                  <span>Sovereign Partner Console</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 text-xs font-medium transition-all"
                >
                  <Terminal size={14} className="shrink-0 text-gold/70" />
                  <span>Vetting Terminal</span>
                </Link>

                <div className="h-px bg-gold/10 my-1" />

                <Link
                  href="/"
                  onClick={() => setIsSwitcherOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 text-xs font-medium transition-all"
                >
                  <Globe size={14} className="shrink-0 text-gold/70" />
                  <span>Public Site</span>
                </Link>
              </div>
            </>
          )}
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
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
        <button
          onClick={handleSignOut}
          id="admin-signout"
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
