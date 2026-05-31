'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, Save, Archive, ArchiveRestore, Loader2,
  Upload, File, Trash2, Calendar, CheckCircle2, Circle,
} from 'lucide-react'

const STATUS_STEPS = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']
const STATUS_COLORS: Record<string, string> = {
  Discovery: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Design: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Development: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Revision: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  Complete: 'bg-green-500/15 text-green-400 border-green-500/25',
}

type Project = {
  id: string; client_name: string; project_name: string; description: string | null
  service_type: string | null; status: string; start_date: string | null
  target_launch_date: string | null; notes: string | null; is_archived: boolean; created_at: string
}
type Asset = { id: string; file_name: string; file_url: string; file_size: number | null; file_type: string | null; created_at: string }

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const load = async () => {
      const [{ data: proj }, { data: assetData }] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('project_assets').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      ])
      if (proj) { setProject(proj); setNotes(proj.notes ?? ''); setStatus(proj.status) }
      setAssets(assetData ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('projects').update({ notes, status }).eq('id', id)
    setSaving(false)
    if (error) { showToast('Failed to save.', 'error'); return }
    showToast('Project updated.')
    setProject((p) => p ? { ...p, notes, status } : p)
  }

  const handleArchive = async () => {
    const newVal = !project!.is_archived
    const { error } = await supabase.from('projects').update({ is_archived: newVal }).eq('id', id)
    if (error) { showToast('Failed.', 'error'); return }
    showToast(newVal ? 'Project archived.' : 'Project restored.')
    setProject((p) => p ? { ...p, is_archived: newVal } : p)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const path = `${id}/${Date.now()}-${file.name}`
      const { data: storageData, error: storageErr } = await supabase.storage.from('project-assets').upload(path, file)
      if (storageErr) { showToast(`Failed to upload ${file.name}`, 'error'); continue }
      const { data: { publicUrl } } = supabase.storage.from('project-assets').getPublicUrl(path)
      await supabase.from('project_assets').insert({
        project_id: id, file_name: file.name, file_url: publicUrl,
        file_size: file.size, file_type: file.type,
      })
    }
    const { data: newAssets } = await supabase.from('project_assets').select('*').eq('project_id', id).order('created_at', { ascending: false })
    setAssets(newAssets ?? [])
    setUploading(false)
    showToast('Files uploaded.')
    e.target.value = ''
  }

  const handleDeleteAsset = async (assetId: string, fileUrl: string) => {
    const path = fileUrl.split('/project-assets/')[1]
    await supabase.storage.from('project-assets').remove([path])
    await supabase.from('project_assets').delete().eq('id', assetId)
    setAssets((prev) => prev.filter((a) => a.id !== assetId))
    setDeleteConfirm(null)
    showToast('File deleted.')
  }

  const formatBytes = (b: number | null) => {
    if (!b) return '—'
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / (1024 * 1024)).toFixed(1)} MB`
  }

  const statusIdx = STATUS_STEPS.indexOf(status)

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 size={28} className="animate-spin text-gold/50" /></div>
  if (!project) return <div className="text-center py-20"><p className="text-foreground font-serif text-xl">Project not found.</p><Link href="/admin/projects" className="text-gold text-sm mt-2 block">← Back</Link></div>

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && (
        <div className={`fixed top-4 left-4 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${toast.type === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold/15 text-muted-foreground hover:text-gold hover:border-gold/30 transition-all">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Project</p>
            <h1 className="font-serif text-2xl font-bold text-foreground mt-0.5">{project.project_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleArchive} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/15 text-sm text-muted-foreground hover:text-foreground hover:border-gold/25 transition-all">
            {project.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            {project.is_archived ? 'Restore' : 'Archive'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
        </div>
      </div>

      {/* Progress Milestones */}
      <div className="glass rounded-2xl border border-gold/10 p-6">
        <p className="text-xxs font-bold uppercase tracking-widest text-gold/70 mb-5">Project Progress</p>
        <div className="flex items-center gap-0 w-full">
          {STATUS_STEPS.map((s, i) => {
            const done = i < statusIdx
            const active = i === statusIdx
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => setStatus(s)}
                  title={s}
                  className={`flex flex-col items-center gap-1.5 transition-all group ${active ? 'scale-105' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${done ? 'bg-green-500/20 border-green-500/50' : active ? 'bg-gold/20 border-gold glow-gold' : 'bg-background border-gold/20 hover:border-gold/40'}`}>
                    {done ? <CheckCircle2 size={16} className="text-green-400" /> : active ? <Circle size={10} className="fill-gold text-gold" /> : <Circle size={8} className="text-muted-foreground/30" />}
                  </div>
                  <span className={`text-xxs font-semibold text-center transition-colors ${active ? 'text-gold' : done ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {s}
                  </span>
                </button>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-1 transition-colors ${i < statusIdx ? 'bg-green-500/40' : 'bg-gold/10'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Meta info */}
          <div className="glass rounded-2xl border border-gold/10 p-6 grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Client', value: project.client_name },
              { label: 'Service Type', value: project.service_type ?? '—' },
              { label: 'Start Date', value: project.start_date ? new Date(project.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              { label: 'Target Launch', value: project.target_launch_date ? new Date(project.target_launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                <p className="text-sm text-foreground">{value}</p>
              </div>
            ))}
            {project.description && (
              <div className="sm:col-span-2">
                <p className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{project.description}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-3">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Project Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add project notes, briefing details, revision requests…"
              className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-gold/15 transition-all resize-none"
            />
          </div>

          {/* Assets */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Project Assets</p>
              <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${uploading ? 'border-gold/20 text-muted-foreground' : 'border-gold/25 text-gold bg-gold/5 hover:bg-gold/10'}`}>
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? 'Uploading…' : 'Upload Files'}
                <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gold/10 rounded-xl text-center">
                <Upload size={28} className="text-gold/20 mb-2" />
                <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {assets.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-gold/8 group">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <File size={14} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-foreground hover:text-gold transition-colors truncate block">
                        {a.file_name}
                      </a>
                      <p className="text-xxs text-muted-foreground">{formatBytes(a.file_size)} · {a.file_type ?? 'unknown'}</p>
                    </div>
                    {deleteConfirm === a.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDeleteAsset(a.id, a.file_url)} className="text-xs text-red-400 hover:text-red-300">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-muted-foreground">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(a.id)} className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div>
          <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Current Status</p>
            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold border ${STATUS_COLORS[status]}`}>{status}</span>
            {project.is_archived && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400 mt-3">
                This project is archived.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
