'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ImageIcon,
  MessageSquareQuote,
  FileEdit,
  HardDrive,
  Settings,
  ScrollText,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/content', label: 'Content', icon: FileEdit },
  { href: '/admin/media', label: 'Media Library', icon: HardDrive },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex flex-col h-full w-64 shrink-0 border-r border-gold/10 bg-card/50 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gold/10">
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
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
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all mb-1"
        >
          View Public Site →
        </Link>
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
  )
}
