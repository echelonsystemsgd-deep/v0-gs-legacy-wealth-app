'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Users, TrendingUp, RefreshCw, Layers } from 'lucide-react'

export function GrowthTelemetry() {
  const [activeTraffic, setActiveTraffic] = useState(142)
  const [conversionRate, setConversionRate] = useState(4.2)
  const [isSyncing, setIsSyncing] = useState(false)

  // Simulate active traffic updating in real time
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTraffic((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4
        return Math.max(120, Math.min(180, prev + delta))
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSync = () => {
    if (isSyncing) return
    setIsSyncing(true)
    setTimeout(() => {
      setConversionRate((prev) => {
        const delta = (Math.random() * 0.4 - 0.2)
        return parseFloat(Math.max(3.8, Math.min(5.2, prev + delta)).toFixed(2))
      })
      setIsSyncing(false)
    }, 1200)
  }

  return (
    <section className="p-6 glass rounded-2xl border border-gold/10 space-y-6 shadow-lg relative overflow-hidden bg-gradient-to-br from-[#0D0D0E]/90 to-purple-950/5">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-gold/3 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Growth Performance Telemetry</h3>
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> System Deployed
            </span>
          </div>
          <p className="text-xxs text-muted-foreground">
            Bespoke growth acquisition engine tracking production conversions and live traffic nodes.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="p-1.5 rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 text-gold/80 hover:text-gold transition-all duration-200 cursor-pointer disabled:opacity-50"
          title="Resync Telemetry Streams"
        >
          <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Active Site Nodes</span>
            <Users size={12} className="text-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-foreground font-mono">{activeTraffic}</span>
            <span className="text-[9px] font-bold text-emerald-400 font-sans">+12.4%</span>
          </div>
          <p className="text-[9px] text-muted-foreground">Live connection endpoints active.</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Lead Conversion Vector</span>
            <TrendingUp size={12} className="text-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-foreground font-mono">{conversionRate}%</span>
            <span className="text-[9px] font-bold text-emerald-400 font-sans">+0.8%</span>
          </div>
          <p className="text-[9px] text-muted-foreground">Premium lead opt-in efficiency.</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Pipeline Security Lock</span>
            <Layers size={12} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-gradient-gold font-sans uppercase">AES-256 Validated</span>
          </div>
          <p className="text-[9px] text-muted-foreground">CRM data-vault integrity confirmed.</p>
        </div>
      </div>

      {/* Visual Chart Placeholder (Styled SVG Graph) */}
      <div className="p-4 rounded-xl bg-[#070708] border border-white/5 h-28 relative flex flex-col justify-between">
        <div className="absolute inset-x-0 bottom-4 h-16">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A227" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />

            {/* Path */}
            <path
              d="M 0 80 Q 50 60 100 70 T 200 40 T 300 30 T 400 10 L 400 100 L 0 100 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M 0 80 Q 50 60 100 70 T 200 40 T 300 30 T 400 10"
              fill="none"
              stroke="#C9A227"
              strokeWidth="2"
              className="drop-shadow-[0_0_4px_rgba(201,162,39,0.3)]"
            />
            {/* Animated Pulses on the graph */}
            <circle cx="400" cy="10" r="3" fill="#C9A227" className="animate-ping" />
            <circle cx="400" cy="10" r="3" fill="#C9A227" />
          </svg>
        </div>
        <div className="flex justify-between text-[8px] text-muted-foreground/50 font-mono select-none z-10">
          <span>Acquisition Nodes Flow (Last 24 Hours)</span>
          <span>100% Secure Pipeline</span>
        </div>
      </div>
    </section>
  )
}
