'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Key, Eye, Clock, User, ShieldAlert, ChevronDown, Check, Loader2, RefreshCw, Search
} from 'lucide-react'

type ActivityLog = {
  id: string; action_type: string; target_table: string | null; target_id: string | null
  details: any; created_at: string
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

type LoginRecord = {
  id: string; ip_address: string | null; user_agent: string | null; logged_at: string
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

export default function LogsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'activity' | 'logins'>('activity')
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [logins, setLogins] = useState<LoginRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [inspectLog, setInspectLog] = useState<ActivityLog | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchData = useCallback(async () => {
    setLoading(true)
    if (activeTab === 'activity') {
      let query = supabase
        .from('activity_logs')
        .select('id, action_type, target_table, target_id, details, created_at, profiles(full_name, avatar_url)')

      if (searchQuery) {
        query = query.or(`action_type.ilike.%${searchQuery}%,target_table.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
      if (error) showToast(`Error fetching logs: ${error.message}`)
      setActivities((data as any) ?? [])
    } else {
      let query = supabase
        .from('login_history')
        .select('id, ip_address, user_agent, logged_at, profiles(full_name, avatar_url)')

      if (searchQuery) {
        query = query.or(`ip_address.ilike.%${searchQuery}%,user_agent.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.order('logged_at', { ascending: false }).limit(100)
      if (error) showToast(`Error fetching logins: ${error.message}`)
      setLogins((data as any) ?? [])
    }
    setLoading(false)
  }, [activeTab, searchQuery, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatUserAgent = (ua: string | null) => {
    if (!ua) return 'Unknown Browser'
    if (ua.includes('Firefox')) return 'Mozilla Firefox'
    if (ua.includes('Chrome') && !ua.includes('Chromium')) return 'Google Chrome'
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari'
    if (ua.includes('Edge')) return 'Microsoft Edge'
    if (ua.includes('Postman')) return 'Postman Runtime'
    return ua.split(' ')[0] || 'Web Browser'
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2">
          <Check size={14} /> {toast}
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Audit</p>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit system modifications, database actions, and user login vectors.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-gold/15 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white/5 border border-gold/15 text-muted-foreground hover:text-foreground transition-all"
            title="Refresh log metrics"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => { setActiveTab('activity'); setSearchQuery('') }}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'activity'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText size={14} /> Activity Stream
        </button>
        <button
          onClick={() => { setActiveTab('logins'); setSearchQuery('') }}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'logins'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Key size={14} /> Auth Sign-Ins
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Retrieving security records...</p>
        </div>
      ) : activeTab === 'activity' ? (
        <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground">Console Activity History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Target Space</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No operations recorded in this filter.</td>
                  </tr>
                ) : (
                  activities.map((act) => (
                    <tr key={act.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                          {act.profiles?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={act.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User size={12} className="text-gold" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground text-xs">{act.profiles?.full_name || 'System Auto'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-gold/5 border border-gold/15 text-xxs font-bold text-gold">{act.action_type}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-muted-foreground text-xs">{act.target_table || '—'} {act.target_id ? `(${act.target_id.slice(0, 8)})` : ''}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} />
                          <span>{new Date(act.created_at).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {act.details ? (
                          <button
                            onClick={() => setInspectLog(act)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-gold/15 hover:border-gold/30 text-xxs font-semibold text-gold transition-all"
                          >
                            <Eye size={10} /> Inspect
                          </button>
                        ) : (
                          <span className="text-xxs text-muted-foreground">No meta</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground">Authentication Attempts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Vector Agent</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {logins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">No authenticated sign-ins recorded.</td>
                  </tr>
                ) : (
                  logins.map((log) => (
                    <tr key={log.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                          {log.profiles?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={log.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User size={12} className="text-gold" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground text-xs">{log.profiles?.full_name || 'Legacy Admin'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gold/80">{log.ip_address || '—'}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground" title={log.user_agent || ''}>
                        {formatUserAgent(log.user_agent)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} />
                          <span>{new Date(log.logged_at).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl border border-gold/15 p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-foreground">Inspect Event Metadata</h3>
              <button onClick={() => setInspectLog(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
            </div>
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs border-b border-gold/5 pb-2">
                <span className="text-muted-foreground uppercase">Action Type</span>
                <span className="text-gold font-semibold">{inspectLog.action_type}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-gold/5 pb-2">
                <span className="text-muted-foreground uppercase">Target Table</span>
                <span className="text-foreground">{inspectLog.target_table || 'None'}</span>
              </div>
              {inspectLog.target_id && (
                <div className="flex justify-between text-xs border-b border-gold/5 pb-2">
                  <span className="text-muted-foreground uppercase">Target ID</span>
                  <span className="text-foreground font-mono text-[10px]">{inspectLog.target_id}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground uppercase block">Raw JSON Details</span>
                <pre className="p-4 bg-background/80 border border-gold/10 rounded-xl font-mono text-[10px] text-muted-foreground overflow-auto max-h-48 scrollbar-none">
                  {JSON.stringify(inspectLog.details, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 rounded-xl border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
