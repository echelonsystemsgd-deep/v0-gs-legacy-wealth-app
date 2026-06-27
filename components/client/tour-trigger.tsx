'use client'

import { HelpCircle } from 'lucide-react'

export function TourTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('trigger-portal-tour'))}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gold/15 hover:border-gold/30 bg-gold/5 hover:bg-gold/10 text-gold text-xs font-medium transition-all cursor-pointer font-sans"
      title="Start interactive console tour"
    >
      <HelpCircle size={14} />
      <span className="hidden sm:inline">Portal Tour</span>
    </button>
  )
}
