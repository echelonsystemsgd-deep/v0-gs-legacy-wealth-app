import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { TimelineFeed } from '@/components/client/timeline-feed'

export default async function ClientUpdatesPage() {
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

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle()

  if (!project) {
    redirect('/client')
  }

  // Fetch timeline updates
  const { data: updates } = await supabase
    .from('project_updates')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
          <Clock size={12} /> Timeline Log
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Project Updates
        </h1>
        <p className="text-sm text-muted-foreground">
          Chronological register of verified system alterations and milestone achievements.
        </p>
      </div>

      <TimelineFeed initialUpdates={updates ?? []} projectId={project.id} />
    </div>
  )
}
