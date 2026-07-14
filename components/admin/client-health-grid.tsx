'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Users,
  MessageSquare,
  CheckSquare,
  Clock,
  Plus,
  AlertTriangle,
  X,
  CheckCircle2,
  ExternalLink,
  Lock,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

export type ProjectWithHealth = {
  id: string
  project_name: string
  client_name: string
  status: string
  client_id: string | null
  updated_at: string
  unreadMessageCount: number
  daysSinceLastMessage: number | null
  clientAvatarUrl: string | null
  is_suspended?: boolean
  actionRequests: Array<{
    id: string
    title: string
    description: string
    status: 'pending' | 'submitted' | 'completed'
    client_response: string | null
    submitted_at: string | null
    created_at: string
  }>
}

interface ClientHealthGridProps {
  clients: ProjectWithHealth[]
  /** If set, limits how many cards are shown (sorted by urgency). Dashboard uses 3. */
  maxItems?: number
  /** When true, shows a "View All" link to /admin/clients */
  showViewAll?: boolean
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStageBadge(status: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    Discovery: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/25' },
    Design: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/25' },
    Development: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25' },
    Revision: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/25' },
    Complete: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/25' },
  }
  return map[status] || { bg: 'bg-gold/10', text: 'text-gold', border: 'border-gold/25' }
}

function getHealthBorder(project: ProjectWithHealth): string {
  const label = getHealthLabel(project)
  if (label === 'Blocked') return 'border-l-red-500'
  if (label === 'Suspended') return 'border-l-zinc-500'
  if (label === 'Awaiting Client') return 'border-l-amber-400'
  return 'border-l-green-500'
}

/**
 * Health Logic:
 * - Suspended (Zinc): Client's portal is explicitly suspended/frozen.
 * - Blocked / Stale (Red): Unread client messages older than 24 hours (daysSinceLastMessage >= 1)
 *   OR client has been inactive for a stage-aware threshold (Discovery/Design: 3 days, Development: 14 days, Revision: 7 days).
 * - Awaiting Client (Amber): Project has active pending action requests waiting on client input.
 * - On Track (Green): Otherwise.
 */
export function getHealthLabel(project: ProjectWithHealth): 'Blocked' | 'Awaiting Client' | 'On Track' | 'Suspended' {
  if (project.is_suspended) {
    return 'Suspended'
  }

  if (project.status === 'Complete') {
    return 'On Track'
  }

  // 1. Red Check (Blocked / Stale)
  const isMessageUnreadAndOver24h = project.unreadMessageCount > 0 && project.daysSinceLastMessage !== null && project.daysSinceLastMessage >= 1
  
  // Stage-aware thresholds (in days)
  let threshold = 7
  if (project.status === 'Discovery' || project.status === 'Design') {
    threshold = 3
  } else if (project.status === 'Development') {
    threshold = 14
  } else if (project.status === 'Revision') {
    threshold = 7
  }

  const daysSinceLastUpdate = Math.floor((Date.now() - new Date(project.updated_at).getTime()) / (1000 * 60 * 60 * 24))
  const isInactiveOverThreshold = (project.daysSinceLastMessage === null || project.daysSinceLastMessage >= threshold) && daysSinceLastUpdate >= threshold

  if (isMessageUnreadAndOver24h || isInactiveOverThreshold) {
    return 'Blocked'
  }

  // 2. Amber Check (Awaiting Client)
  const hasPendingAction = project.actionRequests.some((req) => req.status === 'pending')
  if (hasPendingAction) {
    return 'Awaiting Client'
  }

  return 'On Track'
}

