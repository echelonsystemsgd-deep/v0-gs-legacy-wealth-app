'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { UserNotificationCenter } from '@/components/dashboard/user-notification-center'
import { useRouter } from 'next/navigation'

import { UserProfileDropdown } from '@/components/dashboard/user-profile-dropdown'
import { InspectorToggle } from '@/components/dashboard/inspector-toggle'

interface UserTopbarProps {
  fullName: string | null
  email: string
  userId: string
}

export function UserTopbar({ fullName, email, userId }: UserTopbarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

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
        <InspectorToggle />
        <div className="h-5 w-px bg-gold/10" />
        <UserNotificationCenter userId={userId} />
        <div className="h-5 w-px bg-gold/10" />
        <UserProfileDropdown
          fullName={fullName}
          email={email}
          avatarLetter={initials}
          profileLink="/dashboard?tab=profile"
        />
      </div>
    </header>
  )
}
