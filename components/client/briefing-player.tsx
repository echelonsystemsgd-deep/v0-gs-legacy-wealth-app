'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Terminal, Volume2 } from 'lucide-react'

export function BriefingPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((t) => {
          if (t >= 72) {
            setIsPlaying(false)
            return 0
          }
          return t + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <section className="p-4 sm:p-5 glass rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/10 to-black/30 space-y-3.5 shadow-xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Terminal size={16} className={isPlaying ? 'animate-pulse' : ''} />
          </div>
          <div>
            <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest leading-none">Operations Directive</span>
            <h3 className="text-xs sm:text-sm font-serif font-bold text-foreground mt-0.5">Tactical Briefing: Operations Director</h3>
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(!isOpen)
            if (isOpen) setIsPlaying(false)
          }}
          className="text-[9px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          {isOpen ? 'Collapse' : 'Listen to Briefing'}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 rounded-xl bg-[#08080C] border border-purple-500/10 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 hover:bg-purple-500/25 transition-all shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </button>
              
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                  <Volume2 size={11} className="text-purple-400 shrink-0" />
                  <span>Strategic_Orientation_Briefing.mp3</span>
                </p>
                <p className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                  {isPlaying ? 'Streaming operational brief...' : 'Audio stream suspended.'}
                </p>
              </div>
            </div>

            {/* Simulated wave bars */}
            <div className="flex items-end gap-1 h-5 text-purple-400">
              <span className={`w-0.5 bg-purple-400/80 rounded-full ${isPlaying ? 'animate-wave-1' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-purple-400 rounded-full ${isPlaying ? 'animate-wave-2' : 'h-3'}`} />
              <span className={`w-0.5 bg-purple-400/60 rounded-full ${isPlaying ? 'animate-wave-3' : 'h-1'}`} />
              <span className={`w-0.5 bg-purple-400 rounded-full ${isPlaying ? 'animate-wave-4' : 'h-4'}`} />
              <span className={`w-0.5 bg-purple-400/90 rounded-full ${isPlaying ? 'animate-wave-2' : 'h-2'}`} />
            </div>

            <div className="text-[10px] font-mono text-purple-400/80 bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded shrink-0">
              {formatTime(time)} / 1:12
            </div>
          </div>
          
          <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-purple-500 transition-all duration-300"
              style={{ width: `${(time / 72) * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
