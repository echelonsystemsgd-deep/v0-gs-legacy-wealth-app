import type { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserSidebar } from '@/components/dashboard/sidebar'
import { UserTopbar } from '@/components/dashboard/topbar'
import { Watermark } from '@/components/watermark'
import { InspectorProvider } from '@/hooks/use-inspector'
import { PortalHub } from '@/components/dashboard/portal-hub'
import { InspectorPanel } from '@/components/dashboard/inspector-panel'

export const metadata: Metadata = {
  title: 'User Dashboard',
}

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  if (profile.role === 'client') {
    redirect('/client')
  }

  return (
    <InspectorProvider>
      <div className="min-h-screen bg-[#050505] text-[#F0EDE6] relative overflow-hidden flex">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/3 blur-[130px]" />
        </div>

        <Watermark position="center" opacity={0.02} />

        {/* Zone 1: Switcher */}
        <PortalHub />

        {/* Zone 2: Navigation */}
        <UserSidebar />

        {/* Zone 3 & 4 Container */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 min-h-screen">
          {/* Top bar */}
          <UserTopbar fullName={profile.full_name} email={user.email!} userId={user.id} />

          {/* Content + Zone 4 Panel */}
          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
            <InspectorPanel />
          </div>

          <footer className="w-full border-t border-gold/10 py-5 text-center text-xs text-muted-foreground bg-[#050505]/80 backdrop-blur-md shrink-0">
            © {new Date().getFullYear()} GS Legacy Wealth AI. All rights reserved.
          </footer>
        </div>
      </div>
    </InspectorProvider>
  )
}

