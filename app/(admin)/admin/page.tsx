import { createClient } from '@/lib/supabase/server'
import { Users, FolderKanban, Calendar, Sparkles, Activity, Clock, Plus, ExternalLink, PoundSterling, Info, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { ActivityLogPanel } from '@/components/admin/activity-log-panel'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ modal?: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const showSalesModal = resolvedParams.modal === 'sales'
  const showPipelineModal = resolvedParams.modal === 'pipeline'

  // Fetch real database metrics
  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  // Fetch active bookings (status = 'Scheduled')
  const { count: sessionsCount } = await supabase
    .from('strategy_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Scheduled')

  // Fetch financial aggregates and details from projects (exclude archived)
  const { data: projectsFinancials } = await supabase
    .from('projects')
    .select('id, project_name, client_name, status, amount_paid, contract_value')
    .eq('is_archived', false)

  const totalSales = projectsFinancials?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0
  const totalPipeline = projectsFinancials?.reduce((sum, p) => sum + ((Number(p.contract_value) - Number(p.amount_paid)) || 0), 0) || 0

  // Fetch recent activity logs (up to 20 for filtering)
  const { data: recentLogs } = await supabase
    .from('activity_logs')
    .select('id, action_type, target_table, created_at, profiles(full_name, role)')
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch recent payments joined with projects for name context (10 if sales modal is open, else 4)
  const { data: recentPayments } = await supabase
    .from('payments')
    .select('id, amount, notes, status, created_at, projects(project_name)')
    .order('created_at', { ascending: false })
    .limit(showSalesModal ? 10 : 4)

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold/80 uppercase">
            <Sparkles size={12} className="animate-pulse" /> Operations Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Command Center</h1>
          <p className="text-sm text-muted-foreground">
            Live pipeline telemetry, transactional logs, and system controls.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300 w-full sm:w-fit cursor-pointer"
          >
            View Public Site <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
        {/* Total Sales (Capital Realised) Card */}
        <Link
          href="?modal=sales"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Capital Realised</span>
              <Info size={11} className="text-muted-foreground/45 group-hover:text-gold transition-colors shrink-0" />
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{totalSales.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <PoundSterling size={18} className="text-gold" />
          </div>
        </Link>

        {/* Pipeline (Projected Value) Card */}
        <Link
          href="?modal=pipeline"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Projected Value</span>
              <Info size={11} className="text-muted-foreground/45 group-hover:text-gold transition-colors shrink-0" />
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{totalPipeline.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <Sparkles size={18} className="text-gold" />
          </div>
        </Link>

        {/* Total Leads (Inbound Pipelines) Card */}
        <Link
          href="/admin/leads"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">Inbound Pipelines</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{leadsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <Users size={18} className="text-gold" />
          </div>
        </Link>

        {/* Active Projects (Active Mandates) Card */}
        <Link
          href="/admin/projects"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">Active Mandates</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{projectsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <FolderKanban size={18} className="text-gold" />
          </div>
        </Link>

        {/* Active Bookings (Scheduled Briefings) Card */}
        <Link
          href="/admin/bookings"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 col-span-2 md:col-span-1 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">Scheduled Briefings</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{sessionsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <Calendar size={18} className="text-gold" />
          </div>
        </Link>
      </section>

      {/* Main Grid: Activity, Transactions & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Filterable Activity Log Panel */}
        <ActivityLogPanel initialLogs={recentLogs} />

        {/* Recent Sales / Transactions Panel */}
        <section className="p-4 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4 sm:space-y-6">
          <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
            <PoundSterling size={16} className="text-gold" /> Recent Sales
          </h2>

          <div className="divide-y divide-gold/10">
            {recentPayments && recentPayments.length > 0 ? (
              (recentPayments as any[]).map((payment) => (
                <div key={payment.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 transition-all hover:bg-white/[0.01]">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {payment.projects?.project_name || 'Custom Project'}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {payment.notes || 'Milestone payment'}
                    </p>
                    <p className="text-[9px] text-gold/60 font-mono mt-0.5">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-serif font-bold text-gold flex items-center gap-1 justify-end">
                      <span className="w-1.2 h-1.2 rounded-full bg-green-500 animate-pulse shrink-0" />
                      +£{Number(payment.amount).toLocaleString('en-GB')}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-green-400 font-bold mt-0.5">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center px-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No transactions recorded yet. Revenue logs will populate automatically as project milestones are completed and payments are processed.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="p-4 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4 sm:space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Common management shortlinks.</p>
          </div>

          <div className="space-y-2 mt-4 flex-1 flex flex-col justify-end">
            <Link
              href="/admin/projects?create=true"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Deploy Client Mandate <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/admin/leads?status=New"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Assess CRM Pipeline <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/admin/bookings?schedule=true"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Initiate Strategic Call <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/admin/projects"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Verify Phase Approvals <ArrowUpRight size={12} />
            </Link>
          </div>
        </section>
      </div>

      {/* Sales Modal */}
      {showSalesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass border border-gold/25 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground">Capital Realised Breakdown</h3>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm cursor-pointer p-1 rounded-lg hover:bg-white/5">&times;</Link>
            </div>
            
            <div className="divide-y divide-gold/10">
              {recentPayments && recentPayments.length > 0 ? (
                (recentPayments as any[]).map((payment) => (
                  <div key={payment.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {payment.projects?.project_name || 'Custom Project'}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {payment.notes || 'Milestone payment'}
                      </p>
                      <p className="text-[9px] text-gold/60 font-mono mt-0.5">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-serif font-bold text-gold">
                        +£{Number(payment.amount).toLocaleString('en-GB')}
                      </span>
                      <span className="block text-[8px] uppercase tracking-wider text-green-400 font-bold mt-0.5">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-muted-foreground">No payments recorded yet.</p>
              )}
            </div>
            
            <div className="flex justify-end pt-2">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Close Breakdown
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Modal */}
      {showPipelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl glass border border-gold/25 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground">Active Projects Pipeline</h3>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm cursor-pointer p-1 rounded-lg hover:bg-white/5">&times;</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gold/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
                    <th className="py-3 px-4">Project Name</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Contract Value</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4 text-right font-bold text-gold">Unpaid Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {projectsFinancials && projectsFinancials.length > 0 ? (
                    projectsFinancials.map((p) => {
                      const balance = (Number(p.contract_value) || 0) - (Number(p.amount_paid) || 0)
                      return (
                        <tr key={p.id} className="hover:bg-white/[0.01]">
                          <td className="py-3 px-4 font-semibold text-foreground">{p.project_name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{p.client_name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-gold/5 border border-gold/20 text-[9px] font-bold text-gold">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">£{(Number(p.contract_value) || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">£{(Number(p.amount_paid) || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 font-mono text-right font-bold text-gold">£{balance.toLocaleString()}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">No active mandates telemetry.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end pt-2">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Close Pipeline
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
