'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Globe, LogOut } from 'lucide-react'
import { UserNotificationCenter } from '@/components/dashboard/user-notification-center'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserTopbarProps {
  fullName: string | null
  email: string
}

export function UserTopbar({ fullName, email }: UserTopbarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Dashboard', href: '/dashboard' }]

    if (pathname.includes('/book')) {
      const tab = searchParams.get('tab')
      if (tab === 'my-bookings') {
        crumbs.push({ label: 'My Bookings', href: '/dashboard/book?tab=my-bookings' })
      } else {
        crumbs.push({ label: 'Book a Session', href: '/dashboard/book' })
      }
    } else if (pathname.includes('/notifications')) {
      crumbs.push({ label: 'Notifications', href: '/dashboard/notifications' })
    } else if (searchParams.get('tab') === 'profile') {
      crumbs.push({ label: 'Profile Settings', href: '/dashboard?tab=profile' })
    }

    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()
  const initials = (fullName ?? email ?? 'U')[0].toUpperCase()

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-gold/10 bg-[#050505]/80 backdrop-blur-md flex items-center px-4 sm:px-8 gap-4 shrink-0">
      {/* Mobile Menu Spacer */}
      <div className="w-10 lg:hidden shrink-0" />

      {/* Breadcrumbs */}
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/60 select-none">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {idx > 0 && <span>&gt;</span>}
                {isLast ? (
                  <span className="text-gold font-bold">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-5 w-px bg-gold/10 hidden sm:block" />
        <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">
          {fullName ?? email.split('@')[0]}
        </span>
        <div className="h-5 w-px bg-gold/10" />
        
        <Link
          href="/"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all"
          title="View Public Site"
        >
          <Globe size={15} />
        </Link>

        <UserNotificationCenter />

        <button
          onClick={handleSignOut}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all cursor-pointer"
          title="Sign Out"
        >
          <LogOut size={15} />
        </button>

        <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center select-none">
          <span className="text-xs font-bold text-gold">
            {initials}
          </span>
        </div>
      </div>
    </header>
  )
}
