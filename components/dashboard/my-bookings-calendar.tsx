'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  Trash2
} from 'lucide-react'

type BookedSession = {
  id: string
  scheduled_at: string
  status: 'Scheduled' | 'Canceled' | 'No Show' | 'Completed'
  notes: string | null
  outcomes: string | null
  category_id: string | null
  session_categories: {
    name: string
    slug: string
    duration_minutes: number
    color_code: string
    billing_type?: 'one-time' | 'monthly'
  } | null
}

interface MyBookingsCalendarProps {
  userId: string
  userRole: string
  userEmail: string
}

export function MyBookingsCalendar({ userId, userRole, userEmail }: MyBookingsCalendarProps) {
  const supabase = createClient()

  // State
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<BookedSession[]>([])
  const [selectedSession, setSelectedSession] = useState<BookedSession | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Calendar monthly view state
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()) // 0-indexed

  // Fetch user bookings
  const loadBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch lead ID for this email
      let resolvedLeadId = null
      const { data: lead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle()
      if (lead) resolvedLeadId = lead.id

      // 2. Query strategy sessions
      let query = supabase.from('strategy_sessions').select(`
        id,
        scheduled_at,
        status,
        notes,
        outcomes,
        category_id,
        session_categories (
          name,
          slug,
          duration_minutes,
          color_code,
          billing_type
        )
      `)

      if (userRole === 'client') {
        query = query.eq('client_id', userId)
      } else if (resolvedLeadId) {
        query = query.eq('lead_id', resolvedLeadId)
      } else {
        setSessions([])
        setLoading(false)
        return
      }

      const { data: booked, error: fetchError } = await query.order('scheduled_at', { ascending: true })
      if (fetchError) throw fetchError

      // Cast status strictly to avoid TS errors
      const typedSessions = (booked ?? []).map((s: any) => ({
        ...s,
        status: s.status as BookedSession['status']
      }))

      setSessions(typedSessions)

      // Set default selected session to next upcoming one if available
      const upcoming = typedSessions.find((s) => s.status === 'Scheduled' && new Date(s.scheduled_at) > new Date())
      if (upcoming) {
        setSelectedSession(upcoming)
      } else if (typedSessions.length > 0) {
        setSelectedSession(typedSessions[0])
      }
    } catch (err: any) {
      setError('Failed to load session schedule: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userRole, userEmail])

  // Get days in monthly grid
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()
    
    // Normalize firstDayIndex so Mon = 0, Tue = 1, ..., Sun = 6
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const daysList = []
    for (let i = 0; i < startOffset; i++) {
      daysList.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      daysList.push(new Date(currentYear, currentMonth, d))
    }
    return daysList
  }, [currentYear, currentMonth])

  // Month navigation
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((prev) => prev + 1)
    } else {
      setCurrentMonth((prev) => prev + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
  }

  // Get sessions booked on a specific calendar day
  const getSessionsForDay = (date: Date) => {
    return sessions.filter((s) => {
      const sDate = new Date(s.scheduled_at)
      return (
        sDate.getFullYear() === date.getFullYear() &&
        sDate.getMonth() === date.getMonth() &&
        sDate.getDate() === date.getDate()
      )
    })
  }

  // Separate upcoming vs past sessions
  const { upcomingSessions, pastSessions } = useMemo(() => {
    const upcoming: BookedSession[] = []
    const past: BookedSession[] = []
    const now = new Date()

    sessions.forEach((s) => {
      const sDate = new Date(s.scheduled_at)
      if (sDate >= now && s.status === 'Scheduled') {
        upcoming.push(s)
      } else {
        past.push(s)
      }
    })

    // Sort upcoming ascending, past descending
    upcoming.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    past.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())

    return { upcomingSessions: upcoming, pastSessions: past }
  }, [sessions])

  // Session cancellation handler
  const handleCancelSession = async (session: BookedSession) => {
    if (!confirm('Are you sure you want to cancel this scheduled consultation?')) return

    setCancellingId(session.id)
    setError(null)
    setSuccessMsg(null)

    try {
      const { error: updateError } = await supabase
        .from('strategy_sessions')
        .update({ status: 'Canceled', updated_at: new Date().toISOString() })
        .eq('id', session.id)

      if (updateError) throw updateError

      // Log notification
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: 'Session Cancellation Logged',
          description: `Your ${session.session_categories?.name || 'Consultation'} on ${new Date(session.scheduled_at).toLocaleDateString()} has been canceled.`,
          link: '/dashboard'
        })

      setSuccessMsg('Session canceled successfully.')
      await loadBookings()
    } catch (err: any) {
      setError(err.message || 'Failed to cancel the strategy session.')
    } finally {
      setCancellingId(null)
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center space-y-4 glass rounded-2xl border border-gold/15 max-w-lg mx-auto">
        <Loader2 size={32} className="text-gold animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-mono">Syncing session log...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="p-12 sm:p-16 glass rounded-2xl border border-gold/10 text-center max-w-xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mx-auto">
            <CalendarIcon size={24} className="text-gold" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-bold text-foreground">No Bookings Logged</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No strategy consultations or milestone sync calls have been scheduled yet. Open the "Schedule Call" tab to allocate a session.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* ---- Left Column: Calendar & Session details ---- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Calendar Grid card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-serif font-bold text-foreground">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Select a day to inspect scheduled sessions.</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/25 hover:bg-gold/5 text-gold/60 hover:text-gold transition-all cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/25 hover:bg-gold/5 text-gold/60 hover:text-gold transition-all cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="p-5 glass rounded-2xl border border-gold/15 bg-black/20">
                <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground select-none pb-2 border-b border-gold/10">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span className="text-muted-foreground/30">Sat</span><span className="text-muted-foreground/30">Sun</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 pt-3">
                  {calendarDays.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />

                    const daySessions = getSessionsForDay(day)
                    const hasBookings = daySessions.length > 0
                    const isSelected = selectedSession && new Date(selectedSession.scheduled_at).toDateString() === day.toDateString()

                    return (
                      <button
                        key={`day-${day.getDate()}`}
                        onClick={() => {
                          if (hasBookings) {
                            setSelectedSession(daySessions[0])
                          }
                        }}
                        disabled={!hasBookings}
                        className={`h-11 sm:h-12 rounded-xl text-xs font-semibold font-serif transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                          isSelected
                            ? 'bg-gold text-background font-bold shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                            : hasBookings
                            ? 'bg-gold/10 hover:bg-gold/20 border border-gold/35 text-gold font-bold shadow-[0_0_8px_rgba(212,175,55,0.05)]'
                            : 'text-muted-foreground/20 pointer-events-none'
                        }`}
                      >
                        <span>{day.getDate()}</span>
                        {hasBookings && !isSelected && (
                          <span
                            className="absolute bottom-1.5 w-1 h-1 rounded-full animate-pulse"
                            style={{ backgroundColor: daySessions[0].session_categories?.color_code ?? '#D4AF37' }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Selected Session Details Panel */}
            {selectedSession && (
              <div className="p-6 glass rounded-2xl border border-gold/15 bg-white/[0.01] space-y-4 animate-fade-in">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${selectedSession.session_categories?.color_code ?? '#D4AF37'}15`,
                          color: selectedSession.session_categories?.color_code ?? '#D4AF37',
                          border: `1px solid ${selectedSession.session_categories?.color_code ?? '#D4AF37'}30`
                        }}
                      >
                        {selectedSession.session_categories?.duration_minutes ?? 30} Mins
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        selectedSession.status === 'Scheduled'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : selectedSession.status === 'Completed'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {selectedSession.status}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-foreground pt-1">
                      {selectedSession.session_categories?.name ?? 'Consultation Call'}
                    </h3>
                  </div>

                  {selectedSession.status === 'Scheduled' && (
                    <button
                      onClick={() => handleCancelSession(selectedSession)}
                      disabled={cancellingId === selectedSession.id}
                      className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/30 text-red-400 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                      title="Cancel Booking"
                    >
                      {cancellingId === selectedSession.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-gold/10 bg-black/45 grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Scheduled Date</span>
                    <p className="font-bold text-foreground">
                      {new Date(selectedSession.scheduled_at).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-1 sm:border-l sm:border-gold/10 sm:pl-4">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Start Time</span>
                    <p className="font-bold text-foreground font-mono">
                      {new Date(selectedSession.scheduled_at).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {selectedSession.notes && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <FileText size={11} className="text-gold" /> Meeting Notes
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                      {selectedSession.notes}
                    </p>
                  </div>
                )}

                {selectedSession.outcomes && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Resolution & Outcomes
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-gold/[0.02] p-3 rounded-lg border border-gold/10 whitespace-pre-wrap">
                      {selectedSession.outcomes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---- Right Column: Sidebar Bookings List ---- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upcoming Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                <Clock size={11} /> Upcoming Agenda
              </h4>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {upcomingSessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-white/[0.01] p-4 rounded-xl border border-white/5 text-center">
                    No upcoming sessions scheduled.
                  </p>
                ) : (
                  upcomingSessions.map((session) => {
                    const isSelected = selectedSession?.id === session.id
                    return (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 focus:outline-none cursor-pointer ${
                          isSelected
                            ? 'bg-gold/10 border-gold/60 shadow-[0_0_10px_rgba(212,175,55,0.1)]'
                            : 'bg-[#0B0B0C] border-gold/10 hover:border-gold/25 hover:bg-gold/[0.01]'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2 w-full">
                          <span className="text-[10px] font-bold text-foreground truncate">
                            {session.session_categories?.name ?? 'Consultation'}
                          </span>
                          <span className="text-[9px] font-mono text-gold shrink-0">
                            {new Date(session.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[9px] text-muted-foreground flex justify-between items-center">
                          <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
                          <span style={{ color: session.session_categories?.color_code }} className="font-semibold">
                            {session.session_categories?.duration_minutes}m
                          </span>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* History Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                <XCircle size={11} className="text-muted-foreground" /> Consultation History
              </h4>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {pastSessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic bg-white/[0.01] p-4 rounded-xl border border-white/5 text-center">
                    No past sessions recorded.
                  </p>
                ) : (
                  pastSessions.map((session) => {
                    const isSelected = selectedSession?.id === session.id
                    return (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 focus:outline-none cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.05] border-white/20'
                            : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2 w-full">
                          <span className="text-[10px] font-semibold text-muted-foreground truncate">
                            {session.session_categories?.name ?? 'Consultation'}
                          </span>
                          <span className={`text-[8px] font-bold uppercase shrink-0 ${
                            session.status === 'Completed'
                              ? 'text-blue-400'
                              : session.status === 'Canceled'
                              ? 'text-red-400'
                              : 'text-muted-foreground/60'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="text-[9px] text-muted-foreground/50 flex justify-between items-center font-mono">
                          <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
                          <span>{new Date(session.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
