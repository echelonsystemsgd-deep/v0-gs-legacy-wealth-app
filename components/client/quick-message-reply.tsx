'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type QuickReplyProps = {
  projectId: string
  clientId: string
}

export function QuickMessageReply({ projectId, clientId }: QuickReplyProps) {
  const supabase = createClient()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || sending) return

    setSending(true)
    const text = content.trim()

    try {
      const { error } = await supabase.from('messages').insert({
        project_id: projectId,
        sender_id: clientId,
        content: text,
      })

      if (error) {
        console.error('Error sending support message:', error)
        toast.error('Failed to dispatch message. Please retry.')
      } else {
        toast.success('Support ticket dispatched successfully.')
        setContent('')
        router.refresh() // Trigger a layout refresh to reload parent messages list
      }
    } catch (err) {
      console.error('Message submission error:', err)
      toast.error('Connection error occurred.')
    } finally {
      setSending(false)
    }
  }

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false)
  const [overrideSending, setOverrideSending] = useState(false)

  const handlePriorityOverride = async () => {
    if (overrideSending) return
    setOverrideSending(true)

    try {
      // Post to project_action_requests as a priority override submission
      const { error } = await supabase.from('project_action_requests').insert({
        project_id: projectId,
        title: 'Priority Override: Engineering Redirection',
        description: 'Client authorized immediate priority resource allocation. Redirecting developer workflows to active deployment stack.',
        status: 'submitted',
        client_response: 'Authorized immediate priority override pipeline activation.',
        submitted_at: new Date().toISOString()
      })

      if (error) {
        console.error('Error triggering priority override:', error)
        toast.error('Unable to establish priority link. Please contact command desk.')
      } else {
        // Also post a message so it appears in Chat logs
        await supabase.from('messages').insert({
          project_id: projectId,
          sender_id: clientId,
          content: '⚠️ [SYSTEM MESSAGE] Priority Override pipeline requested by partner.'
        })

        toast.success('Priority pipeline requested successfully. Allocation pending.')
        setIsOverrideModalOpen(false)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      toast.error('Network connection failure.')
    } finally {
      setOverrideSending(false)
    }
  }

  return (
    <>
      <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <MessageSquare size={14} />
          </div>
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Quick Support Dispatch</h3>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          Post an instant support query, asset request, or revision note directly to our build channel below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Compose revision request or support question..."
            disabled={sending}
            maxLength={500}
            className="w-full bg-background/50 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4.5 py-3 text-xs text-foreground placeholder-muted-foreground/60 outline-none transition-all disabled:opacity-50 resize-none font-sans"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/50 font-mono">
              {content.length}/500 chars
            </span>
            <Button
              type="submit"
              disabled={!content.trim() || sending}
              className="bg-gold hover:bg-gold-light text-background font-bold text-xxs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:shadow-gold/5 disabled:opacity-50"
            >
              <span>{sending ? 'Sending...' : 'Dispatch Message'}</span>
              <Send size={11} className={sending ? 'animate-pulse' : ''} />
            </Button>
          </div>
        </form>

        <div className="h-px bg-gold/10 my-4" />

        <div className="space-y-2">
          <button
            onClick={() => setIsOverrideModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 text-[10px] font-bold uppercase tracking-widest text-purple-300 hover:text-purple-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Request Priority Pipeline Override</span>
          </button>
          <p className="text-[9px] text-muted-foreground/60 text-center leading-normal">
            Diverts active engineering workloads to prioritize your launch vector. Subject to MSA terms.
          </p>
        </div>
      </section>

      {/* Priority Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0C0C0D] rounded-2xl border border-purple-500/30 overflow-hidden shadow-[0_10px_50px_rgba(168,85,247,0.15)] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400">System Priority Console</span>
              <button 
                onClick={() => setIsOverrideModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-lg font-bold text-foreground">Activate Priority Build Vector</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are requesting an immediate operational priority override. When triggered, this system:
              </p>
              
              <ul className="text-xxs text-muted-foreground/80 space-y-2.5 pl-4 list-disc leading-relaxed">
                <li>Diverts the next available dev sprint directly to your staging sandbox.</li>
                <li>Escalates build queue precedence to Priority Level 1.</li>
                <li>Applies standard premium override resource margins under the terms of your signed engagement.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsOverrideModalOpen(false)}
                className="flex-1 py-2 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-muted-foreground transition-all cursor-pointer font-bold"
              >
                Cancel Override
              </button>
              <button
                type="button"
                onClick={handlePriorityOverride}
                disabled={overrideSending}
                className="flex-1 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 border border-purple-500 text-xs text-white transition-all cursor-pointer font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {overrideSending ? 'Activating...' : 'Confirm Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
