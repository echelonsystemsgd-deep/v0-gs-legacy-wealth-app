'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Inbox, Calendar, Check, Trash2, UserPlus, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type NotificationItem = {
  id: string
  type: 'lead' | 'booking'
  title: string
  description: string
  timestamp: Date
  isRead: boolean
  link: string
}

export function NotificationCenter() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Listen to clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Subscribe to real-time events on leads and strategy_sessions tables
  useEffect(() => {
    // 1. Subscribe to new leads
    const leadsChannel = supabase
      .channel('realtime_leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = payload.new
          const item: NotificationItem = {
            id: newLead.id || `lead-${Date.now()}`,
            type: 'lead',
            title: 'New Lead Submission',
            description: `${newLead.name} from ${newLead.business_name || 'N/A'}`,
            timestamp: new Date(),
            isRead: false,
            link: `/admin/leads/${newLead.id}`
          }
          setNotifications((prev) => [item, ...prev])
        }
      )
      .subscribe()

    // 2. Subscribe to new bookings
    const bookingsChannel = supabase
      .channel('realtime_bookings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'strategy_sessions' },
        async (payload) => {
          const newBooking = payload.new
          // Query details of lead/client name if possible, or fallback to general label
          let attendeeName = 'Client/Lead'
          if (newBooking.lead_id) {
            const { data } = await supabase
              .from('leads')
              .select('name')
              .eq('id', newBooking.lead_id)
              .maybeSingle()
            if (data?.name) attendeeName = data.name
          } else if (newBooking.client_id) {
            const { data } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newBooking.client_id)
              .maybeSingle()
            if (data?.full_name) attendeeName = data.full_name
          }

          const item: NotificationItem = {
            id: newBooking.id || `booking-${Date.now()}`,
            type: 'booking',
            title: 'New Strategy Session',
            description: `Session booked by ${attendeeName}`,
            timestamp: new Date(newBooking.scheduled_at),
            isRead: false,
            link: '/admin/bookings'
          }
          setNotifications((prev) => [item, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(leadsChannel)
      supabase.removeChannel(bookingsChannel)
    }
  }, [supabase])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl bg-gold/5 border border-gold/10 hover:bg-gold/10 hover:border-gold/30 text-gold transition-all duration-200 cursor-pointer flex items-center justify-center"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass rounded-2xl border border-gold/20 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] z-50 text-sm animate-fade-in">
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#1A0A2E]/60 border-b border-gold/15 flex items-center justify-between">
            <span className="font-serif font-bold text-foreground flex items-center gap-2 text-sm">
              <Sparkles size={13} className="text-gold" /> Notification Centre
            </span>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gold hover:text-gold/70 transition-colors flex items-center gap-1 font-semibold py-1 px-2 rounded-lg hover:bg-gold/10"
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1 font-semibold py-1 px-2 rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-12 text-center px-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto">
                  <Bell size={20} className="text-gold/30" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">All clear</p>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed mt-1">
                    Real-time lead and booking alerts will stream here instantly.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`relative flex items-start gap-3.5 px-4 py-4 hover:bg-white/[0.03] transition-colors cursor-pointer ${
                    !item.isRead ? 'bg-gold/[0.03]' : ''
                  }`}
                >
                  {/* Unread Indicator Bar */}
                  {!item.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r bg-gradient-to-b from-gold to-gold/30" />
                  )}

                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                    item.type === 'lead'
                      ? 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                      : 'bg-purple-500/10 border-purple-500/25 text-purple-400'
                  }`}>
                    {item.type === 'lead' ? <UserPlus size={15} /> : <Calendar size={15} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-semibold text-foreground leading-snug">{item.title}</p>
                      <span className="text-[9px] text-muted-foreground font-mono whitespace-nowrap pt-0.5 shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gold hover:text-gold/70 py-1 transition-colors"
                      >
                        View in workspace →
                      </Link>
                      
                      {!item.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(item.id)
                          }}
                          className="px-2 py-0.5 rounded bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 text-[9px] font-bold transition-all cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
