'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
  UserCheck
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
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'spam'>('active')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)

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
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">CRM Operations</p>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Leads Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Qualify incoming website enquiries and route prospect bookings.
          </p>
        </div>
        <Link
          href="/book"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
        >
          <Plus size={14} /> New Lead
        </Link>
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

      {/* Table */}
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
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Search size={36} className="text-gold/20 mb-3" />
            <p className="font-serif text-lg font-semibold text-foreground">No leads found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search || statusFilter.length > 0 ? 'Try adjusting your filters.' : 'Leads will populate automatically from enquiries.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    <tr key={lead.id} className={`hover:bg-white/[0.01] transition-colors group ${isChecked ? 'bg-gold/5' : ''}`}>
                      {/* Checkbox */}
                      <td className="px-6 py-4">
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
                      <td className="px-4 py-4">
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
        )}
      </div>

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
    </div>
  )
}
