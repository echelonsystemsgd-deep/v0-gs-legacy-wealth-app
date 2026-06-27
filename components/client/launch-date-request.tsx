'use client'

import { useState } from 'react'
import { CalendarClock, ChevronDown, ChevronUp, Loader2, Send, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface LaunchDateRequestProps {
  projectId: string
  currentDate: string | null
}

export function LaunchDateRequest({ projectId, currentDate }: LaunchDateRequestProps) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [preferredDate, setPreferredDate] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferredDate || !reason.trim()) {
      setError('Please select a preferred date and provide a reason.')
      return
    }
    setSubmitting(true)
    setError(null)

    const formattedDate = new Date(preferredDate).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    const { error: dbError } = await supabase
      .from('project_action_requests')
      .insert({
        project_id: projectId,
        title: 'Launch Date Adjustment Request',
        description: `Client has requested a launch date revision.\n\nPreferred new date: ${formattedDate}\n\nReason: ${reason.trim()}`,
        status: 'pending',
      })

    setSubmitting(false)
    if (dbError) {
      setError('Failed to submit your request. Please try again.')
      return
    }

    setSubmitted(true)
    setOpen(false)
    setPreferredDate('')
    setReason('')
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-gold/80 font-medium">
        <CheckCircle2 size={11} className="text-gold shrink-0" />
        Adjustment request submitted — pending team review.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 hover:text-gold transition-colors font-medium cursor-pointer"
      >
        <CalendarClock size={11} />
        Request Date Adjustment
        {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 p-3 rounded-xl border border-gold/15 bg-black/20 animate-in fade-in duration-200"
        >
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Preferred Date
            </label>
            <input
              type="date"
              min={minDate}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full bg-background/50 border border-gold/10 hover:border-gold/25 focus:border-gold/40 rounded-lg px-3 py-2 text-xs text-foreground outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Reason for Request
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly explain why you'd like to adjust the deployment date..."
              rows={2}
              className="w-full bg-background/50 border border-gold/10 hover:border-gold/25 focus:border-gold/40 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-[10px] text-red-400">{error}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting || !preferredDate || !reason.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold text-[10px] font-bold transition-all cursor-pointer disabled:opacity-40"
            >
              {submitting ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <p className="text-[9px] text-muted-foreground/40 leading-relaxed">
            Date adjustments are subject to team review and operational capacity. Approval is not guaranteed and final decisions rest with the GS Legacy Wealth team.
          </p>
        </form>
      )}
    </div>
  )
}
