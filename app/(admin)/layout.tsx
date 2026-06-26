import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { createClient } from '@/lib/supabase/server'
import { NotificationCenter } from '@/components/admin/notification-center'
import { UserProfileDropdown } from '@/components/dashboard/user-profile-dropdown'
import { InspectorProvider } from '@/hooks/use-inspector'
import { PortalHub } from '@/components/dashboard/portal-hub'
import { InspectorPanel } from '@/components/dashboard/inspector-panel'
import { InspectorToggle } from '@/components/dashboard/inspector-toggle'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_suspended, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin' || profile.is_suspended) {
    redirect('/login')
  }

  return (
    <InspectorProvider>
      <div className="min-h-screen bg-[#050505] text-foreground flex relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-64 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/2 blur-[120px]" />
        </div>

        {/* Zone 1: Switcher */}
        <PortalHub />

        {/* Zone 2: Navigation */}
        <AdminSidebar />

        {/* Zone 3 & 4 Container */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-20 h-14 border-b border-gold/10 bg-[#050505]/80 backdrop-blur-md flex items-center px-4 sm:px-8 gap-4">
            <div className="w-10 lg:hidden shrink-0" />
            <div className="flex-1" />
            <div className="flex items-center gap-3.5">
              <InspectorToggle />
              <div className="h-5 w-px bg-gold/10" />
              <NotificationCenter />
              <div className="h-5 w-px bg-gold/10" />
              <UserProfileDropdown
                fullName={profile.full_name}
                email={user.email!}
                avatarLetter={(profile.full_name ?? user.email ?? 'A')[0]}
                profileLink="/admin/settings"
              />
            </div>
          </header>

          {/* Main content + Inspector */}
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 sm:p-8">
              {children}
            </main>
            {/* Zone 4: Inspector Panel */}
            <InspectorPanel />
          </div>
        </div>
      </div>
    </InspectorProvider>
  )
}

