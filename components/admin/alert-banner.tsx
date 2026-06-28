import Link from 'next/link'
import { AlertTriangle, MessageSquare, CheckSquare, Clock, Zap } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface AdminAlertBannerProps {
  unreadMessagesCount: number
  pendingApprovalsCount: number
  coldLeadsCount: number
  imminentSessionCount: number
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AdminAlertBanner({
  unreadMessagesCount,
  pendingApprovalsCount,
  coldLeadsCount,
  imminentSessionCount,
}: AdminAlertBannerProps) {
  // Determine highest-priority alert
  let alertMessage: string | null = null
  let alertLink = '/admin'
  let alertIcon = <AlertTriangle size={14} className="text-gold shrink-0" />

  if (unreadMessagesCount > 0) {
    alertMessage = `${unreadMessagesCount} unread client message${unreadMessagesCount > 1 ? 's' : ''} awaiting your response`
    alertLink = '/admin/messages'
    alertIcon = <MessageSquare size={14} className="text-gold shrink-0" />
  } else if (pendingApprovalsCount > 0) {
    alertMessage = `${pendingApprovalsCount} client submission${pendingApprovalsCount > 1 ? 's' : ''} awaiting your review`
    alertLink = '/admin/projects'
    alertIcon = <CheckSquare size={14} className="text-gold shrink-0" />
  } else if (coldLeadsCount > 0) {
    alertMessage = `${coldLeadsCount} new lead${coldLeadsCount > 1 ? 's' : ''} cold for 48+ hours — action required`
    alertLink = '/admin/leads?status=New'
    alertIcon = <AlertTriangle size={14} className="text-gold shrink-0" />
  } else if (imminentSessionCount > 0) {
    alertMessage = `${imminentSessionCount} strategy session${imminentSessionCount > 1 ? 's' : ''} starting within the hour`
    alertLink = '/admin/bookings'
    alertIcon = <Clock size={14} className="text-gold shrink-0" />
  }

  if (!alertMessage) return null

  return (
    <div className="flex items-center gap-3 px-4 py-3 glass rounded-2xl border border-gold/20 bg-gold/[0.03] animate-in slide-in-from-top-1 duration-300">
      {/* Pulsing dot */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
      </span>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        {alertIcon}
        <p className="text-xs text-foreground font-medium truncate">{alertMessage}</p>
      </div>

      <Link
        href={alertLink}
        className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors"
      >
        <Zap size={10} />
        Resolve
      </Link>
    </div>
  )
}
