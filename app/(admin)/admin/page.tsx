import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Users, FolderKanban, Calendar, Sparkles, Activity, Clock, Plus, ExternalLink } from 'lucide-react'
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

  // Fetch recent activity logs
  const { data: recentLogs } = await supabase
    .from('activity_logs')
    .select('id, action_type, target_table, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="space-y-10 relative">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
            <Sparkles size={12} className="animate-pulse" /> Commander Overview
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor leads, track project progress, and manage website content.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300 w-fit"
        >
          View Public Site <ExternalLink size={12} />
        </Link>
      </div>

      {/* Metrics Row */}
      <section className="grid sm:grid-cols-3 gap-6">
        {/* Leads Metric */}
        <div className="p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Total Leads</span>
            <p className="text-3xl font-serif font-bold text-foreground">{leadsCount ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Users size={20} className="text-gold" />
          </div>
        </div>

        {/* Active Projects Metric */}
        <div className="p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Active Projects</span>
            <p className="text-3xl font-serif font-bold text-foreground">{projectsCount ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <FolderKanban size={20} className="text-gold" />
          </div>
        </div>

        {/* Strategy Sessions Metric */}
        <div className="p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-300 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Booked Sessions</span>
            <p className="text-3xl font-serif font-bold text-foreground">{sessionsCount ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Calendar size={20} className="text-gold" />
          </div>
        </div>
      </section>

      {/* Main Grid: Activity & Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Activity Timeline */}
        <section className="md:col-span-2 p-6 glass rounded-2xl border border-gold/10 space-y-6">
          <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
            <Activity size={16} className="text-gold" /> System Activity
          </h2>

          <div className="relative border-l border-gold/15 pl-4 ml-2 space-y-6">
            {recentLogs && recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold border border-[#050505]" />
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm font-semibold text-foreground">
                      {log.action_type} on <span className="text-gold capitalize">{log.target_table}</span>
                    </p>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock size={10} /> {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Performed by: {log.profiles?.full_name || 'System Auto'}
                  </p>
                </div>
              ))
            ) : (
              <div className="relative py-4 text-center">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold/50 border border-[#050505]" />
                <p className="text-xs text-muted-foreground">No recent system activity found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="p-6 glass rounded-2xl border border-gold/10 space-y-6 flex flex-col justify-between">
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
