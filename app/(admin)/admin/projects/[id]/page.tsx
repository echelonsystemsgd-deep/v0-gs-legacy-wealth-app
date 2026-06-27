'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, Save, Archive, ArchiveRestore, Loader2,
  Upload, File, Trash2, Calendar, CheckCircle2, Circle,
  Send, MessageSquare, Plus, Clock, Sparkles, AlertCircle, FolderKanban,
  CalendarClock, TriangleAlert, ChevronDown
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
  client_id: string | null; live_url: string | null; preview_url: string | null
  contract_value: number; amount_paid: number
}
type Asset = { id: string; file_name: string; file_url: string; file_size: number | null; file_type: string | null; created_at: string }
type ClientProfile = { id: string; full_name: string | null; email: string | null }
type UpdateItem = { id: string; title: string; description: string | null; created_at: string }
type MessageItem = { id: string; content: string; created_at: string; sender_id: string }
type ActionRequest = { id: string; title: string; description: string; status: 'pending' | 'submitted' | 'completed'; client_response: string | null; submitted_at: string | null; completed_at: string | null; created_at: string }

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [clientId, setClientId] = useState<string>('')
  const [liveUrl, setLiveUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [contractValue, setContractValue] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [targetLaunchDate, setTargetLaunchDate] = useState('')

  // Extension Override state
  const [showExtensionPanel, setShowExtensionPanel] = useState(false)
  const [extensionReason, setExtensionReason] = useState('')
  const [extensionDate, setExtensionDate] = useState('')
  const [applyingExtension, setApplyingExtension] = useState(false)
  
  // Updates & Messages states
  const [newUpdateTitle, setNewUpdateTitle] = useState('')
  const [newUpdateDesc, setNewUpdateDesc] = useState('')
  const [postingUpdate, setPostingUpdate] = useState(false)
  
  const [chatInput, setChatInput] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [adminUserId, setAdminUserId] = useState<string | null>(null)
  
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Action Requests
  const [actionRequests, setActionRequests] = useState<ActionRequest[]>([])
  const [newRequestTitle, setNewRequestTitle] = useState('')
  const [newRequestDesc, setNewRequestDesc] = useState('')
  const [postingRequest, setPostingRequest] = useState(false)
  const [completingRequest, setCompletingRequest] = useState<string | null>(null)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Auto scroll chat to bottom
  const scrollToChatBottom = () => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  useEffect(() => {
    scrollToChatBottom()
  }, [messages])

  useEffect(() => {
    const load = async () => {
      // Get admin user session ID
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAdminUserId(user.id)

      const [
        { data: proj },
        { data: assetData },
        { data: clientData },
        { data: updatesData },
        { data: messagesData },
        { data: actionData },
      ] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('project_assets').select('*').eq('project_id', id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email').eq('role', 'client'),
        supabase.from('project_updates').select('*').eq('project_id', id).order('created_at', { ascending: false }),
        supabase.from('messages').select('*').eq('project_id', id).order('created_at', { ascending: true }),
        supabase.from('project_action_requests').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      ])

      if (proj) {
        setProject(proj)
        setNotes(proj.notes ?? '')
        setStatus(proj.status)
        setClientId(proj.client_id ?? '')
        setLiveUrl(proj.live_url ?? '')
        setPreviewUrl(proj.preview_url ?? '')
        setContractValue(proj.contract_value?.toString() ?? '0')
        setAmountPaid(proj.amount_paid?.toString() ?? '0')
        setServiceType(proj.service_type ?? '')
        setDescription(proj.description ?? '')
        setStartDate(proj.start_date ?? '')
        setTargetLaunchDate(proj.target_launch_date ?? '')
      }
      setAssets(assetData ?? [])
      setClients(clientData ?? [])
      setUpdates(updatesData ?? [])
      setMessages(messagesData ?? [])
      setActionRequests((actionData as ActionRequest[]) ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  // Real-time messages listener
  useEffect(() => {
    const channel = supabase
      .channel(`admin_project_messages_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as any
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev
              return [
                ...prev,
                {
                  id: newMsg.id,
                  content: newMsg.content,
                  created_at: newMsg.created_at,
                  sender_id: newMsg.sender_id,
                },
              ]
            })
          } else if (payload.eventType === 'DELETE') {
            const oldMsg = payload.old as any
            setMessages((prev) => prev.filter((m) => m.id !== oldMsg.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, id])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)

  const handleSave = async () => {
    setSaving(true)
    const cVal = parseFloat(contractValue) || 0
    const aPaid = parseFloat(amountPaid) || 0
    const { error } = await supabase.from('projects').update({
      notes,
      status,
      client_id: clientId || null,
      live_url: liveUrl || null,
      preview_url: previewUrl || null,
      contract_value: cVal,
      amount_paid: aPaid,
      service_type: serviceType || null,
      description: description || null,
      start_date: startDate || null,
      target_launch_date: targetLaunchDate || null,
    }).eq('id', id)
    setSaving(false)
    if (error) { showToast('Failed to save.', 'error'); return }
    showToast('Project updated.')
    setProject((p) => p ? {
      ...p, notes, status,
      client_id: clientId || null,
      live_url: liveUrl || null,
      preview_url: previewUrl || null,
      contract_value: cVal,
      amount_paid: aPaid,
      service_type: serviceType || null,
      description: description || null,
      start_date: startDate || null,
      target_launch_date: targetLaunchDate || null,
    } : p)
  }

  const handleExtendLaunch = async () => {
    if (!extensionDate || !extensionReason) {
      showToast('Please select a new date and reason.', 'error')
      return
    }
    setApplyingExtension(true)
    const formattedDate = new Date(extensionDate).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    const reasonMap: Record<string, string> = {
      'client_delays': 'delays in the provision of required materials',
      'scope_expansion': 'an agreed expansion of the project scope',
      'awaiting_materials': 'outstanding client-side assets and information',
      'technical_dependency': 'resolution of a third-party technical dependency',
    }
    const reasonText = reasonMap[extensionReason] || extensionReason
    const noticeBody = `Following a strategic review of active project dependencies, your scheduled deployment date has been revised to ${formattedDate}.

Reason: This extension has been applied due to ${reasonText}.

GS Legacy Wealth remains fully committed to delivering a system that exceeds your expectations and is continuing to operate at maximum capacity.

Important Notice: As stipulated in your service agreement, consistent delays in the provision of required materials, approvals, or client responses may result in contractual delay surcharges being applied to your account. Our team is available to ensure this does not apply to your engagement — please action any outstanding requests without delay.`

    const [updateRes, requestRes, dateRes] = await Promise.all([
      supabase.from('project_updates').insert({
        project_id: id,
        title: `Deployment Vector Revised — ${formattedDate}`,
        description: noticeBody,
        created_by: adminUserId,
      }),
      supabase.from('project_action_requests').insert({
        project_id: id,
        title: 'Timeline Extension Notice — Action Required',
        description: noticeBody,
        status: 'pending',
      }),
      supabase.from('projects').update({ target_launch_date: extensionDate }).eq('id', id),
    ])

    setApplyingExtension(false)
    if (updateRes.error || requestRes.error || dateRes.error) {
      showToast('Extension applied but some notifications failed.', 'error')
    } else {
      showToast('Extension applied. Client has been notified.')
      setTargetLaunchDate(extensionDate)
      setProject((p) => p ? { ...p, target_launch_date: extensionDate } : p)
      setShowExtensionPanel(false)
      setExtensionReason('')
      setExtensionDate('')
    }
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

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUpdateTitle.trim() || postingUpdate) return
    setPostingUpdate(true)

    const { data, error } = await supabase.from('project_updates').insert({
      project_id: id,
      title: newUpdateTitle.trim(),
      description: newUpdateDesc.trim() || null,
      created_by: adminUserId,
    }).select().single()

    setPostingUpdate(false)
    if (error) {
      showToast('Failed to post update.', 'error')
      return
    }

    setUpdates((prev) => [data, ...prev])
    setNewUpdateTitle('')
    setNewUpdateDesc('')
    showToast('Client update published.')
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || sendingMsg || !adminUserId) return
    setSendingMsg(true)
    const text = chatInput.trim()
    setChatInput('')

    const { error } = await supabase.from('messages').insert({
      project_id: id,
      sender_id: adminUserId,
      content: text,
    })

    setSendingMsg(false)
    if (error) {
      console.error(error)
      setChatInput(text)
      showToast('Message send failed.', 'error')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) {
      showToast('Failed to delete message.', 'error')
      return
    }
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
    showToast('Message deleted.')
  }

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRequestTitle.trim() || postingRequest) return
    setPostingRequest(true)
    const { data, error } = await supabase
      .from('project_action_requests')
      .insert({ project_id: id, title: newRequestTitle.trim(), description: newRequestDesc.trim() || newRequestTitle.trim() })
      .select()
      .single()
    setPostingRequest(false)
    if (error) { showToast('Failed to create request.', 'error'); return }
    setActionRequests((prev) => [data as ActionRequest, ...prev])
    setNewRequestTitle('')
    setNewRequestDesc('')
    showToast('Action request sent to client.')
  }

  const handleCompleteRequest = async (requestId: string) => {
    setCompletingRequest(requestId)
    const { error } = await supabase
      .from('project_action_requests')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', requestId)
    setCompletingRequest(null)
    if (error) { showToast('Failed to mark complete.', 'error'); return }
    setActionRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'completed', completed_at: new Date().toISOString() } : r))
    showToast('Request marked as completed.')
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
    <div className="space-y-6 max-w-5xl relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-4 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl flex items-center gap-2 animate-fade-in ${
          toast.type === 'error'
            ? 'bg-red-500/15 border-red-500/30 text-red-400'
            : 'bg-green-500/15 border-green-500/30 text-green-400'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold/15 text-muted-foreground hover:text-gold hover:border-gold/30 transition-all shrink-0">
            <ArrowLeft size={15} />
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-gold uppercase">
              <FolderKanban size={12} /> Project Workspace Details
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-0.5">{project.project_name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <button onClick={handleArchive} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/15 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-gold/25 transition-all cursor-pointer">
            {project.is_archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            {project.is_archived ? 'Restore' : 'Archive'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all disabled:opacity-60 cursor-pointer">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
        </div>
      </div>

      {/* Progress Milestones */}
      <div className="glass rounded-2xl border border-gold/10 p-6">
        <p className="text-xxs font-bold uppercase tracking-widest text-gold/70 mb-5">Status Pipeline</p>
        <div className="flex items-center gap-0 w-full overflow-x-auto pb-2 scrollbar-thin">
          {STATUS_STEPS.map((s, i) => {
            const done = i < statusIdx
            const active = i === statusIdx
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none min-w-[80px]">
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
        {/* Left Columns - Details, Notes, Assets */}
        <div className="lg:col-span-2 space-y-5">
          {/* Metadata Info */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Project Configuration</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Mapped Client Selector */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Linked Portal Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                >
                  <option value="">Unlinked (No portal access)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name || 'Client'} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Service Type</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="e.g. Full Website Build"
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Preview Staging Link */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Staging Preview Link</label>
                <input
                  type="text"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="https://staging.myproject.com"
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Production Live Link */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Live Website URL</label>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://www.myproject.com"
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Contract Value */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Contract Value (£)</label>
                <input
                  type="number"
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  placeholder="0"
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Amount Paid */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Amount Paid (£)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0"
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Start Date — Admin editable */}
              <div>
                <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Project Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Target Launch Date — Admin editable with Extension Override */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">Target Launch Date</label>
                  <button
                    type="button"
                    onClick={() => setShowExtensionPanel(!showExtensionPanel)}
                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 px-2 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    <CalendarClock size={10} />
                    Extension Override
                    <ChevronDown size={9} className={`transition-transform ${showExtensionPanel ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <input
                  type="date"
                  value={targetLaunchDate}
                  onChange={(e) => setTargetLaunchDate(e.target.value)}
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />

                {/* Extension Override Panel */}
                {showExtensionPanel && (
                  <div className="mt-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <TriangleAlert size={13} className="text-amber-400 shrink-0" />
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Timeline Extension Override</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      This will update the target launch date, post a formal notice to the client&apos;s updates feed, and create a mandatory action request informing them of the extension and potential fee implications.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Extension Reason</label>
                        <select
                          value={extensionReason}
                          onChange={(e) => setExtensionReason(e.target.value)}
                          className="w-full bg-background border border-amber-500/20 hover:border-amber-500/35 focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-foreground outline-none"
                        >
                          <option value="">Select a reason…</option>
                          <option value="client_delays">Client delays — late provision of materials</option>
                          <option value="awaiting_materials">Awaiting outstanding client assets</option>
                          <option value="scope_expansion">Agreed scope expansion</option>
                          <option value="technical_dependency">Third-party technical dependency</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">New Target Date</label>
                        <input
                          type="date"
                          value={extensionDate}
                          onChange={(e) => setExtensionDate(e.target.value)}
                          className="w-full bg-background border border-amber-500/20 hover:border-amber-500/35 focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-foreground outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExtendLaunch}
                      disabled={applyingExtension || !extensionDate || !extensionReason}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                    >
                      {applyingExtension ? <Loader2 size={12} className="animate-spin" /> : <CalendarClock size={12} />}
                      Apply Extension &amp; Notify Client
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2 border-t border-gold/10">
              <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Description / Scope Overview</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline the detailed engineering scope of work, features, integrations..."
                rows={3}
                className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none resize-none leading-relaxed"
              />
            </div>
          </div>


          {/* Timeline Updates publisher */}
          <div className="glass rounded-2xl border border-gold/10 p-6 space-y-4">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70 flex items-center gap-2">
              <Clock size={12} /> Post Timeline Update (Client Updates Feed)
            </p>
            <form onSubmit={handlePostUpdate} className="space-y-3">
              <input
                type="text"
                value={newUpdateTitle}
                onChange={(e) => setNewUpdateTitle(e.target.value)}
                placeholder="Update title (e.g. Figma wireframes approved)"
                className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
              />
              <textarea
                value={newUpdateDesc}
                onChange={(e) => setNewUpdateDesc(e.target.value)}
                rows={2}
                placeholder="Optional description / details of what was done..."
                className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none resize-none"
              />
              <button
                type="submit"
                disabled={postingUpdate || !newUpdateTitle.trim()}
                className="px-4 py-2 bg-gold/10 border border-gold/25 hover:bg-gold/15 text-gold text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Plus size={12} /> Publish Update
              </button>
            </form>

            {/* Updates list */}
            {updates.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gold/10 space-y-3 max-h-[220px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                {updates.map((up) => (
                  <div key={up.id} className="pt-3 first:pt-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-foreground">{up.title}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{new Date(up.created_at).toLocaleDateString()}</span>
                    </div>
                    {up.description && <p className="text-[10px] text-muted-foreground mt-0.5">{up.description}</p>}
                  </div>
                ))}
              </div>
            )}
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

        {/* Right panel - Chat box & Status */}
        <div className="space-y-6">
          <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
            <p className="text-xxs font-bold uppercase tracking-widest text-gold/70">Current Status</p>
            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold border ${STATUS_COLORS[status]}`}>{status}</span>
            {project.is_archived && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400 mt-3">
                This project is archived.
              </div>
            )}
          </div>

          {/* Project Chat feed */}
          <div className="glass rounded-2xl border border-gold/10 overflow-hidden flex flex-col h-[400px] shadow-lg">
            <div className="px-4 py-3 bg-[#111111]/80 border-b border-gold/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-gold" />
                <span className="text-xs font-bold text-foreground">Client Workspace Chat</span>
              </div>
            </div>

            {/* Message lists */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/10">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground/60">No conversation history.</p>
                  <p className="text-[10px] text-muted-foreground/45 leading-normal">Send a message to start communicating with the client inside their dashboard.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender_id === adminUserId
                  return (
                    <div key={m.id} className={`flex w-full group/msg items-center gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="opacity-0 group-hover/msg:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all cursor-pointer shrink-0"
                          title="Delete Client Message"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-normal ${
                        isMe
                          ? 'bg-[#1A0A2E]/50 border border-purple-500/20 text-foreground rounded-tr-none'
                          : 'bg-gold/5 border border-gold/20 text-foreground rounded-tl-none'
                      }`}>
                        <span className="text-[8px] font-bold text-gold/80 block uppercase tracking-widest mb-0.5">
                          {isMe ? 'Admin' : 'Client'}
                        </span>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                        <span className="text-[7px] text-muted-foreground/40 block text-right mt-1 font-mono">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {isMe && (
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="opacity-0 group-hover/msg:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all cursor-pointer shrink-0"
                          title="Unsend Message"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Input tray */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#111111]/80 border-t border-gold/10 shrink-0 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Reply to client..."
                disabled={sendingMsg || !clientId}
                className="flex-1 bg-background/50 border border-gold/15 rounded-lg px-3 py-2 text-xs text-foreground placeholder-muted-foreground/60 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || sendingMsg || !clientId}
                className="bg-gold hover:bg-gold-light text-background font-bold shrink-0 w-8 h-8 rounded-lg p-0 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Action Requests Desk ── */}
      <div className="mt-8 p-6 glass rounded-2xl border border-gold/15 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-gold/10">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Sparkles size={14} className="text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-foreground">Action Requests Desk</h3>
            <p className="text-xxs text-muted-foreground">Request files, copy, or information from the client. They see it immediately on their dashboard.</p>
          </div>
        </div>

        {/* Create new request */}
        <form onSubmit={handlePostRequest} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Request title (e.g. Google Analytics Access)"
              value={newRequestTitle}
              onChange={(e) => setNewRequestTitle(e.target.value)}
              className="bg-background/40 border border-gold/10 hover:border-gold/25 focus:border-gold/45 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Details / instructions (optional)"
              value={newRequestDesc}
              onChange={(e) => setNewRequestDesc(e.target.value)}
              className="bg-background/40 border border-gold/10 hover:border-gold/25 focus:border-gold/45 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!newRequestTitle.trim() || postingRequest}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/25 text-gold text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
          >
            {postingRequest ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Send Request to Client
          </button>
        </form>

        {/* Existing requests */}
        {actionRequests.length > 0 ? (
          <div className="space-y-3">
            {actionRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-xl border transition-all ${
                  req.status === 'completed' ? 'border-green-500/20 bg-green-500/[0.03]'
                  : req.status === 'submitted' ? 'border-gold/25 bg-gold/[0.03]'
                  : 'border-gold/10 bg-white/[0.01]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-foreground truncate">{req.title}</p>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        req.status === 'completed' ? 'bg-green-500/15 text-green-400 border-green-500/25'
                        : req.status === 'submitted' ? 'bg-gold/15 text-gold border-gold/25'
                        : 'bg-white/5 text-muted-foreground border-white/10'
                      }`}>{req.status}</span>
                    </div>
                    {req.description !== req.title && (
                      <p className="text-xxs text-muted-foreground">{req.description}</p>
                    )}
                    {req.client_response && (
                      <div className="mt-2 p-3 rounded-lg bg-gold/5 border border-gold/15">
                        <p className="text-[9px] font-bold text-gold uppercase tracking-wider mb-1">Client Response:</p>
                        <p className="text-xs text-foreground whitespace-pre-wrap">{req.client_response}</p>
                        {req.submitted_at && (
                          <p className="text-[8px] text-muted-foreground/50 mt-1 font-mono">{new Date(req.submitted_at).toLocaleString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {req.status === 'submitted' && (
                    <button
                      onClick={() => handleCompleteRequest(req.id)}
                      disabled={completingRequest === req.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xxs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {completingRequest === req.id ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                      Mark Complete
                    </button>
                  )}
                </div>
                <p className="text-[8px] text-muted-foreground/40 mt-2 font-mono">{new Date(req.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-gold/8 text-center">
            <p className="text-xs text-muted-foreground/60">No active requests. Use the form above to request information from your client.</p>
          </div>
        )}
      </div>
    </div>
  )
}
