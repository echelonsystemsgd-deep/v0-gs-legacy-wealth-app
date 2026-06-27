'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Inbox, Calendar, Check, Trash2, UserPlus, Sparkles, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type NotificationItem = {
  id: string
  type: 'lead' | 'booking' | 'message'
  title: string
  description: string
  timestamp: Date
  isRead: boolean
  link: string
}

export function NotificationCenter() {
  const supabase = createClient()
  const router = useRouter()
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

  // Subscribe to real-time events on user_notifications table and load existing history
  useEffect(() => {
    let currentAdminId: string | null = null

    async function loadNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      currentAdminId = user.id

      // Fetch user_notifications
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching notifications:', error.message)
        return
      }

      const mapped: NotificationItem[] = (data ?? []).map((n) => {
        let type: 'lead' | 'booking' | 'message' = 'message'
        if (n.link?.includes('/leads/')) type = 'lead'
        else if (n.link?.includes('/bookings')) type = 'booking'
        return {
          id: n.id,
          type,
          title: n.title,
          description: n.description,
          timestamp: new Date(n.created_at),
          isRead: n.is_read,
          link: n.link || '#'
        }
      })
      setNotifications(mapped)
    }

    loadNotifications()

    // Subscribe to realtime changes in user_notifications table
    const channel = supabase
      .channel('realtime_user_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_notifications' },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          if (payload.eventType === 'INSERT') {
            const newNotif = payload.new as any
            if (newNotif.user_id !== user.id) return

            let type: 'lead' | 'booking' | 'message' = 'message'
            if (newNotif.link?.includes('/leads/')) type = 'lead'
            else if (newNotif.link?.includes('/bookings')) type = 'booking'

            const item: NotificationItem = {
              id: newNotif.id,
              type,
              title: newNotif.title,
              description: newNotif.description,
              timestamp: new Date(newNotif.created_at),
              isRead: newNotif.is_read,
              link: newNotif.link || '#'
            }

            setNotifications((prev) => [item, ...prev])

            // Trigger sonner toast
            if (type === 'lead') {
              toast.success(newNotif.title, {
                description: newNotif.description,
                action: {
                  label: 'View',
                  onClick: () => router.push(newNotif.link || '/admin/leads')
                }
              })
            } else {
              toast.info(newNotif.title, {
                description: newNotif.description,
                action: {
                  label: 'View',
                  onClick: () => router.push(newNotif.link || '/admin')
                }
              })
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotif = payload.new as any
            if (updatedNotif.user_id !== user.id) return

            setNotifications((prev) =>
              prev.map((n) =>
                n.id === updatedNotif.id ? { ...n, isRead: updatedNotif.is_read } : n
              )
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedNotif = payload.old as any
            setNotifications((prev) => prev.filter((n) => n.id !== deletedNotif.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
  }

  const markAsRead = async (id: string) => {
    await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', id)
  }

  const clearAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('user_notifications')
      .delete()
      .eq('user_id', user.id)
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
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#130D24] rounded-2xl border border-gold/20 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.8)] z-50 text-sm animate-fade-in">
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#1C1430] border-b border-gold/15 flex items-center justify-between">
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
                      : item.type === 'message'
                        ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                        : 'bg-purple-500/10 border-purple-500/25 text-purple-400'
                  }`}>
                    {item.type === 'lead' ? (
                      <UserPlus size={15} />
                    ) : item.type === 'message' ? (
                      <MessageSquare size={15} />
                    ) : (
                      <Calendar size={15} />
                    )}
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
