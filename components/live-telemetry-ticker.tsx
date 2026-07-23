"use client"

import { SITE_COPY } from "@/lib/site-copy"

export function LiveTelemetryTicker() {
  const items = SITE_COPY.homepage.telemetryTicker.items
  // Duplicate array 3x for 360-degree seamless infinite marquee loop across wide monitors
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <div className="w-full bg-[#090410] border-b border-accent-gold/20 py-1.5 overflow-hidden z-30 relative select-none">
      <div className="w-full flex items-center justify-between gap-0 font-mono text-[10px] sm:text-[11px] px-3 sm:px-6">
        
        {/* Fixed Left Status Anchor */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-[#090410] z-20 pr-3 sm:pr-5 py-0.5 border-r border-accent-gold/20 shadow-[5px_0_15px_rgba(9,4,16,0.9)]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-accent-gold font-bold tracking-wider uppercase text-[9px] sm:text-[11px] whitespace-nowrap">
            [ <span className="hidden sm:inline">LIVE </span>TELEMETRY ]
          </span>
        </div>

        {/* Continuous Infinite Marquee Stream */}
        <div className="relative flex-1 overflow-hidden ml-2 sm:ml-4">
          {/* Subtle Edge Gradients for Smooth Entrance/Exit */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#090410] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#090410] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-6 text-text-secondary whitespace-nowrap cursor-pointer">
            {duplicatedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0 hover:text-accent-gold transition-colors duration-200">
                <span className="text-accent-gold/40 text-[9px]">✦</span>
                <span className={idx % items.length === 2 ? "text-accent-gold font-semibold" : "text-white/80 font-normal"}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
