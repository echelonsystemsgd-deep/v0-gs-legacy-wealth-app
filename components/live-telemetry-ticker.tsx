"use client"

import { SITE_COPY } from "@/lib/site-copy"

export function LiveTelemetryTicker() {
  const items = SITE_COPY.homepage.telemetryTicker.items

  return (
    <div className="w-full bg-[#090410] border-b border-accent-gold/20 py-1.5 px-4 overflow-hidden z-30 relative">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px]">
        {/* Left Telemetry Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-accent-gold font-bold tracking-wider uppercase text-[10px] sm:text-[11px]">
            [ LIVE SYSTEM TELEMETRY ]
          </span>
        </div>

        {/* Right Ticker Flow */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5 text-text-secondary whitespace-nowrap">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              {idx > 0 && <span className="text-accent-gold/40 text-[9px]">✦</span>}
              <span className={idx === 2 ? "text-accent-gold font-semibold" : "text-white/80"}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
