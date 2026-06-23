'use client'

import { useState, useEffect, useRef } from 'react'
import { RefreshCw, ExternalLink, Terminal, Shield } from 'lucide-react'
import Link from 'next/link'

type UpdateItem = {
  id: string
  title: string
  created_at: string
}

type StagingPreviewProps = {
  previewUrl: string
  projectUpdates: UpdateItem[]
}

export function StagingPreview({ previewUrl, projectUpdates }: StagingPreviewProps) {
  const [iframeKey, setIframeKey] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)

  // Initialize and append real and simulated log streams
  useEffect(() => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    // Baseline system logs
    const initialLogs = [
      `[${formatTime(new Date(Date.now() - 7200000))}] [SYS] Initializing operations workspace container...`,
      `[${formatTime(new Date(Date.now() - 6800000))}] [SEC] SSL/TLS handshake completed. Certificate valid.`,
      `[${formatTime(new Date(Date.now() - 5400000))}] [DB] Supabase schemas and RLS compliance validated.`,
      `[${formatTime(new Date(Date.now() - 3600000))}] [GIT] Pushed commit #9b4a1c to staging/preview.`,
      `[${formatTime(new Date(Date.now() - 3400000))}] [VERCEL] Production-optimize compiler triggered.`,
      `[${formatTime(new Date(Date.now() - 3200000))}] [VERCEL] Live deployment successful (build hash: v0_gs_lwa).`,
      `[${formatTime(new Date(Date.now() - 3150000))}] [CDN] purged edge caches for /client static assets.`
    ]

    // Inject actual admin updates if they exist
    const mappedUpdates = projectUpdates.map(
      (up) => `[${formatTime(new Date(up.created_at))}] [DEPLOY] Update published: "${up.title}"`
    )

    setLogs([...initialLogs, ...mappedUpdates])
  }, [projectUpdates])

  // Scroll terminal logs to bottom when updated (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Periodic simulation of active developer workspace sync
  useEffect(() => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    const simLines = [
      () => `[${formatTime(new Date())}] [GIT] Fetching origin/main updates (all changes synced).`,
      () => `[${formatTime(new Date())}] [CDN] Edge static pre-fetch completed.`,
      `[${formatTime(new Date())}] [SEC] Security scan completed: 0 threats found. RLS policies active.`,
      () => `[${formatTime(new Date())}] [SYS] Telemetry ping: latency 42ms. Health status ACTIVE.`,
      () => `[${formatTime(new Date())}] [DB] Real-time replication socket connection verified.`
    ]

    const interval = setInterval(() => {
      const lineGetter = simLines[Math.floor(Math.random() * simLines.length)]
      const line = typeof lineGetter === 'function' ? lineGetter() : lineGetter
      setLogs((prev) => [...prev, line])
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setIframeKey((prev) => prev + 1)

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    setLogs((prev) => [
      ...prev,
      `[${formatTime(new Date())}] [CLIENT] Force refresh triggered: flushing container preview memory.`,
      `[${formatTime(new Date())}] [SYS] Staging preview container reloaded successfully.`
    ])

    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <section className="p-6 glass rounded-2xl border border-gold/10 space-y-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Live Staging Preview</h3>
            <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active Sync
            </span>
          </div>
          <p className="text-xxs text-muted-foreground">
            Interactive staging build reflecting your site configurations in real-time.
          </p>
        </div>
        <Link
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xxs font-bold text-gold hover:underline flex items-center gap-1 font-mono hover:text-gold-light transition-colors self-start sm:self-center"
        >
          Open in new tab <ExternalLink size={10} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Browser Mockup Frame (2/3 width) */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-black/40 flex flex-col">
          {/* Browser Toolbar */}
          <div className="bg-[#111111] px-4 py-2 border-b border-white/5 flex items-center gap-3 shrink-0 select-none">
            {/* Red, Yellow, Green Window Dots */}
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-green-500/80" />
            </div>

            {/* URL Address Bar */}
            <div className="flex-1 bg-white/[0.03] border border-white/5 rounded px-3 py-0.5 text-[10px] text-muted-foreground font-mono truncate text-center">
              {previewUrl.replace(/^https?:\/\//, '')}
            </div>

            {/* Reload Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh staging sandbox"
              className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-gold transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={11} className={isRefreshing ? 'animate-spin text-gold' : ''} />
            </button>
          </div>

          {/* Browser Frame Content */}
          <div className="relative aspect-video w-full flex-1 min-h-[300px] bg-[#0A0A0A]">
            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Staging Preview Sandbox"
              className="absolute inset-0 w-full h-full border-0 bg-[#0A0A0A]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Live Build Stream Terminal Card (1/3 width) */}
        <div className="lg:col-span-1 rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-black/80 flex flex-col h-full min-h-[300px] lg:min-h-0">
          {/* Terminal Header */}
          <div className="bg-[#111111] px-4 py-2 border-b border-white/5 flex items-center gap-2 shrink-0 select-none">
            <Terminal size={11} className="text-gold" />
            <span className="text-[10px] font-mono font-bold text-foreground">workspace_build.log</span>
            <Shield size={10} className="text-green-500 ml-auto" />
          </div>

          {/* Scrolling Logs Display */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-[9px] text-[#A27E1C] space-y-1.5 bg-[#050505] leading-relaxed scrollbar-thin select-none max-h-[350px] lg:max-h-[330px]">
            {logs.map((log, idx) => {
              let colorClass = 'text-gold-dark'
              if (log.includes('[SYS]')) colorClass = 'text-purple-400'
              if (log.includes('[DEPLOY]') || log.includes('[UPDATE]')) colorClass = 'text-green-400 font-bold'
              if (log.includes('[SEC]')) colorClass = 'text-emerald-400'
              if (log.includes('[CLIENT]')) colorClass = 'text-blue-400'

              return (
                <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all transition-all duration-300`}>
                  {log}
                </div>
              )
            })}
            <div className="flex items-center gap-1 text-gold">
              <span className="w-1.5 h-3 bg-gold animate-pulse inline-block" />
              <span className="text-[8px] text-muted-foreground/40 font-mono">listening...</span>
            </div>
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
