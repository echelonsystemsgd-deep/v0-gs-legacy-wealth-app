'use client'

import Link from 'next/link'
import { CalendarClock, Clock, ArrowRight } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

type Session = {
  id: string
  scheduled_at: string
  leads: { name: string } | null
}

interface TodayScheduleStripProps {
  sessions: Session[]
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

// ── Component ──────────────────────────────────────────────────────────────────

export function TodayScheduleStrip({ sessions }: TodayScheduleStripProps) {
  return (
    <section className="p-4 sm:p-5 glass rounded-2xl border border-gold/10 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gold/10 pb-3">
        <div className="flex items-center gap-2">
          <CalendarClock size={16} className="text-gold shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Today's Briefings
          </h2>
        </div>
        {sessions.length > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-[9px] font-bold text-gold uppercase tracking-wider">
            {sessions.length} Scheduled
          </span>
        )}
      </div>

      {/* Content */}
      {sessions.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-xs text-muted-foreground italic">No strategy sessions scheduled for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-gold/10 hover:border-gold/35 transition-all duration-300 flex flex-col justify-between gap-3 group relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gold font-mono text-[10px] font-semibold">
                  <Clock size={11} />
                  <span>{formatTime(session.scheduled_at)}</span>
                </div>
                <h3 className="text-xs font-bold text-foreground mt-1 truncate group-hover:text-gold transition-colors">
                  {session.leads?.name || 'Private Briefing'}
                </h3>
                <p className="text-[10px] text-muted-foreground">Strategy Consultation Call</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                <span className="text-[8px] uppercase tracking-widest text-gold/60 font-bold">
                  Briefing Room
                </span>
                <Link
                  href="/admin/bookings"
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors group/link"
                >
                  Join Call <ArrowRight size={10} className="transform group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
