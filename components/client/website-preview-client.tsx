'use client'

import { useState } from 'react'
import { ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react'

export function WebsitePreviewClient({ activeUrl }: { activeUrl: string }) {
  const [iframeKey, setIframeKey] = useState(0)
  const [loadFailed, setLoadFailed] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setLoadFailed(false)
    setIframeKey((k) => k + 1)
    setTimeout(() => setIsRefreshing(false), 1200)
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Status Bar */}
      <div className="flex items-center gap-3 bg-[#111111] border border-gold/10 px-4 py-2.5 rounded-xl text-xs text-muted-foreground">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${loadFailed ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
        <span className="truncate flex-1">
          Staging URL:{' '}
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold transition-colors"
          >
            {activeUrl}
          </a>
        </span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Reload preview"
          className="ml-auto shrink-0 p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-gold transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-gold' : ''} />
        </button>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 min-h-[500px] lg:min-h-[600px] glass rounded-2xl border border-gold/15 overflow-hidden shadow-2xl bg-black/40">
        {loadFailed ? (
          /* Network error fallback */
          <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <AlertTriangle size={28} className="text-yellow-400" />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <p className="text-sm font-semibold text-foreground">Preview Failed to Load</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Could not reach the staging server. Retry or open the site directly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/10 transition-all duration-300 cursor-pointer"
              >
                <RefreshCw size={12} /> Retry
              </button>
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300"
              >
                Open in New Tab <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ) : (
          /* Iframe — no sandbox so the embedded site runs fully unrestricted */
          <iframe
            key={iframeKey}
            src={activeUrl}
            title="Site Preview"
            className="w-full h-full border-0 block"
            onError={() => setLoadFailed(true)}
          />
        )}
      </div>
    </div>
  )
}

