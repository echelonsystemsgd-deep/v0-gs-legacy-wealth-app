'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Bell,
  Trash2,
  Check,
  Send,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Inbox,
  User,
  Plus
} from 'lucide-react'

type NotificationRecord = {
  id: string
  user_id: string
  title: string
  description: string
  link: string
  is_read: boolean
  created_at: string
  profiles?: {
    full_name: string | null
    email: string | null
    role: string
  } | null
}

type UserProfile = {
  id: string
  full_name: string | null
  email: string | null
  role: string
}

export default function NotificationsPage() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  
  // Dispatch form states
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [dispatching, setDispatching] = useState(false)
  const [form, setForm] = useState({
    userId: '',
    title: '',
    description: '',
    link: '/client'
  })

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Fetch notifications
      const { data: notificationsData, error: notifErr } = await supabase
        .from('user_notifications')
        .select(`
          id, user_id, title, description, link, is_read, created_at,
          profiles(full_name, email, role)
        `)
        .order('created_at', { ascending: false })

      if (notifErr) throw notifErr
      setNotifications((notificationsData as any) ?? [])

      // 2. Fetch clients & users for dispatch selector
      const { data: profilesData, error: profErr } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .neq('role', 'admin')
        .eq('is_suspended', false)
        .order('role', { ascending: true })

      if (profErr) throw profErr
      setUsers((profilesData as any) ?? [])
    } catch (err: any) {
      triggerToast(err.message || 'Error fetching records.', 'error')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: isRead })
        .eq('id', id)

      if (error) throw error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: isRead } : n))
      )
      triggerToast(isRead ? 'Notification marked as read.' : 'Notification marked as unread.')
    } catch (err: any) {
      triggerToast(err.message || 'Operation failed.', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this notification?')) return
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      triggerToast('Notification permanently deleted.')
    } catch (err: any) {
      triggerToast(err.message || 'Deletion failed.', 'error')
    }
  }

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.userId || !form.title || !form.description) {
      triggerToast('Please fill in all required fields.', 'error')
      return
    }

    setDispatching(true)
    try {
      const { error } = await supabase.from('user_notifications').insert({
        user_id: form.userId,
        title: form.title,
        description: form.description,
        link: form.link || '/client',
        is_read: false
      })

      if (error) throw error
      triggerToast('Notification dispatched successfully.')
      setShowDispatchModal(false)
      setForm({ userId: '', title: '', description: '', link: '/client' })
      fetchData()
    } catch (err: any) {
      triggerToast(err.message || 'Failed to dispatch notification.', 'error')
    } finally {
      setDispatching(false)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read
    if (filter === 'read') return n.is_read
    return true
  })

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 left-4 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl flex items-center gap-2 animate-fade-in ${
          toast.type === 'error'
            ? 'bg-red-500/15 border-red-500/30 text-red-400'
            : 'bg-green-500/15 border-green-500/30 text-green-400'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-gold uppercase">
            <Bell size={12} /> Communication Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Notifications Logs</h1>
          <p className="text-sm text-muted-foreground">
            Audit sent client-side messages and dispatch custom notifications manually.
          </p>
        </div>
        <button
          onClick={() => setShowDispatchModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-gold to-gold-light text-background shadow-[0_0_16px_rgba(212,175,55,0.2)] hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer self-end sm:self-center"
        >
          <Plus size={14} /> Dispatch Alert
        </button>
      </div>

      {/* Filtering tabs */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'all', label: 'All Dispatches' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'read', label: 'Read Only' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-5 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === t.id
                ? 'border-gold text-gold bg-gold/5 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Syncing dispatches log...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6 glass rounded-2xl border border-gold/10 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold/40">
            <Inbox size={20} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-foreground">Dispatches Clear</h3>
            <p className="text-xs text-muted-foreground mt-1">No client notification logs matching this filter criteria exist.</p>
          </div>
          <button onClick={() => setShowDispatchModal(true)} className="px-4 py-2 text-xxs font-bold uppercase tracking-wider rounded-lg bg-gold text-background hover:bg-gold-light transition-all cursor-pointer">
            Dispatch Custom Alert
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 bg-white/[0.01] text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Notification Title</th>
                  <th className="px-6 py-4">Description Preview</th>
                  <th className="px-6 py-4">Read State</th>
                  <th className="px-6 py-4">Sent Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-sm">
                {filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{notif.profiles?.full_name || 'System User'}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{notif.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-foreground truncate max-w-[200px]" title={notif.title}>
                        {notif.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-muted-foreground leading-normal truncate max-w-[250px]" title={notif.description}>
                        {notif.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        notif.is_read
                          ? 'bg-green-500/10 border-green-500/25 text-green-400'
                          : 'bg-amber-500/10 border-amber-500/25 text-amber-400 animate-pulse'
                      }`}>
                        {notif.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleMarkAsRead(notif.id, !notif.is_read)}
                          className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-all cursor-pointer"
                          title={notif.is_read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                          title="Delete Log"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-gold/5">
            {filteredNotifications.map((notif) => (
              <div key={notif.id} className="p-4 space-y-3 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{notif.title}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{notif.profiles?.full_name || 'System User'}</p>
                    <p className="text-[10px] text-muted-foreground/70 font-mono">{notif.profiles?.email}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    notif.is_read
                      ? 'bg-green-500/10 border-green-500/25 text-green-400'
                      : 'bg-amber-500/10 border-amber-500/25 text-amber-400 animate-pulse'
                  }`}>
                    {notif.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-gold/5">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkAsRead(notif.id, !notif.is_read)}
                      className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-all cursor-pointer"
                      title={notif.is_read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                      title="Delete Log"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* DISPATCH NEW ALERT MODAL */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass border border-gold/25 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-foreground">Dispatch Custom Alert</h2>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Recipient Profile *</label>
                <select
                  required
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer [color-scheme:dark]"
                >
                  <option value="" className="bg-[#0A0A0A]">-- Select Client / User --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#0A0A0A]">
                      {u.full_name || 'Anonymous'} ({u.email}) - {u.role.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notification Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Design Proposal Ready"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details showing the purpose of this notification alert..."
                  rows={3}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action Link Target (optional)</label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/client"
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-background rounded-lg shadow-lg hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                >
                  {dispatching ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
