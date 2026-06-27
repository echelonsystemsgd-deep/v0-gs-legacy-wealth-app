'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Loader2, Send, ArrowLeft, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

type ActionRequest = {
  id: string
  title: string
  description: string
  status: 'pending' | 'submitted' | 'completed'
  client_response: string | null
  submitted_at: string | null
  completed_at: string | null
  created_at: string
}

export default function ClientActionsPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [requests, setRequests] = useState<ActionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch user's project
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('client_id', user.id)
          .maybeSingle()

        if (!project) {
          if (active) {
            setRequests([])
            setLoading(false)
          }
          return
        }

        // Fetch action requests
        const { data: arData, error: arError } = await supabase
          .from('project_action_requests')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: true })

        if (arError) throw arError

        if (active && arData) {
          setRequests(arData as ActionRequest[])
          // Expand the first pending one if available
          const firstPending = arData.find(r => r.status === 'pending')
          if (firstPending) {
            setExpandedId(firstPending.id)
          }
        }
      } catch (err: any) {
        console.error(err)
        if (active) setError('Failed to load action requests: ' + err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => { active = false }
  }, [supabase, router])

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
      toast.error('Failed to submit response. Please try again.')
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

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto select-none">
        <Loader2 size={32} className="text-gold animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-mono">Syncing operational actions...</p>
      </div>
    )
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const completedRequests = requests.filter((r) => r.status === 'submitted' || r.status === 'completed')

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5" data-tour="actions-title">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 text-gold/80 hover:text-gold transition-all cursor-pointer mr-1"
              aria-label="Go Back"
            >
              <ArrowLeft size={14} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Action Required Console
            </h1>
          </div>
          <p className="text-xs text-muted-foreground ml-9">
            Review and respond to active design parameters and engineering requests below.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2.5 max-w-xl">
          <AlertTriangle size={16} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Pending and Completed Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending requests */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gold flex items-center gap-2">
              Pending Actions ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="p-8 sm:p-12 glass rounded-2xl border border-gold/10 text-center space-y-4 bg-black/10">
                <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mx-auto text-gold/30">
                  <CheckCircle2 size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">All Actions Addressed</p>
                  <p className="text-xs text-muted-foreground leading-normal max-w-xs mx-auto">
                    Your build is operating at full capacity. No outstanding design assets or business copy items are required.
                  </p>
                </div>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="glass rounded-2xl border border-gold/35 bg-gold/[0.03] overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.06)]"
                >
                  <div
                    className="flex items-center justify-between gap-4 p-5 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                        <AlertTriangle size={16} className="text-gold" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-[8px] font-bold text-gold uppercase tracking-widest">Action Required</span>
                          <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                          <span className="text-[9px] font-mono text-muted-foreground/80">
                            Requested: {new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gold/30" />
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            (() => {
                              const createdDate = new Date(req.created_at)
                              const diffDays = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                              if (diffDays >= 10) return 'bg-red-500/10 text-red-400 border border-red-500/20'
                              if (diffDays >= 3) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              return 'bg-green-500/10 text-green-400 border border-green-500/20'
                            })()
                          }`}>
                            {(() => {
                              const createdDate = new Date(req.created_at)
                              const diffDays = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                              if (diffDays <= 0) return 'Requested today'
                              if (diffDays === 1) return 'Pending 1 day'
                              return `Pending ${diffDays} days`
                            })()}
                          </span>
                        </div>
                        <p className="text-sm font-serif font-bold text-foreground mt-1">{req.title}</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg border border-gold/15 hover:bg-gold/5 text-gold/70 hover:text-gold transition-all cursor-pointer shrink-0">
                      {expandedId === req.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {expandedId === req.id && (
                    <div className="px-5 pb-5 space-y-4 border-t border-gold/10 pt-4 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{req.description}</p>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground">Your Response</label>
                        <textarea
                          value={responses[req.id] ?? ''}
                          onChange={(e) => setResponses((prev) => ({ ...prev, [req.id]: e.target.value }))}
                          placeholder="Provide the requested files, brand links, or text guidelines here..."
                          rows={6}
                          className="w-full bg-background/50 border border-gold/15 hover:border-gold/30 focus:border-gold/50 rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-all resize-none font-sans leading-relaxed"
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
              ))
            )}
          </div>

          {/* History */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Submitted &amp; Completed Actions ({completedRequests.length})
            </h2>

            {completedRequests.length > 0 && (
              <div className="space-y-3">
                {completedRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border transition-all ${
                      req.status === 'completed' 
                        ? 'border-green-500/20 bg-green-500/[0.02] text-muted-foreground'
                        : 'border-gold/15 bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground">{req.title}</p>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            req.status === 'completed'
                              ? 'bg-green-500/15 text-green-400 border-green-500/25'
                              : 'bg-gold/15 text-gold border-gold/25'
                          }`}>
                            {req.status === 'completed' ? 'Verified' : 'Submitted'}
                          </span>
                        </div>
                         <p className="text-[10px] text-muted-foreground line-clamp-1">{req.description}</p>
                         <p className="text-[9px] text-muted-foreground/60 font-mono mt-1">
                           Requested: {new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </p>
                        
                        {req.client_response && (
                          <div className="mt-2.5 p-3 rounded-lg bg-black/25 border border-white/5">
                            <p className="text-[9px] font-bold text-gold uppercase tracking-wider mb-1">Your Submission:</p>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{req.client_response}</p>
                            {req.submitted_at && (
                              <p className="text-[8px] text-muted-foreground/45 mt-1 font-mono">
                                Sent: {new Date(req.submitted_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Information Panel */}
        <div className="space-y-6">
          <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4 bg-gradient-to-br from-background to-[#130E20]/25">
            <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
              <Sparkles size={14} className="text-gold" /> Onboarding Instructions
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Timely response to action items ensures we maintain your projected launch vector. If you submit links or assets, our team will audit them within 12–24 hours and mark the item complete.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Need assistance or clarification on a specific item? Message us inside the secure workspace channel.
            </p>
            <Link
              href="/client/messages"
              className="w-full py-2.5 px-4 rounded-xl bg-gold/10 hover:bg-gold/15 border border-gold/25 text-xs font-semibold text-gold transition-all duration-300 flex items-center justify-between text-center cursor-pointer font-serif"
            >
              <span>Message Build Team</span> <Send size={11} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
