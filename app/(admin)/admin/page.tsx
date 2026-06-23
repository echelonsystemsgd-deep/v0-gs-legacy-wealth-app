import { createClient } from '@/lib/supabase/server'
import { Users, FolderKanban, Calendar, Sparkles, Activity, Clock, Plus, ExternalLink, PoundSterling, Info } from 'lucide-react'
import Link from 'next/link'
import { ActivityLogPanel } from '@/components/admin/activity-log-panel'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

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

  // Fetch financial aggregates from projects
  const { data: projectsFinancials } = await supabase
    .from('projects')
    .select('amount_paid, contract_value')

  const totalSales = projectsFinancials?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0
  const totalPipeline = projectsFinancials?.reduce((sum, p) => sum + ((Number(p.contract_value) - Number(p.amount_paid)) || 0), 0) || 0

  // Fetch recent activity logs (up to 20 for filtering)
  const { data: recentLogs } = await supabase
    .from('activity_logs')
    .select('id, action_type, target_table, created_at, profiles(full_name, role)')
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch recent payments joined with projects for name context
  const { data: recentPayments } = await supabase
    .from('payments')
    .select('id, amount, notes, status, created_at, projects(project_name)')
    .order('created_at', { ascending: false })
    .limit(4)

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
        {/* Total Sales Card */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 cursor-help">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Total Sales</span>
              <Info size={12} className="text-muted-foreground/45 hover:text-gold transition-colors shrink-0" />
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#0C0C0C]/95 border border-gold/20 rounded-xl text-[10px] text-muted-foreground leading-normal shadow-[0_4px_20px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none backdrop-blur-md">
                Sum of all client payments successfully processed and recorded in the system.
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{totalSales.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <PoundSterling size={16} className="text-gold sm:hidden" />
            <PoundSterling size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Active Pipeline Card */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 cursor-help">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Pipeline</span>
              <Info size={12} className="text-muted-foreground/45 hover:text-gold transition-colors shrink-0" />
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#0C0C0C]/95 border border-gold/20 rounded-xl text-[10px] text-muted-foreground leading-normal shadow-[0_4px_20px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none backdrop-blur-md">
                Outstanding contract balances for active projects (Total Contract Value minus Amount Paid).
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{totalPipeline.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-gold sm:hidden" />
            <Sparkles size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Leads Metric */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 cursor-help">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Total Leads</span>
              <Info size={12} className="text-muted-foreground/45 hover:text-gold transition-colors shrink-0" />
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#0C0C0C]/95 border border-gold/20 rounded-xl text-[10px] text-muted-foreground leading-normal shadow-[0_4px_20px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none backdrop-blur-md">
                Total number of potential clients who submitted inquiries through the website.
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{leadsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Users size={16} className="text-gold sm:hidden" />
            <Users size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Active Projects Metric */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 cursor-help">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Active Projects</span>
              <Info size={12} className="text-muted-foreground/45 hover:text-gold transition-colors shrink-0" />
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#0C0C0C]/95 border border-gold/20 rounded-xl text-[10px] text-muted-foreground leading-normal shadow-[0_4px_20px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none backdrop-blur-md">
                Number of client projects currently in progress (excluding completed or archived projects).
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{projectsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <FolderKanban size={16} className="text-gold sm:hidden" />
            <FolderKanban size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Active Bookings Metric */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 col-span-2 md:col-span-1 relative group">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 cursor-help">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Active Bookings</span>
              <Info size={12} className="text-muted-foreground/45 hover:text-gold transition-colors shrink-0" />
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#0C0C0C]/95 border border-gold/20 rounded-xl text-[10px] text-muted-foreground leading-normal shadow-[0_4px_20px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none backdrop-blur-md">
                Upcoming client and lead strategy sessions scheduled to take place.
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{sessionsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-gold sm:hidden" />
            <Calendar size={18} className="text-gold hidden sm:block" />
          </div>
        </div>
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
              href="/admin/leads"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Manage Leads <Plus size={12} />
            </Link>
            <Link
              href="/admin/projects"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Track Projects <Plus size={12} />
            </Link>
            <Link
              href="/admin/testimonials"
              className="w-full py-2.5 px-4 rounded-xl bg-background/50 hover:bg-gold/5 border border-gold/10 hover:border-gold/30 text-xs font-semibold text-foreground hover:text-gold transition-all duration-300 flex items-center justify-between"
            >
              Add Testimonial <Plus size={12} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
