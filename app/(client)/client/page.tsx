import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FolderKanban, Calendar, Clock, MessageSquare, ExternalLink, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { ProjectTelemetry } from '@/components/client/project-telemetry'
import { QuickMessageReply } from '@/components/client/quick-message-reply'
import { StageApprovalButton } from '@/components/client/stage-approval-button'

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

  // Fetch upcoming scheduled strategy session for client
  let upcomingSession = null
  const { data: sessions } = await supabase
    .from('strategy_sessions')
    .select('*')
    .eq('client_id', user.id)
    .eq('status', 'Scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(1)
  if (sessions && sessions.length > 0) {
    upcomingSession = sessions[0]
  }

  // Fetch recent messages preview
  let recentMessages = []
  if (project) {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { descending: true })
      .limit(3)
    recentMessages = messages ?? []
  }

  // Fetch approvals for the project
  let approvals: any[] = []
  if (project) {
    const { data: appData } = await supabase
      .from('project_approvals')
      .select('*, approved_by_profile:profiles(first_name, last_name, full_name)')
      .eq('project_id', project.id)
    approvals = appData ?? []
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
          Client Operations Center: {greetingName}
        </h1>
        <p className="text-sm text-muted-foreground">
          System build telemetry online. Monitoring active milestone progress and system integrations.
        </p>
      </div>

      {!project ? (
        /* Empty State */
        <div className="p-8 sm:p-12 glass rounded-2xl border border-gold/10 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mx-auto">
            <FolderKanban size={28} className="text-gold" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-foreground">Initializing Operations Workspace</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Establishing database containers and provisioning project telemetry. Your dedicated client portal will synchronize automatically as design parameters are finalized and active development commences.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300"
            >
              Request Status Update <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      ) : (
        /* Project Dashboard UI */
        <>
          {/* Scoped Summary Cards & Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Col - Summary Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Card */}
              <div className="p-5 glass rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Active Deployment Phase</span>
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
                    {project.target_launch_date ? new Date(project.target_launch_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Determining Launch Vector...'}
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
            </div>

            {/* Right Col - Telemetry */}
            <div className="lg:col-span-1">
              <ProjectTelemetry project={project} />
            </div>
          </div>

          {/* Project Details & Status Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Col - Brief overview & Stage summary */}
            <section className="lg:col-span-2 space-y-6">
              {/* Overview & Checklist Container */}
              <div className="p-6 glass rounded-2xl border border-gold/10 space-y-6">
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
                    System Implementation Phases
                  </h3>

                  <div className="space-y-2.5">
                    {stages.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex
                      const isActive = idx === currentStageIndex
                      const isApproved = approvals.some((a) => a.stage === stage)
                      const stageApproval = approvals.find((a) => a.stage === stage)

                      const subTasks: Record<string, string[]> = {
                        'Discovery': ['Brand consultation & assets gathered', 'User telemetry & system requirements documented'],
                        'Design': ['Figma interactive wireframes created', 'Premium brand identity & asset system sign-off'],
                        'Development': ['Next.js core application scaffolding', 'Supabase database & schema setup', 'Calendly & notification services integration'],
                        'Revision': ['Staging preview deployment', 'Lead capture forms & CRM pipeline validation', 'Performance & RLS security audit'],
                        'Complete': ['Production server setup', 'Domain delegation & live deployment']
                      }

                      return (
                        <div key={stage} className="space-y-2">
                          <div
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3 rounded-xl border transition-all ${
                              isActive 
                                ? 'bg-gold/5 border-gold/30 text-foreground' 
                                : isCompleted 
                                  ? 'bg-white/[0.01] border-transparent text-muted-foreground' 
                                  : 'bg-transparent border-transparent text-muted-foreground/40'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {isCompleted ? (
                                <CheckCircle2 size={16} className="text-gold shrink-0" />
                              ) : isActive ? (
                                <CheckCircle2 size={16} className="text-gold shrink-0 animate-pulse" />
                              ) : (
                                <Circle size={16} className="text-muted-foreground/30 shrink-0" />
                              )}
                              <span className="text-sm font-semibold">{stage}</span>
                              {isActive && (
                                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold animate-pulse">
                                  Active Phase
                                </span>
                              )}
                            </div>

                            {/* Phase Sign-Off Node */}
                            {(isCompleted || isActive) && (
                              <StageApprovalButton
                                projectId={project.id}
                                clientId={user.id}
                                stage={stage}
                                isApproved={isApproved}
                                approval={stageApproval}
                                clientName={greetingName}
                              />
                            )}
                          </div>
                          
                          {/* Render detailed sub-tasks */}
                          {(isActive || isCompleted) && subTasks[stage] && (
                            <div className="pl-9 pb-2 space-y-1.5 animate-fade-in">
                              {subTasks[stage].map((task) => (
                                <div key={task} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CheckCircle2 size={11} className={isCompleted ? "text-gold/35" : "text-gold"} />
                                  <span>{task}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Staging Preview Browser Frame */}
              {project.preview_url && (
                <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Live Staging Preview</h3>
                      <p className="text-xxs text-muted-foreground">Interactive web instance synchronizing with recent git deployments.</p>
                    </div>
                    <Link
                      href={project.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xxs font-bold text-gold hover:underline flex items-center gap-1 font-mono"
                    >
                      Open in new tab <ExternalLink size={10} />
                    </Link>
                  </div>

                  {/* Browser Mockup Frame */}
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-black/40">
                    {/* Browser Toolbar */}
                    <div className="bg-[#111111] px-4 py-2 border-b border-white/5 flex items-center gap-3">
                      {/* Red, Yellow, Green Window Dots */}
                      <div className="flex gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      
                      {/* URL Bar */}
                      <div className="flex-1 bg-white/[0.03] border border-white/5 rounded px-3 py-0.5 text-[10px] text-muted-foreground font-mono truncate text-center select-none">
                        {project.preview_url.replace(/^https?:\/\//, '')}
                      </div>
                    </div>

                    {/* Frame Content */}
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={project.preview_url}
                        title="Staging Preview"
                        className="absolute inset-0 w-full h-full border-0 bg-[#0A0A0A]"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    </div>
                  </div>
                </section>
              )}
            </section>

            {/* Right Col - Quick Links / Support details */}
            <div className="space-y-6 sm:space-y-8">
              {/* Sync Call Card */}
              <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
                <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} /> Milestone Sync Call
                </h3>
                <div className="space-y-3">
                  {upcomingSession ? (
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 space-y-2">
                      <p className="text-xs text-foreground font-semibold">Sync Scheduled</p>
                      <p className="text-xxs text-muted-foreground font-mono">
                        {new Date(upcomingSession.scheduled_at).toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <Link
                        href="/dashboard/book"
                        className="text-xxs font-bold text-gold hover:underline flex items-center gap-1 mt-1 font-sans"
                      >
                        Reschedule sync →
                      </Link>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Need a progress review or design sync call with our engineering lead? Book an inline check-in.
                      </p>
                      <Link
                        href="/dashboard/book"
                        className="w-full py-2.5 px-4 rounded-xl bg-gold/10 hover:bg-gold/15 border border-gold/25 text-xs font-semibold text-gold transition-all duration-300 flex items-center justify-between text-center cursor-pointer font-serif"
                      >
                        <span>Schedule Dev Sync</span> <ArrowRight size={12} />
                      </Link>
                    </>
                  )}
                </div>
              </section>

              {/* Site Access */}
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
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Project Support</h3>
                  {unreadMessagesCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <div className="space-y-4">
                  {recentMessages.length > 0 ? (
                    <div className="space-y-2.5">
                      {recentMessages.map((msg: any) => {
                        const isAdmin = msg.sender_id !== user.id
                        return (
                          <div key={msg.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className={isAdmin ? "text-purple-400 font-bold" : "text-gold font-bold"}>
                                {isAdmin ? "Engineering Team" : "You"}
                              </span>
                              <span className="text-muted-foreground font-mono">
                                {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 leading-snug">
                              {msg.content}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Have questions about your project, content updates, or changes? Msg us directly.
                    </p>
                  )}
                  <Link
                    href="/client/messages"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1A0A2E]/50 hover:bg-[#1A0A2E]/70 border border-purple-500/20 hover:border-purple-500/40 text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-between"
                  >
                    <span>Open Message Hub</span> <ArrowRight size={12} />
                  </Link>
                </div>
              </section>

              {/* Quick Support Dispatch composer */}
              <QuickMessageReply projectId={project.id} clientId={user.id} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
