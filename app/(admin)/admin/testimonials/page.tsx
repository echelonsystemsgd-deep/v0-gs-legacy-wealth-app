'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Edit2, Archive, ArchiveRestore, Star, Loader2, MessageSquareQuote, X, Save, CheckCircle2, RefreshCw, Sparkles, ShieldCheck
} from 'lucide-react'

type Testimonial = {
  id: string
  client_name: string
  company: string | null
  testimonial: string
  badge?: string | null
  profile_image: string | null
  is_featured: boolean
  is_archived: boolean
  created_at: string
}

const DEFAULT_FRONTEND_TESTIMONIALS = [
  {
    client_name: "Sarah M., Founder",
    company: "The Artisan Patisserie Group · London",
    testimonial: "We used to lose 4–5 bespoke orders every weekend due to missed calls and delayed replies. Mercian deployed an automated 24/7 storefront with WhatsApp notifications. We now capture 50% non-refundable deposits upfront before any job hits our calendar.",
    badge: "+38% Revenue Lift",
    is_featured: true,
    is_archived: false,
  },
  {
    client_name: "Marcus T., Managing Director",
    company: "Gourmet Events & Hospitality · Berkshire",
    testimonial: "The automated quote engine and instant phone dispatch completely eliminated our late-night quote chasing. Setup was completed in 6 business days and paid for itself within the first 3 weeks of operations.",
    badge: "14.5 Hrs Saved / Wk",
    is_featured: true,
    is_archived: false,
  },
]

const EMPTY_FORM = { client_name: '', company: '', testimonial: '', badge: '' }

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
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_archived', showArchived)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    setItems(data ?? [])
    setLoading(false)
  }, [showArchived, supabase])

  useEffect(() => { fetch() }, [fetch])

  const handleSeedDefaults = async () => {
    setSeeding(true)
    try {
      for (const t of DEFAULT_FRONTEND_TESTIMONIALS) {
        await supabase.from('testimonials').insert({
          client_name: t.client_name,
          company: t.company,
          testimonial: t.testimonial,
          badge: t.badge,
          is_featured: t.is_featured,
          is_archived: false,
        })
      }
      showToast('Frontend testimonials imported successfully.')
      fetch()
    } catch (err: any) {
      showToast(`Import failed: ${err.message}`)
    } finally {
      setSeeding(false)
    }
  }

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setImageFile(null); setEditing(null); setModal('create') }
  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({
      client_name: item.client_name,
      company: item.company ?? '',
      testimonial: item.testimonial,
      badge: item.badge ?? '',
    })
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

    const payload = {
      client_name: form.client_name,
      company: form.company || null,
      testimonial: form.testimonial,
      badge: form.badge || null,
      profile_image,
    }

    if (editing) {
      await supabase.from('testimonials').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('testimonials').insert(payload)
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
    fetch()
    showToast(item.is_archived ? 'Restored.' : 'Archived.')
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
            <MessageSquareQuote size={12} /> Social Proof & Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Manage client reviews, KPI badges, and social proof shown on the public site.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gold/20 bg-gold/5 text-gold text-xs font-bold hover:bg-gold/10 transition-all cursor-pointer disabled:opacity-50"
            title="Import the live frontend testimonials into database"
          >
            {seeding ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            Sync Frontend Defaults
          </button>
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
        <div className="glass rounded-2xl border border-gold/10 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
          <MessageSquareQuote size={44} className="text-gold/30 mb-1" />
          <div className="space-y-1">
            <p className="font-serif text-xl font-bold text-foreground">No Database Testimonials Found</p>
            <p className="text-xs text-muted-foreground max-w-md">
              The public site is currently rendering built-in frontend testimonials (Sarah M. & Marcus T.). Click below to import them into your database for direct editing.
            </p>
          </div>
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-xs font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Import 2 Frontend Testimonials
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openEdit(item)}
              className="glass rounded-2xl border border-gold/10 hover:border-gold/25 p-5 space-y-4 transition-all cursor-pointer hover:bg-gold/[0.01]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
                    {item.profile_image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.profile_image} alt={item.client_name} className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold text-gold">{item.client_name[0]}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{item.client_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.company ?? '—'}</p>
                  </div>
                </div>
                {item.is_featured && <Star size={14} className="text-gold fill-gold shrink-0 mt-1" />}
              </div>

              {item.badge && (
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  {item.badge}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic line-clamp-4">
                &ldquo;{item.testimonial}&rdquo;
              </p>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gold/10" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(item)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                    <Edit2 size={11} /> Edit
                  </button>
                  <button onClick={() => toggleFeatured(item)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${item.is_featured ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-gold/15 text-muted-foreground hover:text-foreground'}`}>
                    <Star size={11} className={item.is_featured ? 'fill-gold' : ''} /> {item.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button onClick={() => toggleArchive(item)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer">
                    {item.is_archived ? <ArchiveRestore size={11} /> : <Archive size={11} />}
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-gold">
                  <ShieldCheck size={12} /> Verified
                </div>
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Client Name & Title *</label>
                <input required value={form.client_name} onChange={(e) => setForm((p) => ({ ...p, client_name: e.target.value }))}
                  placeholder="e.g. Sarah M., Founder"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company & City</label>
                  <input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. The Artisan Patisserie Group · London"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">KPI Badge</label>
                  <input value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                    placeholder="e.g. +38% Revenue Lift"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Testimonial Quote *</label>
                <textarea required rows={4} value={form.testimonial} onChange={(e) => setForm((p) => ({ ...p, testimonial: e.target.value }))}
                  placeholder="Client feedback quote..."
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Profile Image {editing && '(leave blank to keep current)'}</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-gold/25 file:bg-gold/5 file:text-xs file:font-semibold file:text-gold hover:file:bg-gold/10 transition-all cursor-pointer" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-gold/15 text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-60 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all cursor-pointer">
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
