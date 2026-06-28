import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ClientSidebar } from '@/components/client/sidebar'
import { createClient } from '@/lib/supabase/server'
import { UserNotificationCenter } from '@/components/dashboard/user-notification-center'
import { Watermark } from '@/components/watermark'
import { UserProfileDropdown } from '@/components/dashboard/user-profile-dropdown'
import { InspectorProvider } from '@/hooks/use-inspector'
import { InspectorPanel } from '@/components/dashboard/inspector-panel'
import { InspectorToggle } from '@/components/dashboard/inspector-toggle'
import { PortalTour } from '@/components/client/portal-tour'
import { TourTrigger } from '@/components/client/tour-trigger'

import { GlowEffect } from '@/components/client/glow-effect'

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

  // Fetch project theme accent
  const { data: project } = await supabase
    .from('projects')
    .select('theme_accent')
    .eq('client_id', user.id)
    .maybeSingle()

  const themeClass = project?.theme_accent ? `theme-${project.theme_accent}` : 'theme-gold'

  return (
    <InspectorProvider>
      <PortalTour />
      <GlowEffect />
      <div className={`h-dvh bg-[#050505] text-foreground flex relative overflow-hidden ${themeClass}`}>

        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Royal Purple Glow */}
          <div className="absolute top-0 left-64 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[160px]" />
          {/* Gold Glow */}
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[120px]" />
        </div>

        <Watermark position="center" opacity={0.02} />

        {/* Zone 2: Navigation */}
        <ClientSidebar />

        {/* Zone 3 & 4 Container */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 h-dvh overflow-hidden">
          {/* Top bar */}
          <header className="sticky top-0 z-20 h-14 border-b border-gold/10 bg-[#050505]/85 backdrop-blur-md flex items-center px-4 sm:px-8 gap-4">
            <div className="w-10 lg:hidden shrink-0" />
            <div className="flex-1" />
            <div className="flex items-center gap-3.5">
              <InspectorToggle />
              <div className="h-5 w-px bg-gold/10" />
              <TourTrigger />
              <div className="h-5 w-px bg-gold/10" />
              <UserNotificationCenter userId={user.id} />
              <div className="h-5 w-px bg-gold/10" />
              <UserProfileDropdown
                fullName={profile.full_name}
                email={user.email!}
                avatarLetter={(profile.full_name ?? user.email ?? 'C')[0]}
                profileLink="/profile"
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

