import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Users, FolderKanban, Calendar, Sparkles, Activity, Clock, Plus, ExternalLink, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
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

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch real database metrics
  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { count: sessionsCount } = await supabase
    .from('strategy_sessions')
    .select('*', { count: 'exact', head: true })

  // Fetch financial aggregates from projects
  const { data: projectsFinancials } = await supabase
    .from('projects')
    .select('amount_paid, contract_value')

  const totalSales = projectsFinancials?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0
  const totalPipeline = projectsFinancials?.reduce((sum, p) => sum + ((Number(p.contract_value) - Number(p.amount_paid)) || 0), 0) || 0

  // Fetch recent activity logs
  const { data: recentLogs } = await supabase
    .from('activity_logs')
    .select('id, action_type, target_table, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(4)

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
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
            <Sparkles size={12} className="animate-pulse" /> Commander Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor leads, track project progress, and manage website content.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-semibold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300 w-full sm:w-fit"
        >
          View Public Site <ExternalLink size={12} />
        </Link>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
        {/* Total Sales Card */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Total Sales</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <DollarSign size={16} className="text-gold sm:hidden" />
            <DollarSign size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Active Pipeline Card */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Pipeline</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              ${totalPipeline.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-gold sm:hidden" />
            <Sparkles size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Leads Metric */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Total Leads</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{leadsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <Users size={16} className="text-gold sm:hidden" />
            <Users size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Active Projects Metric */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Active Projects</span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">{projectsCount ?? 0}</p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <FolderKanban size={16} className="text-gold sm:hidden" />
            <FolderKanban size={18} className="text-gold hidden sm:block" />
          </div>
        </div>

        {/* Strategy Sessions Metric */}
        <div className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 col-span-2 md:col-span-1">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Sessions</span>
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
        {/* Recent Activity Timeline */}
        <section className="p-4 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4 sm:space-y-6">
          <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
            <Activity size={16} className="text-gold" /> System Activity
          </h2>

          <div className="relative border-l border-gold/15 pl-3.5 ml-1.5 space-y-6">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="relative space-y-1">
                  <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-gold border border-[#050505]" />
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-xs font-semibold text-foreground">
                      {log.action_type} on <span className="text-gold capitalize">{log.target_table}</span>
                    </p>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-mono shrink-0">
                      <Clock size={9} /> {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    By: {(Array.isArray(log.profiles) ? log.profiles[0]?.full_name : (log.profiles as any)?.full_name) || 'System Auto'}
                  </p>
                </div>
              ))
            ) : (
              <div className="relative py-4 text-center">
                <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-gold/50 border border-[#050505]" />
                <p className="text-xs text-muted-foreground">No recent activity found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Sales / Transactions Panel */}
        <section className="p-4 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4 sm:space-y-6">
          <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
            <DollarSign size={16} className="text-gold" /> Recent Sales
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
                      +${Number(payment.amount).toLocaleString('en-US')}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-green-400 font-bold mt-0.5">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recent transactions logged.
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
