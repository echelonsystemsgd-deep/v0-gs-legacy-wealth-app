'use client'

import { useState } from 'react'
import { Activity, Clock, Shield, User } from 'lucide-react'

type Profile = {
  full_name: string | null
  role: 'admin' | 'user' | 'client' | null
}

type ActivityLog = {
  id: string
  action_type: string
  target_table: string | null
  created_at: string
  profiles: Profile | Profile[] | null
}

interface ActivityLogPanelProps {
  initialLogs: ActivityLog[] | null
}

export function ActivityLogPanel({ initialLogs }: ActivityLogPanelProps) {
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all')

  const getProfileInfo = (log: ActivityLog) => {
    const profile = Array.isArray(log.profiles) ? log.profiles[0] : log.profiles
    return {
      fullName: profile?.full_name || 'System Auto',
      role: profile?.role || 'system'
    }
  }

  const filteredLogs = (initialLogs || []).filter((log) => {
    if (filter === 'all') return true
    const { role } = getProfileInfo(log)
    if (filter === 'admin') {
      return role === 'admin'
    }
    // 'user' filter includes client and user roles, and system events
    return role === 'client' || role === 'user' || role === 'system'
  })

  return (
    <section className="p-4 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4 sm:space-y-6 flex flex-col h-full">
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-3">
        <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
          <Activity size={16} className="text-gold" /> System Activity
        </h2>
        
        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-[#0A0A0A]/60 p-1 rounded-xl border border-gold/10 self-start 2xl:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-gold/10 text-gold border border-gold/25'
                : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all flex items-center gap-1 ${
              filter === 'admin'
                ? 'bg-gold/10 text-gold border border-gold/25'
                : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
          >
            <Shield size={10} /> Admin
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all flex items-center gap-1 ${
              filter === 'user'
                ? 'bg-gold/10 text-gold border border-gold/25'
                : 'text-muted-foreground hover:text-foreground border border-transparent'
            }`}
          >
            <User size={10} /> Users/Client
          </button>
        </div>
      </div>

      <div className="relative border-l border-gold/15 pl-3.5 ml-1.5 space-y-6 flex-1 overflow-y-auto max-h-[350px] scrollbar-thin">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const { fullName, role } = getProfileInfo(log)
            return (
              <div key={log.id} className="relative space-y-1 group">
                {/* Timeline node */}
                <div className={`absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full border border-[#050505] transition-all duration-300 ${
                  role === 'admin'
                    ? 'bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                    : role === 'system'
                    ? 'bg-muted-foreground/40'
                    : 'bg-blue-400'
                }`} />
                
                <div className="flex justify-between items-start gap-3">
                  <p className="text-xs font-semibold text-foreground">
                    {log.action_type} on <span className="text-gold capitalize">{log.target_table || 'system'}</span>
                  </p>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-mono shrink-0">
                    <Clock size={9} /> {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>By: {fullName}</span>
                  {role !== 'system' && (
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      role === 'admin'
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {role}
                    </span>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="relative py-4 text-left pl-1">
            <div className="absolute -left-[18.5px] top-2.5 w-2.5 h-2.5 rounded-full bg-gold/30 border border-[#050505] animate-pulse" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              No activity logs match the selected filter.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
