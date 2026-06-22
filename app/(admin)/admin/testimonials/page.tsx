'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Archive, ArchiveRestore, Star, Loader2, MessageSquareQuote, X, Save, CheckCircle2 } from 'lucide-react'

type Testimonial = {
  id: string; client_name: string; company: string | null; testimonial: string
  profile_image: string | null; is_featured: boolean; is_archived: boolean; created_at: string
}

const EMPTY_FORM = { client_name: '', company: '', testimonial: '' }

export default function TestimonialsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').eq('is_archived', showArchived).order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [showArchived])

  useEffect(() => { fetch() }, [fetch])

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setImageFile(null); setEditing(null); setModal('create') }
  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({ client_name: item.client_name, company: item.company ?? '', testimonial: item.testimonial })
    setImageFile(null)
    setModal('edit')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    let profile_image = editing?.profile_image ?? null
    if (imageFile) {
      const path = `testimonials/${Date.now()}-${imageFile.name}`
      await supabase.storage.from('testimonials').upload(path, imageFile, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('testimonials').getPublicUrl(path)
      profile_image = publicUrl
    }
    if (editing) {
      await supabase.from('testimonials').update({ ...form, profile_image }).eq('id', editing.id)
    } else {
      await supabase.from('testimonials').insert({ ...form, profile_image })
    }
    setSaving(false)
    setModal(null)
    fetch()
    showToast(editing ? 'Testimonial updated.' : 'Testimonial added.')
  }

  const toggleFeatured = async (item: Testimonial) => {
    await supabase.from('testimonials').update({ is_featured: !item.is_featured }).eq('id', item.id)
    fetch()
  }
  const toggleArchive = async (item: Testimonial) => {
    await supabase.from('testimonials').update({ is_archived: !item.is_archived }).eq('id', item.id)
    fetch(); showToast(item.is_archived ? 'Restored.' : 'Archived.')
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
            <MessageSquareQuote size={12} /> Social Proof
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Manage client feedback shown on the public site.</p>
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
            <Plus size={14} /> Add Testimonial
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-44 rounded-2xl bg-card/50 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquareQuote size={40} className="text-gold/20 mb-3" />
          <p className="font-serif text-xl text-foreground">No testimonials yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add client reviews to build social proof.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openEdit(item)}
              className="glass rounded-2xl border border-gold/10 hover:border-gold/20 p-5 space-y-4 transition-all cursor-pointer hover:bg-gold/[0.01]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
                  {item.profile_image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={item.profile_image} alt={item.client_name} className="w-full h-full object-cover" />
                    : <span className="text-sm font-bold text-gold">{item.client_name[0]}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.client_name}</p>
                  <p className="text-xs text-muted-foreground">{item.company ?? '—'}</p>
                </div>
                {item.is_featured && <Star size={14} className="text-gold fill-gold shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-4">
                &ldquo;{item.testimonial}&rdquo;
              </p>
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gold/8" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => openEdit(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all">
                  <Edit2 size={11} /> Edit
                </button>
                <button onClick={() => toggleFeatured(item)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${item.is_featured ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-gold/15 text-muted-foreground hover:text-foreground'}`}>
                  <Star size={11} className={item.is_featured ? 'fill-gold' : ''} /> {item.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => toggleArchive(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all">
                  {item.is_archived ? <ArchiveRestore size={11} /> : <Archive size={11} />}
                  {item.is_archived ? 'Restore' : 'Archive'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass border border-gold/15 rounded-2xl shadow-2xl p-6 space-y-5 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">{modal === 'edit' ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { id: 'client_name', label: 'Client Name', required: true },
                { id: 'company', label: 'Company' },
              ].map(({ id, label, required }) => (
                <div key={id} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
                  <input required={required} value={(form as any)[id]} onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Testimonial *</label>
                <textarea required rows={4} value={form.testimonial} onChange={(e) => setForm((p) => ({ ...p, testimonial: e.target.value }))}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Profile Image {editing && '(leave blank to keep current)'}</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gold/25 file:bg-gold/5 file:text-xs file:font-semibold file:text-gold hover:file:bg-gold/10 transition-all cursor-pointer" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gold/15 text-sm text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-60 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {modal === 'edit' ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