function getUrgencyScore(project: ProjectWithHealth): number {
  const label = getHealthLabel(project)
  if (label === 'Blocked') return 100
  if (label === 'Awaiting Client') return 50 + project.unreadMessageCount
  return 0
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ClientHealthGrid({
  clients,
  maxItems,
  showViewAll = false,
}: ClientHealthGridProps) {
  const supabase = createClient()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<ProjectWithHealth | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Sort by urgency score
  const sorted = [...clients].sort((a, b) => getUrgencyScore(b) - getUrgencyScore(a))
  const displayed = maxItems ? sorted.slice(0, maxItems) : sorted
  const hiddenCount = maxItems ? Math.max(0, sorted.length - maxItems) : 0

  const blockedCount = clients.filter((c) => getHealthLabel(c) === 'Blocked').length
  const attentionCount = clients.filter((c) => getHealthLabel(c) === 'Awaiting Client').length
  const suspendedCount = clients.filter((c) => getHealthLabel(c) === 'Suspended').length

  const handleMarkRequestComplete = async (requestId: string) => {
    setUpdatingId(requestId)
    try {
      const { error } = await supabase
        .from('project_action_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      if (error) throw error

      toast.success('Action request marked complete.')
      
      // Update local state in modal preview if open
      if (selectedProject) {
        setSelectedProject({
          ...selectedProject,
          actionRequests: selectedProject.actionRequests.filter((r) => r.id !== requestId),
        })
      }

      router.refresh()
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  if (clients.length === 0) {
    return (
      <section className="p-6 glass rounded-2xl border border-purple-500/15 flex flex-col items-center justify-center text-center gap-4 min-h-[200px]">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Users size={22} className="text-gold" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">No Active Client Mandates</p>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Deploy a new project from the Projects page to begin tracking client health.
          </p>
        </div>
        <Link
          href="/admin/projects?create=true&redirect=/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/15 border border-gold/25 text-xs font-bold text-gold transition-all duration-200"
        >
          <Plus size={12} />
          Deploy New Project
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Users size={13} className="text-gold" />
            Client Health
          </h2>
          <div className="flex items-center gap-1.5">
            {blockedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-[9px] font-bold text-red-400 uppercase tracking-wide">
                <AlertTriangle size={8} />
                {blockedCount} blocked
              </span>
            )}
            {attentionCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[9px] font-bold text-amber-400 uppercase tracking-wide">
                {attentionCount} awaiting client
              </span>
            )}
            {suspendedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-500/10 border border-zinc-500/25 text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                {suspendedCount} suspended
              </span>
            )}
            {blockedCount === 0 && attentionCount === 0 && suspendedCount === 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/25 text-[9px] font-bold text-green-400 uppercase tracking-wide">
                All clear
              </span>
            )}
          </div>
        </div>

        {showViewAll && (
          <Link
            href="/admin/clients"
            className="text-[10px] font-bold uppercase tracking-wider text-gold/60 hover:text-gold transition-colors shrink-0"
          >
            View All ({clients.length}) →
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3">
        {displayed.map((project) => {
          const stageBadge = getStageBadge(project.status)
          const healthBorder = getHealthBorder(project)
          const initials = getInitials(project.client_name)
          const health = getHealthLabel(project)
          const tabParam = health === 'Blocked' ? 'chat' : health === 'Awaiting Client' ? 'actions' : 'config'

          return (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`relative p-4 glass rounded-2xl border border-purple-500/15 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all duration-300 border-l-[3px] ${healthBorder} group flex flex-col gap-3 text-left w-full cursor-pointer`}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {project.clientAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.clientAvatarUrl}
                      alt={project.client_name}
                      className="w-9 h-9 rounded-xl object-cover border border-gold/20"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-gold">{initials}</span>
                    </div>
                  )}
                  {project.unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#050505] flex items-center justify-center">
                      <span className="text-[7px] font-black text-black">{project.unreadMessageCount}</span>
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate group-hover:text-gold transition-colors">
                    {project.client_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{project.project_name}</p>
                </div>
                {health === 'Suspended' ? (
                  <span title="Suspended" className="shrink-0 flex items-center">
                    <Lock size={11} className="text-zinc-400" />
                  </span>
                ) : (
                  <span
                    className={`shrink-0 w-2 h-2 rounded-full ${
                      health === 'Blocked'
                        ? 'bg-red-500'
                        : health === 'Awaiting Client'
                        ? 'bg-amber-400'
                        : 'bg-green-500'
                    }`}
                    title={health}
                  />
                )}
              </div>

              {/* Stage Badge & Details */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${stageBadge.bg} ${stageBadge.text} ${stageBadge.border}`}
                >
                  {project.status}
                </span>

                {(health === 'Blocked' || health === 'Awaiting Client') && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.success(`Nudge notification sent to ${project.client_name}`)
                    }}
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-[8px] font-bold text-amber-400 uppercase tracking-wider transition-all cursor-pointer hover:border-amber-400/40"
                  >
                    Nudge
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  {project.unreadMessageCount > 0 && (
                    <span title="Unread messages" className="text-amber-400">
                      <MessageSquare size={10} />
                    </span>
                  )}
                  {project.actionRequests.some((r) => r.status === 'submitted') && (
                    <span title="Information Submitted" className="text-amber-400 animate-pulse">
                      <CheckCircle2 size={10} />
                    </span>
                  )}
                  {project.daysSinceLastMessage !== null && (
                    <span className="flex items-center gap-0.5 text-muted-foreground/60">
                      <Clock size={9} />
                      <span className="text-[9px] font-mono">{project.daysSinceLastMessage}d</span>
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}

        {hiddenCount > 0 && (
          <Link
            href="/admin/clients"
            className="p-4 glass rounded-2xl border border-purple-500/15 border-dashed hover:border-purple-500/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center group min-h-[100px]"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/15 transition-all">
              <Users size={16} className="text-gold" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground group-hover:text-gold transition-colors">
                +{hiddenCount} more client{hiddenCount > 1 ? 's' : ''}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">View full board →</p>
            </div>
          </Link>
        )}
      </div>

      {/* ── Client Health Quick Preview Modal ───────────────────────────────── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass border border-gold/20 rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-purple-500/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-gold">
                    {getInitials(selectedProject.client_name)}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-foreground leading-tight">
                    {selectedProject.client_name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedProject.project_name} · <span className="text-gold font-mono text-[10px]">{getHealthLabel(selectedProject)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 scrollbar-thin">
              
              {/* Project Status */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Current Stage
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      getStageBadge(selectedProject.status).bg
                    } ${getStageBadge(selectedProject.status).text} ${
                      getStageBadge(selectedProject.status).border
                    }`}
                  >
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              {/* Message Summary */}
              <div className="space-y-1.5 bg-white/[0.01] border border-gold/5 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Telemetry Status
                  </p>
                  {selectedProject.daysSinceLastMessage !== null && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Last contact: {selectedProject.daysSinceLastMessage} days ago
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {selectedProject.unreadMessageCount > 0 ? (
                    <p className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
                      <MessageSquare size={13} />
                      {selectedProject.unreadMessageCount} unread message{selectedProject.unreadMessageCount > 1 ? 's' : ''} from client.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-green-400" />
                      All messages processed and answered.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Requests */}
              <div className="space-y-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  Action Requests & Submissions
                </p>

                {selectedProject.actionRequests.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-white/[0.01] border border-dashed border-purple-500/15 p-4 rounded-xl text-center">
                    No active action requests registered for this client.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedProject.actionRequests.map((req) => (
                      <div
                        key={req.id}
                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                          req.status === 'submitted'
                            ? 'bg-amber-500/[0.03] border-amber-500/25'
                            : 'bg-white/[0.02] border-purple-500/15'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-foreground">{req.title}</h4>
                            <p className="text-[10px] text-muted-foreground mt-1 whitespace-pre-line leading-relaxed">
                              {req.description}
                            </p>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                              req.status === 'submitted'
                                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                                : 'bg-white/5 text-muted-foreground border border-white/10'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        {req.status === 'submitted' && (
                          <div className="space-y-2 bg-[#050505]/60 p-3 rounded-lg border border-amber-500/10">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                              Client Response:
                            </p>
                            <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed font-mono">
                              {req.client_response || 'No text provided (assets uploaded).'}
                            </p>
                            {req.submitted_at && (
                              <p className="text-[9px] text-muted-foreground font-mono text-right mt-1">
                                Submitted {Math.floor((Date.now() - new Date(req.submitted_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </p>
                            )}
                          </div>
                        )}

                        {req.status === 'submitted' && (
                          <button
                            onClick={() => handleMarkRequestComplete(req.id)}
                            disabled={updatingId === req.id}
                            className="w-full py-2 bg-gold/10 hover:bg-gold/25 text-gold hover:text-white border border-gold/25 hover:border-gold/45 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {updatingId === req.id ? 'Processing...' : 'Mark Approved & Complete'}
                          </button>
                        )}

                        {req.status === 'pending' && (
                          <div className="text-[9px] text-muted-foreground flex items-center gap-1.5 italic">
                            <Clock size={10} />
                            Awaiting client submission. Created {Math.floor((Date.now() - new Date(req.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-purple-500/15 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2.5 rounded-xl border border-gold/15 hover:bg-white/5 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer order-last sm:order-first"
              >
                Close
              </button>
              <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
                <Link
                  href={`/admin/projects?openId=${selectedProject.id}&tab=config`}
                  className="px-4 py-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/25 hover:border-gold/45 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  Launch Console (Config) <ExternalLink size={11} />
                </Link>
                {getHealthLabel(selectedProject) !== 'On Track' && (
                  <Link
                    href={`/admin/projects?openId=${selectedProject.id}&tab=${getHealthLabel(selectedProject) === 'Blocked' ? 'chat' : 'actions'}`}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    Resolve Active Tasks ({getHealthLabel(selectedProject) === 'Blocked' ? 'Chat' : 'Actions'}) <ExternalLink size={11} />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}
