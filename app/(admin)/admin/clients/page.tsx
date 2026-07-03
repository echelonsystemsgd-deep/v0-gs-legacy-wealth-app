'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useInspector } from '@/hooks/use-inspector'
import { createClient } from '@/lib/supabase/client'
import {
  Users as UsersIcon,
  Plus,
  Search,
  Filter,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  Building,
  UserCheck,
  UserX,
  Loader2,
  CheckCircle2,
  RefreshCw,
  FolderKanban,
  Edit2,
  Trash2,
  ChevronRight,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  X,
  ShieldAlert,
  Eye,
  Activity,
  LayoutGrid,
} from 'lucide-react'
import { ClientHealthGrid, type ProjectWithHealth, getHealthLabel } from '@/components/admin/client-health-grid'
import { toast } from 'sonner'

// Define Types
type ClientProfile = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: 'admin' | 'user' | 'client'
  is_suspended: boolean
  has_completed_tour: boolean
  phone_number: string | null
  company_name?: string | null // Virtual / metadata field
  created_at: string
}

type Project = {
  id: string
  client_id: string | null
  client_name: string
  project_name: string
  status: 'Discovery' | 'Design' | 'Development' | 'Revision' | 'Complete'
  contract_value: number
  amount_paid: number
}

type StrategySession = {
  id: string
  client_id: string | null
  lead_id: string | null
  scheduled_at: string
  status: 'Scheduled' | 'Canceled' | 'No Show' | 'Completed'
  notes: string | null
  session_categories?: { name: string } | null
}

