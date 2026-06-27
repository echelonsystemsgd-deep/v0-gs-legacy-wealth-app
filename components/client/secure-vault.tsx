'use client'

import { Shield, KeyRound, Check, FileText } from 'lucide-react'

export function SecureVault() {
  const assets = [
    { name: 'Brand_Guidelines_V1.pdf', size: '4.8 MB', date: '24/06/2026' },
    { name: 'Identity_Assets_Vector.zip', size: '18.2 MB', date: '24/06/2026' },
    { name: 'Contact_Config_Details.json', size: '1.2 KB', date: '25/06/2026' }
  ]

  return (
    <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
          <Shield size={14} className="text-gold" /> Encrypted Asset Vault
        </h3>
        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest font-bold">
          <KeyRound size={8} /> AES-256 Active
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Secure asset repository holding validated brand identity guidelines and core technical metadata parameters.
      </p>

      <div className="space-y-2.5">
        {assets.map((file) => (
          <div 
            key={file.name} 
            className="p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3.5 transition-all select-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gold/5 border border-gold/15 flex items-center justify-center text-gold/70 shrink-0">
                <FileText size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">{file.size} • Uploaded {file.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded px-2 py-0.5 shrink-0">
              <Check size={8} /> INTEGRITY OK
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
