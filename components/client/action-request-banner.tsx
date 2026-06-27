'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Loader2, Send, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type ActionRequest = {
  id: string
  title: string
  description: string
  status: 'pending' | 'submitted' | 'completed'
  client_response: string | null
  submitted_at: string | null
}

interface ActionRequestBannerProps {
  requests: ActionRequest[]
}

export function ActionRequestBanner({ requests: initialRequests }: ActionRequestBannerProps) {
  const supabase = createClient()
  const [requests, setRequests] = useState<ActionRequest[]>(initialRequests)
  const [expandedId, setExpandedId] = useState<string | null>(initialRequests[0]?.id ?? null)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const submittedRequests = requests.filter((r) => r.status === 'submitted')

  const handleSubmit = async (req: ActionRequest) => {
    const responseText = responses[req.id]?.trim()
    if (!responseText) {
      toast.error('Please enter a response before submitting.')
      return
    }
    setSubmitting(req.id)
    const { error } = await supabase
      .from('project_action_requests')
      .update({
        client_response: responseText,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', req.id)

    setSubmitting(null)
    if (error) {
      toast.error('Failed to submit your response. Please try again.')
      return
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: 'submitted', client_response: responseText, submitted_at: new Date().toISOString() }
          : r
      )
    )
    setResponses((prev) => ({ ...prev, [req.id]: '' }))
    toast.success('Response submitted. Our team has been notified.')
  }

  if (pendingRequests.length === 0 && submittedRequests.length === 0) return null

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Pending requests — prominent action required */}
      {pendingRequests.map((req) => (
        <div
          key={req.id}
          className="glass rounded-2xl border border-gold/35 bg-gold/[0.03] overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.06)]"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between gap-4 p-5 cursor-pointer"
            onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                <AlertTriangle size={16} className="text-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-gold uppercase tracking-widest">Action Required</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                </div>
                <p className="text-sm font-serif font-bold text-foreground mt-0.5">{req.title}</p>
              </div>
            </div>
            <button className="p-1.5 rounded-lg border border-gold/15 hover:bg-gold/5 text-gold/70 hover:text-gold transition-all cursor-pointer shrink-0">
              {expandedId === req.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Expanded body */}
          {expandedId === req.id && (
            <div className="px-5 pb-5 space-y-4 border-t border-gold/10 pt-4 animate-in fade-in duration-200">
              <p className="text-sm text-muted-foreground leading-relaxed">{req.description}</p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Your Response</label>
                <textarea
                  value={responses[req.id] ?? ''}
                  onChange={(e) => setResponses((prev) => ({ ...prev, [req.id]: e.target.value }))}
                  placeholder="Enter the requested details here..."
                  rows={4}
                  className="w-full bg-background/50 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={() => handleSubmit(req)}
                disabled={submitting === req.id || !responses[req.id]?.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold/90 text-background font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all cursor-pointer disabled:opacity-40"
              >
                {submitting === req.id ? (
                  <><Loader2 size={12} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={12} /> Submit Response</>
                )}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Submitted requests — awaiting verification */}
      {submittedRequests.map((req) => (
        <div
          key={req.id}
          className="glass rounded-2xl border border-gold/15 bg-white/[0.01] p-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={14} className="text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{req.title}</p>
            <p className="text-[10px] text-muted-foreground">Response submitted — awaiting team verification.</p>
          </div>
          <span className="ml-auto text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold shrink-0">
            Submitted
          </span>
        </div>
      ))}
    </div>
  )
}
