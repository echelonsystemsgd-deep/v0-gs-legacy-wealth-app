import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FolderKanban, Calendar, Clock, MessageSquare, ExternalLink, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

export default async function ClientDashboardPage() {
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

  // Fetch the client's project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle()

  // Fetch latest update if project exists
  let latestUpdate = null
  if (project) {
    const { data: updates } = await supabase
      .from('project_updates')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(1)
    if (updates && updates.length > 0) {
      latestUpdate = updates[0]
    }
  }

  // Fetch unread messages count (messages where sender_id !== user.id)
  let unreadMessagesCount = 0
  if (project) {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', project.id)
      .neq('sender_id', user.id)
    unreadMessagesCount = count || 0
  }

  const greetingName = profile.first_name || profile.full_name || 'Client'

  // Standard visual stages mapping
  const stages = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']
  const currentStageIndex = project ? stages.indexOf(project.status) : 0

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Welcome back, {greetingName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is the current status of your digital build with GS Legacy Wealth.
        </p>
      </div>

      {!project ? (
        /* Empty State */
        <div className="p-8 sm:p-12 glass rounded-2xl border border-gold/10 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mx-auto">
            <FolderKanban size={28} className="text-gold" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-foreground">Project Setup in Progress</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are currently preparing your project portal workspace. As soon as your strategy session outcomes are finalized and development pipelines are active, you will be able to track your build, check off design milestones, and access deliverables right here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300"
            >
              Contact Support <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      ) : (
        /* Project Dashboard UI */
        <>
          {/* Scoped Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Status Card */}
            <div className="p-5 glass rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Project Status</span>
                <p className="text-lg font-serif font-bold text-gradient-gold truncate">
                  {project.status}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <FolderKanban size={18} className="text-gold" />
              </div>
            </div>

            {/* Target Launch Card */}
            <div className="p-5 glass rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Target Launch</span>
                <p className="text-lg font-serif font-bold text-foreground truncate">
                  {project.target_launch_date ? new Date(project.target_launch_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Setting Date...'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-gold" />
              </div>
            </div>

            {/* Last Update Card */}
            <div className="p-5 glass rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Last Update</span>
                <p className="text-sm font-bold text-foreground truncate max-w-full">
                  {latestUpdate ? latestUpdate.title : 'No updates posted'}
                </p>
                {latestUpdate && (
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    {new Date(latestUpdate.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-gold" />
              </div>
            </div>

            {/* Support Messages Card */}
            <div className="p-5 glass rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Unread Messages</span>
                <p className="text-lg font-serif font-bold text-foreground truncate">
                  {unreadMessagesCount > 0 ? `${unreadMessagesCount} New` : 'All caught up'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-gold" />
              </div>
            </div>
          </section>

          {/* Project Details & Status Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Col - Brief overview & Stage summary */}
            <section className="lg:col-span-2 p-6 glass rounded-2xl border border-gold/10 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-serif font-bold text-foreground">Project: {project.project_name}</h2>
                <p className="text-xs text-muted-foreground">Started on {new Date(project.start_date || project.created_at).toLocaleDateString()}</p>
              </div>

              {project.description && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-1.5">Overview</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* High-level checklist snapshot */}
              <div className="space-y-4">
                <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                  Project Path Summary
                </h3>

                <div className="space-y-2.5">
                  {stages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex
                    const isActive = idx === currentStageIndex

                    return (
                      <div
                        key={stage}
                        className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-gold/5 border-gold/30 text-foreground' 
                            : isCompleted 
                              ? 'bg-white/[0.01] border-transparent text-muted-foreground' 
                              : 'bg-transparent border-transparent text-muted-foreground/40'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-gold shrink-0" />
                        ) : isActive ? (
                          <CheckCircle2 size={16} className="text-gold shrink-0 animate-pulse" />
                        ) : (
                          <Circle size={16} className="text-muted-foreground/30 shrink-0" />
                        )}
                        <span className="text-sm font-semibold">{stage}</span>
                        {isActive && (
                          <span className="ml-auto text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold animate-pulse">
                            Active Phase
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Right Col - Quick Links / Support details */}
            <div className="space-y-6 sm:space-y-8">
              {/* Quick status report */}
              <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
                <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Site Access</h3>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Check your build preview, staging server, or production instance once it is ready.
                  </p>
                  <Link
                    href="/client/website"
                    className="w-full py-2.5 px-4 rounded-xl bg-gold/10 hover:bg-gold/15 border border-gold/25 text-xs font-semibold text-gold transition-all duration-300 flex items-center justify-between"
                  >
                    View Website Preview <ExternalLink size={12} />
                  </Link>
                </div>
              </section>

              {/* Client support center card */}
              <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
                <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Project Support</h3>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Have questions about your project, content updates, or changes? Msg us directly.
                  </p>
                  <Link
                    href="/client/messages"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A0A2E]/50 hover:bg-[#1A0A2E]/70 border border-purple-500/20 hover:border-purple-500/40 text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-between"
                  >
                    Message Team <ArrowRight size={12} />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
