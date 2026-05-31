'use client'

import { CheckCircle2, Circle } from 'lucide-react'

interface ProjectMilestonesProps {
  steps: string[]
  currentStatus: string
  onStatusChange?: (status: string) => void
}

export function ProjectMilestones({ steps, currentStatus, onStatusChange }: ProjectMilestonesProps) {
  const currentIdx = steps.indexOf(currentStatus)

  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto scrollbar-none py-2">
      {steps.map((step, idx) => {
        const done = idx < currentIdx
        const active = idx === currentIdx
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => onStatusChange && onStatusChange(step)}
              disabled={!onStatusChange}
              title={step}
              className={`flex flex-col items-center gap-1.5 transition-all group ${
                active ? 'scale-105' : ''
              } ${onStatusChange ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  done
                    ? 'bg-green-500/20 border-green-500/50'
                    : active
                    ? 'bg-gold/20 border-gold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'bg-background border-gold/15 hover:border-gold/30'
                }`}
              >
                {done ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : active ? (
                  <Circle size={8} className="fill-gold text-gold" />
                ) : (
                  <Circle size={6} className="text-muted-foreground/30" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold text-center whitespace-nowrap transition-colors ${
                  active ? 'text-gold' : done ? 'text-green-400' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 transition-colors ${
                  idx < currentIdx ? 'bg-green-500/40' : 'bg-gold/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
