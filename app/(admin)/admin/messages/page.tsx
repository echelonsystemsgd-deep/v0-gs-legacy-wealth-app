'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, MessageSquare, Send, Globe, FolderKanban, 
  ExternalLink, Loader2, ArrowRight, CornerDownLeft, 
  ShieldCheck, CircleDot 
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Project = {
  id: string
  project_name: string
  client_name: string
  client_id: string | null
  preview_url: string | null
  status: string
}

type Message = {
  id: string
  project_id: string
  sender_id: string
  content: string
  created_at: string
  is_read?: boolean
}

export default function AdminMessageDesk() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [adminUserId, setAdminUserId] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Request notification permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default' && localStorage.getItem('gs-messages-alert-prompted') !== 'true') {
        Notification.requestPermission().then(() => {
          localStorage.setItem('gs-messages-alert-prompted', 'true')
        })
      }
    }
  }, [])

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      gain1.gain.setValueAtTime(0.08, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start()
      osc1.stop(ctx.currentTime + 0.3)
      
      setTimeout(() => {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(880, ctx.currentTime) // A5
        gain2.gain.setValueAtTime(0.08, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start()
        osc2.stop(ctx.currentTime + 0.4)
      }, 70)
    } catch (e) {
      console.warn('Audio blocked', e)
    }
  }

  const startTitleFlash = () => {
    let showMsg = true
    const originalTitle = document.title
    const flashInterval = setInterval(() => {
      document.title = showMsg ? '💬 New Message!' : originalTitle
      showMsg = !showMsg
    }, 1200)

    const stopFlash = () => {
      clearInterval(flashInterval)
      document.title = originalTitle
      window.removeEventListener('focus', stopFlash)
    }
    window.addEventListener('focus', stopFlash)
  }

  // Get admin user session ID on load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setAdminUserId(data.user.id)
    })
  }, [supabase])

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, msgRes] = await Promise.all([
          supabase
            .from('projects')
            .select('id, project_name, client_name, client_id, preview_url, status')
            .eq('is_archived', false),
          supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })
        ])

        if (projRes.data) setProjects(projRes.data)
        if (msgRes.data) setAllMessages(msgRes.data)
      } catch (err) {
        console.error('Error fetching messaging data:', err)
        toast.error('Failed to sync workspace parameters.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  // Real-time listener for incoming messages globally
  useEffect(() => {
    const channel = supabase
      .channel('admin_global_chat_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message
          const isFromOther = newMsg.sender_id !== adminUserId

          if (isFromOther) {
            if (newMsg.project_id === selectedProjectId) {
              // Automatically mark as read in DB since the chat is open
              supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMsg.id)
                .then(({ error }) => {
                  if (error) console.error('Failed to mark real-time message read:', error)
                })
              newMsg.is_read = true
            } else {
              playChime()

              if (
                typeof window !== 'undefined' &&
                'Notification' in window &&
                Notification.permission === 'granted'
              ) {
                new Notification('New Client Message', {
                  body: newMsg.content,
                  icon: '/favicon.ico',
                })
              }

              if (document.hidden) {
                startTitleFlash()
              }
            }
          }

          setAllMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          const oldMsg = payload.old as Message
          setAllMessages((prev) => prev.filter((m) => m.id !== oldMsg.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, adminUserId, selectedProjectId])

  // Scroll chat window to bottom
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [selectedProjectId, allMessages])

  // Automatically mark client messages as read when opening conversation
  useEffect(() => {
    if (!selectedProjectId || !adminUserId) return

    const markAsRead = async () => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('project_id', selectedProjectId)
          .neq('sender_id', adminUserId)
          .eq('is_read', false)

        if (error) throw error

        // Update local state to reflect read status
        setAllMessages((prev) =>
          prev.map((m) =>
            m.project_id === selectedProjectId && m.sender_id !== adminUserId
              ? { ...m, is_read: true }
              : m
          )
        )
      } catch (err) {
        console.error('Error marking messages as read:', err)
      }
    }

    markAsRead()
  }, [selectedProjectId, adminUserId, supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || sendingMsg || !selectedProjectId || !adminUserId) return

    setSendingMsg(true)
    const text = chatInput.trim()
    setChatInput('')

    try {
      const { error } = await supabase.from('messages').insert({
        project_id: selectedProjectId,
        sender_id: adminUserId,
        content: text,
      })

      if (error) {
        console.error('Send error:', error)
        setChatInput(text)
        toast.error('Message transmission failed.')
      } else {
        // Automatically mark client messages as read when admin replies
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('project_id', selectedProjectId)
          .neq('sender_id', adminUserId)
          .eq('is_read', false)

        setAllMessages((prev) =>
          prev.map((m) =>
            m.project_id === selectedProjectId && m.sender_id !== adminUserId
              ? { ...m, is_read: true }
              : m
          )
        )
      }
    } catch (err) {
      console.error('Send exception:', err)
      toast.error('Network disconnect detected.')
    } finally {
      setSendingMsg(false)
    }
  }

  const handleUnsendMessage = async (messageId: string) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', messageId)
      if (error) {
        console.error('Delete error:', error)
        toast.error('Failed to unsend message.')
      } else {
        setAllMessages((prev) => prev.filter((m) => m.id !== messageId))
        toast.success('Message unsent.')
      }
    } catch (err) {
      console.error('Delete exception:', err)
      toast.error('Failed to delete message.')
    }
  }

  // Derive conversation details list
  const conversationList = projects
    .map((proj) => {
      const projMessages = allMessages.filter((m) => m.project_id === proj.id)
      const latestMsg = projMessages[projMessages.length - 1] || null
      
      // A conversation is flagged "unread" if there are unread messages from client
      const unreadCount = projMessages.filter((m) => m.sender_id !== adminUserId && !m.is_read).length
      const isUnread = unreadCount > 0

      return {
        ...proj,
        latestMsg,
        isUnread,
        unreadCount,
        messageCount: projMessages.length,
      }
    })
    // Sort by latest message date, placing conversations with no messages at the bottom
    .sort((a, b) => {
      if (a.latestMsg && b.latestMsg) {
        return new Date(b.latestMsg.created_at).getTime() - new Date(a.latestMsg.created_at).getTime()
      }
      if (a.latestMsg) return -1
      if (b.latestMsg) return 1
      return 0
    })
    // Filter by search query (project name or client name)
    .filter((conv) => {
      const query = searchQuery.toLowerCase()
      return (
        conv.project_name.toLowerCase().includes(query) ||
        conv.client_name.toLowerCase().includes(query)
      )
    })

  const activeProject = projects.find((p) => p.id === selectedProjectId) || null
  const activeMessages = allMessages.filter((m) => m.project_id === selectedProjectId)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 size={32} className="animate-spin text-gold/50" />
      </div>
    )
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col min-h-[500px]">
      {/* Page Title */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-gold uppercase">
            <MessageSquare size={12} /> Communication Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-0.5">Client Messages Center</h1>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono bg-white/[0.03] px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 shrink-0">
          <ShieldCheck size={11} className="text-gold" /> secure gateway
        </span>
      </div>

      {/* Main Container Split Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side: Inbox List (1/3 width) */}
        <div className="lg:col-span-1 glass rounded-2xl border border-gold/10 flex flex-col overflow-hidden bg-[#0A0A0A]/50">
          {/* Search bar */}
          <div className="p-4 border-b border-gold/10 shrink-0">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <input
                type="text"
                placeholder="Search clients or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-gold/15 hover:border-gold/35 focus:border-gold/50 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Inbox list */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {conversationList.length === 0 ? (
              <div className="py-12 text-center px-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground/60">No conversations found.</p>
                <p className="text-[10px] text-muted-foreground/40 leading-relaxed">
                  Verify project client assignments inside the Projects Configuration panel.
                </p>
              </div>
            ) : (
              conversationList.map((conv) => {
                const isActive = conv.id === selectedProjectId
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedProjectId(conv.id)}
                    className={`relative p-4 flex gap-3.5 hover:bg-white/[0.02] cursor-pointer transition-all duration-200 border-l-[3px] select-none ${
                      isActive 
                        ? 'bg-gold/5 border-gold' 
                        : conv.isUnread 
                          ? 'bg-gold/[0.02] border-gold/40' 
                          : 'border-transparent'
                    }`}
                  >
                    {/* Folder Icon / Unread Dot */}
                    <div className={`w-10 h-10 rounded-xl border shrink-0 flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_8px_rgba(201,162,39,0.15)]' 
                        : conv.isUnread 
                          ? 'bg-[#1A0A2E]/50 border-purple-500/30 text-purple-400' 
                          : 'bg-white/[0.02] border-white/5 text-muted-foreground/50'
                    }`}>
                      <FolderKanban size={16} />
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-foreground truncate">{conv.project_name}</h4>
                        {conv.latestMsg && (
                          <span className="text-[8px] text-muted-foreground/50 font-mono">
                            {new Date(conv.latestMsg.created_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">Client: {conv.client_name}</p>
                      
                      {/* Message Preview */}
                      {conv.latestMsg ? (
                        <p className={`text-[10px] truncate leading-normal ${conv.isUnread ? 'text-gold font-semibold' : 'text-muted-foreground/60'}`}>
                          {conv.latestMsg.sender_id === adminUserId ? 'You: ' : ''}{conv.latestMsg.content}
                        </p>
                      ) : (
                        <p className="text-[10px] italic text-muted-foreground/35">No conversation history</p>
                      )}
                    </div>

                    {/* Unread dot count */}
                    {conv.isUnread && (
                      <div className="absolute right-4 bottom-4 shrink-0 flex items-center justify-center">
                        <CircleDot size={12} className="text-gold animate-pulse" />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Window (2/3 width) */}
        <div className="lg:col-span-2 glass rounded-2xl border border-gold/10 flex flex-col overflow-hidden bg-[#0A0A0A]/20">
          {activeProject ? (
            <>
              {/* Active Chat Header */}
              <div className="px-6 py-4 bg-[#111111]/90 border-b border-gold/10 flex items-center justify-between shrink-0 select-none">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold text-foreground">{activeProject.project_name}</h2>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Client Channel: <span className="text-gold">{activeProject.client_name}</span> | Pipeline Status: {activeProject.status}
                  </p>
                </div>
                
                {/* Header Shortcut Actions */}
                <div className="flex items-center gap-2.5">
                  {activeProject.preview_url && (
                    <a
                      href={activeProject.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gold/20 text-[10px] font-bold text-gold hover:bg-gold/10 hover:border-gold/30 transition-all cursor-pointer font-mono"
                    >
                      Staging <Globe size={10} />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${activeProject.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 hover:border-gold/50 text-[10px] font-bold text-gold hover:bg-gold/15 transition-all"
                  >
                    Manage Project <ArrowRight size={10} />
                  </Link>
                </div>
              </div>

              {/* Message List Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#0A0A0A]/30 scrollbar-thin">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center">
                      <MessageSquare size={20} className="text-gold/45" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Awaiting Project Setup</p>
                      <p className="text-xs text-muted-foreground/60 leading-relaxed mt-1">
                        Send a message to kick off client onboarding instructions. They will see it immediately inside their Operations dashboard.
                      </p>
                    </div>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMe = msg.sender_id === adminUserId
                    return (
                      <div
                        key={msg.id}
                        className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#1A0A2E]/60 border border-purple-500/25 text-foreground rounded-tr-none shadow-md shadow-purple-950/20'
                              : 'bg-gold/10 border border-gold/25 text-foreground rounded-tl-none shadow-md shadow-amber-950/10'
                          }`}
                        >
                          {/* Sender title banner */}
                          <span className={`text-[9px] font-bold block uppercase tracking-widest mb-1 ${isMe ? 'text-purple-400' : 'text-gold'}`}>
                            {isMe ? 'Admin Support' : 'Client Representative'}
                          </span>
                          
                          {/* Message Content */}
                          <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
                          
                          {/* Message Timestamp & Unsend */}
                          <div className="flex justify-between items-center mt-1.5 gap-4">
                            {isMe && (
                              <button
                                type="button"
                                onClick={() => handleUnsendMessage(msg.id)}
                                className="text-[8px] text-red-400/70 hover:text-red-400 transition-colors uppercase font-bold tracking-wider cursor-pointer font-sans"
                                title="Unsend message"
                              >
                                Unsend
                              </button>
                            )}
                            <span className="text-[8px] text-muted-foreground/50 block ml-auto font-mono">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Chat Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#111111]/90 border-t border-gold/10 shrink-0 flex items-center gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Send reply to ${activeProject.client_name}...`}
                  disabled={sendingMsg || !activeProject.client_id}
                  className="flex-1 bg-background/50 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4.5 py-3 text-xs text-foreground placeholder-muted-foreground/60 outline-none transition-all disabled:opacity-50"
                />
                
                <Button
                  type="submit"
                  disabled={!chatInput.trim() || sendingMsg || !activeProject.client_id}
                  className="bg-gold hover:bg-gold-light text-background font-bold shrink-0 w-11 h-11 rounded-xl p-0 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:shadow-gold/10 disabled:opacity-50"
                >
                  <Send size={14} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center">
                <MessageSquare size={26} className="text-gold/45" />
              </div>
              <div className="max-w-xs space-y-1.5">
                <h3 className="text-sm font-bold text-foreground">Select a Conversation</h3>
                <p className="text-xs text-muted-foreground/75 leading-relaxed">
                  Select an active client project workspace from the left pane to initialize chat channels.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
