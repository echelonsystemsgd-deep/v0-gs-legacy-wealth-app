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

  return (
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
    </section>
  )
}
