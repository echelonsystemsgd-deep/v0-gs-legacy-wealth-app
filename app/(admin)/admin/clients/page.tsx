'use client'

import { useState, useEffect, useCallback } from 'react'
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
  AlertCircle
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
  scheduled_at: string
  status: 'Scheduled' | 'Canceled' | 'No Show' | 'Completed'
  notes: string | null
  session_categories?: { name: string } | null
}

// Mock Data
const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'client-1',
    full_name: 'Sarah Jenkins',
    email: 'sarah@jenkinsconsulting.com',
    avatar_url: null,
    role: 'client',
    is_suspended: false,
    phone_number: '+1 (555) 123-4567',
    company_name: 'Jenkins Consulting',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
  },
  {
    id: 'client-2',
    full_name: 'Markus Vance',
    email: 'markus@vanceholdings.com',
    avatar_url: null,
    role: 'client',
    is_suspended: false,
    phone_number: '+1 (555) 987-6543',
    company_name: 'Vance Holdings',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  },
  {
    id: 'client-3',
    full_name: 'Helen Sterling',
    email: 'helen@sterlingmetals.com',
    avatar_url: null,
    role: 'client',
    is_suspended: true,
    phone_number: '+1 (555) 246-8135',
    company_name: 'Sterling Metals',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago
  }
]

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    client_id: 'client-1',
    client_name: 'Sarah Jenkins',
    project_name: 'Legacy Wealth App Design',
    status: 'Development',
    contract_value: 12000,
    amount_paid: 6000
  },
  {
    id: 'proj-2',
    client_id: 'client-2',
    client_name: 'Markus Vance',
    project_name: 'Agency Portfolio Showcase',
    status: 'Design',
    contract_value: 8500,
    amount_paid: 4250
  },
  {
    id: 'proj-3',
    client_id: 'client-1',
    client_name: 'Sarah Jenkins',
    project_name: 'Marketing SEO Optimization',
    status: 'Discovery',
    contract_value: 3000,
    amount_paid: 3000
  }
]

const MOCK_SESSIONS: StrategySession[] = [
  {
    id: 'sess-1',
    client_id: 'client-1',
    scheduled_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    notes: 'Initial layout discussion.',
    session_categories: { name: 'Technical Discovery' }
  },
  {
    id: 'sess-2',
    client_id: 'client-2',
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Scheduled',
    notes: 'Kickoff call to seed typography requirements.',
    session_categories: { name: 'Onboarding Consultation' }
  }
]

