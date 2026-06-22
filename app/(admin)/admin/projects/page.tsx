'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  ChevronRight,
  Archive,
  Loader2,
  FolderKanban,
  Calendar,
  LayoutList,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react'

type Project = {
  id: string
  client_name: string
  project_name: string
  service_type: string | null
  status: string
  start_date: string | null
  target_launch_date: string | null
  is_archived: boolean
  created_at: string
}

const STATUS_STEPS = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']

const STATUS_COLORS: Record<string, string> = {
  Discovery: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Design: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Development: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Revision: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  Complete: 'bg-green-500/15 text-green-400 border-green-500/25',
}

export default function ProjectsPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [activeKanbanColumn, setActiveKanbanColumn] = useState<string>('Discovery')
  const [showArchived, setShowArchived] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [form, setForm] = useState({
    client_name: '', project_name: '', service_type: '', description: '', notes: '',
    start_date: '', target_launch_date: '',
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('is_archived', showArchived)
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }, [showArchived])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('projects').insert({
      ...form,
      start_date: form.start_date || null,
      target_launch_date: form.target_launch_date || null,
      status: 'Discovery',
    })
    setSaving(false)
    if (error) { showToast('Failed to create project.'); return }
    setShowNewModal(false)
    setForm({ client_name: '', project_name: '', service_type: '', description: '', notes: '', start_date: '', target_launch_date: '' })
    fetchProjects()
    showToast('Project created!')
  }

  const byStatus = (status: string) => projects.filter((p) => p.status === status)

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-gold uppercase">
            <FolderKanban size={12} /> Production Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Projects</h1>
          <p className="text-sm text-muted-foreground">Track client builds from discovery to launch.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          {/* View toggle */}
          <div className="flex items-center bg-card border border-gold/15 rounded-xl p-1 gap-1">
            <button onClick={() => setView('kanban')} className={`p-2 rounded-lg transition-all cursor-pointer ${view === 'kanban' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid size={15} />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all cursor-pointer ${view === 'list' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutList size={15} />
            </button>
          </div>
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${showArchived ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-card border-gold/15 text-muted-foreground hover:text-foreground'}`}
          >
            <Archive size={14} /> {showArchived ? 'Archived' : 'Show Archived'}
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all cursor-pointer"
          >
            <Plus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 size={28} className="animate-spin text-gold/40" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6 glass rounded-2xl border border-gold/10 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold/40">
            <FolderKanban size={20} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-foreground">
              {showArchived ? 'Archived Ledger Empty' : 'Production Pipeline Empty'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {showArchived
                ? 'No archived project records exist in the historical archives.'
                : 'No client projects are currently active in the engineering queue. Initialize a new project container to begin tracking progress.'}
            </p>
          </div>
          {!showArchived && (
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg bg-gold text-background hover:bg-gold-light transition-all cursor-pointer font-bold"
            >
              Initialize Project
            </button>
          )}
        </div>
      ) : view === 'kanban' ? (
        <div className="space-y-4">
          {/* Mobile Kanban Switcher */}
          <div className="flex md:hidden border-b border-gold/10 overflow-x-auto scrollbar-none gap-2 pb-2 mb-2">
            {STATUS_STEPS.map((status) => {
              const count = byStatus(status).length
              const isActive = activeKanbanColumn === status
              return (
                <button
                  key={status}
                  onClick={() => setActiveKanbanColumn(status)}
                  className={`px-3.5 py-2 border-b-2 text-xxs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border-gold text-gold bg-gold/5 font-extrabold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status} ({count})
                </button>
              )
            })}
          </div>

          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-4 min-w-max xl:min-w-0 xl:grid xl:grid-cols-5">
            {STATUS_STEPS.map((status) => {
              const cols = byStatus(status)
              const isVisible = status === activeKanbanColumn
              return (
                <div key={status} className={`w-56 xl:w-auto space-y-3 shrink-0 xl:shrink ${isVisible ? 'block' : 'hidden md:block'}`}>
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold ${STATUS_COLORS[status]}`}>
                    <span>{status}</span>
                    <span className="opacity-70">{cols.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cols.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground/50">
                        No projects
                      </div>
                    ) : cols.map((p) => (
                      <Link key={p.id} href={`/admin/projects/${p.id}`} className="block p-4 glass rounded-xl border border-gold/10 hover:border-gold/25 transition-all group space-y-2">
                        <p className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-1">{p.project_name}</p>
                        <p className="text-xs text-muted-foreground">{p.client_name}</p>
                        {p.target_launch_date && (
                          <div className="flex items-center gap-1 text-xxs text-muted-foreground/70">
                            <Calendar size={10} />
                            {new Date(p.target_launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left px-6 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground">Project</th>
                    <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Client</th>
                    <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Launch Date</th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-foreground">{p.project_name}</p>
                        <p className="text-xs text-muted-foreground">{p.service_type ?? '—'}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-sm text-foreground">{p.client_name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xxs font-bold border ${STATUS_COLORS[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="text-sm text-muted-foreground">
                          {p.target_launch_date ? new Date(p.target_launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/admin/projects/${p.id}`} className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-all">
                          <ChevronRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden divide-y divide-gold/5">
              {projects.map((p) => (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.project_name}</p>
                      <p className="text-xs text-muted-foreground">{p.service_type ?? '—'}</p>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xxs text-muted-foreground pt-1">
                    <div>
                      <span className="font-semibold text-gold/70 block uppercase tracking-wider mb-0.5">Client</span>
                      <span className="text-foreground">{p.client_name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gold/70 block uppercase tracking-wider mb-0.5">Launch Target</span>
                      <span className="text-foreground">
                        {p.target_launch_date ? new Date(p.target_launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-gold/5">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="flex items-center gap-1 text-[10px] text-gold font-bold hover:underline"
                    >
                      Open Project Workspace <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl border border-gold/15 p-6 w-full max-w-lg space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">New Project</h2>
              <button onClick={() => setShowNewModal(false)} className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { id: 'project_name', label: 'Project Name', required: true },
                { id: 'client_name', label: 'Client Name', required: true },
                { id: 'service_type', label: 'Service Type' },
              ].map(({ id, label, required }) => (
                <div key={id} className="space-y-1.5">
                  <label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</label>
                  <input
                    id={id}
                    required={required}
                    value={(form as any)[id]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [id]: e.target.value }))}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'start_date', label: 'Start Date' },
                  { id: 'target_launch_date', label: 'Target Launch' },
                ].map(({ id, label }) => (
                  <div key={id} className="space-y-1.5">
                    <label htmlFor={id} className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</label>
                    <input
                      id={id}
                      type="date"
                      value={(form as any)[id]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [id]: e.target.value }))}
                      className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                  </div>
                ))}
              </div>
              <textarea
                placeholder="Description (optional)"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded-xl border border-gold/15 text-sm text-muted-foreground hover:text-foreground transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-60 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
