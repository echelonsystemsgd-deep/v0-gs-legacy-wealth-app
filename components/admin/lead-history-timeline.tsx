'use client'

import { Clock, Calendar, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'

type TimelineEvent = {
  id: string
  title: string
  timestamp: string
  description?: string | null
  type: 'session' | 'status_change' | 'note' | 'system'
  status?: string
}

interface LeadHistoryTimelineProps {
  events: TimelineEvent[]
}

export function LeadHistoryTimeline({ events }: LeadHistoryTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type'], status?: string) => {
    switch (type) {
      case 'session':
        if (status === 'Completed') return <CheckCircle2 size={13} className="text-green-400" />
        if (status === 'Canceled') return <AlertCircle size={13} className="text-red-400" />
        return <Calendar size={13} className="text-gold" />
      case 'note':
        return <MessageSquare size={13} className="text-blue-400" />
      default:
        return <Clock size={13} className="text-muted-foreground/60" />
    }
  }

  return (
    <div className="relative border-l border-gold/15 pl-4 ml-2 space-y-5 py-2">
      {events.length === 0 ? (
        <div className="text-center py-4 text-xs text-muted-foreground">No events recorded.</div>
      ) : (
        events.map((event) => (
          <div key={event.id} className="relative space-y-1">
            {/* Timeline bullet dot */}
            <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-background border border-gold/30 flex items-center justify-center">
              {getEventIcon(event.type, event.status)}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">{event.title}</span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(event.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {event.description && (
              <p className="text-xs text-muted-foreground leading-relaxed italic bg-white/2 rounded-lg p-2.5 border border-gold/5">
                &ldquo;{event.description}&rdquo;
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
