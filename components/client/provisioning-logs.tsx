'use client'

import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'

export function ProvisioningLogs() {
  const [logs, setLogs] = useState<string[]>([
    '[SYS] Client portal successfully initialized.',
    '[SYS] Establishing private PostgreSQL container schema...',
  ])

  useEffect(() => {
    const extraLogs = [
      '[DB] Migration sequence 20260628200000 completed.',
      '[SYS] Allocating staging server CDN cache resources...',
      '[CDN] SSL certification parameters validated.',
      '[DEV] Discovery wireframing and intelligence gathering active.',
    ]

    let currentLogIndex = 0
    const interval = setInterval(() => {
      if (currentLogIndex < extraLogs.length) {
        setLogs((l) => [...l, extraLogs[currentLogIndex]])
        currentLogIndex++
      } else {
        clearInterval(interval)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section data-tour="provisioning-logs" className="p-4 sm:p-5 glass rounded-2xl border border-gold/15 bg-black/40 space-y-3 font-mono shadow-lg text-left select-none animate-in fade-in duration-300">

      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[9px] font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
          <Terminal size={11} className="text-gold" /> System Build Trajectory Logs
        </span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div className="space-y-1.5 text-[9px] sm:text-[10px] leading-relaxed text-muted-foreground/80 overflow-hidden max-h-[140px] scrollbar-none font-mono">
        {logs.map((log, index) => {
          let colorClass = 'text-muted-foreground/80'
          if (log.startsWith('[SYS]')) colorClass = 'text-slate-400'
          else if (log.startsWith('[DB]')) colorClass = 'text-gold/90'
          else if (log.startsWith('[DEV]')) colorClass = 'text-purple-400/90'
          else if (log.startsWith('[CDN]')) colorClass = 'text-emerald-400/90'

          return (
            <p key={index} className={`${colorClass} transition-all duration-300`}>
              {log}
            </p>
          )
        })}
        <p className="text-[9px] text-muted-foreground/35 italic mt-1 animate-pulse font-mono">
          Listening for live deployment sequence...
        </p>
      </div>
    </section>
  )
}
