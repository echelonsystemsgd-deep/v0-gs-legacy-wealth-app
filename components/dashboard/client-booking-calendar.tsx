'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react'

type SessionCategory = {
  id: string
  name: string
  slug: string
  duration_minutes: number
  description: string | null
  color_code: string
  billing_type?: 'one-time' | 'monthly'
}

type AvailabilityRule = {
  id: string
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string // e.g. "09:00:00"
  end_time: string // e.g. "17:00:00"
}

type StrategySession = {
  id: string
  scheduled_at: string
  status: string
  category_id: string | null
}

interface ClientBookingCalendarProps {
  userId: string
  userRole: string
  userEmail: string
}

export function ClientBookingCalendar({ userId, userRole, userEmail }: ClientBookingCalendarProps) {
  const supabase = createClient()
  const router = useRouter()

  // State definitions
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<SessionCategory[]>([])
  const [availability, setAvailability] = useState<AvailabilityRule[]>([])
  const [existingSessions, setExistingSessions] = useState<StrategySession[]>([])
  const [leadId, setLeadId] = useState<string | null>(null)

  // Step states
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCategory, setSelectedCategory] = useState<SessionCategory | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null) // e.g. "10:30"
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calendar view states
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()) // 0-indexed

  // Load database metadata
  useEffect(() => {
    const loadMetadata = async () => {
      setLoading(true)
      try {
        // 1. Fetch lead ID for this user email (if sandbox user)
        const { data: lead } = await supabase
          .from('leads')
          .select('id')
          .eq('email', userEmail)
          .maybeSingle()
        if (lead) setLeadId(lead.id)

        // 2. Fetch session categories
        const { data: cats } = await supabase
          .from('session_categories')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true })
        setCategories(cats ?? [])

        // 3. Fetch availability rules
        const { data: avs } = await supabase
          .from('availability_rules')
          .select('*')
        setAvailability(avs ?? [])

        // 4. Fetch booked sessions in the next 60 days
        const startDate = new Date().toISOString()
        const endDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        const { data: bookings } = await supabase
          .from('strategy_sessions')
          .select('id, scheduled_at, status, category_id')
          .eq('status', 'Scheduled')
          .gte('scheduled_at', startDate)
          .lte('scheduled_at', endDate)
        setExistingSessions(bookings ?? [])

      } catch (err: any) {
        setError('Failed to sync booking parameters: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMetadata()
  }, [supabase, userEmail])

  // Get days in selected month
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay() // 0 = Sunday, 1 = Monday
    
    // Normalize firstDayIndex so Mon = 0, Tue = 1, ..., Sun = 6
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const daysList = []
    // Pad previous month days
    for (let i = 0; i < startOffset; i++) {
      daysList.push(null)
    }

    // Populate current month days
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
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const prevMonth = () => {
    const now = new Date()
    if (currentYear === now.getFullYear() && currentMonth === now.getMonth()) {
      return // Can't go to past months
    }
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  // Check if a day has availability rules
  const isDayAvailable = (date: Date | null) => {
    if (!date) return false
    
    // Check if in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return false

    const dayOfWeek = date.getDay() // 0 = Sun, 1 = Mon
    // Database dayOfWeek is usually 0 = Sunday, 1 = Monday
    return availability.some((rule) => rule.day_of_week === dayOfWeek)
  }

  // Calculate available time slots for the selected day
  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedCategory) return []

    const dayOfWeek = selectedDate.getDay()
    const activeRules = availability.filter((r) => r.day_of_week === dayOfWeek)
    
    const slots: string[] = []
    const duration = selectedCategory.duration_minutes

    activeRules.forEach((rule) => {
      // Convert start and end times to minutes from midnight
      const [startH, startM] = rule.start_time.split(':').map(Number)
      const [endH, endM] = rule.end_time.split(':').map(Number)

      let currentMin = startH * 60 + startM
      const endMin = endH * 60 + endM

      while (currentMin + duration <= endMin) {
        const slotH = Math.floor(currentMin / 60)
        const slotM = currentMin % 60
        const slotTimeString = `${slotH.toString().padStart(2, '0')}:${slotM.toString().padStart(2, '0')}`

        // Build absolute UTC timestamp for comparison
        const slotDate = new Date(selectedDate)
        slotDate.setHours(slotH, slotM, 0, 0)

        // Ensure slot is in the future
        if (slotDate.getTime() > Date.now()) {
          // Check if slot overlaps with existing booked strategy session
          const hasConflict = existingSessions.some((session) => {
            const sessionTime = new Date(session.scheduled_at).getTime()
            return sessionTime === slotDate.getTime()
          })

          if (!hasConflict) {
            slots.push(slotTimeString)
          }
        }

        currentMin += duration
      }
    })

    return slots.sort()
  }, [selectedDate, selectedCategory, availability, existingSessions])

  // Booking Execution
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTimeSlot || !selectedCategory) return

    setSubmitting(true)
    setError(null)

    // Assemble scheduled_at timestamp
    const [h, m] = selectedTimeSlot.split(':').map(Number)
    const scheduledAt = new Date(selectedDate)
    scheduledAt.setHours(h, m, 0, 0)

    try {
      let currentLeadId = leadId
      if (userRole !== 'client' && !currentLeadId) {
        // Query profile for name if available to create a lead
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name, last_name')
          .eq('id', userId)
          .maybeSingle()

        const name = profile?.full_name || 
                     (profile?.first_name || profile?.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                      : userEmail.split('@')[0])

        const { data: newLead, error: leadError } = await supabase
          .from('leads')
          .insert({
            name: name,
            business_name: 'To Be Specified',
            email: userEmail,
            status: 'New',
            source: 'booking'
          })
          .select('id')
          .single()

        if (leadError) throw leadError
        currentLeadId = newLead.id
        setLeadId(currentLeadId)
      }

      const payload = {
        category_id: selectedCategory.id,
        scheduled_at: scheduledAt.toISOString(),
        status: 'Scheduled',
        notes: notes || null,
        client_id: userRole === 'client' ? userId : null,
        lead_id: userRole !== 'client' ? currentLeadId : null
      }

      const { error: insertError } = await supabase
        .from('strategy_sessions')
        .insert(payload)

      if (insertError) throw insertError

      // Create notification in DB
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: 'Strategy Session Scheduled',
          description: `Vetting session category "${selectedCategory.name}" booked for ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}.`,
          link: '/dashboard'
        })

      setSuccess(true)
      setTimeout(() => {
        router.push(userRole === 'client' ? '/client' : '/dashboard')
      }, 3500)

    } catch (err: any) {
      setError(err.message || 'Failed to submit booking session. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Get investment tag (matching the admin panel weights)
  const getInvestmentText = (slug: string) => {
    switch (slug) {
      case 'launch-discovery-call': return '£1,500'
      case 'legacy-strategy-session': return '£3,500'
      case 'elite-strategy-session': return '£7,000'
      case 'ascent-discovery-call': return '£499/mo'
      case 'sovereign-strategy-session': return '£1,299/mo'
      case 'apex-strategy-session': return '£2,999/mo'
      default: return 'Included'
    }
  }

  // Loading indicator
  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center space-y-4 glass rounded-2xl border border-gold/15 max-w-lg mx-auto">
        <Loader2 size={32} className="text-gold animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-mono">Initializing booking telemetry...</p>
      </div>
    )
  }

  // Booking success view
  if (success) {
    return (
      <div className="max-w-md w-full mx-auto p-8 rounded-2xl border border-green-500/25 bg-gradient-to-b from-green-500/5 to-transparent text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.15)]">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-foreground">Session Allocation Confirmed</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your sync session for <span className="text-gold font-semibold">"{selectedCategory?.name}"</span> has been recorded. Direct calendar sync coordinates have been logged to your dashboard.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-gold/15 bg-black/45 space-y-1">
          <p className="text-xxs uppercase tracking-wider text-muted-foreground">Session Date & Time</p>
          <p className="text-sm font-bold text-gold">
            {selectedDate?.toLocaleDateString()} at {selectedTimeSlot}
          </p>
        </div>
        <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5 animate-pulse">
          <Loader2 size={10} className="animate-spin text-gold" /> Redirecting to Operations dashboard...
        </div>
      </div>
    )
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="w-full space-y-6">
      {/* Step Stepper Header */}
      <div className="flex items-center gap-4 bg-white/[0.02] border border-gold/10 p-4 rounded-2xl select-none">
        {([
          { num: 1, label: 'Package Type' },
          { num: 2, label: 'Select Date & Time' },
          { num: 3, label: 'Confirm Sync' }
        ]).map((s) => (
          <div key={s.num} className="flex items-center gap-2 flex-1 last:flex-initial">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
              step >= s.num
                ? 'bg-gold border-gold text-background shadow-[0_0_8px_rgba(212,175,55,0.3)]'
                : 'bg-gold/5 border-gold/15 text-gold/60'
            }`}>
              {s.num}
            </div>
            <span className={`text-[10px] font-bold tracking-wider uppercase hidden sm:block ${
              step >= s.num ? 'text-foreground' : 'text-muted-foreground/50'
            }`}>
              {s.label}
            </span>
            {s.num < 3 && <div className="h-px bg-gold/10 flex-1 mx-2 hidden sm:block" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-foreground">Select Session Category</h2>
            <p className="text-xs text-muted-foreground">Select your alignment package target to display calendar availability.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat)
                  setStep(2)
                }}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all group focus:outline-none cursor-pointer ${
                  selectedCategory?.id === cat.id
                    ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                    : 'border-gold/10 bg-[#0B0B0C] hover:border-gold/30 hover:bg-gold/[0.01]'
                }`}
              >
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-start gap-2 w-full">
                    <span
                      className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${cat.color_code}15`, color: cat.color_code, border: `1px solid ${cat.color_code}30` }}
                    >
                      {cat.duration_minutes} Mins
                    </span>
                    <span className="text-xs font-bold font-mono text-gold group-hover:text-gold-light transition-colors">
                      {getInvestmentText(cat.slug)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground pt-1.5 group-hover:text-gold transition-colors">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1 leading-relaxed">{cat.description || 'Consultation session.'}</p>
                </div>
                <div className="text-[10px] font-bold text-gold flex items-center gap-1 mt-3">
                  Select Package <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME SELECTOR */}
      {step === 2 && selectedCategory && (
        <div className="grid md:grid-cols-5 gap-6 animate-fade-in">
          {/* Calendar Grid */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-serif font-bold text-foreground">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <p className="text-[10px] text-muted-foreground">Select an available calendar day.</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/25 hover:bg-gold/5 text-gold/60 hover:text-gold transition-all cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/25 hover:bg-gold/5 text-gold/60 hover:text-gold transition-all cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="p-4 glass rounded-2xl border border-gold/15 bg-black/20">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground select-none pb-2 border-b border-gold/10">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span className="text-muted-foreground/30">Sat</span><span className="text-muted-foreground/30">Sun</span>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1.5 pt-3">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />
                  
                  const isAvailable = isDayAvailable(day)
                  const isSelected = selectedDate?.toDateString() === day.toDateString()
                  const isSatSun = day.getDay() === 0 || day.getDay() === 6

                  return (
                    <button
                      key={`day-${day.getDate()}`}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedDate(day)
                        setSelectedTimeSlot(null)
                      }}
                      className={`h-9 sm:h-11 rounded-xl text-xs font-semibold font-serif transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                        isSelected
                          ? 'bg-gold text-background font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                          : isAvailable
                          ? 'bg-gold/5 hover:bg-gold/15 border border-gold/20 hover:border-gold/45 text-gold font-bold shadow-[0_0_8px_rgba(212,175,55,0.05)]'
                          : `text-muted-foreground/20 pointer-events-none ${isSatSun ? 'bg-transparent' : 'bg-white/[0.01]'}`
                      }`}
                    >
                      <span>{day.getDate()}</span>
                      {isAvailable && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            
            <button
              onClick={() => {
                setSelectedCategory(null)
                setSelectedDate(null)
                setSelectedTimeSlot(null)
                setStep(1)
              }}
              className="text-xs text-muted-foreground hover:text-gold transition-colors underline underline-offset-2"
            >
              ← Back to packages
            </button>
          </div>

          {/* Time Slot Picker */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-serif font-bold text-foreground">Available Time Slots</h3>
              <p className="text-[10px] text-muted-foreground">
                {selectedDate
                  ? `Showing slots for ${selectedDate.toLocaleDateString()}`
                  : 'Select a day to display open sync slots.'}
              </p>
            </div>

            {selectedDate ? (
              timeSlots.length > 0 ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTimeSlot === time
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`py-2.5 text-center text-xs font-semibold rounded-xl border font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gold text-background border-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                              : 'bg-black/35 border-gold/10 hover:border-gold/30 text-foreground hover:bg-gold/5'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>

                  {selectedTimeSlot && (
                    <button
                      onClick={() => setStep(3)}
                      className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-serif"
                    >
                      Next Steps: Add Notes <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-gold/10 text-center space-y-2 bg-black/20">
                  <AlertCircle size={18} className="text-gold/50 mx-auto" />
                  <p className="text-xs text-muted-foreground">No slots available on this date.</p>
                </div>
              )
            ) : (
              <div className="p-8 rounded-2xl border border-gold/10 text-center space-y-2 bg-black/20 h-44 flex flex-col items-center justify-center">
                <CalendarIcon size={20} className="text-gold/25" />
                <p className="text-xs text-muted-foreground/60">Awaiting date selection...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: BRIEFING NOTES & CONFIRMATION */}
      {step === 3 && selectedCategory && selectedDate && selectedTimeSlot && (
        <form onSubmit={handleConfirmBooking} className="max-w-xl mx-auto glass rounded-2xl border border-gold/15 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-foreground">Consultation Briefing</h2>
            <p className="text-xs text-muted-foreground">Log topics or bottlenecks you want our integration architect to review.</p>
          </div>

          <div className="p-4 rounded-xl border border-gold/10 bg-black/45 grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Consultation Package</span>
              <p className="text-xs font-bold text-foreground">{selectedCategory.name}</p>
              <p className="text-xxs text-gold font-mono">{selectedCategory.duration_minutes} Mins · {getInvestmentText(selectedCategory.slug)}</p>
            </div>
            <div className="space-y-1 sm:border-l sm:border-gold/10 sm:pl-4">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sync Coordinates</span>
              <p className="text-xs font-bold text-foreground">{selectedDate.toLocaleDateString()}</p>
              <p className="text-xxs text-gold font-mono">Starts at {selectedTimeSlot}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText size={12} className="text-gold" /> Meeting Notes & Bottlenecks (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide context, website URLs, or automation roadblocks..."
              rows={4}
              className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-gold/10 hover:bg-gold/5 text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer font-serif"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-serif"
            >
              {submitting ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Allocating Sync...
                </>
              ) : (
                <>
                  Confirm Booking <Sparkles size={12} className="animate-pulse" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
