'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderPlus,
  RefreshCw,
  Sparkles,
  Edit2,
  Trash2,
  ChevronRight,
  Info,
  CalendarDays,
  UserPlus,
  CalendarRange,
  SlidersHorizontal,
  Eye,
  CreditCard,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

// Define Types
type SessionCategory = {
  id: string
  name: string
  slug: string
  duration_minutes: number
  description: string | null
  color_code: string
  is_active: boolean
}

type StrategySession = {
  id: string
  lead_id: string | null
  client_id: string | null
  scheduled_at: string
  status: 'Scheduled' | 'Canceled' | 'No Show' | 'Completed'
  notes: string | null
  outcomes: string | null
  category_id: string | null
  // Joins
  leads?: { id: string; name: string; email: string; business_name: string } | null
  profiles?: { id: string; full_name: string; email: string } | null
  session_categories?: SessionCategory | null
}

type SimpleLead = { id: string; name: string; email: string; business_name: string }
type SimpleClient = { id: string; full_name: string; email: string; role?: string }

export default function BookingsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'bookings' | 'categories' | 'availability'>('bookings')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Real Database States
  const [dbSessions, setDbSessions] = useState<StrategySession[]>([])
  const [dbCategories, setDbCategories] = useState<SessionCategory[]>([])
  const [dbLeads, setDbLeads] = useState<SimpleLead[]>([])
  const [dbClients, setDbClients] = useState<SimpleClient[]>([])
  const [dbAvailability, setDbAvailability] = useState<{ id: string; day_of_week: number; start_time: string; end_time: string }[]>([])

  const sessions = dbSessions
  const categories = dbCategories
  const leads = dbLeads
  const clients = dbClients

  // Filter & Search states
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [sortField, setSortField] = useState<'contact' | 'package' | 'investment' | 'date' | 'status'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Modals States
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', slug: '', duration: 30, description: '', color: '#D4AF37' })

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    id: '',
    targetType: 'lead' as 'lead' | 'client',
    targetId: '',
    categoryId: '',
    date: '',
    time: '',
    notes: ''
  })

  const [showOutcomeModal, setShowOutcomeModal] = useState(false)
  const [outcomeForm, setOutcomeForm] = useState({
    sessionId: '',
    clientName: '',
    status: 'Scheduled' as StrategySession['status'],
    notes: '',
    outcomes: ''
  })

  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [availabilityForm, setAvailabilityForm] = useState({ id: '', day: 1, start: '09:00', end: '17:00' })
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<StrategySession | null>(null)

  const triggerToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch Database Data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Fetch categories
      const { data: cats } = await supabase
          .from('session_categories')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true })
      setDbCategories(cats ?? [])

      // 2. Fetch sessions with joins
      const { data: sess } = await supabase
          .from('strategy_sessions')
          .select(`
          id, lead_id, client_id, scheduled_at, status, notes, outcomes, category_id,
          leads(id, name, email, business_name),
          profiles(id, full_name, email),
          session_categories(id, name, slug, duration_minutes, description, color_code, is_active)
        `)
          .order('scheduled_at', { ascending: false })
      setDbSessions((sess as any) ?? [])

      // 3. Fetch leads for scheduling selectors
      const { data: lds } = await supabase
          .from('leads')
          .select('id, name, email, business_name')
          .eq('is_archived', false)
      setDbLeads(lds ?? [])

      // 4. Fetch clients and users for scheduling selectors
      const { data: cls } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .in('role', ['client', 'user'])
          .eq('is_suspended', false)
      setDbClients((cls as any) ?? [])

      // 5. Fetch availability rules
      const { data: avRules } = await supabase
          .from('availability_rules')
          .select('*')
          .order('day_of_week', { ascending: true })
          .order('start_time', { ascending: true })
      setDbAvailability(avRules ?? [])

    } catch (err: any) {
      triggerToast(`Database fetch error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filters & search logic
  const filteredSessions = sessions.filter((s) => {
    const name = s.leads?.name || s.profiles?.full_name || 'System Booking'
    const email = s.leads?.email || s.profiles?.email || ''
    const business = s.leads?.business_name || ''
    const matchSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        business.toLowerCase().includes(search.toLowerCase())

    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    const matchCat = categoryFilter === 'All' || s.category_id === categoryFilter

    // Date filtering logic
    const sessionDate = new Date(s.scheduled_at)
    const today = new Date()
    let matchDate = true

    if (dateFilter === 'today') {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      const endOfToday = new Date()
      endOfToday.setHours(23, 59, 59, 999)
      matchDate = sessionDate >= startOfToday && sessionDate <= endOfToday
    } else if (dateFilter === 'week') {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      const endOf7Days = new Date()
      endOf7Days.setDate(startOfToday.getDate() + 7)
      endOf7Days.setHours(23, 59, 59, 999)
      matchDate = sessionDate >= startOfToday && sessionDate <= endOf7Days
    } else if (dateFilter === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
      matchDate = sessionDate >= startOfMonth && sessionDate <= endOfMonth
    } else if (dateFilter === 'custom') {
      const start = customStartDate ? new Date(customStartDate) : null
      const end = customEndDate ? new Date(customEndDate) : null
      if (start && end) {
        end.setHours(23, 59, 59, 999)
        matchDate = sessionDate >= start && sessionDate <= end
      } else if (start) {
        matchDate = sessionDate >= start
      } else if (end) {
        matchDate = sessionDate <= end
      }
    }

    return matchSearch && matchStatus && matchCat && matchDate
  })

  // Sorting helper
  const handleSort = (field: 'contact' | 'package' | 'investment' | 'date' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sorted list based on filtered result
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let valA: any = ''
    let valB: any = ''

    if (sortField === 'contact') {
      valA = (a.leads?.name || a.profiles?.full_name || 'System Booking').toLowerCase()
      valB = (b.leads?.name || b.profiles?.full_name || 'System Booking').toLowerCase()
    } else if (sortField === 'package') {
      valA = (a.session_categories?.name || 'General Strategy').toLowerCase()
      valB = (b.session_categories?.name || 'General Strategy').toLowerCase()
    } else if (sortField === 'investment') {
      const getPriceWeight = (slug: string) => {
        switch (slug) {
          case 'launch-discovery-call': return 1500
          case 'legacy-strategy-session': return 3500
          case 'elite-strategy-session': return 7000
          case 'ascent-discovery-call': return 499
          case 'sovereign-strategy-session': return 1299
          case 'apex-strategy-session': return 2999
          default: return 0
        }
      }
      valA = getPriceWeight(a.session_categories?.slug || '')
      valB = getPriceWeight(b.session_categories?.slug || '')
    } else if (sortField === 'date') {
      valA = new Date(a.scheduled_at).getTime()
      valB = new Date(b.scheduled_at).getTime()
    } else if (sortField === 'status') {
      valA = a.status.toLowerCase()
      valB = b.status.toLowerCase()
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // CRUD Session Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = categoryForm.name.toLowerCase().replace(/\s+/g, '-')

    // Live Database Save
    setLoading(true)
    const payload = {
      name: categoryForm.name,
      slug,
      duration_minutes: Number(categoryForm.duration),
      description: categoryForm.description || null,
      color_code: categoryForm.color,
      is_active: true
    }

    try {
      let error
      if (categoryForm.id) {
        ({ error } = await supabase
            .from('session_categories')
            .update(payload)
            .eq('id', categoryForm.id))
      } else {
        ({ error } = await supabase
            .from('session_categories')
            .insert(payload))
      }

      if (error) throw error
      triggerToast('Session category saved.')
      setShowCategoryModal(false)
      fetchData()
    } catch (err: any) {
      triggerToast(`Error saving category: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // CRUD Booking
  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingForm.targetId || !bookingForm.categoryId || !bookingForm.date || !bookingForm.time) {
      triggerToast('Please fill in all booking fields.')
      return
    }

    const scheduledAt = new Date(`${bookingForm.date}T${bookingForm.time}:00`).toISOString()

    // Live Database Save
    setLoading(true)
    const payload = {
      lead_id: bookingForm.targetType === 'lead' ? bookingForm.targetId : null,
      client_id: bookingForm.targetType === 'client' ? bookingForm.targetId : null,
      category_id: bookingForm.categoryId,
      scheduled_at: scheduledAt,
      status: 'Scheduled' as const,
      notes: bookingForm.notes || null
    }

    try {
      const { error } = await supabase
          .from('strategy_sessions')
          .insert(payload)

      if (error) throw error
      triggerToast('Booking scheduled successfully.')
      setShowBookingModal(false)
      fetchData()
    } catch (err: any) {
      triggerToast(`Scheduling failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Update Booking Status/Outcome
  const handleSaveOutcome = async (e: React.FormEvent) => {
    e.preventDefault()

    // Live Database Update
    setLoading(true)
    try {
      const { error } = await supabase
          .from('strategy_sessions')
          .update({
            status: outcomeForm.status,
            notes: outcomeForm.notes || null,
            outcomes: outcomeForm.outcomes || null
          })
          .eq('id', outcomeForm.sessionId)

      if (error) throw error
      triggerToast('Outcomes and status logged.')
      setShowOutcomeModal(false)
      fetchData()
    } catch (err: any) {
      triggerToast(`Outcome update failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (status: StrategySession['status']) => {
    if (!selectedBooking) return
    setLoading(true)
    try {
      const { error } = await supabase
          .from('strategy_sessions')
          .update({ status })
          .eq('id', selectedBooking.id)

      if (error) throw error
      triggerToast(`Meeting status updated to ${status}.`)
      setSelectedBooking({ ...selectedBooking, status })
      fetchData()
    } catch (err: any) {
      triggerToast(`Status update failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getPackageInvestment = (slug: string, full = false) => {
    switch (slug) {
      case 'launch-discovery-call': return full ? 'From £1,500 (One-Time)' : '£1,500'
      case 'legacy-strategy-session': return full ? 'From £3,500 (One-Time)' : '£3,500'
      case 'elite-strategy-session': return full ? 'From £7,000 (One-Time)' : '£7,000'
      case 'ascent-discovery-call': return full ? 'From £499/mo (Retainer)' : '£499/mo'
      case 'sovereign-strategy-session': return full ? 'From £1,299/mo (Retainer)' : '£1,299/mo'
      case 'apex-strategy-session': return full ? 'From £2,999/mo (Retainer)' : '£2,999/mo'
      default: return full ? 'Active Partner Session' : 'Included'
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    setLoading(true)
    try {
      const { error } = await supabase
          .from('session_categories')
          .delete()
          .eq('id', id)

      if (error) throw error
      triggerToast('Category deleted successfully.')
      fetchData()
    } catch (err: any) {
      triggerToast(`Deletion failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking?')) return

    setLoading(true)
    try {
      const { error } = await supabase
          .from('strategy_sessions')
          .delete()
          .eq('id', id)

      if (error) throw error
      triggerToast('Booking deleted permanently.')
      fetchData()
    } catch (err: any) {
      triggerToast(`Deletion failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        day_of_week: Number(availabilityForm.day),
        start_time: `${availabilityForm.start}:00`,
        end_time: `${availabilityForm.end}:00`
      }
      let error
      if (availabilityForm.id) {
        ({ error } = await supabase
          .from('availability_rules')
          .update(payload)
          .eq('id', availabilityForm.id))
      } else {
        ({ error } = await supabase
          .from('availability_rules')
          .insert(payload))
      }
      if (error) throw error
      triggerToast('Availability rule saved successfully.')
      setShowAvailabilityModal(false)
      fetchData()
    } catch (err: any) {
      triggerToast(`Save failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAvailability = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability rule?')) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('availability_rules')
        .delete()
        .eq('id', id)
      if (error) throw error
      triggerToast('Availability rule deleted.')
      fetchData()
    } catch (err: any) {
      triggerToast(`Delete failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Convert Lead / Client triggers (Mock only / visual dialog launcher)
  const handleConvertToClient = (session: StrategySession) => {
    const clientName = session.leads?.name || 'Client'

    // Direct redirection to Client Management Page to initialize onboarding
    triggerToast(`Launching conversion panel for ${clientName}. Please seed standard credentials in clients view.`);
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
              <CalendarIcon size={12} /> CRM Calendar Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Bookings & Sessions</h1>
            <p className="text-sm text-muted-foreground">Define your strategy packages and manage scheduled agency calls.</p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
                onClick={() => {
                  setBookingForm({ id: '', targetType: 'lead', targetId: '', categoryId: '', date: '', time: '', notes: '' })
                  setShowBookingModal(true)
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
            >
              <Plus size={14} /> Schedule Call
            </button>
          </div>
        </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarDays size={14} /> Booked Sessions ({filteredSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 border-b-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'border-gold text-gold bg-gold/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Info size={14} /> Session Packages ({categories.length})
        </button>
      </div>

      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-16 flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Syncing call scheduler database...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="relative col-span-2">
                  <Search size={15} className="absolute left-4 top-3.5 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search client/lead name, email or company..."
                    className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter size={13} className="absolute left-3.5 top-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/10 transition-all appearance-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                    <option value="No Show">No Show</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter size={13} className="absolute left-3.5 top-4 text-muted-foreground" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-card/60 border border-gold/10 hover:border-gold/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/10 transition-all appearance-none"
                  >
                    <option value="All">All Packages</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Filters Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1 bg-white/[0.01] p-3 rounded-2xl border border-gold/5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xxs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mr-2">
                    <Clock size={11} className="text-gold" /> Date Range
                  </span>
                  
                  {[
                    { id: 'all', label: 'All Time', icon: CalendarIcon },
                    { id: 'today', label: 'Today', icon: Clock },
                    { id: 'week', label: 'Next 7 Days', icon: CalendarDays },
                    { id: 'month', label: 'This Month', icon: CalendarIcon },
                    { id: 'custom', label: 'Custom Range', icon: CalendarRange }
                  ].map((range) => {
                    const IconComponent = range.icon
                    const isActive = dateFilter === range.id
                    return (
                      <button
                        key={range.id}
                        onClick={() => setDateFilter(range.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xxs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-gold/10 border-gold/30 text-gold shadow-sm'
                            : 'bg-card/40 border-gold/5 text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <IconComponent size={12} />
                        {range.label}
                      </button>
                    )
                  })}
                </div>

                {dateFilter === 'custom' && (
                  <div className="flex items-center gap-2 bg-card/45 border border-gold/10 px-3 py-1 rounded-xl animate-fade-in">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">From:</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="bg-transparent text-foreground text-xs outline-none cursor-pointer w-28 [color-scheme:dark]"
                    />
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold border-l border-gold/10 pl-2">To:</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="bg-transparent text-foreground text-xs outline-none cursor-pointer w-28 [color-scheme:dark]"
                    />
                  </div>
                )}
              </div>

              {/* Table List */}
              <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gold/10 text-xxs font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.01] select-none">
                        <th 
                          onClick={() => handleSort('contact')}
                          className="py-4 px-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            Contact Details
                            {sortField === 'contact' ? (
                              sortDirection === 'asc' ? <ArrowUp size={11} className="text-gold" /> : <ArrowDown size={11} className="text-gold" />
                            ) : (
                              <span className="text-muted-foreground/35 font-normal text-xxs">⇅</span>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('package')}
                          className="py-4 px-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            Package / Type
                            {sortField === 'package' ? (
                              sortDirection === 'asc' ? <ArrowUp size={11} className="text-gold" /> : <ArrowDown size={11} className="text-gold" />
                            ) : (
                              <span className="text-muted-foreground/35 font-normal text-xxs">⇅</span>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('investment')}
                          className="py-4 px-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            Investment
                            {sortField === 'investment' ? (
                              sortDirection === 'asc' ? <ArrowUp size={11} className="text-gold" /> : <ArrowDown size={11} className="text-gold" />
                            ) : (
                              <span className="text-muted-foreground/35 font-normal text-xxs">⇅</span>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('date')}
                          className="py-4 px-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            Scheduled Date
                            {sortField === 'date' ? (
                              sortDirection === 'asc' ? <ArrowUp size={11} className="text-gold" /> : <ArrowDown size={11} className="text-gold" />
                            ) : (
                              <span className="text-muted-foreground/35 font-normal text-xxs">⇅</span>
                            )}
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('status')}
                          className="py-4 px-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            Status
                            {sortField === 'status' ? (
                              sortDirection === 'asc' ? <ArrowUp size={11} className="text-gold" /> : <ArrowDown size={11} className="text-gold" />
                            ) : (
                              <span className="text-muted-foreground/35 font-normal text-xxs">⇅</span>
                            )}
                          </div>
                        </th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5 text-sm">
                      {sortedSessions.length > 0 ? (
                        sortedSessions.map((session) => {
                          const contactName = session.leads?.name || session.profiles?.full_name || 'System Intake'
                          const company = session.leads?.business_name || (session.profiles ? 'Registered Client' : '')
                          const email = session.leads?.email || session.profiles?.email || ''
                          const isClient = !!session.client_id || !session.lead_id

                          return (
                            <tr
                              key={session.id}
                              onClick={() => {
                                setSelectedBooking(session)
                                setShowViewModal(true)
                              }}
                              className="hover:bg-white/[0.02] cursor-pointer transition-all"
                            >
                              <td className="py-4 px-5">
                                <div className="font-semibold text-foreground">{contactName}</div>
                                {company && <div className="text-xxs text-gold/70 mt-0.5 uppercase tracking-wide">{company}</div>}
                                <div className="text-[10px] text-muted-foreground">{email}</div>
                              </td>
                              <td className="py-4 px-5">
                                <span
                                  className="px-2.5 py-0.5 rounded-full text-xxs font-semibold border"
                                  style={{
                                    borderColor: `${session.session_categories?.color_code || '#D4AF37'}30`,
                                    backgroundColor: `${session.session_categories?.color_code || '#D4AF37'}10`,
                                    color: session.session_categories?.color_code || '#D4AF37'
                                  }}
                                >
                                  {session.session_categories?.name || 'General Strategy'}
                                </span>
                                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                  <Clock size={10} /> {session.session_categories?.duration_minutes || 30} mins
                                </div>
                              </td>
                              <td className="py-4 px-5 whitespace-nowrap">
                                <span className="font-semibold text-gold-light">
                                  {getPackageInvestment(session.session_categories?.slug || '')}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <div className="font-medium text-foreground">
                                  {new Date(session.scheduled_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {new Date(session.scheduled_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`px-2.5 py-0.5 rounded-full text-xxs font-semibold flex items-center gap-1.5 w-fit ${
                                  session.status === 'Completed' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
                                  session.status === 'Canceled' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                                  session.status === 'No Show' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                                  'bg-gold/15 border border-gold/30 text-gold'
                                }`}>
                                  {session.status === 'Completed' && <CheckCircle2 size={10} />}
                                  {session.status === 'Canceled' && <XCircle size={10} />}
                                  {session.status === 'No Show' && <AlertTriangle size={10} />}
                                  {session.status}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  {/* Convert lead to client button */}
                                  {!isClient && session.status === 'Completed' && (
                                    <button
                                      onClick={() => handleConvertToClient(session)}
                                      className="p-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 hover:border-gold/30 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                      title="Convert Prospect to Client profile"
                                    >
                                      <UserPlus size={12} /> Convert Client
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setOutcomeForm({
                                        sessionId: session.id,
                                        clientName: contactName,
                                        status: session.status,
                                        notes: session.notes || '',
                                        outcomes: session.outcomes || ''
                                      })
                                      setShowOutcomeModal(true)
                                    }}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center gap-1 text-xxs font-bold border border-transparent hover:border-gold/15"
                                    title="Edit Outcomes & Details"
                                  >
                                    Log Outcome
                                  </button>

                                  <button
                                    onClick={() => handleDeleteBooking(session.id)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all cursor-pointer border border-transparent hover:border-red-500/20"
                                    title="Delete Booking"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-muted-foreground px-4">
                            <Info size={24} className="mx-auto text-gold/30 mb-2" />
                            No scheduled strategy sessions match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES & CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-foreground">Available Consulting Slots</h3>
                <button
                  onClick={() => {
                    setCategoryForm({ id: '', name: '', slug: '', duration: 30, description: '', color: '#D4AF37' })
                    setShowCategoryModal(true)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-gold/25 hover:border-gold/40 text-gold bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
                >
                  <Plus size={12} /> Add Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-5 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_24px_rgba(212,175,55,0.02)] transition-all duration-300 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xxs font-semibold border"
                          style={{
                            borderColor: `${category.color_code}30`,
                            backgroundColor: `${category.color_code}10`,
                            color: category.color_code
                          }}
                        >
                          {category.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                          <Clock size={12} /> {category.duration_minutes} Minutes
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        {category.description || 'No package description details set.'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gold/5">
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-mono">
                        Slug: {category.slug}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCategoryForm({
                              id: category.id,
                              name: category.name,
                              slug: category.slug,
                              duration: category.duration_minutes,
                              description: category.description || '',
                              color: category.color_code
                            })
                            setShowCategoryModal(true)
                          }}
                          className="p-2 text-muted-foreground hover:text-gold transition-colors"
                          title="Edit Package"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                          title="Delete Package"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD / EDIT SESSION CATEGORY */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">
                {categoryForm.id ? 'Edit Session Package' : 'Create Session Package'}
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Package Name</label>
                <input
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Discovery Audit Call"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={categoryForm.duration}
                    onChange={(e) => setCategoryForm({ ...categoryForm, duration: Number(e.target.value) })}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accent Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                    />
                    <input
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      className="w-full bg-background/60 border border-gold/15 rounded-xl px-3 py-2.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Describe the consultation value..."
                  rows={3}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE CALL (MANUAL BOOKING) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">Schedule Booking</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-gold/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBookingForm({ ...bookingForm, targetType: 'lead', targetId: '' })}
                  className={`py-1.5 rounded-lg text-xxs font-semibold tracking-wider transition-all cursor-pointer uppercase ${
                    bookingForm.targetType === 'lead' ? 'bg-gold text-background font-bold' : 'text-muted-foreground'
                  }`}
                >
                  Provisional Lead
                </button>
                <button
                  type="button"
                  onClick={() => setBookingForm({ ...bookingForm, targetType: 'client', targetId: '' })}
                  className={`py-1.5 rounded-lg text-xxs font-semibold tracking-wider transition-all cursor-pointer uppercase ${
                    bookingForm.targetType === 'client' ? 'bg-gold text-background font-bold' : 'text-muted-foreground'
                  }`}
                >
                  Client / User
                </button>
              </div>

              {/* Target Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select {bookingForm.targetType === 'lead' ? 'Lead Profile' : 'Client/User Profile'}
                </label>
                <select
                  required
                  value={bookingForm.targetId}
                  onChange={(e) => setBookingForm({ ...bookingForm, targetId: e.target.value })}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/20 transition-all appearance-none"
                >
                  <option value="">-- Choose Contact --</option>
                  {bookingForm.targetType === 'lead'
                    ? leads.map((l) => (
                        <option key={l.id} value={l.id}>{l.name} ({l.business_name})</option>
                      ))
                    : clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.email}) — {c.role === 'client' ? 'Client' : 'User'}
                        </option>
                      ))}
                </select>
              </div>

              {/* Category Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session Package</label>
                <select
                  required
                  value={bookingForm.categoryId}
                  onChange={(e) => setBookingForm({ ...bookingForm, categoryId: e.target.value })}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/20 transition-all appearance-none"
                >
                  <option value="">-- Select Package Type --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.duration_minutes}m)</option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Time</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administrative Notes</label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="Meeting agenda details..."
                  rows={2}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                >
                  {loading ? 'Scheduling...' : 'Schedule call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG OUTCOMES / OUTCOME LOGGER */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">Log Outcomes & Notes</h2>
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOutcome} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attendee Name</label>
                <input
                  disabled
                  value={outcomeForm.clientName}
                  className="w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Status Picker */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Meeting Status</label>
                <select
                  value={outcomeForm.status}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, status: e.target.value as StrategySession['status'] })}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-gold/20 transition-all appearance-none"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                  <option value="No Show">No Show</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preparation Notes</label>
                <textarea
                  value={outcomeForm.notes}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, notes: e.target.value })}
                  placeholder="Review client requirements..."
                  rows={2}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              {/* Outcomes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meeting Outcome Log</label>
                <textarea
                  value={outcomeForm.outcomes}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, outcomes: e.target.value })}
                  placeholder="Record deal outcomes, follow-ups, or conversion updates..."
                  rows={3}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowOutcomeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                >
                  {loading ? 'Logging...' : 'Log Outcomes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW BOOKING DETAILS */}
      {showViewModal && selectedBooking && (() => {
        const formattedDate = new Date(selectedBooking.scheduled_at).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
        const formattedTime = new Date(selectedBooking.scheduled_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        const displayDateTime = `${formattedDate} at ${formattedTime}`

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-6 animate-scale-up">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-gold/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Client
                  </span>
                  <h2 className="font-serif text-lg font-bold text-foreground mt-0.5">
                    {selectedBooking.leads?.name || selectedBooking.profiles?.full_name || 'System Booking'}
                  </h2>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Booking ID
                  </span>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    #{selectedBooking.id.substring(0, 8)}
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-gold/10 space-y-4 shadow-inner">
                {/* Session Package */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CalendarIcon size={14} className="text-gold/60" /> Session
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedBooking.session_categories?.name || 'General Strategy'}
                  </span>
                </div>

                {/* Date/Time */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock size={14} className="text-gold/60" /> Date/Time
                  </span>
                  <span className="font-semibold text-gold-light text-right max-w-[240px] leading-snug">
                    {displayDateTime}
                  </span>
                </div>

                {/* Price / Type */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CreditCard size={14} className="text-gold/60" /> Value / Tier
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xxs font-semibold bg-gold/15 border border-gold/30 text-gold-light">
                    {getPackageInvestment(selectedBooking.session_categories?.slug || '', true)}
                  </span>
                </div>
              </div>

              {/* Manage Status Buttons */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  Manage Status
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {/* Confirm */}
                  <button
                    onClick={() => handleUpdateStatus('Completed')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedBooking.status === 'Completed'
                        ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-bold'
                        : 'bg-white/5 border-white/5 text-muted-foreground/60 hover:border-green-500/30 hover:text-green-400 hover:bg-green-500/5'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    Confirm
                  </button>

                  {/* Pending */}
                  <button
                    onClick={() => handleUpdateStatus('Scheduled')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedBooking.status === 'Scheduled'
                        ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_12px_rgba(212,175,55,0.15)] font-bold'
                        : 'bg-white/5 border-white/5 text-muted-foreground/60 hover:border-gold/30 hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    <Clock size={13} />
                    Pending
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => handleUpdateStatus('Canceled')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedBooking.status === 'Canceled'
                        ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)] font-bold'
                        : 'bg-white/5 border-white/5 text-muted-foreground/60 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5'
                    }`}
                  >
                    <XCircle size={13} />
                    Cancel
                  </button>
                </div>
              </div>

              {/* Prep Notes & Outcome log info */}
              <div className="space-y-3 pt-1">
                {selectedBooking.notes && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Administrative Prep Notes
                    </span>
                    <div className="p-3 bg-white/[0.01] border border-gold/5 rounded-xl text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[80px] overflow-y-auto">
                      {selectedBooking.notes}
                    </div>
                  </div>
                )}

                {selectedBooking.outcomes && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Outcomes Log
                    </span>
                    <div className="p-3 bg-gold/5 border border-gold/15 rounded-xl text-xs text-gold-light whitespace-pre-wrap leading-relaxed max-h-[80px] overflow-y-auto">
                      {selectedBooking.outcomes}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gold/10">
                {/* Delete Booking */}
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleDeleteBooking(selectedBooking.id)
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={12} /> Delete Booking
                </button>

                <div className="flex gap-2">
                  {/* Convert Prospect to Client */}
                  {(!selectedBooking.client_id && selectedBooking.status === 'Completed') && (
                    <button
                      onClick={() => {
                        setShowViewModal(false)
                        handleConvertToClient(selectedBooking)
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus size={12} /> Convert Client
                    </button>
                  )}

                  {/* Log Outcome */}
                  <button
                    onClick={() => {
                      const contactName = selectedBooking.leads?.name || selectedBooking.profiles?.full_name || 'System Intake'
                      setOutcomeForm({
                        sessionId: selectedBooking.id,
                        clientName: contactName,
                        status: selectedBooking.status,
                        notes: selectedBooking.notes || '',
                        outcomes: selectedBooking.outcomes || ''
                      })
                      setShowViewModal(false)
                      setShowOutcomeModal(true)
                    }}
                    className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <SlidersHorizontal size={12} /> Log Outcome
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition-all cursor-pointer border border-transparent hover:border-gold/10 text-center"
              >
                Close
              </button>

            </div>
          </div>
        );
      })()}
    </div>
  )
}
