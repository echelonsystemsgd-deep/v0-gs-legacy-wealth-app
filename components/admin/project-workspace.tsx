'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X, Save, Archive, ArchiveRestore, Loader2,
  Upload, File, Trash2, Calendar, CheckCircle2, Circle,
  Send, MessageSquare, Plus, Clock, Sparkles, AlertCircle, FolderKanban,
  CalendarClock, TriangleAlert, ChevronDown, DollarSign, ExternalLink, Link2, Bell
} from 'lucide-react'
import { toast } from 'sonner'

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
  contract_type: string | null; retainer_amount: number; one_time_fee: number; rev_share_percentage: number
}
type Asset = { id: string; file_name: string; file_url: string; file_size: number | null; file_type: string | null; created_at: string }
type ClientProfile = { id: string; full_name: string | null; email: string | null; is_suspended?: boolean }
type UpdateItem = { id: string; title: string; description: string | null; created_at: string }
type MessageItem = { id: string; content: string; created_at: string; sender_id: string }
type ActionRequest = { id: string; title: string; description: string; status: 'pending' | 'submitted' | 'completed'; client_response: string | null; submitted_at: string | null; completed_at: string | null; created_at: string; due_date: string | null }

const getValidUrl = (url: string) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

interface ProjectWorkspaceProps {
  id: string
  isModal?: boolean
  onClose?: () => void
  initialTab?: 'config' | 'actions' | 'chat' | 'assets'
}

