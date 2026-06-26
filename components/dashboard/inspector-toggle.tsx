'use client'

import { useInspector } from '@/hooks/use-inspector'
import { Activity } from 'lucide-react'

export function InspectorToggle() {
  const { toggle, isOpen } = useInspector()

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold ${
        isOpen
          ? 'bg-gold/10 border-gold/30 text-gold hover:bg-gold/15'
          : 'bg-card border-gold/15 text-gold/80 hover:text-foreground hover:bg-gold/5'
      }`}
      title="Toggle Console Inspector"
    >
      <Activity size={15} />
      <span className="hidden sm:inline">Inspector</span>
    </button>
  )
}
