'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Edit2, Archive, ArchiveRestore, Star, Loader2, ImageIcon, ExternalLink, X, Save, CheckCircle2,
} from 'lucide-react'

type PortfolioItem = {
  id: string; project_name: string; client_name: string | null; description: string | null
  industry: string | null; website_link: string | null; cover_image: string
  is_featured: boolean; is_archived: boolean; created_at: string
}

const EMPTY_FORM = { project_name: '', client_name: '', description: '', industry: '', website_link: '' }

export default function PortfolioPage() {
  const supabase = createClient()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('portfolio_items').select('*').eq('is_archived', showArchived).order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [showArchived])

  useEffect(() => { fetch() }, [fetch])

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setCoverFile(null); setEditing(null); setModal('create') }
  const openEdit = (item: PortfolioItem) => {
    setEditing(item)
    setForm({ project_name: item.project_name, client_name: item.client_name ?? '', description: item.description ?? '', industry: item.industry ?? '', website_link: item.website_link ?? '' })
    setCoverFile(null)
    setModal('edit')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let cover_image = editing?.cover_image ?? ''

    if (coverFile) {
      const path = `portfolio/${Date.now()}-${coverFile.name}`
      await supabase.storage.from('portfolio').upload(path, coverFile, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path)
      cover_image = publicUrl
    }

    if (!cover_image && !editing) { showToast('Please select a cover image.'); setSaving(false); return }

    if (editing) {
      await supabase.from('portfolio_items').update({ ...form, cover_image }).eq('id', editing.id)
    } else {
      await supabase.from('portfolio_items').insert({ ...form, cover_image })
    }
    setSaving(false)
    setModal(null)
    fetch()
    showToast(editing ? 'Portfolio item updated.' : 'Portfolio item added.')
  }

  const toggleFeatured = async (item: PortfolioItem) => {
    await supabase.from('portfolio_items').update({ is_featured: !item.is_featured }).eq('id', item.id)
    fetch()
  }

  const toggleArchive = async (item: PortfolioItem) => {
    await supabase.from('portfolio_items').update({ is_archived: !item.is_archived }).eq('id', item.id)
    fetch()
    showToast(item.is_archived ? 'Item restored.' : 'Item archived.')
  }

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold/80 uppercase">
            <ImageIcon size={12} /> CMS Showcase Content
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Portfolio</h1>
          <p className="text-sm text-muted-foreground">Manage your public case studies and projects.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showArchived
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-card border-gold/15 text-muted-foreground hover:text-foreground hover:border-gold/25'
            }`}
          >
            <Archive size={14} /> {showArchived ? 'Archived' : 'Show Archived'}
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-xs font-bold hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-2xl bg-card/50 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageIcon size={40} className="text-gold/20 mb-3" />
          <p className="font-serif text-xl text-foreground">No portfolio items</p>
          <p className="text-sm text-muted-foreground mt-1">Add your first project to showcase your work.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openEdit(item)}
              className="glass rounded-2xl border border-gold/10 overflow-hidden group hover:border-gold/20 transition-all cursor-pointer hover:bg-gold/[0.01]"
            >
              <div className="relative h-44 bg-secondary/50">
                {item.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.cover_image} alt={item.project_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={32} className="text-muted-foreground/30" />
                  </div>
                )}
                {item.is_featured && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-gold/90 text-background text-xxs font-bold flex items-center gap-1">
                    <Star size={9} className="fill-current" /> Featured
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-semibold text-foreground line-clamp-1">{item.project_name}</p>
                  <p className="text-xs text-muted-foreground">{item.client_name ?? '—'} {item.industry ? `· ${item.industry}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground hover:border-gold/25 transition-all">
                    <Edit2 size={11} /> Edit
                  </button>
                  <button onClick={() => toggleFeatured(item)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${item.is_featured ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-gold/15 text-muted-foreground hover:text-foreground'}`}>
                    <Star size={11} className={item.is_featured ? 'fill-gold' : ''} /> {item.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button onClick={() => toggleArchive(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all">
                    {item.is_archived ? <ArchiveRestore size={11} /> : <Archive size={11} />}
                    {item.is_archived ? 'Restore' : 'Archive'}
                  </button>
                  {item.website_link && (
                    <a href={item.website_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-gold hover:bg-gold/10 transition-all">
                      <ExternalLink size={11} /> View
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass border border-gold/15 rounded-2xl shadow-2xl p-6 space-y-5 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">{modal === 'edit' ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { id: 'project_name', label: 'Project Name', required: true },
                { id: 'client_name', label: 'Client Name' },
                { id: 'industry', label: 'Industry' },
                { id: 'website_link', label: 'Live Website URL' },
              ].map(({ id, label, required }) => (
                <div key={id} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
                  <input required={required} value={(form as any)[id]} onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cover Image {editing && '(leave blank to keep current)'}</label>
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gold/25 file:bg-gold/5 file:text-xs file:font-semibold file:text-gold hover:file:bg-gold/10 transition-all cursor-pointer" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gold/15 text-sm text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-60 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {modal === 'edit' ? 'Save Changes' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
