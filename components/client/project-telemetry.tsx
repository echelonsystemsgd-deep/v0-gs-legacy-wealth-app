'use client'

import { useState } from 'react'
import { Info, Lock, Unlock, Check } from 'lucide-react'

type ProjectProps = {
  project: {
    id: string
    project_name: string
    contract_value: number
    amount_paid: number
    status: string
  }
}

export function ProjectTelemetry({ project }: ProjectProps) {
  const contractValue = Number(project.contract_value) || 0
  const amountPaid = Number(project.amount_paid) || 0
  
  const hasContract = contractValue > 0
  const percent = hasContract ? Math.min(Math.round((amountPaid / contractValue) * 100), 100) : 0

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (percent / 100) * circumference

  const milestones = [
    { name: 'Discovery', threshold: 0, desc: 'Initial phase. Unlocked upon project initialization.' },
    { name: 'Design', threshold: 25, desc: 'Figma wireframes & brand planning. Unlocks at 25% payment.' },
    { name: 'Development', threshold: 50, desc: 'Core app build & database schema. Unlocks at 50% payment.' },
    { name: 'Revision', threshold: 75, desc: 'Preview staging & lead form verification. Unlocks at 75% payment.' },
    { name: 'Complete', threshold: 100, desc: 'Live deployment & domain delegation. Unlocks at 100% payment.' },
  ]

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const firstLocked = milestones.find(m => hasContract && percent < m.threshold)

  return (
    <div className="p-6 glass rounded-2xl border border-gold/10 flex flex-col items-center space-y-6 relative overflow-hidden h-full shadow-lg">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Financial Telemetry</h3>
        <span className="text-[10px] text-muted-foreground font-mono bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
          USD SECURE
        </span>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(201, 162, 39, 0.05)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Glowing gold progress track */}
          {hasContract && (
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#goldGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(201, 162, 39, 0.4))'
              }}
            />
          )}
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-gold)" />
              <stop offset="100%" stopColor="#E5C453" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Labels */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          {hasContract ? (
            <>
              <span className="text-3xl font-serif font-bold text-gradient-gold">
                {percent}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                Settled
              </span>
            </>
          ) : (
            <>
              <span className="text-xl font-serif font-bold text-muted-foreground">
                Pending
              </span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 px-2 mt-1">
                Awaiting Contract
              </span>
            </>
          )}
        </div>
      </div>

      {/* Financial Details */}
      <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-center">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Total Contract
          </span>
          <span className="text-sm font-semibold text-foreground font-mono">
            {hasContract ? formatCurrency(contractValue) : 'TBD'}
          </span>
        </div>
        <div className="space-y-1 border-l border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            Settled Balance
          </span>
          <span className="text-sm font-semibold text-gold font-mono">
            {hasContract ? formatCurrency(amountPaid) : '£0'}
          </span>
        </div>
      </div>

      {/* Interactive Milestones Checklist */}
      <div className="w-full space-y-3 pt-2">
        <h4 className="text-xxs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
          <Info size={11} className="text-gold" /> Phase Unlock Milestones
        </h4>
        
        <div className="space-y-2.5">
          {milestones.map((m) => {
            const isUnlocked = hasContract && percent >= m.threshold
            const isHovered = activeTooltip === m.name
            const requiredAmount = (m.threshold / 100) * contractValue

            return (
              <div 
                key={m.name} 
                className="relative"
                onMouseEnter={() => setActiveTooltip(m.name)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div 
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-300 border ${
                    isUnlocked 
                      ? 'bg-gold/[0.03] border-gold/15 text-foreground' 
                      : 'bg-white/[0.01] border-transparent text-muted-foreground/45'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_8px_rgba(201,162,39,0.25)]' 
                      : 'bg-black/20 border-white/5 text-muted-foreground/30'
                  }`}>
                    {isUnlocked ? (
                      <Check size={11} className="stroke-[3]" />
                    ) : (
                      <Lock size={9} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold">{m.name}</span>
                      {hasContract && (
                        <span className="text-[9px] font-mono text-muted-foreground/60">
                          {m.threshold}% ({formatCurrency(requiredAmount)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Micro-tooltip */}
                {isHovered && (
                  <div className="absolute left-0 bottom-full mb-2 w-full bg-[#130D24] border border-gold/25 p-3 rounded-xl shadow-2xl z-20 animate-fade-in text-left">
                    <div className="flex items-center gap-1.5 mb-1">
                      {isUnlocked ? (
                        <Unlock size={11} className="text-gold" />
                      ) : (
                        <Lock size={11} className="text-muted-foreground/50" />
                      )}
                      <span className="text-xs font-bold text-foreground">{m.name} Milestone</span>
                      <span className={`text-[9px] ml-auto font-bold px-1.5 py-0.5 rounded ${
                        isUnlocked ? 'bg-gold/15 text-gold' : 'bg-white/5 text-muted-foreground/60'
                      }`}>
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {m.desc}
                    </p>
                    {!isUnlocked && hasContract && (
                      <p className="text-[10px] text-gold font-mono mt-1.5 border-t border-white/5 pt-1">
                        {firstLocked?.name === m.name ? (
                          <>Requires additional {formatCurrency(requiredAmount - amountPaid)} settled to unlock (Target: {formatCurrency(requiredAmount)}).</>
                        ) : (
                          <>Requires {formatCurrency(requiredAmount)} total settled to unlock.</>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
