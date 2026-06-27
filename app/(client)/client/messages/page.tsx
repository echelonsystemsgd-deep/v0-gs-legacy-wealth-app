import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MessageSquare, Sparkles } from 'lucide-react'
import { MessagesClientContainer } from '@/components/client/messages-client-container'

export default async function ClientMessagesPage() {
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

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle()

  if (!project) {
    redirect('/client')
  }

  // Fetch initial message history
  const { data: initialMessages } = await supabase
    .from('messages')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true })

  const clientName = profile.first_name || profile.full_name || 'Client'

  return (
    <div className="space-y-6 sm:space-y-10 relative h-full flex flex-col">
      {/* Header */}
      <div className="space-y-1 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
          <Sparkles size={12} className="animate-pulse" /> Message Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Operations Desk
        </h1>
        <p className="text-sm text-muted-foreground">
          Direct technical link. Submit assets, copy details, or review queries directly. Dispatched responses occur within 2 hours.
        </p>
      </div>

      <div className="flex-1 min-h-0" data-tour="messages-chat">
        <MessagesClientContainer
          projectId={project.id}
          clientId={user.id}
          initialMessages={(initialMessages ?? []) as any[]}
          clientName={clientName}
        />
      </div>
    </div>
  )
}