export function ProjectWorkspace({ id, isModal = false, onClose, initialTab }: ProjectWorkspaceProps) {
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [actionRequests, setActionRequests] = useState<ActionRequest[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'actions' | 'chat' | 'assets'>(initialTab || 'config')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  useEffect(() => {
    setIsSandboxInteractive(false)
  }, [activeTab])

  // Forms states
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
  
  // Custom contract schemes states
  const [contractType, setContractType] = useState<string>('')
  const [retainerAmount, setRetainerAmount] = useState('')
  const [oneTimeFee, setOneTimeFee] = useState('')
  const [revSharePercentage, setRevSharePercentage] = useState('')

  // Extension Override state
  const [showExtensionPanel, setShowExtensionPanel] = useState(false)
  const [extensionReason, setExtensionReason] = useState('')
  const [extensionDate, setExtensionDate] = useState('')
  const [applyingExtension, setApplyingExtension] = useState(false)

  // Detect current device for viewport default
  const getDeviceViewport = (): 'desktop' | 'tablet' | 'mobile' => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    if (w < 768) return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
  }

  // Viewport, custom accents, & nudge states
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>(() => getDeviceViewport())
  const [themeAccent, setThemeAccent] = useState('gold')
  const [themeFont, setThemeFont] = useState('sans')
  const [newRequestDueDate, setNewRequestDueDate] = useState('')
  const [nudgingRequest, setNudgingRequest] = useState<string | null>(null)
  const [isSandboxInteractive, setIsSandboxInteractive] = useState(false)
  
  // Mobile Staging Preview scale states & refs
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateWidth = () => {
      if (previewContainerRef.current) {
        setContainerWidth(previewContainerRef.current.getBoundingClientRect().width)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    const timer = setTimeout(updateWidth, 300)
    return () => {
      window.removeEventListener('resize', updateWidth)
      clearTimeout(timer)
    }
  }, [activeTab, viewportSize])

  // Updates & Messages states
  const [newUpdateTitle, setNewUpdateTitle] = useState('')
  const [newUpdateDesc, setNewUpdateDesc] = useState('')
  const [postingUpdate, setPostingUpdate] = useState(false)

  const [chatInput, setChatInput] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [adminUserId, setAdminUserId] = useState<string | null>(null)

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newRequestTitle, setNewRequestTitle] = useState('')
  const [newRequestDesc, setNewRequestDesc] = useState('')
  const [postingRequest, setPostingRequest] = useState(false)
  const [completingRequest, setCompletingRequest] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToChatBottom = () => {
    setTimeout(() => {
      const container = chatContainerRef.current
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 50)
  }

  useEffect(() => {
    scrollToChatBottom()
  }, [messages, activeTab])

  // Load project details
  useEffect(() => {
    const load = async () => {
      setLoading(true)
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
        supabase.from('profiles').select('id, full_name, email, is_suspended').eq('role', 'client'),
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
        
        setContractType(proj.contract_type ?? '')
        setRetainerAmount(proj.retainer_amount?.toString() ?? '0')
        setOneTimeFee(proj.one_time_fee?.toString() ?? '0')
        setRevSharePercentage(proj.rev_share_percentage?.toString() ?? '0')
        
        const dbAccent = proj.theme_accent ?? 'gold|sans'
        const parts = dbAccent.split('|')
        setThemeAccent(parts[0] ?? 'gold')
        setThemeFont(parts[1] ?? 'sans')
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

  // Re-detect device viewport on every client open
  useEffect(() => {
    setViewportSize(getDeviceViewport())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])


  useEffect(() => {
    const channel = supabase
      .channel(`admin_workspace_messages_${id}`)
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
              return [...prev, newMsg]
            })
            scrollToChatBottom()
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

  // Real-time action requests sync
  useEffect(() => {
    const channel = supabase
      .channel(`admin_workspace_actions_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_action_requests',
          filter: `project_id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newReq = payload.new as ActionRequest
            setActionRequests((prev) => {
              if (prev.some((r) => r.id === newReq.id)) return prev
              return [newReq, ...prev]
            })
            toast.info(`Client action request dispatched: ${newReq.title}`)
          } else if (payload.eventType === 'UPDATE') {
            const updatedReq = payload.new as ActionRequest
            setActionRequests((prev) =>
              prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
            )
            if (updatedReq.status === 'submitted') {
              toast.success(`Client submitted answers for: "${updatedReq.title}"!`)
            } else if (updatedReq.status === 'completed') {
              toast.success(`Task marked completed: "${updatedReq.title}"`)
            }
          } else if (payload.eventType === 'DELETE') {
            const oldReq = payload.old as any
            setActionRequests((prev) => prev.filter((r) => r.id !== oldReq.id))
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

  const extractDominantColor = (url: string) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 40) {
          const currR = data[i]
          const currG = data[i+1]
          const currB = data[i+2]
          const currA = data[i+3]
          if (currA > 200) {
            const max = Math.max(currR, currG, currB)
            const min = Math.min(currR, currG, currB)
            if (max - min > 30 && max < 240 && min > 15) {
              r += currR
              g += currG
              b += currB
              count++
            }
          }
        }
        
        if (count > 0) {
          const hex = "#" + [Math.round(r/count), Math.round(g/count), Math.round(b/count)].map(x => {
            const s = x.toString(16)
            return s.length === 1 ? '0' + s : s
          }).join('')
          setThemeAccent(hex)
          toast.success(`Extracted brand accent: ${hex}`)
        } else {
          toast.error("Could not find a distinct dominant color. Try a different image.")
        }
      } catch (e) {
        toast.error("Security policy blocked direct image reading. Ensure image is served with CORS.")
      }
    }
    img.onerror = () => {
      toast.error("Failed to load image for color extraction.")
    }
    img.src = url
  }

  const handleSave = async () => {
    setSaving(true)
    const retAmt = parseFloat(retainerAmount) || 0
    const otFee = parseFloat(oneTimeFee) || 0
    const revPct = parseFloat(revSharePercentage) || 0
    const cVal = contractType === 'one_time' ? otFee : contractType === 'retainer' ? retAmt : 0
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
      contract_type: contractType || null,
      retainer_amount: retAmt,
      one_time_fee: otFee,
      rev_share_percentage: revPct,
      theme_accent: `${themeAccent}|${themeFont}`,
    }).eq('id', id)

    setSaving(false)
    if (error) {
      toast.error(`Failed to save: ${error.message}`)
      return
    }
    toast.success('Workspace configurations updated.')
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
      contract_type: contractType || null,
      retainer_amount: retAmt,
      one_time_fee: otFee,
      rev_share_percentage: revPct,
      theme_accent: themeAccent,
    } : p)
  }

  const handleExtendLaunch = async () => {
    if (!extensionDate || !extensionReason) {
      toast.error('Please specify a valid extension date and reason.')
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
      toast.error('Extension applied but notifications failed to dispatch.')
    } else {
      toast.success('Launch timeline extended. Client has been notified.')
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
    if (error) { toast.error('Failed to change archival state.'); return }
    toast.success(newVal ? 'Project archived.' : 'Project restored.')
    setProject((p) => p ? { ...p, is_archived: newVal } : p)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const path = `${id}/${Date.now()}-${file.name}`
      const { data: storageData, error: storageErr } = await supabase.storage.from('project-assets').upload(path, file)
      if (storageErr) { toast.error(`Failed to upload ${file.name}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('project-assets').getPublicUrl(path)
      await supabase.from('project_assets').insert({
        project_id: id, file_name: file.name, file_url: publicUrl,
        file_size: file.size, file_type: file.type,
      })
    }
    const { data: newAssets } = await supabase.from('project_assets').select('*').eq('project_id', id).order('created_at', { ascending: false })
    setAssets(newAssets ?? [])
    setUploading(false)
    toast.success('Files uploaded to workspace.')
    e.target.value = ''
  }

  const handleDeleteAsset = async (assetId: string, fileUrl: string) => {
    const path = fileUrl.split('/project-assets/')[1]
    await supabase.storage.from('project-assets').remove([path])
    await supabase.from('project_assets').delete().eq('id', assetId)
    setAssets((prev) => prev.filter((a) => a.id !== assetId))
    setDeleteConfirm(null)
    toast.success('Asset deleted.')
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
    if (error) { toast.error('Failed to post update.'); return }

    setUpdates((prev) => [data, ...prev])
    setNewUpdateTitle('')
    setNewUpdateDesc('')
    toast.success('Operational timeline update published.')
  }

  const handleDeleteUpdate = async (updateId: string) => {
    const { error } = await supabase.from('project_updates').delete().eq('id', updateId)
    if (error) {
      toast.error('Failed to unsend update.')
    } else {
      setUpdates((prev) => prev.filter((u) => u.id !== updateId))
      toast.success('Project update unsent successfully.')
    }
  }

  const handleNudgeRequest = async (reqItem: ActionRequest) => {
    setNudgingRequest(reqItem.id)
    
    // 1. Post an automated chat message warning the client
    await supabase.from('messages').insert({
      project_id: id,
      sender_id: adminUserId,
      content: `⚠️ SYSTEM ALERT: Gentle nudge to review the outstanding Action Request: "${reqItem.title}". Please upload any pending files or approvals to prevent project launch delay.`,
    })

    // 2. Trigger timeline log update
    await supabase.from('project_updates').insert({
      project_id: id,
      title: `Action Request Nudge Issued`,
      description: `System alert dispatched for pending action task: "${reqItem.title}".`,
      created_by: adminUserId
    })

    setNudgingRequest(null)
    toast.success('Nudge system alert dispatched successfully.')
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
      setChatInput(text)
      toast.error('Message transmission failed.')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    const { error } = await supabase.from('messages').delete().eq('id', messageId)
    if (error) { toast.error('Failed to delete message.'); return }
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
    toast.success('Message deleted.')
  }

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRequestTitle.trim() || postingRequest) return
    setPostingRequest(true)
    const { data, error } = await supabase
      .from('project_action_requests')
      .insert({ 
        project_id: id, 
        title: newRequestTitle.trim(), 
        description: newRequestDesc.trim() || newRequestTitle.trim(),
        due_date: newRequestDueDate || null
      })
      .select()
      .single()
    setPostingRequest(false)
    if (error) { toast.error('Failed to generate action request.'); return }
    setActionRequests((prev) => [data as ActionRequest, ...prev])
    setNewRequestTitle('')
    setNewRequestDesc('')
    setNewRequestDueDate('')
    toast.success('New action request dispatched to client portal.')
  }

  const handleCompleteRequest = async (requestId: string) => {
    setCompletingRequest(requestId)
    const { error } = await supabase
      .from('project_action_requests')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', requestId)
    setCompletingRequest(null)
    if (error) { toast.error('Failed to update status.'); return }
    setActionRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'completed', completed_at: new Date().toISOString() } : r))
    toast.success('Action request approved and closed.')
  }

  const formatBytes = (b: number | null) => {
    if (!b) return '—'
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / (1024 * 1024)).toFixed(1)} MB`
  }

  const statusIdx = STATUS_STEPS.indexOf(status)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 size={32} className="animate-spin text-gold" />
        <span className="text-xs text-muted-foreground">Orchestrating workspace telemetry...</span>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-8 text-center glass border border-gold/10 rounded-2xl max-w-md mx-auto space-y-4">
        <AlertCircle size={28} className="text-red-400 mx-auto" />
        <p className="font-serif text-lg text-foreground font-bold">Workspace Unavailable</p>
        <p className="text-xs text-muted-foreground">The project container could not be resolved in the database logs.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 relative max-w-full ${isModal ? 'p-1' : 'max-w-6xl'}`}>
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-gold uppercase">
            <Sparkles size={11} className="animate-pulse" /> Project Command Console
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground truncate max-w-md">
            {project.project_name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Bespoke Mandate for client: <span className="text-foreground font-semibold">{project.client_name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleArchive}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gold/10 hover:border-gold/25 text-muted-foreground hover:text-foreground bg-white/[0.01] hover:bg-white/[0.03] transition-all"
          >
            {project.is_archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
            {project.is_archived ? 'Restore' : 'Archive'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save Changes
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Visual Stepper */}
      <div className="glass rounded-2xl border border-gold/10 p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70 mb-4">Operational Status Pipeline</p>
        <div className="flex items-center gap-0 w-full overflow-x-auto pb-1 scrollbar-none">
          {STATUS_STEPS.map((s, i) => {
            const done = i < statusIdx
            const active = i === statusIdx
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none min-w-[70px]">
                <button
                  onClick={() => setStatus(s)}
                  title={`Set status to ${s}`}
                  className="flex flex-col items-center gap-1.5 transition-all outline-none"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    done ? 'bg-green-500/20 border-green-500/50' 
                    : active ? 'bg-gold/20 border-gold shadow-[0_0_10px_rgba(201,162,39,0.3)]' 
                    : 'bg-background border-white/10 hover:border-gold/30'
                  }`}>
                    {done ? (
                      <CheckCircle2 size={14} className="text-green-400" />
                    ) : active ? (
                      <Circle size={8} className="fill-gold text-gold" />
                    ) : (
                      <Circle size={6} className="text-muted-foreground/30" />
                    )}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    active ? 'text-gold' : done ? 'text-green-400' : 'text-muted-foreground/60'
                  }`}>
                    {s}
                  </span>
                </button>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-1.5 transition-colors ${i < statusIdx ? 'bg-green-500/40' : 'bg-gold/10'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs Control Switcher */}
      <div className="flex border-b border-gold/10 p-0.5 bg-card/40 rounded-xl border max-w-md">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'config' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🛠️ Config
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex-1 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'actions' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📋 Actions
          {actionRequests.filter(r => r.status === 'submitted').length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'chat' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'assets' ? 'bg-gold/15 text-gold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📂 Assets
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        
        {/* TAB 1: CONFIGURATION */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left 2 Cols: Form Controls */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Telemetry Links Card */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70 flex items-center gap-1.5">
                  <Link2 size={13} className="text-gold" /> Deployment Telemetry Nodes
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Staging Preview Link</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={previewUrl}
                        onChange={(e) => setPreviewUrl(e.target.value)}
                        placeholder="https://staging.domain.com"
                        className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl pl-3 pr-8 py-2 text-xs text-foreground outline-none transition-all"
                      />
                      {previewUrl && (
                        <a href={getValidUrl(previewUrl)} target="_blank" rel="noopener noreferrer" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-gold transition-colors">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Live Website URL</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="https://www.domain.com"
                        className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl pl-3 pr-8 py-2 text-xs text-foreground outline-none transition-all"
                      />
                      {liveUrl && (
                        <a href={getValidUrl(liveUrl)} target="_blank" rel="noopener noreferrer" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-gold transition-colors">
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {previewUrl && (
                  <div className="pt-4 border-t border-gold/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Staging Viewport Console</span>
                      <div className="flex bg-black/40 border border-gold/10 p-0.5 rounded-lg text-[8px] font-bold">
                        <button
                          type="button"
                          onClick={() => setViewportSize('desktop')}
                          className={`px-2 py-1 rounded transition-all border-none cursor-pointer ${viewportSize === 'desktop' ? 'bg-gold/15 text-gold font-extrabold' : 'text-muted-foreground hover:text-foreground bg-transparent'}`}
                        >
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportSize('tablet')}
                          className={`px-2 py-1 rounded transition-all border-none cursor-pointer ${viewportSize === 'tablet' ? 'bg-gold/15 text-gold font-extrabold' : 'text-muted-foreground hover:text-foreground bg-transparent'}`}
                        >
                          Tablet
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewportSize('mobile')}
                          className={`px-2 py-1 rounded transition-all border-none cursor-pointer ${viewportSize === 'mobile' ? 'bg-gold/15 text-gold font-extrabold' : 'text-muted-foreground hover:text-foreground bg-transparent'}`}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>
                    
                    {(() => {
                      const targetWidth = viewportSize === 'mobile' ? 320 : viewportSize === 'tablet' ? 640 : 1024;
                      const paddingOffset = 32;
                      const availableWidth = containerWidth ? containerWidth - paddingOffset : 0;
                      const scale = availableWidth && availableWidth < targetWidth ? availableWidth / targetWidth : 1;

                      return (
                        <div ref={previewContainerRef} className="flex justify-center bg-black/60 rounded-xl p-4 border border-gold/5 relative overflow-hidden w-full">
                          <div className="absolute top-2 left-2 flex gap-1 z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                          </div>
                          
                          <div 
                            className="flex items-center justify-center overflow-hidden w-full animate-in fade-in duration-200"
                            style={{ height: '350px' }}
                          >
                            <div 
                              className="transition-all duration-300 border border-gold/15 rounded-lg overflow-hidden bg-background shadow-inner relative flex-shrink-0"
                              style={{
                                width: `${targetWidth}px`,
                                height: `${350 / scale}px`,
                                transform: `scale(${scale})`,
                                transformOrigin: 'top center',
                              }}
                            >
                              <iframe 
                                src={getValidUrl(previewUrl)} 
                                title="Staging Viewport Preview" 
                                className={`w-full h-full border-0 ${isSandboxInteractive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                sandbox="allow-scripts allow-same-origin"
                              />

                              {!isSandboxInteractive && (
                                <div 
                                  onClick={() => setIsSandboxInteractive(true)}
                                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] hover:bg-black/25 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 select-none group z-10"
                                >
                                  <span className="px-3.5 py-1.5 rounded-xl border border-gold/30 bg-black/85 text-gold text-[10px] font-bold uppercase tracking-wider group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(201,162,39,0.2)]">
                                    Click to Interact
                                  </span>
                                </div>
                              )}

                              {isSandboxInteractive && (
                                <button
                                  type="button"
                                  onClick={() => setIsSandboxInteractive(false)}
                                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/90 hover:bg-black border border-gold/35 text-gold text-[8px] font-bold uppercase tracking-wider shadow-lg transition-all z-20 cursor-pointer"
                                >
                                  Lock Viewport
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Financial Scheme Card */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70 flex items-center gap-1.5">
                  <DollarSign size={13} className="text-gold" /> Financial Strategy &amp; Contract Schemes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gold/10">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Contract Valuation Model</label>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all"
                    >
                      <option value="">Awaiting Client Selection</option>
                      <option value="retainer">Monthly Retainer</option>
                      <option value="one_time">One-Time Setup Fee</option>
                      <option value="rev_share">Performance Royalty Yield (PRY)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Amount Settled (£)</label>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder="0"
                      className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gold/70">Client Pricing Options (Pre-Set)</p>
                  <p className="text-[9px] text-muted-foreground/60 leading-relaxed -mt-1">Set the rate for each pricing model below. The active model is determined by the Contract Valuation selection above.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    {/* Model 1 — Monthly Retainer */}
                    <div className={`rounded-xl border p-3.5 space-y-2.5 transition-all ${
                      contractType === 'retainer'
                        ? 'border-gold/35 bg-gold/[0.04]'
                        : 'border-gold/10 bg-white/[0.01] opacity-70'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gold/80">Monthly Retainer</p>
                        {contractType === 'retainer' && (
                          <span className="text-[8px] font-bold uppercase tracking-wider text-gold bg-gold/10 border border-gold/25 px-1.5 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Rate (£/mo)</label>
                      <input
                        type="number"
                        value={retainerAmount}
                        onChange={(e) => setRetainerAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Model 2 — One-Time Setup Fee */}
                    <div className={`rounded-xl border p-3.5 space-y-2.5 transition-all ${
                      contractType === 'one_time'
                        ? 'border-gold/35 bg-gold/[0.04]'
                        : 'border-gold/10 bg-white/[0.01] opacity-70'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gold/80">One-Time Setup Fee</p>
                        {contractType === 'one_time' && (
                          <span className="text-[8px] font-bold uppercase tracking-wider text-gold bg-gold/10 border border-gold/25 px-1.5 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">Fee Amount (£)</label>
                      <input
                        type="number"
                        value={oneTimeFee}
                        onChange={(e) => setOneTimeFee(e.target.value)}
                        placeholder="0"
                        className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Model 3 — Performance Royalty Yield (PRY) */}
                    <div className={`rounded-xl border p-3.5 space-y-2.5 transition-all ${
                      contractType === 'rev_share'
                        ? 'border-gold/35 bg-gold/[0.04]'
                        : 'border-gold/10 bg-white/[0.01] opacity-70'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gold/80">Performance Royalty Yield</p>
                        {contractType === 'rev_share' && (
                          <span className="text-[8px] font-bold uppercase tracking-wider text-gold bg-gold/10 border border-gold/25 px-1.5 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">PRY Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={revSharePercentage}
                        onChange={(e) => setRevSharePercentage(e.target.value)}
                        placeholder="5.0"
                        className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all font-mono"
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* Timeline Settings */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70 flex items-center gap-1.5">
                  <Calendar size={13} className="text-gold" /> Build Schedule &amp; Target Milestones
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Project Initialized Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Target Launch Date</label>
                      <button
                        type="button"
                        onClick={() => setShowExtensionPanel(!showExtensionPanel)}
                        className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 px-2 py-0.5 rounded transition-all"
                      >
                        <CalendarClock size={9} /> Override
                      </button>
                    </div>
                    <input
                      type="date"
                      value={targetLaunchDate}
                      onChange={(e) => setTargetLaunchDate(e.target.value)}
                      className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>

                {showExtensionPanel && (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.02] space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <TriangleAlert size={12} className="text-amber-400 shrink-0" />
                      <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Deploy Extension Mechanism</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <select
                          value={extensionReason}
                          onChange={(e) => setExtensionReason(e.target.value)}
                          className="w-full bg-background border border-amber-500/20 hover:border-amber-500/35 rounded-lg px-3 py-1.5 text-[11px] text-foreground outline-none"
                        >
                          <option value="">Select failure trigger…</option>
                          <option value="client_delays">Client delays — late materials</option>
                          <option value="awaiting_materials">Awaiting client assets</option>
                          <option value="scope_expansion">Agreed scope increase</option>
                          <option value="technical_dependency">Third-party blocker</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="date"
                          value={extensionDate}
                          onChange={(e) => setExtensionDate(e.target.value)}
                          className="w-full bg-background border border-amber-500/20 hover:border-amber-500/35 rounded-lg px-3 py-1.5 text-[11px] text-foreground outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExtendLaunch}
                      disabled={applyingExtension || !extensionDate || !extensionReason}
                      className="w-full py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xxs font-bold transition-all disabled:opacity-40"
                    >
                      {applyingExtension ? 'Publishing override...' : 'Apply Extension & Notify Client'}
                    </button>
                  </div>
                )}
              </div>

              {/* Scope Description */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold/70 block">Project Description &amp; Specifications</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the detailed engineering scope of work, features, integrations..."
                  rows={4}
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3.5 py-3 text-xs text-foreground outline-none resize-none leading-relaxed"
                />
              </div>

            </div>

            {/* Right 1 Col: Sidebar Metadata */}
            <div className="space-y-5">
              
              {/* Bespoke Portal Accent Theme */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gold/70 block">Bespoke Portal Visuals</label>
                  <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-gold/10 text-gold tracking-widest">Branding Engine</span>
                </div>
                
                {/* Preset Select */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-muted-foreground block font-medium">Portal Accent Preset</label>
                  <select
                    value={['gold', 'emerald', 'sapphire', 'obsidian'].includes(themeAccent) ? themeAccent : 'custom'}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setThemeAccent('#C9A227')
                      } else {
                        setThemeAccent(e.target.value)
                      }
                    }}
                    className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all"
                  >
                    <option value="gold">✨ Aurum Gold (Preset)</option>
                    <option value="emerald">💚 Emerald Forest (Preset)</option>
                    <option value="sapphire">💙 Sapphire Ocean (Preset)</option>
                    <option value="obsidian">🖤 Obsidian Velvet (Preset)</option>
                    <option value="custom">🎨 Custom Brand Accent</option>
                  </select>
                </div>

                {/* Custom Color Input */}
                {!['gold', 'emerald', 'sapphire', 'obsidian'].includes(themeAccent) && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground block font-medium">Custom Brand Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeAccent.startsWith('#') ? themeAccent : '#C9A227'}
                        onChange={(e) => setThemeAccent(e.target.value)}
                        className="w-8 h-8 rounded-lg overflow-hidden border border-gold/15 bg-transparent cursor-pointer p-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={themeAccent}
                        onChange={(e) => setThemeAccent(e.target.value)}
                        placeholder="#HEXCODE"
                        className="flex-1 bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none font-mono transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Typography Accent */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-muted-foreground block font-medium">Bespoke Font Pairing</label>
                  <select
                    value={themeFont}
                    onChange={(e) => setThemeFont(e.target.value)}
                    className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all"
                  >
                    <option value="sans">🏢 Modernist Sans (Inter / Outfit)</option>
                    <option value="serif">🏛️ Luxurious Serif (Lora / Playfair)</option>
                    <option value="mono">💻 High-Tech Mono (Fira / JetBrains)</option>
                  </select>
                </div>

                {/* Logo color extraction helper */}
                {(() => {
                  const imageAssets = assets.filter(a => a.file_name?.match(/\.(png|jpg|jpeg|webp)$/i))
                  if (imageAssets.length === 0) return null
                  return (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Extract brand color from repository images:</label>
                      <div className="max-h-[90px] overflow-y-auto divide-y divide-gold/5 border border-gold/10 rounded-lg p-1.5 bg-background">
                        {imageAssets.map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => extractDominantColor(asset.file_url)}
                            className="w-full text-[10px] text-left py-1.5 hover:text-gold hover:bg-white/[0.02] px-1 truncate font-mono text-muted-foreground transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span className="truncate max-w-[80%]">{asset.file_name}</span>
                            <span className="text-[8px] uppercase font-bold text-gold/60 shrink-0">Extract</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                {/* Symmetrical Live Preview Widget */}
                <div className="pt-2 border-t border-gold/10 space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Portal Preview (Real-time)</span>
                  {(() => {
                    const getAccentColorHex = (accent: string) => {
                      if (accent === 'gold') return '#C9A227'
                      if (accent === 'emerald') return '#10B981'
                      if (accent === 'sapphire') return '#3B82F6'
                      if (accent === 'obsidian') return '#E2E8F0'
                      return accent
                    }
                    const currentHex = getAccentColorHex(themeAccent)
                    const fontClass = themeFont === 'serif' ? 'font-serif' : themeFont === 'mono' ? 'font-mono' : 'font-sans'
                    return (
                      <div 
                        className={`p-3.5 rounded-xl border bg-black/40 space-y-3 transition-all duration-300 ${fontClass}`}
                        style={{ borderColor: `${currentHex}20` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-muted-foreground">Mock Portal Badge</span>
                          <span 
                            className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border"
                            style={{ 
                              backgroundColor: `${currentHex}10`, 
                              color: currentHex, 
                              borderColor: `${currentHex}30` 
                            }}
                          >
                            ACTIVE MANDATE
                          </span>
                        </div>
                        <button 
                          type="button"
                          className="w-full py-1.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-black transition-all hover:opacity-90"
                          style={{ backgroundColor: currentHex }}
                        >
                          Launch Site Staging
                        </button>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Linked Client Panel */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold/70 block">Linked Portal Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none transition-all"
                >
                  <option value="">Unlinked (Awaiting Allocation)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name || 'Client'} ({c.email})
                    </option>
                  ))}
                </select>
                {clientId && (
                  <button
                    type="button"
                    onClick={async () => {
                      const client = clients.find(c => c.id === clientId)
                      if (!client) return
                      const nextSusp = !client.is_suspended
                      const { error } = await supabase.functions.invoke('admin-user-actions', {
                        body: { target_user_id: clientId, action: nextSusp ? 'suspend' : 'unsuspend' }
                      })
                      if (error) {
                        toast.error(error.message)
                        return
                      }
                      setClients(clients.map(c => c.id === clientId ? { ...c, is_suspended: nextSusp } : c))
                      toast.success(nextSusp ? 'Client portal access suspended.' : 'Client portal access activated.')
                    }}
                    className={`w-full py-1.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border text-center ${
                      clients.find(c => c.id === clientId)?.is_suspended
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                    }`}
                  >
                    {clients.find(c => c.id === clientId)?.is_suspended ? 'Reactivate Client Portal' : 'Freeze Portal / Lock Milestone'}
                  </button>
                )}
              </div>

              {/* Service Type Panel */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold/70 block">Service Model</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="e.g. Brand Strategy &amp; Web Engine"
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                />
              </div>

              {/* Notes Panel */}
              <div className="glass rounded-2xl border border-gold/10 p-5 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold/70 block">Administrative Notes (Internal)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal administrative logs, notes, client reminders..."
                  rows={6}
                  className="w-full bg-background border border-gold/15 hover:border-gold/25 focus:border-gold/40 rounded-xl px-3.5 py-3 text-xs text-foreground outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ACTION REQUESTS DESK */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            
            {/* Create action form */}
            <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70 flex items-center gap-1.5">
                <Plus size={13} className="text-gold" /> Issue New Action Mandate
              </p>
              <form onSubmit={handlePostRequest} className="space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Task Title (e.g., Stripe API Credentials)"
                    value={newRequestTitle}
                    onChange={(e) => setNewRequestTitle(e.target.value)}
                    className="bg-background/40 border border-gold/10 hover:border-gold/25 focus:border-gold/45 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Action Instructions / Details (optional)"
                    value={newRequestDesc}
                    onChange={(e) => setNewRequestDesc(e.target.value)}
                    className="bg-background/40 border border-gold/10 hover:border-gold/25 focus:border-gold/45 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">Due:</span>
                    <input
                      type="date"
                      value={newRequestDueDate}
                      onChange={(e) => setNewRequestDueDate(e.target.value)}
                      className="bg-background/40 border border-gold/10 hover:border-gold/25 focus:border-gold/45 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none transition-all w-full font-sans"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newRequestTitle.trim() || postingRequest}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 border border-gold/25 text-gold text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  {postingRequest ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Send Request to Client
                </button>
              </form>
            </div>

            {/* Existing actions list */}
            <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70">Action Telemetry History</p>
              {actionRequests.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground italic">No action requests catalogued.</div>
              ) : (
                <div className="space-y-3">
                  {actionRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all ${
                        req.status === 'completed' ? 'border-green-500/20 bg-green-500/[0.02]'
                        : req.status === 'submitted' ? 'border-amber-500/25 bg-amber-500/[0.02] shadow-[0_0_12px_rgba(212,175,55,0.02)]'
                        : 'border-gold/10 bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-bold text-foreground truncate">{req.title}</p>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              req.status === 'completed' ? 'bg-green-500/15 text-green-400 border-green-500/25'
                              : req.status === 'submitted' ? 'bg-amber-400/10 text-amber-400 border-amber-400/25'
                              : 'bg-white/5 text-muted-foreground border-white/10'
                            }`}>{req.status}</span>
                            {req.due_date && (
                              <span className="text-[8px] font-mono text-red-400 border border-red-500/20 bg-red-500/5 px-2 py-0.5 rounded-full">
                                Due: {new Date(req.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {req.description !== req.title && (
                            <p className="text-[10px] text-muted-foreground leading-normal">{req.description}</p>
                          )}
                          {req.client_response && (
                            <div className="mt-2.5 p-3 rounded-lg bg-black/40 border border-gold/10">
                              <p className="text-[9px] font-bold text-gold uppercase tracking-wider mb-1">Client Input:</p>
                              <p className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">{req.client_response}</p>
                            </div>
                          )}
                        </div>
                        {req.status === 'submitted' && (
                          <button
                            onClick={() => handleCompleteRequest(req.id)}
                            disabled={completingRequest === req.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xxs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            {completingRequest === req.id ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                            Approve Submission
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleNudgeRequest(req)}
                            disabled={nudgingRequest === req.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xxs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            {nudgingRequest === req.id ? <Loader2 size={10} className="animate-spin" /> : <Bell size={10} />}
                            Nudge Client
                          </button>
                        )}
                      </div>
                      <p className="text-[8px] text-muted-foreground/30 mt-2 font-mono">Dispatched: {new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: CLIENT CONVERSATIONS */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Conversation box */}
            <div className="lg:col-span-2 glass rounded-2xl border border-gold/10 overflow-hidden flex flex-col h-[500px]">
              <div className="px-4 py-3 bg-[#111111]/80 border-b border-gold/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-gold" />
                  <span className="text-xs font-bold text-foreground">Secure Channel Telemetry Feed</span>
                </div>
              </div>

              {/* Chat messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050505]/40 discord-scroll">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">No feed history available.</p>
                    <p className="text-[10px] text-muted-foreground/50">Send a system query to connect with this client portal.</p>
                  </div>
                ) : (
                  (() => {
                    let lastDateStr = ''
                    return messages.map((m) => {
                      const isMe = m.sender_id === adminUserId
                      const msgDateObj = new Date(m.created_at)
                      const messageDateStr = msgDateObj.toDateString()
                      const showDateHeader = lastDateStr !== messageDateStr
                      lastDateStr = messageDateStr

                      const isToday = messageDateStr === new Date().toDateString()
                      const formattedTime = isToday 
                        ? msgDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : `${msgDateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, ${msgDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

                      const displayDateHeader = showDateHeader ? (
                        <div className="flex items-center justify-center py-2 animate-in fade-in select-none w-full">
                          <span className="px-3 py-1 rounded-full bg-black/60 border border-gold/10 text-[8px] font-bold text-gold uppercase tracking-widest font-mono">
                            {isToday ? 'Today' : msgDateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      ) : null

                      return (
                        <div key={m.id} className="space-y-3 w-full">
                          {displayDateHeader}
                          <div className={`flex w-full group/msg items-center gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(m.id)}
                                className="opacity-0 group-hover/msg:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0 border-none bg-transparent cursor-pointer"
                                title="Purge Message"
                              >
                                <Trash2 size={10} />
                              </button>
                            )}
                            <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-purple-900/15 border border-purple-500/20 text-foreground rounded-tr-none'
                                : 'bg-gold/5 border border-gold/15 text-foreground rounded-tl-none'
                            }`}>
                              <span className="text-[7px] font-black text-gold/80 block uppercase tracking-widest mb-0.5">
                                {isMe ? 'Admin' : 'Client'}
                              </span>
                              <p className="whitespace-pre-wrap">{m.content}</p>
                              <span className="text-[7px] text-muted-foreground/45 block text-right mt-1 font-mono">
                                {formattedTime}
                              </span>
                            </div>
                            {isMe && (
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(m.id)}
                                className="opacity-0 group-hover/msg:opacity-100 p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0 border-none bg-transparent cursor-pointer"
                                title="Purge Message"
                              >
                                <Trash2 size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  })()
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-[#111111]/80 border-t border-gold/10 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={clientId ? "Enter query reply for client portal..." : "Awaiting client portal link..."}
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

            {/* Timeline updates publisher column */}
            <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4 h-fit">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70 flex items-center gap-1.5">
                <Clock size={12} /> Dispatch Timeline Status Log
              </p>
              <form onSubmit={handlePostUpdate} className="space-y-3">
                <input
                  type="text"
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  placeholder="Update headline (e.g. Design assets finalized)"
                  className="w-full bg-background border border-gold/15 rounded-xl px-3 py-2 text-xs text-foreground outline-none"
                />
                <textarea
                  value={newUpdateDesc}
                  onChange={(e) => setNewUpdateDesc(e.target.value)}
                  rows={3}
                  placeholder="Description details..."
                  className="w-full bg-background border border-gold/15 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={postingUpdate || !newUpdateTitle.trim()}
                  className="w-full py-2 bg-gold/10 border border-gold/25 hover:bg-gold/15 text-gold text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  Publish Log Update
                </button>
              </form>

              {/* Updates List scroll area */}
              {updates.length > 0 && (
                <div className="pt-3 border-t border-gold/10 space-y-3 max-h-[180px] overflow-y-auto divide-y divide-white/5 scrollbar-none">
                  {updates.map((up) => (
                    <div key={up.id} className="pt-2.5 first:pt-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-foreground">{up.title}</p>
                          {up.description && <p className="text-[10px] text-muted-foreground mt-0.5">{up.description}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[8px] text-muted-foreground font-mono">{new Date(up.created_at).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteUpdate(up.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all border-none bg-transparent cursor-pointer"
                            title="Unsend Timeline Update"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: WORKSPACE ASSETS */}
        {activeTab === 'assets' && (
          <div className="glass rounded-2xl border border-gold/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold/70">Secure Asset Repository</p>
              <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xxs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                uploading ? 'border-gold/25 text-muted-foreground bg-white/5' : 'border-gold/25 text-gold bg-gold/5 hover:bg-gold/10'
              }`}>
                {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
                {uploading ? 'Uploading…' : 'Upload Asset'}
                <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>

            {assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gold/10 rounded-xl text-center space-y-2">
                <Upload size={24} className="text-gold/25" />
                <p className="text-xs text-muted-foreground">Workspace asset repository is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assets.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-gold/10 group">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <File size={14} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-foreground hover:text-gold transition-colors truncate block">
                        {a.file_name}
                      </a>
                      <p className="text-[9px] text-muted-foreground">
                        {formatBytes(a.file_size)} · {a.file_type ?? 'unknown'} · {a.created_at ? new Date(a.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                    {deleteConfirm === a.id ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => handleDeleteAsset(a.id, a.file_url)} className="text-[9px] font-bold uppercase text-red-400 hover:text-red-300">Purge</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-[9px] font-bold uppercase text-muted-foreground">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(a.id)} className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      
    </div>
  )
}
