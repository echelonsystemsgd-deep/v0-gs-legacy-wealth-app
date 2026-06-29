import { createClient } from '@/lib/supabase/server'
import { Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ActivityLogPanel } from '@/components/admin/activity-log-panel'
import { AdminKpiRow } from '@/components/admin/kpi-row'
import { AdminAlertBanner } from '@/components/admin/alert-banner'
import { TodayScheduleStrip } from '@/components/admin/today-schedule-strip'
import { ClientHealthGrid } from '@/components/admin/client-health-grid'
import { AttentionPanel } from '@/components/admin/attention-panel'
import { TransactionsFeed } from '@/components/admin/transactions-feed'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  const adminId = adminUser?.id

  // ── DB Queries (all server-side) ──────────────────────────────────────────

  // KPI counts
  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  const { count: sessionsCount } = await supabase
    .from('strategy_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Scheduled')

  // Projects: one query covers financials + active projects list
  const { data: projectsFinancials } = await supabase
    .from('projects')
    .select('id, project_name, client_name, client_id, status, updated_at, amount_paid, contract_value, contract_type, retainer_amount')
    .eq('is_archived', false)
    .order('updated_at', { ascending: false })

  // Financials derived from a single projects query
  const totalSales = projectsFinancials?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0
  const totalPipeline = projectsFinancials?.reduce((sum, p) => sum + ((Number(p.contract_value) - Number(p.amount_paid)) || 0), 0) || 0
  const totalContractValue = projectsFinancials?.reduce((sum, p) => sum + (Number(p.contract_value) || 0), 0) || 0
  const projectedMRR = projectsFinancials?.reduce((sum, p) => sum + (p.contract_type === 'retainer' ? (Number(p.retainer_amount) || 0) : 0), 0) || 0
  // Project count derived — no separate query needed
  const projectsCount = projectsFinancials?.length ?? 0

  // Activity + payments
  const { data: recentLogs } = await supabase
    .from('activity_logs')
    .select('id, action_type, target_table, created_at, profiles(full_name, role)')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: recentPayments } = await supabase
    .from('payments')
    .select('id, amount, notes, status, created_at, projects(project_name)')
    .order('created_at', { ascending: false })
    .limit(10)

  // Client avatars (batch fetch by client_id)
  const clientIds = (projectsFinancials || [])
    .map((p) => p.client_id)
    .filter((id): id is string => !!id)

  const { data: clientProfiles } = clientIds.length > 0
    ? await supabase.from('profiles').select('id, avatar_url').in('id', clientIds)
    : { data: [] }

  const clientAvatarMap: Record<string, string | null> = {}
  for (const cp of clientProfiles || []) {
    clientAvatarMap[cp.id] = cp.avatar_url || null
  }

  // Client messages (exclude admin's own — those are replies, not unread)
  const { data: clientMessages } = adminId
    ? await supabase.from('messages').select('id, project_id, sender_id, created_at').neq('sender_id', adminId)
    : await supabase.from('messages').select('id, project_id, sender_id, created_at')

  // Active action requests (pending + submitted)
  const { data: activeActionRequests } = await supabase
    .from('project_action_requests')
    .select('id, project_id, title, description, status, client_response, submitted_at, created_at')
    .in('status', ['pending', 'submitted'])

  // Cold leads (New status, 48h+ old)
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  const { count: coldLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'New')
    .eq('is_archived', false)
    .lt('created_at', fortyEightHoursAgo)

  // Today's sessions
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const { data: todaySessions } = await supabase
    .from('strategy_sessions')
    .select('id, scheduled_at, leads(name)')
    .eq('status', 'Scheduled')
    .gte('scheduled_at', todayStart.toISOString())
    .lte('scheduled_at', todayEnd.toISOString())
    .order('scheduled_at', { ascending: true })

  // Imminent sessions (next 60 min) — for alert banner only
  const { count: imminentSessionCount } = await supabase
    .from('strategy_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .lte('scheduled_at', new Date(Date.now() + 60 * 60 * 1000).toISOString())

  // ── Derived Data (single pass over messages) ──────────────────────────────

  const unreadByProject: Record<string, number> = {}
  const lastMessageByProject: Record<string, string> = {}

  for (const msg of clientMessages || []) {
    unreadByProject[msg.project_id] = (unreadByProject[msg.project_id] || 0) + 1
    if (!lastMessageByProject[msg.project_id] || msg.created_at > lastMessageByProject[msg.project_id]) {
      lastMessageByProject[msg.project_id] = msg.created_at
    }
  }

  // Group action requests by project
  const requestsByProject: Record<string, any[]> = {}
  for (const req of activeActionRequests || []) {
    if (!requestsByProject[req.project_id]) {
      requestsByProject[req.project_id] = []
    }
    requestsByProject[req.project_id].push(req)
  }

  // Build client health cards from the single projects query
  const clientHealthData = (projectsFinancials || []).map((project) => {
    const unreadCount = unreadByProject[project.id] || 0
    const lastMsgDate = lastMessageByProject[project.id]
    const daysSinceLastMessage = lastMsgDate
      ? Math.floor((Date.now() - new Date(lastMsgDate).getTime()) / (1000 * 60 * 60 * 24))
      : null

    const projRequests = requestsByProject[project.id] || []

    return {
      id: project.id,
      project_name: project.project_name,
      client_name: project.client_name,
      status: project.status,
      client_id: project.client_id,
      updated_at: project.updated_at,
      unreadMessageCount: unreadCount,
      daysSinceLastMessage,
      clientAvatarUrl: project.client_id ? (clientAvatarMap[project.client_id] ?? null) : null,
      actionRequests: projRequests,
    }
  })

  // Totals for alert banner + attention panel
  // We count only submitted actions (admin needs to review) for admin alerts
  const totalUnreadMessages = Object.values(unreadByProject).reduce((a, b) => a + b, 0)
  const totalSubmittedActionRequests = (activeActionRequests || []).filter((req) => req.status === 'submitted').length
  const hasAlerts = totalUnreadMessages > 0 || totalSubmittedActionRequests > 0 || (coldLeadsCount ?? 0) > 0 || (imminentSessionCount ?? 0) > 0

  // Normalise today sessions type (Supabase may return leads as array)
  type TodaySession = { id: string; scheduled_at: string; leads: { name: string } | null }
  const safeTodaySessions: TodaySession[] = (todaySessions || []).map((s) => ({
    id: s.id,
    scheduled_at: s.scheduled_at,
    leads: Array.isArray(s.leads) ? (s.leads[0] || null) : (s.leads as { name: string } | null),
  }))

  // KPI row financials need the original shape (without new fields)
  const kpiFinancials = (projectsFinancials || []).map(({ id, project_name, client_name, status, amount_paid, contract_value }) => ({
    id, project_name, client_name, status, amount_paid, contract_value,
  }))

  // Normalise recent payments type (projects relation might return array)
  const safePayments = (recentPayments || []).map((p) => ({
    id: p.id,
    amount: p.amount,
    notes: p.notes,
    status: p.status,
    created_at: p.created_at,
    projects: Array.isArray(p.projects) 
      ? (p.projects[0] || null) 
      : (p.projects as { project_name: string } | null),
  }))

  return (
    <div className="space-y-6 sm:space-y-8 relative">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold/80 uppercase">
            <Sparkles size={12} className="animate-pulse" /> Operations Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Live pipeline telemetry, transactional logs, and system controls.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300 self-end sm:self-center"
        >
          View Public Site <ExternalLink size={12} />
        </Link>
      </div>

      {/* ── Alert Banner (shows only when there is something urgent) ─────────── */}
      {hasAlerts && (
        <AdminAlertBanner
          unreadMessagesCount={totalUnreadMessages}
          pendingApprovalsCount={totalSubmittedActionRequests}
          coldLeadsCount={coldLeadsCount ?? 0}
          imminentSessionCount={imminentSessionCount ?? 0}
        />
      )}

      {/* ── KPI Row ───────────────────────────────────────────────────────────── */}
      <AdminKpiRow
        totalSales={totalSales}
        totalPipeline={totalPipeline}
        projectedMRR={projectedMRR}
        leadsCount={leadsCount}
        projectsCount={projectsCount}
        sessionsCount={sessionsCount}
        projectsFinancials={kpiFinancials}
        recentPayments={safePayments}
      />

      {/* ── Today's Schedule Strip ───────────────────────────────────────────── */}
      <TodayScheduleStrip sessions={safeTodaySessions} />

      {/* ── Main Grid: Client Health + Right Sidebar ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClientHealthGrid clients={clientHealthData} maxItems={3} showViewAll />
        </div>
        <div className="space-y-6">
          <AttentionPanel
            unreadMessagesCount={totalUnreadMessages}
            pendingApprovalsCount={totalSubmittedActionRequests}
            coldLeadsCount={coldLeadsCount ?? 0}
            todaySessionCount={safeTodaySessions.length}
          />
          <TransactionsFeed
            payments={safePayments}
            totalCollected={totalSales}
            totalContractValue={totalContractValue}
          />
        </div>
      </div>

      {/* ── Activity Log ─────────────────────────────────────────────────────── */}
      <ActivityLogPanel initialLogs={recentLogs} />
    </div>
  )
}
