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
}

const ALL_STATUSES = ['New', 'Contacted', 'Call Booked', 'Proposal Sent', 'Won', 'Lost']

export default function LeadsPage() {
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('leads')
      .select('*')
      .eq('is_archived', showArchived)
      .order('created_at', { ascending: false })

    if (statusFilter.length > 0) {
      query = query.in('status', statusFilter)
    }
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,business_name.ilike.%${search}%`)
    }

    const { data } = await query
    setLeads(data ?? [])
    setLoading(false)
  }, [showArchived, statusFilter, search])

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300)
    return () => clearTimeout(timer)
  }, [fetchLeads])

  const toggleStatus = (s: string) =>
    setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">CRM</p>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage enquiries and strategy session requests.
          </p>
        </div>
        <Link
          href="/contact"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/25 text-sm font-semibold text-gold hover:bg-gold/15 transition-all"
        >
          <Plus size={15} /> New Lead
        </Link>
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

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-card border-gold/15 text-muted-foreground hover:text-foreground hover:border-gold/25'}`}
        >
          <Filter size={15} /> Filters {statusFilter.length > 0 && `(${statusFilter.length})`}
        </button>

        {/* Archived toggle */}
        <button
          onClick={() => setShowArchived((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showArchived ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-card border-gold/15 text-muted-foreground hover:text-foreground'}`}
        >
          <Archive size={15} /> {showArchived ? 'Showing Archived' : 'Show Archived'}
        </button>
      </div>

      {/* Status filter chips */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 glass rounded-xl border border-gold/10">
          <p className="text-xs font-semibold text-muted-foreground w-full mb-1">Filter by Status:</p>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter.includes(s) ? STATUS_COLORS[s] : 'bg-card border-gold/15 text-muted-foreground hover:border-gold/30'}`}
            >
              {s}
            </button>
          ))}
          {statusFilter.length > 0 && (
            <button onClick={() => setStatusFilter([])} className="px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground border border-gold/10 hover:border-gold/25 transition-all">
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gold/5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
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
              {search || statusFilter.length > 0 ? 'Try adjusting your filters.' : 'Leads from your contact form will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-left px-6 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Business</th>
                  <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Service</th>
                  <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden xl:table-cell">Source</th>
                  <th className="text-left px-4 py-3 text-xxs font-bold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Date</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/2 transition-colors group">
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