export default function ClientsPage() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setIsOpen: setInspectorOpen } = useInspector()

  const handleInspectClient = (clientId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('clientId', clientId)
    params.delete('leadId')
    params.delete('projectId')
    router.push(`${pathname}?${params.toString()}`)
    setInspectorOpen(true)
  }

  const [loading, setLoading] = useState(false)
  const [modalTab, setModalTab] = useState<'activity' | 'profile' | 'security'>('activity')

  // Real Database States
  const [dbClients, setDbClients] = useState<ClientProfile[]>([])
  const [dbProjects, setDbProjects] = useState<Project[]>([])
  const [dbSessions, setDbSessions] = useState<StrategySession[]>([])
  const [dbLeads, setDbLeads] = useState<any[]>([])

  // Search & Filter States
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')

  // Selected Client details panel
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null)
  const [clientProjects, setClientProjects] = useState<Project[]>([])
  const [clientSessions, setClientSessions] = useState<StrategySession[]>([])
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // View state: directory or health board
  const [activeView, setActiveView] = useState<'directory' | 'health'>('directory')

  // Health board filter
  const [healthSearch, setHealthSearch] = useState('')
  const [healthFilter, setHealthFilter] = useState<'All' | 'Blocked' | 'Awaiting Client' | 'On Track' | 'Suspended'>('All')

  // Messages (for health board unread counts)
  const [allMessages, setAllMessages] = useState<{ id: string; project_id: string; sender_id: string; created_at: string }[]>([])

  // Action requests (for health board detail modals)
  const [dbActionRequests, setDbActionRequests] = useState<any[]>([])

  // Edit / Add client form
  const [showAddModal, setShowAddModal] = useState(false)
  const [clientForm, setClientForm] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    isSuspended: false,
    role: 'client' as 'admin' | 'client' | 'user'
  })

  // Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [clientToDelete, setClientToDelete] = useState<ClientProfile | null>(null)

  const triggerToast = (msg: string) => {
    if (msg.toLowerCase().includes('failed') || msg.toLowerCase().includes('error')) {
      toast.error(msg)
    } else {
      toast.success(msg)
    }
  }

  // Fetch Database Data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // 0. Fetch current user session
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }

      // 1. Fetch all profiles (Admins, Clients, Users)
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (pErr) throw pErr

      // Map profiles and reuse address_line2 as company name
      const mappedProfiles = (profiles ?? []).map(p => ({
        ...p,
        company_name: (p as any).address_line2 || (p.role === 'admin' ? 'Internal' : 'Direct Business')
      }))
      setDbClients(mappedProfiles as any)

      // 2. Fetch projects
      const { data: projs, error: prErr } = await supabase
        .from('projects')
        .select('*')
      if (prErr) throw prErr
      setDbProjects((projs as any) ?? [])

      // 3. Fetch strategy sessions
      const { data: sess, error: sErr } = await supabase
        .from('strategy_sessions')
        .select(`
          id, client_id, lead_id, scheduled_at, status, notes,
          session_categories(name)
        `)
      if (sErr) throw sErr
      setDbSessions((sess as any) ?? [])

      // 4. Fetch leads
      const { data: leads, error: lErr } = await supabase
        .from('leads')
        .select('*')
      if (lErr) throw lErr
      setDbLeads((leads as any) ?? [])

      // 5. Fetch messages for health board unread counts
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, project_id, sender_id, created_at')
      setAllMessages((msgs as any) ?? [])

      // 6. Fetch action requests
      const { data: actionReqs } = await supabase
        .from('project_action_requests')
        .select('id, project_id, title, description, status, client_response, submitted_at, created_at')
      setDbActionRequests((actionReqs as any) ?? [])

    } catch (err: any) {
      triggerToast(`Database fetch error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Sync tab switcher view parameter
  const viewParam = searchParams.get('view')
  useEffect(() => {
    if (viewParam === 'health') {
      setActiveView('health')
    } else {
      setActiveView('directory')
    }
  }, [viewParam])

  // Map sub-relations when a client is selected
  useEffect(() => {
    if (selectedClient) {
      const associatedProjs = dbProjects.filter(p => p.client_id === selectedClient.id)
      
      const associatedLead = dbLeads.find(l => l.email === selectedClient.email)
      const associatedSess = dbSessions.filter(s => 
        s.client_id === selectedClient.id || 
        (associatedLead && s.lead_id === associatedLead.id)
      )

      setClientProjects(associatedProjs)
      setClientSessions(associatedSess)
    }
  }, [selectedClient, dbProjects, dbSessions, dbLeads])

  // Sorting Logic: Admin first, then Client (Active first), then User.
  // Within groups, sorted by created_at desc.
  const sortedProfiles = useMemo(() => {
    const admins = dbClients.filter(c => c.role === 'admin')
    const clients = dbClients.filter(c => c.role === 'client')
    const users = dbClients.filter(c => c.role === 'user')

    // Sort Admins by created_at desc
    admins.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Sort Users by created_at desc
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Sort Clients: active/in-progress first, then completed/inactive
    const activeClients: ClientProfile[] = []
    const inactiveClients: ClientProfile[] = []

    clients.forEach(c => {
      const clientProjs = dbProjects.filter(p => p.client_id === c.id)
      const hasActiveProject = clientProjs.length > 0 && clientProjs.some(p => p.status !== 'Complete')
      if (hasActiveProject) {
        activeClients.push(c)
      } else {
        inactiveClients.push(c)
      }
    })

    activeClients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    inactiveClients.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return [...admins, ...activeClients, ...inactiveClients, ...users]
  }, [dbClients, dbProjects])

  // Filtering Logic
  const filteredClients = useMemo(() => {
    return sortedProfiles.filter(c => {
      const name = c.full_name || ''
      const email = c.email || ''
      const company = c.company_name || ''
      
      const associatedLead = dbLeads.find(l => l.email === c.email)
      const leadBusiness = associatedLead?.business_name || ''
      const leadService = associatedLead?.service_interested || ''

      const matchSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        company.toLowerCase().includes(search.toLowerCase()) ||
        leadBusiness.toLowerCase().includes(search.toLowerCase()) ||
        leadService.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())

      const isSusp = c.is_suspended
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && !isSusp) ||
        (statusFilter === 'Suspended' && isSusp)

      const matchRole =
        roleFilter === 'All' ||
        roleFilter.toLowerCase() === c.role.toLowerCase()

      return matchSearch && matchStatus && matchRole
    })
  }, [sortedProfiles, search, statusFilter, roleFilter, dbLeads])

  // Toggle suspension state
  const handleToggleSuspension = async (client: ClientProfile) => {
    if (client.id === currentUserId) {
      triggerToast('You cannot suspend your own admin account.')
      return
    }
    const nextSuspended = !client.is_suspended

    setLoading(true)
    try {
      const { error } = await supabase.functions.invoke('admin-user-actions', {
        body: { target_user_id: client.id, action: nextSuspended ? 'suspend' : 'unsuspend' }
      })

      if (error) throw error
      triggerToast(nextSuspended ? 'Account access suspended.' : 'Account access activated.')
      fetchData()
      if (selectedClient?.id === client.id) {
        setSelectedClient({ ...selectedClient, is_suspended: nextSuspended })
      }
    } catch (err: any) {
      triggerToast(`Update failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Reset onboarding tour
  const handleResetTour = async (client: ClientProfile) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ has_completed_tour: false })
        .eq('id', client.id)

      if (error) throw error
      triggerToast('Client onboarding tour reset successfully.')
      fetchData()
      if (selectedClient?.id === client.id) {
        setSelectedClient({ ...selectedClient, has_completed_tour: false })
      }
    } catch (err: any) {
      triggerToast(`Reset failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    if (clientToDelete.id === currentUserId) {
      triggerToast('You cannot delete your own admin account.')
      return
    }
    const expectedText = (clientToDelete.email || '').trim().toLowerCase()
    if (deleteConfirmText.trim().toLowerCase() !== expectedText) {
      triggerToast('Confirmation email does not match.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.functions.invoke('admin-user-actions', {
        body: { target_user_id: clientToDelete.id, action: 'delete' }
      })

      if (error) throw error
      triggerToast('Account deleted successfully.')
      setSelectedClient(null)
      setShowDeleteModal(false)
      setDeleteConfirmText('')
      fetchData()
    } catch (err: any) {
      triggerToast(`Deletion failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Create or Update Client Profile
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      if (clientForm.id) {
        // Editing existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: clientForm.fullName,
            email: clientForm.email,
            phone_number: clientForm.phone,
            address_line2: clientForm.company,
            role: clientForm.role
          })
          .eq('id', clientForm.id)

        if (error) throw error
        triggerToast('Profile updated.')
        setShowAddModal(false)
        fetchData()
        if (selectedClient?.id === clientForm.id) {
          setSelectedClient({
            ...selectedClient,
            full_name: clientForm.fullName,
            email: clientForm.email,
            phone_number: clientForm.phone,
            company_name: clientForm.company,
            role: clientForm.role
          })
        }
      } else {
        // Creating/inviting new user
        const response = await fetch('/api/admin/invite-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: clientForm.email,
            fullName: clientForm.fullName,
            phone: clientForm.phone,
            company: clientForm.company,
            role: clientForm.role
          })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Failed to dispatch invitation.')

        triggerToast(`Account invitation dispatched for role: ${clientForm.role}`)
        setShowAddModal(false)
        fetchData()
      }
    } catch (err: any) {
      triggerToast(`Operation failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Helpers to Render Key Details Columns in Directory Table
  const renderKeyDetails = (c: ClientProfile) => {
    if (c.role === 'admin') {
      return <span className="text-xs text-muted-foreground font-mono">System Administrator</span>
    }

    if (c.role === 'client') {
      const clientProjs = dbProjects.filter(p => p.client_id === c.id)
      const activeProj = clientProjs.find(p => p.status !== 'Complete') || clientProjs[0]
      if (activeProj) {
        return (
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-foreground truncate max-w-[180px]">
              {activeProj.project_name}
            </div>
            <div className="text-[10px] text-gold flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 animate-pulse" />
              {activeProj.status} · £{activeProj.amount_paid.toLocaleString()} Paid
            </div>
          </div>
        )
      }
      return <span className="text-xs text-muted-foreground/60 italic">No projects registered</span>
    }

    // role === 'user' (Prospect)
    const associatedLead = dbLeads.find(l => l.email === c.email)
    if (associatedLead) {
      return (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-foreground truncate max-w-[180px]">
            Lead: <span className="text-indigo-400 font-bold">{associatedLead.status}</span>
          </div>
          {associatedLead.service_interested && (
            <div className="text-[10px] text-muted-foreground/80 truncate max-w-[180px]">
              Interest: {associatedLead.service_interested}
            </div>
          )}
        </div>
      )
    }
    return <span className="text-xs text-muted-foreground/60 italic">No CRM Lead linked</span>
  }

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-bold text-gold uppercase tracking-wider">
            Admin
          </span>
        )
      case 'client':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Client
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            User
          </span>
        )
    }
  }

  // ── Health board data (computed from directory data) ──────────────────────
  const healthClients: ProjectWithHealth[] = useMemo(() => {
    const clientProfiles = dbClients.filter(c => c.role === 'client')
    const activeProjects = dbProjects.filter(p => !(p as any).is_archived)

    // Unread = messages whose sender is not the current admin
    const unreadByProject: Record<string, number> = {}
    const lastMessageByProject: Record<string, string> = {}
    
    for (const msg of allMessages) {
      if (msg.sender_id !== currentUserId) {
        unreadByProject[msg.project_id] = (unreadByProject[msg.project_id] || 0) + 1
      }
      if (!lastMessageByProject[msg.project_id] || msg.created_at > lastMessageByProject[msg.project_id]) {
        lastMessageByProject[msg.project_id] = msg.created_at
      }
    }

    return activeProjects.map(project => {
      const clientProfile = clientProfiles.find(c => c.id === project.client_id)
      const projRequests = dbActionRequests.filter(req => req.project_id === project.id)
      const lastMsgDate = lastMessageByProject[project.id]
      const daysSinceLastMessage = lastMsgDate
        ? Math.floor((Date.now() - new Date(lastMsgDate).getTime()) / (1000 * 60 * 60 * 24))
        : null

      return {
        id: project.id,
        project_name: project.project_name,
        client_name: project.client_name,
        status: project.status,
        client_id: project.client_id,
        updated_at: (project as any).updated_at || new Date().toISOString(),
        unreadMessageCount: unreadByProject[project.id] || 0,
        daysSinceLastMessage,
        clientAvatarUrl: clientProfile?.avatar_url || null,
        is_suspended: clientProfile?.is_suspended || false,
        actionRequests: projRequests,
      } as ProjectWithHealth
    })
  }, [dbClients, dbProjects, allMessages, dbActionRequests, currentUserId])

  const filteredHealthClients = useMemo(() => {
    return healthClients.filter(c => {
      const matchSearch =
        !healthSearch ||
        c.client_name.toLowerCase().includes(healthSearch.toLowerCase()) ||
        c.project_name.toLowerCase().includes(healthSearch.toLowerCase()) ||
        c.status.toLowerCase().includes(healthSearch.toLowerCase())

      const label = getHealthLabel(c)
      const matchFilter = healthFilter === 'All' || label === healthFilter

      return matchSearch && matchFilter
    })
  }, [healthClients, healthSearch, healthFilter])

  return (
    <div className="space-y-6 sm:space-y-10 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
            <UsersIcon size={12} /> CRM Directory Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Client Directory</h1>
          <p className="text-sm text-muted-foreground">Manage active partners, audit project pipelines, and configure client credentials.</p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={() => {
              setClientForm({ id: '', fullName: '', email: '', phone: '', company: '', isSuspended: false, role: 'client' })
              setShowAddModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            <Plus size={14} /> Add User
          </button>
        </div>
      </div>

      {/* ── View Tab Switcher ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-[#0A0A0A]/60 p-1 rounded-xl border border-gold/10 w-fit">
        <button
          onClick={() => setActiveView('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeView === 'directory'
              ? 'bg-gold/10 text-gold border border-gold/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid size={12} />
          Directory
        </button>
        <button
          onClick={() => setActiveView('health')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeView === 'health'
              ? 'bg-gold/10 text-gold border border-gold/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity size={12} />
          Health Board
          {healthClients.filter(c => getHealthLabel(c) !== 'On Track').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold">
              {healthClients.filter(c => getHealthLabel(c) !== 'On Track').length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-16 flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Syncing directory profiles...</p>
        </div>
      ) : activeView === 'health' ? (
        /* ── Health Board View ─────────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Health board filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-3 text-muted-foreground" />
              <input
                value={healthSearch}
                onChange={(e) => setHealthSearch(e.target.value)}
                placeholder="Search client name, project, or stage..."
                className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-[#0A0A0A]/60 p-1 rounded-xl border border-gold/10 flex-wrap">
              {(['All', 'Blocked', 'Awaiting Client', 'On Track', 'Suspended'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setHealthFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    healthFilter === f
                      ? f === 'Blocked'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : f === 'Awaiting Client'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : f === 'On Track'
                        ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                        : f === 'Suspended'
                        ? 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                        : 'bg-gold/10 text-gold border border-gold/25'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <ClientHealthGrid clients={filteredHealthClients} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Role Filters Tabs */}
          <div className="flex flex-wrap gap-2 items-center pb-1">
            {[
              { id: 'All', label: 'All Roles', count: sortedProfiles.length },
              { id: 'Admin', label: 'Admins', count: dbClients.filter(c => c.role === 'admin').length },
              { id: 'Client', label: 'Clients', count: dbClients.filter(c => c.role === 'client').length },
              { id: 'User', label: 'Users', count: dbClients.filter(c => c.role === 'user').length },
            ].map((roleTab) => (
              <button
                key={roleTab.id}
                onClick={() => setRoleFilter(roleTab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                  roleFilter === roleTab.id
                    ? 'bg-gold/15 border-gold/45 text-gold shadow-[0_0_12px_rgba(212,175,55,0.12)]'
                    : 'bg-card/40 border-gold/10 text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {roleTab.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold ${
                  roleFilter === roleTab.id ? 'bg-gold/25 text-gold' : 'bg-white/5 text-muted-foreground'
                }`}>
                  {roleTab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search size={15} className="absolute left-4 top-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, company..."
                className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              />
            </div>

            <div className="relative">
              <Filter size={13} className="absolute left-3.5 top-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/10 transition-all appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active only</option>
                <option value="Suspended">Suspended only</option>
              </select>
            </div>
          </div>
          <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
            {filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold/40">
                  <UsersIcon size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-foreground">Directory Registry Empty</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {search || roleFilter !== 'All' || statusFilter !== 'All'
                      ? 'No profiles match the current filter criteria. Refine your parameters or register a new profile.'
                      : 'No active accounts are registered in the secure directory. Dispatch a system invite to get started.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setClientForm({ id: '', fullName: '', email: '', phone: '', company: '', isSuspended: false, role: 'client' })
                    setShowAddModal(true)
                  }}
                  className="px-4 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg bg-gold text-background hover:bg-gold-light transition-all cursor-pointer font-bold"
                >
                  Invite New User
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gold/10 text-xxs font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
                        <th className="py-4 px-5">Identity Details</th>
                        <th className="py-4 px-5">Role</th>
                        <th className="py-4 px-5">Key Information</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5 text-sm">
                      {filteredClients.map((client) => {
                        const isSelected = selectedClient?.id === client.id
                        const isInspected = searchParams.get('clientId') === client.id
                        return (
                          <tr
                            key={client.id}
                            onClick={() => {
                              setSelectedClient(client)
                              setShowViewModal(true)
                            }}
                            className={`cursor-pointer transition-all hover:bg-white/[0.02] ${
                              isInspected 
                                ? 'bg-gold/[0.03] border-l-2 border-l-gold shadow-[inset_3px_0_0_rgba(212,175,55,1),0_0_15px_rgba(212,175,55,0.05)]' 
                                : isSelected 
                                ? 'bg-gold/5' 
                                : ''
                            }`}
                          >
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                                  <span className="text-xs font-bold text-gold">
                                    {client.full_name?.[0] || 'C'}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-foreground flex items-center gap-2 truncate max-w-[150px]">
                                    <span>{client.full_name || 'Anonymous User'}</span>
                                    {client.id === currentUserId && (
                                      <span className="px-1.5 py-0.5 rounded bg-gold/20 border border-gold/45 text-[8px] font-bold text-gold uppercase tracking-wider shrink-0">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                    {client.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              {renderRoleBadge(client.role)}
                            </td>
                            <td className="py-4 px-5">
                              {renderKeyDetails(client)}
                            </td>
                            <td className="py-4 px-5">
                              {client.is_suspended ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-xxs font-semibold text-red-400">
                                  Suspended
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-xxs font-semibold text-green-400">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleInspectClient(client.id)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-sm ${isInspected ? 'bg-gold/20 border-gold text-gold' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-gold/10 hover:border-gold/30'}`}
                                  title="Inspect Client Telemetry"
                                >
                                  <Info size={12} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedClient(client)
                                    setShowViewModal(true)
                                  }}
                                  className="p-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all cursor-pointer shadow-[0_0_8px_rgba(212,175,55,0.05)]"
                                  title="View Profile"
                                >
                                  <Eye size={12} />
                                </button>
                                {client.id !== currentUserId && (
                                  <button
                                    onClick={() => handleToggleSuspension(client)}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-sm ${
                                      client.is_suspended
                                        ? 'text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                                        : 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                                    }`}
                                    title={client.is_suspended ? 'Activate Access' : 'Suspend Access'}
                                  >
                                    {client.is_suspended ? <Unlock size={12} /> : <Lock size={12} />}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="block md:hidden divide-y divide-gold/5 text-sm">
                  {filteredClients.map((client) => {
                    const isSelected = selectedClient?.id === client.id
                    return (
                      <div
                        key={client.id}
                        onClick={() => {
                          setSelectedClient(client)
                          setShowViewModal(true)
                        }}
                        className={`p-4 space-y-3 cursor-pointer hover:bg-white/[0.01] transition-colors ${
                          isSelected ? 'bg-gold/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-gold">
                                {client.full_name?.[0] || 'C'}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-2">
                                <span>{client.full_name || 'Anonymous User'}</span>
                                {client.id === currentUserId && (
                                  <span className="px-1.5 py-0.5 rounded bg-gold/20 border border-gold/45 text-[8px] font-bold text-gold uppercase tracking-wider shrink-0">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            client.is_suspended ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
                          }`}>
                            {client.is_suspended ? 'Suspended' : 'Active'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xxs text-muted-foreground pt-1">
                          <div>
                            <span className="font-semibold text-gold/70 block uppercase tracking-wider mb-0.5">Role</span>
                            <span>{renderRoleBadge(client.role)}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gold/70 block uppercase tracking-wider mb-0.5">Key Info</span>
                            <span className="text-foreground">{renderKeyDetails(client)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gold/5" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] text-muted-foreground">
                            Joined: {new Date(client.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedClient(client)
                                setShowViewModal(true)
                              }}
                              className="p-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all cursor-pointer"
                              title="View Profile"
                            >
                              <Eye size={12} />
                            </button>
                            {client.id !== currentUserId && (
                              <button
                                onClick={() => handleToggleSuspension(client)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  client.is_suspended
                                    ? 'text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                                    : 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                                }`}
                                title={client.is_suspended ? 'Activate Access' : 'Suspend Access'}
                              >
                                {client.is_suspended ? <Unlock size={12} /> : <Lock size={12} />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
          </div>
      )}

      {/* MODAL: ADD / EDIT CLIENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">
                {clientForm.id ? 'Edit User Profile' : 'Invite New Account'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Display Name</label>
                <input
                  required
                  value={clientForm.fullName}
                  onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  required
                  value={clientForm.email}
                  disabled={!!clientForm.id} // Disable email edit for safety in existing profiles
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  placeholder="sarah@jenkinsconsulting.com"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Access Role</label>
                <select
                  value={clientForm.role}
                  disabled={clientForm.id === currentUserId}
                  onChange={(e) => setClientForm({ ...clientForm, role: e.target.value as any })}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="client" className="bg-[#0A0A0A]">Client (Paying Partner)</option>
                  <option value="user" className="bg-[#0A0A0A]">User (Prospect/Visitor)</option>
                  <option value="admin" className="bg-[#0A0A0A]">Administrator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                  <input
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company Name</label>
                  <input
                    value={clientForm.company}
                    onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                    placeholder="Jenkins Consulting"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>

              {!clientForm.id && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2.5 items-start">
                  <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    <strong>Invite Mode:</strong> Dispatches a secure Supabase invite link so the user can verify their email and establish password credentials.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                >
                  {loading ? 'Processing...' : (clientForm.id ? 'Save Profile' : 'Send Invite')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE SAFETY CONFIRMATION */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md glass border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 relative">
            <div className="flex justify-between items-center border-b border-red-500/15 pb-3">
              <h2 className="font-serif text-base font-bold text-red-400 flex items-center gap-2">
                <ShieldAlert size={16} /> Permanent Account Deletion
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="text-muted-foreground hover:text-foreground text-xs cursor-pointer p-1 rounded-lg hover:bg-white/5 bg-transparent border-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Warning: Hard-deleting the profile for <strong className="text-foreground">{clientToDelete.full_name || 'this client'}</strong> will permanently revoke all portal credentials and remove related project directories, files, and logs.
              </p>
              <p className="text-[11px] text-muted-foreground">
                To confirm this deletion, please type the client's email <strong className="text-foreground font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">"{clientToDelete.email}"</strong> below:
              </p>
              <input
                type="text"
                autoFocus
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type client's email here..."
                className="w-full bg-background/60 border border-red-500/25 hover:border-red-500/40 rounded-xl px-4 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2.5 border-t border-red-500/15">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="px-4 py-2 text-xxs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground bg-transparent border-none transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteClient}
                disabled={loading || deleteConfirmText.trim().toLowerCase() !== (clientToDelete.email || '').trim().toLowerCase()}
                className="px-5 py-2 text-xxs font-bold bg-red-500/25 hover:bg-red-500 text-red-400 hover:text-background rounded-lg border border-red-500/30 hover:border-red-500 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW CLIENT DETAILS */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto relative">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gold/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-gold">
                    {selectedClient.full_name?.[0] || 'C'}
                  </span>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    {selectedClient.full_name || 'Anonymous User'}
                  </h2>
                  <p className="text-[9px] text-gold/70 font-semibold uppercase tracking-widest mt-0.5">
                    {selectedClient.company_name || 'Direct Business'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setModalTab('activity')
                }}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer p-1 rounded-lg hover:bg-white/5 bg-transparent border-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs Selector Control */}
            <div className="flex border-b border-gold/10 p-0.5 bg-card/40 rounded-xl border max-w-sm">
              <button
                onClick={() => setModalTab('activity')}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all border-none cursor-pointer ${
                  modalTab === 'activity' ? 'bg-gold/15 text-gold font-extrabold' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                📁 Activity
              </button>
              <button
                onClick={() => setModalTab('profile')}
                className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all border-none cursor-pointer ${
                  modalTab === 'profile' ? 'bg-gold/15 text-gold font-extrabold' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                👤 Profile
              </button>
              {selectedClient.id !== currentUserId && (
                <button
                  onClick={() => setModalTab('security')}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all border-none cursor-pointer ${
                    modalTab === 'security' ? 'bg-gold/15 text-gold font-extrabold' : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  🛡️ Security
                </button>
              )}
            </div>

            {/* TAB PANELS */}
            <div className="space-y-4">
              
              {/* TAB 1: ACTIVITY HUB */}
              {modalTab === 'activity' && (
                <div className="animate-in fade-in duration-200">
                  {selectedClient.role === 'client' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Associated Projects Section */}
                      <div className="space-y-2.5">
                        <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                          <FolderKanban size={11} /> Active Projects ({clientProjects.length})
                        </h3>
                        {clientProjects.length > 0 ? (
                          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
                            {clientProjects.map((p) => (
                              <div key={p.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-foreground truncate">{p.project_name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-1.5 py-0.5 rounded bg-gold/15 text-[8px] font-bold text-gold uppercase">
                                      {p.status}
                                    </span>
                                    <span className="text-[8px] text-muted-foreground">
                                      Paid: £{p.amount_paid.toLocaleString()} / £{p.contract_value.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <Link
                                  href={`/admin/projects?openId=${p.id}`}
                                  className="px-2.5 py-1 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/25 text-[8px] font-bold transition-all shrink-0 hover:shadow-sm"
                                >
                                  View
                                </Link>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xxs text-muted-foreground">
                            No active build projects registered.
                          </div>
                        )}
                      </div>

                      {/* Associated Bookings Section */}
                      <div className="space-y-2.5">
                        <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                          <Calendar size={11} /> Strategy Calls ({clientSessions.length})
                        </h3>
                        {clientSessions.length > 0 ? (
                          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
                            {clientSessions.map((s) => (
                              <div key={s.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-foreground truncate">
                                    {s.session_categories?.name || 'Consultation Call'}
                                  </h4>
                                  <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                                    {new Date(s.scheduled_at).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                                  s.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                                  s.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'
                                }`}>
                                  {s.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xxs text-muted-foreground">
                            No strategy bookings logged.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedClient.role === 'user' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Synced CRM Lead Details */}
                      <div className="space-y-2.5">
                        <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                          <Building size={11} /> Synced CRM Lead Details
                        </h3>
                        {(() => {
                          const lead = dbLeads.find(l => l.email === selectedClient.email)
                          if (lead) {
                            return (
                              <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2.5 text-xxs font-sans animate-in fade-in">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Lead Status:</span>
                                  <span className="text-gold font-semibold">{lead.status}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Business:</span>
                                  <span className="text-foreground font-semibold">{lead.business_name || 'N/A'}</span>
                                </div>
                                {lead.website && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Website:</span>
                                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline flex items-center gap-1">
                                      {lead.website.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                                    </a>
                                  </div>
                                )}
                                {lead.service_interested && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Interest:</span>
                                    <span className="text-foreground">{lead.service_interested}</span>
                                  </div>
                                )}
                                {lead.phone && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Lead Phone:</span>
                                    <span className="text-foreground">{lead.phone}</span>
                                  </div>
                                )}
                                {lead.notes && (
                                  <div className="pt-2 border-t border-gold/5 space-y-1">
                                    <span className="text-muted-foreground block font-semibold">CRM Notes:</span>
                                    <p className="text-muted-foreground leading-relaxed italic text-[10px]">{lead.notes}</p>
                                  </div>
                                )}
                              </div>
                            )
                          }
                          return (
                            <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xxs text-muted-foreground">
                              No synced CRM lead found for this user.
                            </div>
                          )
                        })()}
                      </div>

                      {/* Associated Bookings Section */}
                      <div className="space-y-2.5">
                        <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                          <Calendar size={11} /> Strategy Calls ({clientSessions.length})
                        </h3>
                        {clientSessions.length > 0 ? (
                          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
                            {clientSessions.map((s) => (
                              <div key={s.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-foreground truncate">
                                    {s.session_categories?.name || 'Consultation Call'}
                                  </h4>
                                  <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                                    {new Date(s.scheduled_at).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                                  s.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                                  s.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'
                                }`}>
                                  {s.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xxs text-muted-foreground">
                            No strategy bookings logged.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedClient.role === 'admin' && (
                    <div className="space-y-2.5">
                      <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                        <UserCheck size={11} /> Administrator Capabilities
                      </h3>
                      <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2 text-xxs text-muted-foreground leading-relaxed font-sans animate-in fade-in">
                        <p>This administrator account enjoys comprehensive control across CRM pipelines, website content nodes, activity audits, and server resources.</p>
                        <ul className="list-disc pl-4 space-y-1 mt-1 text-[10px]">
                          <li>Full audit logs control</li>
                          <li>Global CMS variables override</li>
                          <li>Client portal revocation privileges</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFILE DETAILS */}
              {modalTab === 'profile' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xxs animate-in fade-in duration-200">
                  <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2.5">
                    <h3 className="font-semibold text-gold tracking-wider uppercase text-[9px] flex items-center gap-1.5">
                      <UsersIcon size={10} /> Profile Details
                    </h3>
                    <div className="divide-y divide-gold/5 space-y-2">
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Access Role:</span>
                        {renderRoleBadge(selectedClient.role)}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                          selectedClient.is_suspended ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'
                        }`}>
                          {selectedClient.is_suspended ? 'Suspended' : 'Active'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Registered:</span>
                        <span className="text-foreground font-semibold">
                          {new Date(selectedClient.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2.5">
                    <h3 className="font-semibold text-gold tracking-wider uppercase text-[9px] flex items-center gap-1.5">
                      <Mail size={10} /> Contact Information
                    </h3>
                    <div className="divide-y divide-gold/5 space-y-2">
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground font-semibold truncate max-w-[150px]" title={selectedClient.email || ''}>
                          {selectedClient.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground font-semibold">
                          {selectedClient.phone_number || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Company:</span>
                        <span className="text-foreground font-semibold truncate max-w-[150px]">
                          {selectedClient.company_name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY & DANGER ZONE */}
              {modalTab === 'security' && selectedClient.id !== currentUserId && (
                <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.01] space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">Danger &amp; Access Control Desk</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Admin-only controls to suspend portal access or permanently erase identity records.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleToggleSuspension(selectedClient)}
                      className={`flex-1 min-w-[150px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border transition-all cursor-pointer text-xxs font-bold uppercase tracking-wider ${
                        selectedClient.is_suspended
                          ? 'text-green-400 bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                          : 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      {selectedClient.is_suspended ? (
                        <>
                          <Unlock size={12} /> Activate Account
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Suspend Account
                        </>
                      )}
                    </button>

                    {selectedClient.role === 'client' && (
                      <button
                        type="button"
                        onClick={() => handleResetTour(selectedClient)}
                        className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 text-xxs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Reset Onboarding Tour
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setClientForm({
                          id: selectedClient.id,
                          fullName: selectedClient.full_name || '',
                          email: selectedClient.email || '',
                          phone: selectedClient.phone_number || '',
                          company: selectedClient.company_name || '',
                          isSuspended: selectedClient.is_suspended,
                          role: selectedClient.role
                        })
                        setShowViewModal(false)
                        setShowAddModal(true)
                      }}
                      className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 text-xxs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Edit2 size={12} /> Edit Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setClientToDelete(selectedClient)
                        setShowViewModal(false)
                        setShowDeleteModal(true)
                      }}
                      className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500 hover:text-background text-red-400 border border-red-500/30 text-xxs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete Account
                    </button>
                  </div>
                </div>
              )}

            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}
