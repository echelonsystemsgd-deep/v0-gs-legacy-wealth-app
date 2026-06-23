import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ClientSidebar } from '@/components/client/sidebar'
import { createClient } from '@/lib/supabase/server'
import { UserNotificationCenter } from '@/components/dashboard/user-notification-center'
import { Watermark } from '@/components/watermark'

export const metadata: Metadata = {
  title: 'Client Dashboard',
}

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_suspended, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'client' && profile.role !== 'admin') || profile.is_suspended) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Royal Purple Glow */}
        <div className="absolute top-0 left-64 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[160px]" />
        {/* Gold Glow */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[120px]" />
      </div>

      <Watermark position="center" opacity={0.02} />

      {/* Sidebar */}
      <ClientSidebar />

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 ml-0 relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 h-14 border-b border-gold/10 bg-background/80 backdrop-blur-md flex items-center px-4 sm:px-8 gap-4">
          <div className="w-10 lg:hidden shrink-0" />
          <div className="flex-1" />
          <div className="flex items-center gap-3.5">
            <UserNotificationCenter />
            <div className="h-5 w-px bg-gold/10 hidden sm:block" />
            <span className="text-xs text-muted-foreground hidden sm:block">
              {profile.full_name ?? user.email}
            </span>
            <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
              <span className="text-xxs font-bold text-gold uppercase">
                {(profile.full_name ?? user.email ?? 'C')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
