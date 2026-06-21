'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
} from 'lucide-react'

// Define Types
type ClientProfile = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: 'admin' | 'user' | 'client'
  is_suspended: boolean
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
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

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
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

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
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch Database Data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
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

    } catch (err: any) {
      triggerToast(`Database fetch error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
    const nextSuspended = !client.is_suspended

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: nextSuspended })
        .eq('id', client.id)

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

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    const expectedText = clientToDelete.company_name || clientToDelete.full_name || 'Confirm'
    if (deleteConfirmText !== expectedText) {
      triggerToast('Confirmation name does not match.')
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
              {activeProj.status} · ${activeProj.amount_paid.toLocaleString()} Paid
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

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

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

      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-16 flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Syncing directory profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT: DIRECTORY LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="relative col-span-2">
                <Search size={15} className="absolute left-4 top-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, company, role..."
                  className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                />
              </div>

              <div className="relative">
                <Filter size={13} className="absolute left-3.5 top-4 text-muted-foreground" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/10 transition-all appearance-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admins</option>
                  <option value="Client">Clients</option>
                  <option value="User">Users</option>
                </select>
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
              <div className="overflow-x-auto">
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
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => {
                        const isSelected = selectedClient?.id === client.id
                        return (
                          <tr
                            key={client.id}
                            onClick={() => {
                              setSelectedClient(client)
                              setMobileSheetOpen(true)
                            }}
                            className={`cursor-pointer transition-all hover:bg-white/[0.02] ${
                              isSelected ? 'bg-gold/5' : ''
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
                                  <div className="font-semibold text-foreground truncate max-w-[150px]">{client.full_name || 'Anonymous User'}</div>
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
                                  onClick={() => {
                                    setClientForm({
                                      id: client.id,
                                      fullName: client.full_name || '',
                                      email: client.email || '',
                                      phone: client.phone_number || '',
                                      company: client.company_name || '',
                                      isSuspended: client.is_suspended,
                                      role: client.role
                                    })
                                    setShowAddModal(true)
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                                  title="Edit Profile"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleToggleSuspension(client)}
                                  className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
                                    client.is_suspended ? 'text-green-400' : 'text-red-400'
                                  }`}
                                  title={client.is_suspended ? 'Activate Access' : 'Suspend Access'}
                                >
                                  {client.is_suspended ? <Unlock size={12} /> : <Lock size={12} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground px-4">
                          <Info size={24} className="mx-auto text-gold/30 mb-2" />
                          No directory listings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAIL DRAWER (desktop only) */}
          <div className="lg:col-span-1 hidden lg:block">
            {selectedClient ? (
              <div className="p-5 sm:p-6 glass rounded-2xl border border-gold/15 space-y-6 sticky top-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground">User Profile</h2>
                    <p className="text-xxs text-gold/70 font-semibold uppercase tracking-widest mt-0.5">
                      {selectedClient.company_name || 'Direct Business'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    Close ✕
                  </button>
                </div>

                {/* Identity Card */}
                <div className="p-4 bg-white/[0.02] border border-gold/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gold">
                          {selectedClient.full_name?.[0] || 'C'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{selectedClient.full_name}</div>
                        <div className="text-[10px] text-muted-foreground">{selectedClient.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 divide-y divide-gold/5 text-xs">
                    <div className="py-2 flex justify-between items-center">
                      <span className="text-muted-foreground">Access Role:</span>
                      {renderRoleBadge(selectedClient.role)}
                    </div>
                    {selectedClient.phone_number && (
                      <div className="py-2 flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground font-medium">{selectedClient.phone_number}</span>
                      </div>
                    )}
                    <div className="py-2 flex justify-between">
                      <span className="text-muted-foreground">Registered:</span>
                      <span className="text-foreground font-medium">
                        {new Date(selectedClient.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        selectedClient.is_suspended ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'
                      }`}>
                        {selectedClient.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => {
                        setClientToDelete(selectedClient)
                        setShowDeleteModal(true)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 text-xxs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} /> Delete Account
                    </button>
                  </div>
                </div>

                {/* Conditional Sections based on role */}
                {selectedClient.role === 'client' && (
                  <>
                    {/* Associated Projects Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                        <FolderKanban size={12} /> Active Projects ({clientProjects.length})
                      </h3>

                      {clientProjects.length > 0 ? (
                        <div className="space-y-2">
                          {clientProjects.map((p) => (
                            <div key={p.id} className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-gold/10 rounded-xl flex items-center justify-between gap-3 transition-colors">
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-foreground truncate">{p.project_name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-1.5 py-0.5 rounded bg-gold/15 text-[8px] font-bold text-gold uppercase">
                                    {p.status}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground">
                                    Paid: ${p.amount_paid.toLocaleString()} / ${p.contract_value.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-gold/50 shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">
                          No active build projects registered.
                        </div>
                      )}
                    </div>

                    {/* Associated Bookings Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                        <Calendar size={12} /> Strategy Calls ({clientSessions.length})
                      </h3>

                      {clientSessions.length > 0 ? (
                        <div className="space-y-2">
                          {clientSessions.map((s) => (
                            <div key={s.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-foreground">
                                  {s.session_categories?.name || 'Consultation Call'}
                                </h4>
                                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                                  {new Date(s.scheduled_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                s.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                                s.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">
                          No strategy bookings logged.
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedClient.role === 'user' && (
                  <>
                    {/* Synced CRM Lead Details */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                        <Building size={12} /> Synced CRM Lead Details
                      </h3>
                      {(() => {
                        const lead = dbLeads.find(l => l.email === selectedClient.email)
                        if (lead) {
                          return (
                            <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2.5 text-xs">
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
                                  <p className="text-muted-foreground leading-relaxed italic">{lead.notes}</p>
                                </div>
                              )}
                            </div>
                          )
                        }
                        return (
                          <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">
                            No synced CRM lead found for this user.
                          </div>
                        )
                      })()}
                    </div>

                    {/* Associated Bookings Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                        <Calendar size={12} /> Strategy Calls ({clientSessions.length})
                      </h3>

                      {clientSessions.length > 0 ? (
                        <div className="space-y-2">
                          {clientSessions.map((s) => (
                            <div key={s.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-foreground">
                                  {s.session_categories?.name || 'Consultation Call'}
                                </h4>
                                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                                  {new Date(s.scheduled_at).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                s.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                                s.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'
                              }`}>
                                {s.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">
                          No strategy bookings logged.
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedClient.role === 'admin' && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <UserCheck size={12} /> Administrator Capabilities
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2 text-xs text-muted-foreground leading-relaxed">
                      <p>This administrator account enjoys comprehensive control across CRM pipelines, website content nodes, activity audits, and server resources.</p>
                      <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                        <li>Full audit logs control</li>
                        <li>Global CMS variables override</li>
                        <li>Client portal revocation privileges</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 glass rounded-2xl border border-gold/10 border-dashed text-center space-y-3 sticky top-6">
                <UsersIcon size={28} className="mx-auto text-gold/30" />
                <h3 className="font-serif text-sm font-semibold text-foreground">No User Selected</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Select an entry in the catalog to view details, active project parameters, strategy calls, or synchronized lead profiles.
                </p>
              </div>
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
                  onChange={(e) => setClientForm({ ...clientForm, role: e.target.value as any })}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-red-500/15 pb-3">
              <h2 className="font-serif text-lg font-bold text-red-400 flex items-center gap-2">
                <ShieldAlert size={18} /> Permanent Account Deletion
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Warning: Hard-deleting the profile for <strong className="text-foreground">{clientToDelete.full_name}</strong> will revoke all auth portal credentials, erase their profile record, and cascade-remove all associated projects, files, and CRM data.
              </p>
              <p className="text-xs text-muted-foreground">
                To confirm this deletion, please type the company name or full name <strong className="text-foreground font-mono">"{clientToDelete.company_name || clientToDelete.full_name || 'Confirm'}"</strong> below:
              </p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type confirmation here..."
                className="w-full bg-background/60 border border-red-500/25 hover:border-red-500/40 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-red-500/15">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText('')
                }}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteClient}
                disabled={loading || deleteConfirmText !== (clientToDelete.company_name || clientToDelete.full_name || 'Confirm')}
                className="px-5 py-2 text-xs font-bold bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-background rounded-lg border border-red-500/30 hover:border-red-500 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SHEET: Client Workspace (lg:hidden) */}
      {mobileSheetOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="relative bg-[#0A0A0A] border-t border-gold/20 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            {/* Sheet Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-gold/10">
              <div>
                <h2 className="font-serif text-lg font-bold text-foreground">User Details</h2>
                <p className="text-xxs text-gold/70 font-semibold uppercase tracking-widest">
                  {selectedClient.company_name || 'Direct Business'}
                </p>
              </div>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Identity Card */}
              <div className="p-4 bg-white/[0.02] border border-gold/10 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-gold">{selectedClient.full_name?.[0] || 'C'}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{selectedClient.full_name}</div>
                    <div className="text-[10px] text-muted-foreground">{selectedClient.email}</div>
                  </div>
                </div>
                <div className="pt-2 divide-y divide-gold/5 text-xs">
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-muted-foreground">Access Role:</span>
                    {renderRoleBadge(selectedClient.role)}
                  </div>
                  {selectedClient.phone_number && (
                    <div className="py-2 flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-foreground font-medium">{selectedClient.phone_number}</span>
                    </div>
                  )}
                  <div className="py-2 flex justify-between">
                    <span className="text-muted-foreground">Registered:</span>
                    <span className="text-foreground font-medium">{new Date(selectedClient.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${selectedClient.is_suspended ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'}`}>
                      {selectedClient.is_suspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => { setClientToDelete(selectedClient); setShowDeleteModal(true); setMobileSheetOpen(false) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xxs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete Account
                  </button>
                </div>
              </div>

              {/* Conditional Sections based on role (Mobile) */}
              {selectedClient.role === 'client' && (
                <>
                  {/* Projects */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <FolderKanban size={12} /> Active Projects ({clientProjects.length})
                    </h3>
                    {clientProjects.length > 0 ? clientProjects.map((p) => (
                      <div key={p.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">{p.project_name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 rounded bg-gold/15 text-[8px] font-bold text-gold uppercase">{p.status}</span>
                            <span className="text-[9px] text-muted-foreground">Paid: ${p.amount_paid.toLocaleString()} / ${p.contract_value.toLocaleString()}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gold/50 shrink-0" />
                      </div>
                    )) : (
                      <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">No active projects.</div>
                    )}
                  </div>

                  {/* Sessions */}
                  <div className="space-y-2 pb-4">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <Calendar size={12} /> Strategy Calls ({clientSessions.length})
                    </h3>
                    {clientSessions.length > 0 ? clientSessions.map((s) => (
                      <div key={s.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{s.session_categories?.name || 'Consultation Call'}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            {new Date(s.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${s.status === 'Completed' ? 'bg-green-500/10 text-green-400' : s.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'}`}>
                          {s.status}
                        </span>
                      </div>
                    )) : (
                      <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">No strategy bookings logged.</div>
                    )}
                  </div>
                </>
              )}

              {selectedClient.role === 'user' && (
                <>
                  {/* Lead CRM */}
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <Building size={12} /> CRM Lead Details
                    </h3>
                    {(() => {
                      const lead = dbLeads.find(l => l.email === selectedClient.email)
                      if (lead) {
                        return (
                          <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl space-y-2.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className="text-gold font-bold">{lead.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Business Name:</span>
                              <span className="text-foreground">{lead.business_name}</span>
                            </div>
                            {lead.website && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Website:</span>
                                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline truncate max-w-[150px]">
                                  {lead.website.replace(/^https?:\/\//, '')}
                                </a>
                              </div>
                            )}
                            {lead.service_interested && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Service:</span>
                                <span className="text-foreground">{lead.service_interested}</span>
                              </div>
                            )}
                            {lead.notes && (
                              <div className="pt-2 border-t border-gold/5 space-y-1">
                                <span className="text-muted-foreground block font-semibold">Notes:</span>
                                <p className="text-muted-foreground leading-normal italic">{lead.notes}</p>
                              </div>
                            )}
                          </div>
                        )
                      }
                      return <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">No synced lead found.</div>
                    })()}
                  </div>

                  {/* Sessions */}
                  <div className="space-y-2 pb-4">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <Calendar size={12} /> Strategy Calls ({clientSessions.length})
                    </h3>
                    {clientSessions.length > 0 ? clientSessions.map((s) => (
                      <div key={s.id} className="p-3 bg-white/[0.01] border border-gold/10 rounded-xl flex items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{s.session_categories?.name || 'Consultation Call'}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                            {new Date(s.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${s.status === 'Completed' ? 'bg-green-500/10 text-green-400' : s.status === 'Canceled' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'}`}>
                          {s.status}
                        </span>
                      </div>
                    )) : (
                      <div className="p-4 rounded-xl border border-dashed border-gold/10 text-center text-xs text-muted-foreground">No strategy bookings logged.</div>
                    )}
                  </div>
                </>
              )}

              {selectedClient.role === 'admin' && (
                <div className="space-y-2 pb-4">
                  <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                    <UserCheck size={12} /> Admin Information
                  </h3>
                  <div className="p-4 bg-white/[0.01] border border-gold/10 rounded-xl text-xs text-muted-foreground leading-normal">
                    This account is registered as a system administrator with full access privileges.
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
