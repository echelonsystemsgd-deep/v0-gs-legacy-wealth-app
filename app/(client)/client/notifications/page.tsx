'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, ArrowLeft, MessageSquare, Calendar, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type NotificationItem = {
  id: string
  title: string
  description: string
  timestamp: Date
  isRead: boolean
  link: string
}

export default function ClientNotificationsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial notifications and subscribe to real-time additions
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false

    const loadNotifications = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUserId(user.id)

        // Load notifications from DB (always works regardless of realtime)
        const { data, error: fetchError } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        if (data && !cancelled) {
          setNotifications(
            data.map((n) => ({
              id: n.id,
              title: n.title,
              description: n.description,
              timestamp: new Date(n.created_at),
              isRead: n.is_read,
              link: n.link || '#',
            }))
          )
        }

        // Set up realtime subscription separately — failures here are non-fatal
        if (!cancelled) {
          try {
            channel = supabase
              .channel(`notifs_${user.id}_${Date.now()}`)
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'user_notifications',
                  filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                  if (cancelled) return
                  const newNotif = payload.new as any
                  const item: NotificationItem = {
                    id: newNotif.id,
                    title: newNotif.title,
                    description: newNotif.description,
                    timestamp: new Date(newNotif.created_at),
                    isRead: newNotif.is_read,
                    link: newNotif.link || '#',
                  }
                  setNotifications((prev) => [item, ...prev])
                }
              )
              .subscribe()
          } catch (realtimeErr) {
            // Realtime failing is non-fatal — the page still shows notifications from DB
            console.warn('Realtime subscription skipped:', realtimeErr)
          }
        }
      } catch (err: any) {
        if (!cancelled) setError('Failed to load notifications: ' + err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNotifications()

    return () => {
      cancelled = true
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, router])

  const markAllAsRead = async () => {
    if (!userId) return
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    try {
      await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
      toast.success('All notifications marked as read.')
    } catch (err: any) {
      toast.error('Failed to update notifications.')
    }
  }

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    try {
      await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', id)
    } catch (err) {
      console.error(err)
    }
  }

  const clearAll = async () => {
    if (!userId) return
    if (!confirm('Are you sure you want to clear all notifications?')) return
    setNotifications([])
    try {
      await supabase
        .from('user_notifications')
        .delete()
        .eq('user_id', userId)
      toast.success('All notifications cleared.')
    } catch (err: any) {
      toast.error('Failed to clear notifications.')
    }
  }

  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    try {
      await supabase
        .from('user_notifications')
        .delete()
        .eq('id', id)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto select-none">
        <Loader2 size={32} className="text-gold animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-mono">Syncing alert telemetry...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 text-gold/80 hover:text-gold transition-all cursor-pointer mr-1"
              aria-label="Go Back"
            >
              <ArrowLeft size={14} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Notifications
            </h1>
          </div>
          <p className="text-xs text-muted-foreground ml-9">
            Stay updated with your bookings and account activity.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-3 self-end sm:self-center ml-9 sm:ml-0">
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-gold/5 border border-gold/25 text-gold hover:bg-gold/10 hover:border-gold/45 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-3.5 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/35 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5 max-w-xl">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4 max-w-4xl">
        {notifications.length === 0 ? (
          <div className="p-12 sm:p-16 glass rounded-2xl border border-gold/10 text-center max-w-xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mx-auto">
              <Bell size={24} className="text-gold/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-foreground">All Clear</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No active notifications logged. System telemetry, message notifications, and milestone alerts will appear here.
              </p>
            </div>
          </div>
        ) : (
          notifications.map((item) => {
            const isBooking = item.title.toLowerCase().includes('session') || item.title.toLowerCase().includes('booking')
            const isMessage = item.link.includes('messages')
            
            return (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`relative p-5 glass rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer group ${
                  !item.isRead
                    ? 'border-gold/35 bg-gold/[0.02] shadow-[0_0_12px_rgba(212,175,55,0.03)]'
                    : 'border-gold/10 hover:border-gold/25 bg-[#0B0B0C] hover:bg-gold/[0.01]'
                }`}
              >
                {/* Unread indicator vertical bar */}
                {!item.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-r bg-gradient-to-b from-gold to-gold/30" />
                )}

                {/* Left Icon */}
                <div className={`p-3 rounded-xl border shrink-0 ${
                  isBooking
                    ? 'bg-gold/10 border-gold/25 text-gold'
                    : isMessage
                    ? 'bg-purple-500/10 border-purple-500/25 text-purple-400'
                    : 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                }`}>
                  {isBooking ? (
                    <Calendar size={16} />
                  ) : isMessage ? (
                    <MessageSquare size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-sm font-serif font-bold text-foreground group-hover:text-gold transition-colors duration-200">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pr-8">
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-between">
                    {item.link && item.link !== '#' ? (
                      <Link
                        href={item.link}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gold hover:text-gold-light hover:underline transition-all"
                      >
                        Open Target Action →
                      </Link>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-3">
                      {!item.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(item.id)
                          }}
                          className="px-2.5 py-1 rounded bg-gold/15 hover:bg-gold/25 text-gold border border-gold/20 text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={(e) => deleteNotification(e, item.id)}
                        className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/30 text-red-400 transition-all cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
