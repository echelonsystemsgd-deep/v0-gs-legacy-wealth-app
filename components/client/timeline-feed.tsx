'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock } from 'lucide-react'

type Update = {
  id: string
  title: string
  description: string | null
  created_at: string
  project_id: string
}

export function TimelineFeed({ initialUpdates, projectId }: { initialUpdates: Update[], projectId: string }) {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`client_timeline_updates_${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_updates',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newUp = payload.new as Update
            setUpdates((prev) => {
              if (prev.some((u) => u.id === newUp.id)) return prev
              return [newUp, ...prev]
            })
          } else if (payload.eventType === 'DELETE') {
            const oldUp = payload.old as any
            setUpdates((prev) => prev.filter((u) => u.id !== oldUp.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, projectId])

  if (updates.length === 0) {
    return (
      <div className="p-8 sm:p-12 glass rounded-2xl border border-gold/10 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mx-auto">
          <Clock size={28} className="text-gold" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-foreground">Awaiting Initial Deployment Log</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            System updates will populate here as code commits are pushed and telemetry milestones are verified.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto relative pl-6 border-l border-gold/15 space-y-10 py-4 ml-2 animate-in fade-in duration-300">
      {updates.map((update) => (
        <div key={update.id} className="relative group space-y-3 animate-in fade-in duration-300">
          {/* Bullet Node */}
          <div className="absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0A0A0A] border-2 border-gold flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gold group-hover:scale-150 transition-transform" />
          </div>

          {/* Update Details */}
          <div className="glass p-5 rounded-2xl border border-gold/10 hover:border-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.02)] transition-all duration-300 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h2 className="text-base sm:text-lg font-serif font-bold text-foreground">
                {update.title}
              </h2>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono bg-gold/5 px-2 py-0.5 rounded-lg border border-gold/10 w-fit shrink-0">
                {new Date(update.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {update.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {update.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
