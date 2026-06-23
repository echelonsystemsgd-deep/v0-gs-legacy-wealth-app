import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { BookingTabsWrapper } from '@/components/dashboard/booking-tabs-wrapper'
import { CalendarDays } from 'lucide-react'

export default async function DashboardBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedParams = await searchParams
  const defaultTab = resolvedParams.tab === 'my-bookings' ? 'my-bookings' : 'book'
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6">
      {/* Page title */}
      <div className="space-y-1 pb-6 border-b border-gold/15">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
          <CalendarDays size={12} className="animate-pulse" />
          Vetting & Progress Alignment
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
          Schedule Operational Sync
        </h1>
        <p className="text-xs text-muted-foreground max-w-md">
          Sync details directly to the DB ledger. Select a package and day to isolate scaling blocks.
        </p>
      </div>

      {/* Booking Tabs (Schedule Call & My Bookings) */}
      <BookingTabsWrapper
        userId={user.id}
        userRole={profile.role}
        userEmail={user.email!}
        defaultTab={defaultTab as any}
      />
    </div>
  )
}
