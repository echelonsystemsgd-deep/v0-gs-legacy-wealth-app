import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FolderKanban, Calendar, Clock, MessageSquare, ExternalLink, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { ProjectTelemetry } from '@/components/client/project-telemetry'
import { QuickMessageReply } from '@/components/client/quick-message-reply'
import { StageApprovalButton } from '@/components/client/stage-approval-button'
import { StagingPreview } from '@/components/client/staging-preview'
import { ActionRequestBanner } from '@/components/client/action-request-banner'
import { LaunchDateRequest } from '@/components/client/launch-date-request'
import { GrowthTelemetry } from '@/components/client/growth-telemetry'
import { SecureVault } from '@/components/client/secure-vault'
import { ProvisioningLogs } from '@/components/client/provisioning-logs'




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
      .order('created_at', { ascending: false })
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

  // Fetch recent project updates for the logs
  let projectUpdates: any[] = []
  if (project) {
    const { data: upLogs } = await supabase
      .from('project_updates')
      .select('id, title, created_at')
      .eq('project_id', project.id)
      .order('created_at', { ascending: true })
    projectUpdates = upLogs ?? []
  }

  // Fetch action requests for the project
  let pendingActionRequests: any[] = []
  if (project) {
    const { data: arData } = await supabase
      .from('project_action_requests')
      .select('*')
      .eq('project_id', project.id)
      .in('status', ['pending', 'submitted'])
      .order('created_at', { ascending: false })
    pendingActionRequests = arData ?? []
  }

  const greetingName = profile.first_name || profile.full_name || 'Client'

  // Standard visual stages mapping
  const stages = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']
  const currentStageIndex = project ? stages.indexOf(project.status) : 0

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Welcome Header */}
      <div className="space-y-2" data-tour="welcome">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Operations Command: {greetingName}
        </h1>
        <p className="text-sm text-muted-foreground">
          System build telemetry active. Monitoring bespoke asset allocation, milestone trajectory, and integration vector pipelines.
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
          {/* Sleek Alert Banner linking to Actions page */}


          {pendingActionRequests.length > 0 && (
            <div 
              data-tour="action-banner"
              className="flex items-center justify-between p-4 rounded-xl border border-gold/30 bg-gold/[0.02] shadow-[0_0_15px_rgba(212,175,55,0.03)] animate-in fade-in duration-300 pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-semibold text-foreground">
                  {pendingActionRequests.length} Pending Action Item{pendingActionRequests.length > 1 ? 's' : ''} require{pendingActionRequests.length === 1 ? 's' : ''} your input to proceed.
                </span>
              </div>
              <Link href="/client/actions" className="text-xs font-bold text-gold hover:underline">
                Open Action Console →
              </Link>
            </div>
          )}

          {/* Contract Enrollment Desk Notice Banner */}
          {!project.contract_type && (
            <div 
              className="flex items-center justify-between p-4 rounded-xl border border-gold/30 bg-gold/[0.02] shadow-[0_0_15px_rgba(212,175,55,0.03)] animate-in fade-in duration-300 pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse animate-duration-1000" />
                <span className="text-xs font-semibold text-foreground">
                  Mandate Contract Pending: Please enroll in your preferred support model in the sidebar configuration desk to initialize build pipeline telemetry.
                </span>
              </div>
            </div>
          )}

          {/* Scoped Summary Cards & Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left Col - Summary Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Card */}
              <Link 
                href="/client/progress"
                className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/30 hover:bg-gold/[0.02] flex items-center justify-between gap-3.5 transition-all duration-300 transform hover:-translate-y-0.5"
                data-tour="build-stage"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Current Build Stage</span>
                  <p className="text-base font-serif font-bold text-gradient-gold truncate">
                    {project.status}
                  </p>
                  <span className="text-[9px] text-gold/80 block font-semibold hover:text-gold/95">Track Progress &amp; Sign-off →</span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <FolderKanban size={15} className="text-gold" />
                </div>
              </Link>

              {/* Target Launch Card */}
              <div 
                className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 flex flex-col gap-3"
                data-tour="target-launch"
              >
                <div className="flex items-center justify-between gap-3.5">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Target Launch Date</span>
                    <p className="text-base font-serif font-bold text-foreground truncate">
                      {project.target_launch_date
                        ? new Date(project.target_launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Under Strategic Review'}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Calendar size={15} className="text-gold" />
                  </div>
                </div>
                <LaunchDateRequest projectId={project.id} currentDate={project.target_launch_date} />
              </div>

              {/* Last Update Card */}
              <Link
                href="/client/updates"
                className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/30 hover:bg-gold/[0.02] flex items-center justify-between gap-3.5 transition-all duration-300 transform hover:-translate-y-0.5"
                data-tour="latest-update"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Latest Team Update</span>
                  <p className="text-xs font-bold text-foreground truncate max-w-full">
                    {latestUpdate ? latestUpdate.title : 'Awaiting Transmission'}
                  </p>
                  {latestUpdate ? (
                    <span className="text-[9px] text-muted-foreground block font-mono">
                      Published {new Date(latestUpdate.created_at).toLocaleDateString('en-GB')}
                    </span>
                  ) : (
                    <span className="text-[9px] text-muted-foreground block">No updates yet</span>
                  )}
                </div>
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-gold" />
                </div>
              </Link>

              {/* Support Messages Card */}
              <Link
                href="/client/messages"
                className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/30 hover:bg-gold/[0.02] flex items-center justify-between gap-3.5 transition-all duration-300 transform hover:-translate-y-0.5"
                data-tour="messages-inbox"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Unread Messages</span>
                  <p className="text-base font-serif font-bold text-foreground truncate">
                    {unreadMessagesCount > 0 ? `${unreadMessagesCount} Inbound` : 'Secure Channel — Clear'}
                  </p>
                  <span className="text-[9px] text-gold/80 block font-semibold">Open Message Hub →</span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <MessageSquare size={15} className="text-gold" />
                </div>
              </Link>
            </div>

            {/* Right Col - Telemetry */}
            <div className="lg:col-span-1">
              <ProjectTelemetry project={project} />
            </div>
          </div>

          {/* Project Details & Status Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                {/* Minimal Milestone Summary Card */}
                <div className="p-4 rounded-xl border border-gold/15 bg-gold/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Active Phase</h3>
                    <p className="text-base font-serif font-bold text-foreground">{project.status}</p>
                    <p className="text-xxs text-muted-foreground leading-normal">
                      Review deliverables and sign off on completed engineering checkpoints.
                    </p>
                  </div>
                  <Link
                    href="/client/progress"
                    className="px-4 py-2 bg-gold/10 hover:bg-gold/15 border border-gold/25 rounded-xl text-xs font-semibold text-gold transition-all duration-300 shrink-0 text-center"
                  >
                    Track Progress &amp; Sign-off →
                  </Link>
                </div>

                {/* Provisioning terminal logs */}
                {(project.status === 'Discovery' || project.status === 'Design') && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <ProvisioningLogs />
                  </div>
                )}
              </div>

              {/* Staging Preview / Growth Telemetry container */}
              {project.status === 'Complete' ? (
                <GrowthTelemetry />
              ) : (project.status === 'Development' || project.status === 'Revision') ? (
                <StagingPreview 
                  previewUrl={project.preview_url || project.live_url || 'https://mercianwealth.com'} 
                  projectUpdates={projectUpdates} 
                />
              ) : null}
            </section>

            {/* Right Col - Quick Links / Support details */}
            <div className="space-y-6 sm:space-y-8">
              {/* Sync Call Card */}
              <section data-tour="sync-call" className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
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
                        href="/client/book"
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
                        href="/client/book"
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

              {/* Secure Asset Vault */}
              <div data-tour="asset-vault">
                <SecureVault />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
