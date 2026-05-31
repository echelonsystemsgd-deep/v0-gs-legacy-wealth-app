import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/admin/stat-card'
import {
  Users,
  FolderKanban,
  ImageIcon,
  MessageSquareQuote,
  TrendingUp,
  CheckCircle2,
  Inbox,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch all stats in parallel
  const [
    { count: totalLeads },
    { count: newLeads },
    { count: activeProjects },
    { count: completedProjects },
    { count: portfolioCount },
    { count: testimonialCount },
    { data: recentActivity },
    { data: upcomingSessions },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('is_archived', false),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'New').eq('is_archived', false),
    supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['Discovery', 'Design', 'Development', 'Revision']).eq('is_archived', false),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'Complete').eq('is_archived', false),
    supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('is_archived', false),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_archived', false),
    supabase.from('activity_logs').select('action_type, target_table, created_at').order('created_at', { ascending: false }).limit(6),
    supabase.from('strategy_sessions').select('id, scheduled_at, status, leads(name, business_name)').eq('status', 'Scheduled').gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(4),
  ])

  // Leads this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const { count: leadsThisMonth } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
    .eq('is_archived', false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Overview</p>
        <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={totalLeads ?? 0}
          icon={<Users size={18} />}
          accentColor="gold"
        />
        <StatCard
          label="New Leads"
          value={newLeads ?? 0}
          icon={<Inbox size={18} />}
          accentColor="gold"
          trend="Awaiting follow-up"
        />
        <StatCard
          label="Leads This Month"
          value={leadsThisMonth ?? 0}
          icon={<TrendingUp size={18} />}
          accentColor="green"
          trendUp
        />
        <StatCard
          label="Active Projects"
          value={activeProjects ?? 0}
          icon={<FolderKanban size={18} />}
          accentColor="blue"
        />
        <StatCard
          label="Completed Projects"
          value={completedProjects ?? 0}
          icon={<CheckCircle2 size={18} />}
          accentColor="green"
        />
        <StatCard
          label="Portfolio Items"
          value={portfolioCount ?? 0}
          icon={<ImageIcon size={18} />}
          accentColor="gold"
        />
        <StatCard
          label="Testimonials"
          value={testimonialCount ?? 0}
          icon={<MessageSquareQuote size={18} />}
          accentColor="gold"
        />
        <StatCard
          label="Sessions Booked"
          value={upcomingSessions?.length ?? 0}
          icon={<Calendar size={18} />}
          accentColor="blue"
          trend="Upcoming"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground">Upcoming Sessions</h2>
            <Link href="/admin/leads" className="text-xs text-gold hover:text-gold-light transition-colors">
              View All Leads →
            </Link>
          </div>
          {!upcomingSessions || upcomingSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar size={32} className="text-gold/20 mb-3" />
              <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session: any) => (
                <div key={session.id} className="flex items-start gap-3 p-3 rounded-xl bg-background/40 border border-gold/8">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Calendar size={14} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {session.leads?.name ?? 'Unknown Lead'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.leads?.business_name} ·{' '}
                      {new Date(session.scheduled_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground">Recent Activity</h2>
            <Link href="/admin/logs" className="text-xs text-gold hover:text-gold-light transition-colors">
              View All Logs →
            </Link>
          </div>
          {!recentActivity || recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users size={32} className="text-gold/20 mb-3" />
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((log: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground font-medium truncate">
                      {log.action_type.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                    </p>
                    <p className="text-xxs text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
