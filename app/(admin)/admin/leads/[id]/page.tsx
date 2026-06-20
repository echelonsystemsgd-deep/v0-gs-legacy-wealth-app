'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  Save,
  Archive,
  ArchiveRestore,
  Loader2,
  Globe,
  Phone,
  Mail,
  Building2,
  Calendar,
  Circle,
  Trash2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

const STATUS_OPTIONS = ['New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost', 'Spam']
const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  'Call Booked': 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  'Proposal Sent': 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Won: 'bg-green-500/15 text-green-400 border-green-500/25',
  Lost: 'bg-red-500/15 text-red-400 border-red-500/25',
  Spam: 'bg-red-500/10 text-red-400/70 border-red-500/20',
}

type Lead = {
  id: string
  name: string
  business_name: string
  email: string
  phone: string | null
  website: string | null
  service_interested: string | null
  notes: string | null
  status: string
  source: string
  is_archived: boolean
  created_at: string
  updated_at: string
}

type Session = {
  id: string
  scheduled_at: string
  status: string
  notes: string | null
  outcomes: string | null
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [lead, setLead] = useState<Lead | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Portal Account Promotion states
  const [profileForLead, setProfileForLead] = useState<any | null>(null)
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [promoting, setPromoting] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: leadData }, { data: sessionData }] = await Promise.all([
        supabase.from('leads').select('*').eq('id', id).single(),
        supabase.from('strategy_sessions').select('*').eq('lead_id', id).order('scheduled_at', { ascending: false }),
      ])
      if (leadData) {
        setLead(leadData)
        setNotes(leadData.notes ?? '')
        setStatus(leadData.status)

        // Check if there is a registered portal profile for this lead email
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', leadData.email)
          .maybeSingle()
        setProfileForLead(profileData)
      }
      setSessions(sessionData ?? [])
      setCheckingProfile(false)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handlePromote = async () => {
    if (!profileForLead) return
    setPromoting(true)
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'client' })
      .eq('id', profileForLead.id)
    setPromoting(false)

    if (error) {
      showToast('Failed to promote user.', 'error')
      return
    }

    showToast('User promoted to Client successfully.')
    setProfileForLead((prev: any) => prev ? { ...prev, role: 'client' } : null)

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('activity_logs').insert({
      user_id: user?.id,
      action_type: 'Promoted Lead to Client',
      target_table: 'profiles',
      target_id: profileForLead.id,
      details: { email: lead!.email }
    })
  }

  const handleDemote = async () => {
    if (!profileForLead) return
    setPromoting(true)
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('id', profileForLead.id)
    setPromoting(false)

    if (error) {
      showToast('Failed to demote user.', 'error')
      return
    }

    showToast('User demoted to standard User.')
    setProfileForLead((prev: any) => prev ? { ...prev, role: 'user' } : null)

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('activity_logs').insert({
      user_id: user?.id,
      action_type: 'Demoted Client to User',
      target_table: 'profiles',
      target_id: profileForLead.id,
      details: { email: lead!.email }
    })
  }

  const handleInviteClient = async () => {
    if (!lead) return
    setPromoting(true)
    try {
      const response = await fetch('/api/admin/invite-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: lead.email,
          fullName: lead.name,
          phone: lead.phone || '',
          company: lead.business_name || ''
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to send invite.')

      showToast('Client invitation dispatched successfully.')
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', lead.email)
        .maybeSingle()
      setProfileForLead(profileData)
    } catch (err: any) {
      showToast(err.message || 'Invitation failed.', 'error')
    } finally {
      setPromoting(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('leads')
      .update({ notes, status, updated_at: new Date().toISOString() })
      .eq('id', id)
    setSaving(false)
    if (error) { showToast('Failed to save changes.', 'error'); return }
    showToast('Lead updated successfully.')
    setLead((prev) => prev ? { ...prev, notes, status } : prev)
  }

  const handleArchive = async () => {
    setArchiving(true)
    const newVal = !lead!.is_archived
    const { error } = await supabase.from('leads').update({ is_archived: newVal }).eq('id', id)
    setArchiving(false)
    if (error) { showToast('Failed to archive lead.', 'error'); return }
    showToast(newVal ? 'Lead archived.' : 'Lead restored.')
    setLead((prev) => prev ? { ...prev, is_archived: newVal } : prev)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this lead? This action cannot be undone.')) return
    setSaving(true)
    const { error } = await supabase.from('leads').delete().eq('id', id)
    setSaving(false)
    if (error) {
      showToast('Failed to delete lead.', 'error')
      return
    }
    showToast('Lead permanently deleted.')
    setTimeout(() => {
      router.push('/admin/leads')
    }, 1200)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={28} className="animate-spin text-gold/50" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-3">
        <p className="font-serif text-xl text-foreground">Lead not found</p>
        <Link href="/admin/leads" className="text-sm text-gold hover:text-gold-light transition-colors">
          ← Back to Leads
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-4 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl transition-all ${toast.type === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="flex items-center justify-center w-8 h-8 rounded-lg border border-gold/15 text-muted-foreground hover:text-gold hover:border-gold/30 transition-all">
            <ArrowLeft size={15} />
          </Link>
          <div>
            <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Lead Detail</p>
            <h1 className="font-serif text-2xl font-bold text-foreground mt-0.5">{lead.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-background text-sm font-bold border border-red-500/20 hover:border-red-500 transition-all cursor-pointer"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={handleArchive}
            disabled={archiving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/15 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/25 transition-all"
          >
            {archiving ? <Loader2 size={14} className="animate-spin" /> : lead.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            {lead.is_archived ? 'Restore' : 'Archive'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact Info */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Contact Information</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: 'Email', value: lead.email, href: `mailto:${lead.email}` },
                { icon: Phone, label: 'Phone', value: lead.phone ?? '—', href: lead.phone ? `tel:${lead.phone}` : undefined },
                { icon: Building2, label: 'Business', value: lead.business_name },
                { icon: Globe, label: 'Website', value: lead.website ?? '—', href: lead.website ?? undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="space-y-1">
                  <p className="text-xxs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Icon size={11} /> {label}
                  </p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:text-gold-light transition-colors truncate block">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{value}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gold/8">
              <div>
                <p className="text-xxs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Service Interested In</p>
                <p className="text-sm text-foreground">{lead.service_interested ?? '—'}</p>
              </div>
              <div>
                <p className="text-xxs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Lead Source</p>
                <p className="text-sm text-foreground capitalize">{lead.source}</p>
              </div>
              <div>
                <p className="text-xxs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Date Submitted</p>
                <p className="text-sm text-foreground">
                  {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-3">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Internal Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Add notes about this lead, call outcomes, next steps…"
              className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-2 focus:ring-gold/15 transition-all resize-none"
            />
          </div>

          {/* Strategy Sessions */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Strategy Sessions</p>
              <Link href={`/admin/leads/${id}/session`} className="text-xs text-gold hover:text-gold-light transition-colors">
                + Log Session
              </Link>
            </div>
            {sessions.length === 0 ? (
              <div className="text-center py-6">
                <Calendar size={28} className="text-gold/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No sessions logged yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-background/40 border border-gold/8 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(s.scheduled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className={`text-xxs font-bold px-2 py-0.5 rounded-full border ${s.status === 'Completed' ? 'bg-green-500/15 text-green-400 border-green-500/25' : s.status === 'Canceled' ? 'bg-red-500/15 text-red-400 border-red-500/25' : 'bg-blue-500/15 text-blue-400 border-blue-500/25'}`}>
                        {s.status}
                      </span>
                    </div>
                    {s.notes && <p className="text-xs text-muted-foreground">{s.notes}</p>}
                    {s.outcomes && <p className="text-xs text-green-400/80">Outcome: {s.outcomes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Status & Metadata */}
        <div className="space-y-5">
          {/* Portal Integration Card */}
          <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Portal Account Status</p>
            
            {checkingProfile ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={13} className="animate-spin text-gold" /> Checking portal accounts…
              </div>
            ) : !profileForLead ? (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground bg-white/2 rounded-lg p-3 border border-gold/5 leading-relaxed">
                  No registered member account matches this email. You can directly invite them to create their client portal workspace.
                </div>
                <button
                  onClick={handleInviteClient}
                  disabled={promoting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-xs font-bold hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {promoting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <UserCheck size={13} />
                  )}
                  Invite Client Account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/2 border border-gold/5 rounded-lg p-3 space-y-1.5 text-xs">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <UserCheck size={13} className="text-gold" /> Registered Member Found
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    ID: {profileForLead.id}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    Current Role: <span className="font-bold text-gold uppercase tracking-wider">{profileForLead.role}</span>
                  </p>
                </div>

                {profileForLead.role === 'user' ? (
                  <button
                    onClick={handlePromote}
                    disabled={promoting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-xs font-bold hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {promoting ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={13} />
                    )}
                    Promote to Client
                  </button>
                ) : profileForLead.role === 'client' ? (
                  <div className="flex flex-col gap-2">
                    <div className="bg-green-500/10 border border-green-500/25 rounded-lg p-2.5 text-[10px] font-semibold text-green-400 flex items-center gap-1">
                      ✓ Active Client Dashboard Enabled
                    </div>
                    <button
                      onClick={handleDemote}
                      disabled={promoting}
                      className="w-full text-center text-[10px] text-muted-foreground hover:text-gold transition-colors underline py-1"
                    >
                      Demote to User
                    </button>
                  </div>
                ) : (
                  <div className="bg-gold/10 border border-gold/20 rounded-lg p-2.5 text-[10px] font-semibold text-gold">
                    Crown Executive Admin Account
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Lead Status</p>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${status === s ? STATUS_COLORS[s] : 'bg-background/40 border-gold/10 text-muted-foreground hover:border-gold/20 hover:text-foreground'}`}
                >
                  <Circle size={8} className={status === s ? 'fill-current' : 'opacity-40'} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Archive warning */}
          {lead.is_archived && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400">
              This lead is archived and hidden from the main list.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
