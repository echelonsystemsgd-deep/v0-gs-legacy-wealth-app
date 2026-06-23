import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClientBookingCalendar } from '@/components/dashboard/client-booking-calendar'
import { Sparkles, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { Watermark } from '@/components/watermark'

export default async function DashboardBookingPage() {
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
    <div className="min-h-screen bg-[#050505] text-[#F0EDE6] relative overflow-hidden flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/3 blur-[130px]" />
      </div>

      <Watermark position="center" opacity={0.02} />

      {/* Header */}
      <header className="sticky top-0 z-20 h-14 border-b border-gold/10 bg-[#050505]/90 backdrop-blur-md flex items-center px-4 sm:px-8 gap-4 shrink-0">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
            <Sparkles size={11} className="text-gold" />
          </div>
          <div>
            <p className="font-serif text-xs font-bold text-foreground leading-none">GS Legacy Wealth</p>
            <p className="text-[10px] text-gold/60 font-semibold uppercase tracking-widest mt-0.5">
              Secure Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={profile.role === 'client' ? '/client' : '/dashboard'}
            className="px-3.5 py-1.5 rounded-lg bg-gold/5 border border-gold/20 hover:border-gold/45 text-xs font-bold text-gold hover:bg-gold/10 transition-all cursor-pointer font-serif"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto px-4 pt-6 pb-28 sm:py-10 space-y-8 relative z-10 flex-1">
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

        {/* Custom Calendar widget */}
        <ClientBookingCalendar
          userId={user.id}
          userRole={profile.role}
          userEmail={user.email!}
        />
      </div>

      <footer className="w-full border-t border-gold/10 py-5 text-center text-xs text-muted-foreground relative z-10 bg-[#050505]/80 backdrop-blur-md">
        © {new Date().getFullYear()} GS Legacy Wealth AI. All rights reserved.
      </footer>
    </div>
  )
}
