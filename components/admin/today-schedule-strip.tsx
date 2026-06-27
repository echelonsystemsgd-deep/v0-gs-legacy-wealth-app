import Link from 'next/link'
import { CalendarClock, Clock } from 'lucide-react'

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
  const maxVisible = 4
  const visibleSessions = sessions.slice(0, maxVisible)
  const overflow = sessions.length - maxVisible

  return (
    <div className="flex items-center gap-3 flex-wrap px-4 py-3 glass rounded-2xl border border-gold/10">
      <div className="flex items-center gap-1.5 shrink-0">
        <CalendarClock size={14} className="text-gold" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Today
        </span>
      </div>

      <div className="h-3.5 w-px bg-gold/20 shrink-0" />

      {sessions.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No sessions scheduled today</p>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          {visibleSessions.map((session) => (
            <Link
              key={session.id}
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 hover:bg-gold/15 hover:border-gold/35 transition-all duration-200 group"
            >
              <Clock size={9} className="text-gold/70 group-hover:text-gold transition-colors" />
              <span className="text-[10px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                {formatTime(session.scheduled_at)}
              </span>
              {session.leads?.name && (
                <>
                  <span className="text-[10px] text-gold/40">·</span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground/70 transition-colors max-w-[100px] truncate">
                    {session.leads.name}
                  </span>
                </>
              )}
            </Link>
          ))}

          {overflow > 0 && (
            <Link
              href="/admin/bookings"
              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-gold/5 hover:border-gold/20 transition-all duration-200 text-[10px] font-semibold text-muted-foreground hover:text-gold"
            >
              +{overflow} more
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