export default function ClientsPage() {
  const supabase = createClient()
  const [useMock, setUseMock] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Real Database States
  const [dbClients, setDbClients] = useState<ClientProfile[]>([])
  const [dbProjects, setDbProjects] = useState<Project[]>([])
  const [dbSessions, setDbSessions] = useState<StrategySession[]>([])

  // Computed Datasets
  const clientsList = useMock ? MOCK_CLIENTS : dbClients
  const projects = useMock ? MOCK_PROJECTS : dbProjects
  const sessions = useMock ? MOCK_SESSIONS : dbSessions

  // Search & Filter
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Selected Client details panel
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null)
  const [clientProjects, setClientProjects] = useState<Project[]>([])
  const [clientSessions, setClientSessions] = useState<StrategySession[]>([])

  // Edit / Add client form
  const [showAddModal, setShowAddModal] = useState(false)
  const [clientForm, setClientForm] = useState({
    id: '',
    fullName: '',
    email: '',
    phone: '',
    company: '',
    isSuspended: false
  })

  const triggerToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch Database Data
  const fetchData = useCallback(async () => {
    if (useMock) return
    setLoading(true)
    try {
      // 1. Fetch clients profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false })

      // Wait, we need company name which might be stored in website_content or project metadata, 
      // or we can map phone number / business name from projects or leads.
      // In profiles schema, we added email, first/last/full name, phone_number (via migrations).
      // Let's query them.
      const mappedProfiles = (profiles ?? []).map(p => ({
        ...p,
        company_name: (p as any).address_line2 || 'Direct Client' // We can reuse address_line2 or mock metadata
      }))
      setDbClients(mappedProfiles as any)

      // 2. Fetch projects
      const { data: projs } = await supabase
        .from('projects')
        .select('*')
      setDbProjects((projs as any) ?? [])

      // 3. Fetch strategy sessions
      const { data: sess } = await supabase
        .from('strategy_sessions')
        .select(`
          id, client_id, scheduled_at, status, notes,
          session_categories(name)
        `)
      setDbSessions((sess as any) ?? [])

    } catch (err: any) {
      triggerToast(`Database fetch error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [useMock, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Map sub-relations when a client is selected
  useEffect(() => {
    if (selectedClient) {
      const associatedProjs = projects.filter(p => p.client_id === selectedClient.id)
      const associatedSess = sessions.filter(s => s.client_id === selectedClient.id)
      setClientProjects(associatedProjs)
      setClientSessions(associatedSess)
    }
  }, [selectedClient, projects, sessions])

  const filteredClients = clientsList.filter(c => {
    const name = c.full_name || ''
    const email = c.email || ''
    const company = c.company_name || ''
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase())

    const isSusp = c.is_suspended
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && !isSusp) ||
      (statusFilter === 'Suspended' && isSusp)

    return matchSearch && matchStatus
  })

  // Toggle suspension state
  const handleToggleSuspension = async (client: ClientProfile) => {
    const nextSuspended = !client.is_suspended

    if (useMock) {
      const idx = MOCK_CLIENTS.findIndex(c => c.id === client.id)
      if (idx !== -1) {
        MOCK_CLIENTS[idx].is_suspended = nextSuspended
        // update selected state if active
        if (selectedClient?.id === client.id) {
          setSelectedClient({ ...MOCK_CLIENTS[idx] })
        }
      }
      triggerToast(nextSuspended ? 'Mock account suspended.' : 'Mock account activated.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: nextSuspended })
        .eq('id', client.id)

      if (error) throw error
      triggerToast(nextSuspended ? 'Client account suspended.' : 'Client account activated.')
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

  // Create or Update Client Profile
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault()

    if (useMock) {
      if (clientForm.id) {
        // Edit mock
        const idx = MOCK_CLIENTS.findIndex(c => c.id === clientForm.id)
        if (idx !== -1) {
          MOCK_CLIENTS[idx] = {
            ...MOCK_CLIENTS[idx],
            full_name: clientForm.fullName,
            email: clientForm.email,
            phone_number: clientForm.phone,
            company_name: clientForm.company
          }
          if (selectedClient?.id === clientForm.id) {
            setSelectedClient({ ...MOCK_CLIENTS[idx] })
          }
        }
        triggerToast('Mock client updated.')
      } else {
        // Create mock
        const newClient: ClientProfile = {
          id: `client-${Date.now()}`,
          full_name: clientForm.fullName,
          email: clientForm.email,
          avatar_url: null,
          role: 'client',
          is_suspended: false,
          phone_number: clientForm.phone,
          company_name: clientForm.company,
          created_at: new Date().toISOString()
        }
        MOCK_CLIENTS.unshift(newClient)
        triggerToast('Mock client account created.')
      }
      setShowAddModal(false)
      return
    }

    // Live Database Save
    setLoading(true)
    try {
      // NOTE: Creating a new client in a live environment requires provisioning in auth.users first. 
      // If editing an existing profile:
      if (clientForm.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: clientForm.fullName,
            email: clientForm.email,
            phone_number: clientForm.phone,
            address_line2: clientForm.company // Reuse address_line2 as company metadata
          })
          .eq('id', clientForm.id)

        if (error) throw error
        triggerToast('Client profile updated.')
        setShowAddModal(false)
        fetchData()
        if (selectedClient?.id === clientForm.id) {
          setSelectedClient({
            ...selectedClient,
            full_name: clientForm.fullName,
            email: clientForm.email,
            phone_number: clientForm.phone,
            company_name: clientForm.company
          })
        }
      } else {
        // Direct addition from console requires auth. For live integration:
        // We will call the backend API/edge function admin-user-actions to invite them.
        const response = await fetch('/api/admin/invite-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: clientForm.email,
            fullName: clientForm.fullName,
            phone: clientForm.phone,
            company: clientForm.company
          })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Failed to send invite.')

        triggerToast('Client invitation dispatched.')
        setShowAddModal(false)
        fetchData()
      }
    } catch (err: any) {
      triggerToast(`Operation failed: ${err.message}`)
    } finally {
      setLoading(false)
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
            <UsersIcon size={12} /> CRM Client Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage active partners, audit delivery timelines, and monitor account authorizations.</p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Mock Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-gold/10 text-xs font-semibold text-muted-foreground select-none">
            <span className={useMock ? 'text-gold' : ''}>Mockup Data</span>
            <button
              onClick={() => setUseMock(!useMock)}
              className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 ${useMock ? 'bg-gold/30' : 'bg-gold'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-all duration-300 ${useMock ? 'translate-x-0' : 'translate-x-4'}`} />
            </button>
            <span className={!useMock ? 'text-gold animate-pulse' : ''}>Live Database</span>
          </div>

          <button
            onClick={() => {
              setClientForm({ id: '', fullName: '', email: '', phone: '', company: '', isSuspended: false })
              setShowAddModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            <Plus size={14} /> Add Client
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-16 flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Syncing client portal profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT: CLIENTS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative col-span-2">
                <Search size={15} className="absolute left-4 top-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by client name, email or company..."
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
                  <option value="All">All Accounts</option>
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
                      <th className="py-4 px-5">Client Identity</th>
                      <th className="py-4 px-5">Contact coordinates</th>
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
                            onClick={() => setSelectedClient(client)}
                            className={`cursor-pointer transition-all hover:bg-white/[0.02] ${
                              isSelected ? 'bg-gold/5' : ''
                            }`}
                          >
                            <td className="py-4 px-5 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-gold">
                                  {client.full_name?.[0] || 'C'}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{client.full_name || 'Anonymous Partner'}</div>
                                <div className="text-xxs text-gold/70 mt-0.5 uppercase tracking-wider">
                                  {client.company_name || 'Direct Business'}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-5">
                              <div className="text-xs text-foreground flex items-center gap-1.5">
                                <Mail size={12} className="text-muted-foreground" /> {client.email}
                              </div>
                              {client.phone_number && (
                                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                                  <Phone size={10} className="text-muted-foreground" /> {client.phone_number}
                                </div>
                              )}
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
                                      isSuspended: client.is_suspended
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
                                  title={client.is_suspended ? 'Activate Portal Access' : 'Suspend Portal Access'}
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
                        <td colSpan={4} className="py-12 text-center text-muted-foreground px-4">
                          <Info size={24} className="mx-auto text-gold/30 mb-2" />
                          No client accounts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: CLIENT WORKSPACE DETAIL DRAWER */}
          <div className="lg:col-span-1">
            {selectedClient ? (
              <div className="p-5 sm:p-6 glass rounded-2xl border border-gold/15 space-y-6 sticky top-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground">Client Workspace</h2>
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

                  <div className="pt-2 divide-y divide-gold/5 text-xs">
                    {selectedClient.phone_number && (
                      <div className="py-2 flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground font-medium">{selectedClient.phone_number}</span>
                      </div>
                    )}
                    <div className="py-2 flex justify-between">
                      <span className="text-muted-foreground">Partner Since:</span>
                      <span className="text-foreground font-medium">
                        {new Date(selectedClient.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between items-center">
                      <span className="text-muted-foreground">Portal Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        selectedClient.is_suspended ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'
                      }`}>
                        {selectedClient.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

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
                            <p className="text-[10px] text-muted-foreground mt-1">
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
                      No previous consultations logged.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 glass rounded-2xl border border-gold/10 border-dashed text-center space-y-3 sticky top-6">
                <UsersIcon size={28} className="mx-auto text-gold/30" />
                <h3 className="font-serif text-sm font-semibold text-foreground">No Client Selected</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  Click on any client profile card to view associated projects, booking history, and contact metadata.
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
                {clientForm.id ? 'Edit Client Profile' : 'Add Client Account'}
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
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  placeholder="sarah@jenkinsconsulting.com"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
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

              {!clientForm.id && !useMock && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2.5 items-start">
                  <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    <strong>Live Database Mode:</strong> Saving will dispatch a Supabase Auth invitation email to the client to set up their password and credentials.
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
                  {loading ? 'Dispatched...' : (clientForm.id ? 'Save Client' : 'Invite Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
