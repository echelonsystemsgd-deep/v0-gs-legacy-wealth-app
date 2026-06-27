import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClientBookingCalendly } from '@/components/client/booking-calendly'
import { MyBookingsCalendar } from '@/components/dashboard/my-bookings-calendar'
import { ClientBookingCalendar } from '@/components/dashboard/client-booking-calendar'
import { Sparkles, CalendarDays, CalendarRange } from 'lucide-react'

export default async function ClientBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedParams = await searchParams
  const activeTab = resolvedParams.tab === 'my-bookings' ? 'my-bookings' : 'book'
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

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'client' && profile.role !== 'admin')) {
    redirect('/login')
  }

  const fullName = profile.full_name || 
    (profile.first_name || profile.last_name ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '') ||
    user.email!.split('@')[0]

  return (
    <div className="max-w-7xl w-full mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1 pb-6 border-b border-gold/15">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
          <Sparkles size={12} className="animate-pulse" /> Alignment Desk
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-0.5">
          Schedule Operational Sync
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Coordinate technical reviews, layout audits, or automation strategy check-ins directly with our build team. Your details are pre-loaded — no vetting required.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/8 rounded-xl w-fit">
        <a
          href="/client/book?tab=book"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            activeTab === 'book'
              ? 'bg-gold text-background border border-gold/10 shadow-[0_0_10px_rgba(212,175,55,0.25)]'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          <CalendarDays size={14} />
          <span>Schedule Call</span>
        </a>
        <a
          href="/client/book?tab=my-bookings"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            activeTab === 'my-bookings'
              ? 'bg-gold text-background border border-gold/10 shadow-[0_0_10px_rgba(212,175,55,0.25)]'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          <CalendarRange size={14} />
          <span>My Bookings</span>
        </a>
      </div>

      {/* Tab Content */}
      {activeTab === 'book' ? (
        <ClientBookingCalendly
          fullName={fullName}
          email={user.email!}
          website={profile.address_line1 || ''}
        />
      ) : (
        <div className="glass p-6 sm:p-8 rounded-2xl border border-gold/10 bg-black/10">
          <MyBookingsCalendar
            userId={user.id}
            userRole={profile.role}
            userEmail={user.email!}
          />
        </div>
      )}
    </div>
  )
}
