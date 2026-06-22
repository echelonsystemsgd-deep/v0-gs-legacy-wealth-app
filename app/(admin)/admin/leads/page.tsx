'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Archive,
  Circle,
  X,
  Ban,
  Trash2,
  Inbox,
  AlertCircle,
  RefreshCw,
  FolderInput,
  CheckCircle2,
  UserCheck,
  LayoutGrid,
  List
} from 'lucide-react'

type Lead = {
  id: string
  name: string
  business_name: string
  email: string
  phone: string | null
  website: string | null
  service_interested: string | null
  status: string
  source: string
  created_at: string
  is_archived: boolean
}

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Contacted: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  'Call Booked': 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  'Proposal Sent': 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Won: 'bg-green-500/15 text-green-400 border-green-500/25',
  Lost: 'bg-red-500/15 text-red-400 border-red-500/25',
  Spam: 'bg-red-500/10 text-red-400/70 border-red-500/20'
}

const ALL_STATUSES = ['New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost', 'Spam']

export default function LeadsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'spam'>('active')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [activeKanbanColumn, setActiveKanbanColumn] = useState<string>('New')

  // Manual Lead creation modal states
  const [showNewModal, setShowNewModal] = useState(false)
  const [leadForm, setLeadForm] = useState({
    name: '',
    business_name: '',
    email: '',
    phone: '',
    website: '',
    service_interested: '',
    source: 'manual',
    status: 'New',
    notes: ''
  })
  const [savingLead, setSavingLead] = useState(false)

  const handleUpdateLeadStatus = async (id: string, status: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      triggerToast(`Lead status updated to ${status}.`)
      fetchLeads()
    } catch (err: any) {
      triggerToast(`Update failed: ${err.message}`)
      setLoading(false)
    }
  }

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadForm.name || !leadForm.email) {
      triggerToast('Name and Email are required.')
      return
    }
    setSavingLead(true)
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: leadForm.name,
          business_name: leadForm.business_name || 'N/A',
          email: leadForm.email,
          phone: leadForm.phone || null,
          website: leadForm.website || null,
          service_interested: leadForm.service_interested || null,
          source: leadForm.source,
          status: leadForm.status,
          notes: leadForm.notes || null
        })

      if (error) throw error
      triggerToast('Lead created successfully.')
      setShowNewModal(false)
      fetchLeads()
    } catch (err: any) {
      triggerToast(`Creation failed: ${err.message}`)
    } finally {
      setSavingLead(false)
    }
  }

  const triggerToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('leads')
      .select('*')

    if (activeTab === 'active') {
      query = query.eq('is_archived', false).neq('status', 'Spam')
    } else if (activeTab === 'archived') {
      query = query.eq('is_archived', true).neq('status', 'Spam')
    } else if (activeTab === 'spam') {
      query = query.eq('status', 'Spam')
    }

    query = query.order('created_at', { ascending: false })

    if (statusFilter.length > 0 && activeTab !== 'spam') {
      query = query.in('status', statusFilter)
    }
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,business_name.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) {
      triggerToast(`Fetch error: ${error.message}`)
    } else {
      setLeads(data ?? [])
    }
    setLoading(false)
  }, [activeTab, statusFilter, search, supabase])

  // Clear selections when switching tab or search/filter changes
  useEffect(() => {
    setSelectedIds([])
  }, [activeTab, search, statusFilter])

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300)
    return () => clearTimeout(timer)
  }, [fetchLeads])

  const toggleStatus = (s: string) =>
    setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  // Checkbox Selection Helpers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(leads.map((l) => l.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    }
  }

  // Bulk Actions
  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .in('id', selectedIds)

      if (error) throw error
      triggerToast(`Updated status to ${status} for ${selectedIds.length} leads.`)
      setSelectedIds([])
      fetchLeads()
    } catch (err: any) {
      triggerToast(`Update failed: ${err.message}`)
      setLoading(false)
    }
  }

  const handleBulkArchiveUpdate = async (archive: boolean) => {
    if (selectedIds.length === 0) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('leads')
        .update({ is_archived: archive })
        .in('id', selectedIds)

      if (error) throw error
      triggerToast(archive ? `Archived ${selectedIds.length} leads.` : `Restored ${selectedIds.length} leads to inbox.`)
      setSelectedIds([])
      fetchLeads()
    } catch (err: any) {
      triggerToast(`Archive failed: ${err.message}`)
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Are you sure you want to permanently delete the ${selectedIds.length} selected leads? This action is irreversible.`)) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', selectedIds)

      if (error) throw error
      triggerToast(`Permanently deleted ${selectedIds.length} leads.`)
      setSelectedIds([])
      fetchLeads()
    } catch (err: any) {
      triggerToast(`Deletion failed: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-gold uppercase">
            <Inbox size={12} /> CRM Lead Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Leads Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Qualify incoming website enquiries and route prospect bookings.
          </p>
        </div>
        <button
          onClick={() => {
            setLeadForm({ name: '', business_name: '', email: '', phone: '', website: '', service_interested: '', source: 'manual', status: 'New', notes: '' })
            setShowNewModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer self-end sm:self-center"
        >
          <Plus size={14} /> New Lead
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Inbox size={14} /> Inbox Leads
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'archived'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Archive size={14} /> Archived Leads
        </button>
        <button
          onClick={() => setActiveTab('spam')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'spam'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Ban size={14} /> Spam / Blocked
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email, business…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-gold/15 hover:border-gold/25 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle (hidden for spam tab since it's just spam) */}
        {activeTab !== 'spam' && (
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${showFilters ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-card border-gold/15 text-muted-foreground hover:text-foreground hover:border-gold/25'}`}
          >
            <Filter size={15} /> Filters {statusFilter.length > 0 && `(${statusFilter.length})`}
          </button>
        )}

        {/* View Toggle (Only shown for Active tab) */}
        {activeTab === 'active' && (
          <div className="flex items-center gap-1 bg-[#0A0A0A]/60 p-1 rounded-xl border border-gold/10 ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-gold/10 text-gold border border-gold/20 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              <List size={13} /> List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-gold/10 text-gold border border-gold/20 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              <LayoutGrid size={13} /> Board
            </button>
          </div>
        )}
      </div>

      {/* Status filter chips */}
      {showFilters && activeTab !== 'spam' && (
        <div className="flex flex-wrap gap-2 p-4 glass rounded-xl border border-gold/10">
          <p className="text-xs font-semibold text-muted-foreground w-full mb-1">Filter by Status:</p>
          {ALL_STATUSES.filter(s => s !== 'Spam').map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${statusFilter.includes(s) ? STATUS_COLORS[s] : 'bg-card border-gold/15 text-muted-foreground hover:border-gold/30'}`}
            >
              {s}
            </button>
          ))}
          {statusFilter.length > 0 && (
            <button onClick={() => setStatusFilter([])} className="px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground border border-gold/10 hover:border-gold/25 transition-all cursor-pointer">
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Table / Kanban Board */}
      {viewMode === 'kanban' && activeTab === 'active' ? (
        loading ? (
          <div className="glass rounded-2xl border border-gold/10 p-16 flex flex-col items-center justify-center space-y-4">
            <RefreshCw size={36} className="text-gold animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Syncing leads board...</p>
          </div>
         ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6 glass rounded-2xl border border-gold/10 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold/40">
              <Inbox size={20} />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-foreground">Lead Ledger Empty</h3>
              <p className="text-xs text-muted-foreground mt-1">No prospect records match these filter options. Initialize a manual lead record to begin.</p>
            </div>
            <button onClick={() => setShowNewModal(true)} className="px-4 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg bg-gold text-background hover:bg-gold-light transition-all cursor-pointer">
              Add Manual Lead
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile Kanban Switcher */}
            <div className="flex md:hidden border-b border-gold/10 overflow-x-auto scrollbar-none gap-2 pb-2 mb-2">
              {['New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost'].map((status) => {
                const count = leads.filter(l => l.status === status).length
                const isActive = activeKanbanColumn === status
                return (
                  <button
                    key={status}
                    onClick={() => setActiveKanbanColumn(status)}
                    className={`px-3.5 py-2 border-b-2 text-xxs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'border-gold text-gold bg-gold/5 font-extrabold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {status} ({count})
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
              {['New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost'].map((columnStatus) => {
                const columnLeads = leads.filter((l) => l.status === columnStatus)
                const isVisible = columnStatus === activeKanbanColumn
                return (
                  <div key={columnStatus} className={`glass rounded-2xl border border-gold/10 p-4 space-y-4 flex flex-col min-h-[450px] bg-white/[0.01] ${isVisible ? 'block' : 'hidden md:flex'}`}>
                    {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-gold/5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        columnStatus === 'New' ? 'bg-blue-400' :
                        columnStatus === 'Contacted' ? 'bg-yellow-400' :
                        columnStatus === 'Call Booked' ? 'bg-purple-400' :
                        columnStatus === 'Proposal Sent' ? 'bg-orange-400' :
                        columnStatus === 'Won' ? 'bg-green-400' :
                        'bg-red-400'
                      }`} />
                      <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">{columnStatus}</h3>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-muted-foreground font-bold">
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Column Body / Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin">
                    {columnLeads.length > 0 ? (
                      columnLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => router.push(`/admin/leads/${lead.id}`)}
                          className="p-3.5 rounded-xl border border-gold/5 hover:border-gold/20 bg-background/50 hover:bg-gold/[0.02] transition-all duration-200 space-y-3 group shadow-sm hover:shadow-md relative cursor-pointer"
                        >
                          {/* Card Content */}
                          <div className="space-y-1">
                            <h4 className="font-semibold text-xs text-foreground line-clamp-1 group-hover:text-gold transition-colors">{lead.name}</h4>
                            {lead.business_name && (
                              <p className="text-[10px] text-gold/80 uppercase tracking-wider font-semibold truncate">{lead.business_name}</p>
                            )}
                            <p className="text-[10px] text-muted-foreground truncate">{lead.email}</p>
                            {lead.service_interested && (
                              <div className="pt-1.5">
                                <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-white/5 block w-fit truncate max-w-full">
                                  {lead.service_interested}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Action Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            {/* Quick Status Dropdown Selector */}
                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                              className="bg-transparent text-[9px] text-muted-foreground hover:text-foreground font-semibold border-0 p-0 outline-none w-20 [color-scheme:dark] cursor-pointer"
                            >
                              <option value="New" className="bg-[#0C0C0C]">New</option>
                              <option value="Contacted" className="bg-[#0C0C0C]">Contacted</option>
                              <option value="Call Booked" className="bg-[#0C0C0C]">Call Booked</option>
                              <option value="Proposal Sent" className="bg-[#0C0C0C]">Proposal Sent</option>
                              <option value="Won" className="bg-[#0C0C0C]">Won</option>
                              <option value="Lost" className="bg-[#0C0C0C]">Lost</option>
                              <option value="Spam" className="bg-[#0C0C0C]">Spam</option>
                            </select>

                            {/* Detail Link Button */}
                            <Link
                              href={`/admin/leads/${lead.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-gold font-bold flex items-center hover:underline"
                            >
                              Details <ChevronRight size={10} />
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground text-xxs">
                        No leads
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        )
      ) : (
        <div className="glass rounded-2xl border border-gold/10 overflow-hidden relative">
          {loading ? (
            <div className="divide-y divide-gold/5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="px-6 py-5 flex items-center gap-4 animate-pulse">
                  <div className="h-4 w-4 bg-white/5 rounded shrink-0" />
                  <div className="h-4 w-40 bg-white/5 rounded" />
                  <div className="h-4 w-28 bg-white/5 rounded" />
                  <div className="h-4 w-20 bg-white/5 rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold/40">
                <Inbox size={20} />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-foreground">Lead Ledger Empty</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {search || statusFilter.length > 0 ? 'No results match your search parameters.' : 'No prospects are currently in this pipeline.'}
                </p>
              </div>
              <button onClick={() => setShowNewModal(true)} className="px-4 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg bg-gold text-background hover:bg-gold-light transition-all cursor-pointer">
                Add Manual Lead
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold/10 bg-white/[0.01]">
                      {/* Select All Checkbox */}
                      <th className="w-12 px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === leads.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 accent-gold cursor-pointer rounded border-gold/25 bg-background text-gold focus:ring-0 focus:ring-offset-0"
                        />
                      </th>
                      <th className="px-6 py-4 text-xxs font-bold uppercase tracking-widest text-muted-foreground">Name</th>
                      <th className="px-4 py-4 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Business</th>
                      <th className="px-4 py-4 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Service</th>
                      <th className="px-4 py-4 text-xxs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="px-4 py-4 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden xl:table-cell">Source</th>
                      <th className="px-4 py-4 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Date</th>
                      <th className="w-10 px-4 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {leads.map((lead) => {
                      const isChecked = selectedIds.includes(lead.id)
                      return (
                        <tr 
                          key={lead.id} 
                          onClick={() => router.push(`/admin/leads/${lead.id}`)}
                          className={`hover:bg-white/[0.01] transition-colors group cursor-pointer ${isChecked ? 'bg-gold/5' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSelectRow(lead.id, e.target.checked)}
                              className="w-4 h-4 accent-gold cursor-pointer rounded border-gold/25 bg-background text-gold focus:ring-0 focus:ring-offset-0"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <p className="text-sm text-foreground">{lead.business_name}</p>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <p className="text-sm text-muted-foreground">{lead.service_interested ?? '—'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xxs font-bold border ${STATUS_COLORS[lead.status] ?? 'bg-card text-muted-foreground border-gold/10'}`}>
                              <Circle size={5} className="fill-current" />
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden xl:table-cell">
                            <span className="text-xs text-muted-foreground capitalize">{lead.source}</span>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-xs text-muted-foreground">
                              {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/admin/leads/${lead.id}`}
                              className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-all"
                            >
                              <ChevronRight size={15} />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden divide-y divide-gold/5">
                {leads.map((lead) => {
                  const isChecked = selectedIds.includes(lead.id)
                  return (
                    <div 
                      key={lead.id} 
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                      className={`p-4 space-y-3 cursor-pointer hover:bg-gold/[0.01] transition-all ${isChecked ? 'bg-gold/5' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleSelectRow(lead.id, e.target.checked)}
                              className="w-4 h-4 accent-gold cursor-pointer rounded border-gold/25 bg-background text-gold focus:ring-0 focus:ring-offset-0"
                            />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[lead.status] ?? 'bg-card text-muted-foreground border-gold/10'}`}>
                          <Circle size={4} className="fill-current text-current" />
                          {lead.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xxs text-muted-foreground pt-1">
                        <div>
                          <span className="font-semibold text-gold/70 block uppercase tracking-wider mb-0.5">Business</span>
                          <span className="text-foreground">{lead.business_name || '—'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gold/70 block uppercase tracking-wider mb-0.5">Service</span>
                          <span className="text-foreground truncate block">{lead.service_interested ?? '—'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gold/5">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · <span className="capitalize">{lead.source}</span>
                        </span>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[10px] text-gold font-bold hover:underline"
                        >
                          Details <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* FLOATING BULK ACTIONS TOOLBAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card border border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] px-5 py-3 rounded-2xl flex items-center gap-5 sm:gap-8 animate-fade-in w-[90%] max-w-xl justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gold text-background text-xxs font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs text-foreground font-semibold">Selected</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Archive / Unarchive */}
            {activeTab === 'active' && (
              <button
                onClick={() => handleBulkArchiveUpdate(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-gold/10 text-muted-foreground hover:text-gold text-xxs font-bold border border-transparent hover:border-gold/15 transition-all cursor-pointer"
                title="Archive selected leads"
              >
                <Archive size={12} /> Archive
              </button>
            )}
            {activeTab === 'archived' && (
              <button
                onClick={() => handleBulkArchiveUpdate(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-gold/10 text-muted-foreground hover:text-gold text-xxs font-bold border border-transparent hover:border-gold/15 transition-all cursor-pointer"
                title="Restore selected leads to inbox"
              >
                <FolderInput size={12} /> Restore
              </button>
            )}

            {/* Spam toggle */}
            {activeTab !== 'spam' ? (
              <button
                onClick={() => handleBulkStatusUpdate('Spam')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 text-xxs font-bold border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                title="Mark selected leads as spam"
              >
                <Ban size={12} /> Spam
              </button>
            ) : (
              <button
                onClick={() => handleBulkStatusUpdate('New')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-green-500/10 text-muted-foreground hover:text-green-400 text-xxs font-bold border border-transparent hover:border-green-500/20 transition-all cursor-pointer"
                title="Mark selected spam as active leads"
              >
                <UserCheck className="w-3 h-3" /> Not Spam
              </button>
            )}

            {/* Permanent Delete */}
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-background text-xxs font-bold border border-red-500/20 hover:border-red-500 transition-all cursor-pointer"
              title="Delete permanently"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Manual Creation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">Add New Lead</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                  <input
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Name</label>
                  <input
                    value={leadForm.business_name}
                    onChange={(e) => setLeadForm({ ...leadForm, business_name: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                  <input
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website URL</label>
                  <input
                    value={leadForm.website}
                    onChange={(e) => setLeadForm({ ...leadForm, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Interested</label>
                  <input
                    value={leadForm.service_interested}
                    onChange={(e) => setLeadForm({ ...leadForm, service_interested: e.target.value })}
                    placeholder="e.g. AI Automation & Design"
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                  >
                    <option value="manual">Manual Intake</option>
                    <option value="booking_form">Booking Flow</option>
                    <option value="contact_form">Contact Form</option>
                    <option value="direct">Direct Referral</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipeline Status</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes / Qualifier Answers</label>
                <textarea
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="Additional context or qualification details..."
                  rows={3}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLead}
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingLead ? 'Creating...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
