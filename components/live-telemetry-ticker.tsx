"use client"

import { motion } from "framer-motion"
import { SITE_COPY } from "@/lib/site-copy"

export function LiveTelemetryTicker() {
  const items = SITE_COPY.homepage.telemetryTicker.items

  return (
    <div className="w-full bg-[#0D0716] border-b border-accent-gold/20 py-2.5 px-4 overflow-hidden z-30 relative shadow-inner">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        {/* Left Telemetry Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-accent-gold font-bold tracking-wider text-[11px] uppercase">
            [ LIVE SYSTEM TELEMETRY ]
          </span>
        </div>

        {/* Center / Right Ticker Flow */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 text-[11px] text-text-secondary whitespace-nowrap">
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
