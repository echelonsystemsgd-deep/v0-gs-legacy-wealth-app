'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, User, Sparkles, MessageSquare, ShieldAlert, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'


type MessageItem = {
  id: string
  content: string
  created_at: string
  sender_id: string
  sender_role?: string
  sender_name?: string
}

export function MessagesClientContainer({
  projectId,
  clientId,
  initialMessages,
  clientName,
}: {
  projectId: string
  clientId: string
  initialMessages: MessageItem[]
  clientName: string
}) {
  const supabase = createClient()
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const [showPriorityModal, setShowPriorityModal] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [requestingOverride, setRequestingOverride] = useState(false)

  const handleRequestOverride = async () => {
    if (!overrideReason.trim()) {
      toast.error('Please specify a reason for the priority override request.')
      return
    }
    setRequestingOverride(true)
    try {
      const { error } = await supabase
        .from('project_action_requests')
        .insert({
          project_id: projectId,
          title: '[PRIORITY OVERRIDE] Build Stack Redirection',
          description: `Priority Override Authorized by Client. Reason: ${overrideReason}`,
          status: 'submitted',
          client_response: 'Authorized',
          submitted_at: new Date().toISOString()
        })
      
      if (error) throw error
      toast.success('Priority pipeline override requested successfully.')
      setOverrideReason('')
      setShowPriorityModal(false)
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to request priority override: ' + err.message)
    } finally {
      setRequestingOverride(false)
    }
  }


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

  // Scroll to bottom helper
  const scrollToBottom = () => {
    const container = chatContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Real-time subscription to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`project_messages_${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any
          const isFromOther = newMsg.sender_id !== clientId

          if (isFromOther) {
            playChime()

            if (
              typeof window !== 'undefined' &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              new Notification('New Message from Support', {
                body: newMsg.content,
                icon: '/favicon.ico',
              })
            }

            if (document.hidden) {
              startTitleFlash()
            }
          }
          
          // Check if message is already in list (prevents duplicates from rapid loads)
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [
              ...prev,
              {
                id: newMsg.id,
                content: newMsg.content,
                created_at: newMsg.created_at,
                sender_id: newMsg.sender_id,
              },
            ]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const oldMsg = payload.old as any
          setMessages((prev) => prev.filter((m) => m.id !== oldMsg.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, projectId, clientId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || sending) return

    setSending(true)
    const textToSend = inputText.trim()
    setInputText('')

    try {
      const { error } = await supabase.from('messages').insert({
        project_id: projectId,
        sender_id: clientId,
        content: textToSend,
      })

      if (error) {
        console.error('Error inserting message', error)
        // Put text back in input if it fails
        setInputText(textToSend)
      }
    } catch (err) {
      console.error('Error sending message', err)
    } finally {
      setSending(false)
    }
  }

  const handleUnsendMessage = async (messageId: string) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', messageId)
      if (error) {
        console.error('Error deleting message', error)
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
      }
    } catch (err) {
      console.error('Error unsending message', err)
    }
  }

  return (
    <div className="glass rounded-2xl border border-gold/10 overflow-hidden flex flex-col h-[500px] sm:h-[600px] lg:h-[650px] shadow-2xl">
      {/* Thread Header */}
      <div className="px-6 py-4 bg-[#111111]/90 border-b border-gold/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <MessageSquare size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Project Desk</h2>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live sync active
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPriorityModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 text-xxs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
        >
          <Sparkles size={11} className="animate-pulse shrink-0" />
          <span>Priority Override</span>
        </button>
      </div>


      {/* Messages Panel */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 bg-black/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center">
              <MessageSquare size={20} className="text-gold/40" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed mt-1">
                Start the conversation. Send a message to our build team about revisions, assets, or feedback.
              </p>
            </div>
          </div>
        ) : (
          (() => {
            let lastDateStr = ''
            return messages.map((msg) => {
              const isMe = msg.sender_id === clientId
              const isWithin15Min = new Date().getTime() - new Date(msg.created_at).getTime() < 15 * 60 * 1000
              const msgDateObj = new Date(msg.created_at)
              const messageDateStr = msgDateObj.toDateString()
              const showDateHeader = lastDateStr !== messageDateStr
              lastDateStr = messageDateStr

              const isToday = messageDateStr === new Date().toDateString()
              const formattedTime = isToday 
                ? msgDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : `${msgDateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, ${msgDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

              const displayDateHeader = showDateHeader ? (
                <div className="flex items-center justify-center py-2 animate-in fade-in select-none w-full">
                  <span className="px-3 py-1 rounded-full bg-black/60 border border-gold/10 text-[8px] font-bold text-gold uppercase tracking-widest font-mono">
                    {isToday ? 'Today' : msgDateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              ) : null

              return (
                <div key={msg.id} className="space-y-3 w-full">
                  {displayDateHeader}
                  <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gold/10 border border-gold/25 text-foreground rounded-tr-none'
                          : 'bg-[#1A0A2E]/50 border border-purple-500/25 text-foreground rounded-tl-none'
                      }`}
                    >
                      {/* Sender title */}
                      <span className="text-[9px] font-bold text-gold/80 block uppercase tracking-widest mb-1">
                        {isMe ? 'You' : 'Agency Support'}
                      </span>
                      
                      {/* Content */}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Time & Unsend */}
                      <div className="flex justify-between items-center mt-1.5 gap-4">
                        {isMe && isWithin15Min && (
                          <button
                            type="button"
                            onClick={() => handleUnsendMessage(msg.id)}
                            className="text-[8px] text-red-400/70 hover:text-red-400 transition-colors uppercase font-bold tracking-wider cursor-pointer"
                            title="Unsend message"
                          >
                            Unsend
                          </button>
                        )}
                        <span className="text-[8px] text-muted-foreground/50 block ml-auto font-mono">
                          {formattedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          })()
        )}
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#111111]/90 border-t border-gold/10 shrink-0 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          disabled={sending}
          className="flex-1 bg-background/50 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/60 outline-none transition-all disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="bg-gold hover:bg-gold-light text-background font-bold shrink-0 w-11 h-11 rounded-xl p-0 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:shadow-gold/10 disabled:opacity-50"
        >
          <Send size={15} />
        </Button>
      </form>
      {showPriorityModal && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0D0D0E] border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl p-6 relative flex flex-col gap-5 select-text">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
                  <ShieldAlert size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest leading-none">Priority Directive</span>
                  <h4 className="text-sm font-serif font-bold text-foreground truncate mt-0.5 font-bold">Priority Pipeline Override</h4>
                </div>
              </div>
              <button
                onClick={() => setShowPriorityModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-purple-500/10 text-muted-foreground hover:text-purple-400 transition-all cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed text-left">
              Authorizing a Priority Override directs our engineering team to immediately swap their active build stack to prioritize your task deliverables. Please specify the engineering focus below.
            </p>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground">Override Rationale / Build Focus</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Specify which wireframes, designs, code updates or issues require immediate engineering resolution..."
                rows={3}
                className="w-full bg-background/50 border border-purple-500/20 hover:border-purple-500/45 focus:border-purple-500/60 rounded-xl p-3 text-xs text-foreground placeholder-muted-foreground/45 outline-none transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleRequestOverride}
                disabled={requestingOverride || !overrideReason.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all text-center cursor-pointer font-serif disabled:opacity-50"
              >
                {requestingOverride ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Authorize Override Command
              </button>
              <button
                onClick={() => setShowPriorityModal(false)}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
