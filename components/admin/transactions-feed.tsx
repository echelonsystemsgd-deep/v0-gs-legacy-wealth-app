'use client'

import { useState } from 'react'
import { PoundSterling, X, Calendar, FileText } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

type Payment = {
  id: string
  amount: number | null
  notes: string | null
  status: string | null
  created_at: string
  projects: { project_name: string } | null
}

interface TransactionsFeedProps {
  payments: Payment[]
  totalCollected: number
  totalContractValue: number
}

// ── Component ──────────────────────────────────────────────────────────────────

export function TransactionsFeed({
  payments,
  totalCollected,
  totalContractValue,
}: TransactionsFeedProps) {
  const [showModal, setShowModal] = useState(false)
  const collectionRate =
    totalContractValue > 0
      ? Math.round((totalCollected / totalContractValue) * 100)
      : 0

  const displayPayments = payments.slice(0, 3)

  return (
    <section className="p-4 sm:p-5 glass rounded-2xl border border-gold/10 space-y-4">
      <h2 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
        <PoundSterling size={15} className="text-gold" />
        Recent Sales
      </h2>

      <div className="divide-y divide-gold/10">
        {displayPayments.length > 0 ? (
          displayPayments.map((payment) => (
            <div
              key={payment.id}
              className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 transition-all hover:bg-white/[0.01]"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {payment.projects?.project_name || 'Custom Project'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {payment.notes || 'Milestone payment'}
                </p>
                <p className="text-[9px] text-gold/60 font-mono mt-0.5">
                  {new Date(payment.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-serif font-bold text-gold flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                  +£{Number(payment.amount).toLocaleString('en-GB')}
                </span>
                <span className="block text-[8px] uppercase tracking-wider text-green-400 font-bold mt-0.5">
                  {payment.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center px-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              No transactions recorded yet. Revenue logs will populate as project milestones are completed.
            </p>
          </div>
        )}
      </div>

      {/* Collection Rate Bar */}
      {totalContractValue > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-gold/10">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>
              £{totalCollected.toLocaleString('en-GB')} of £{totalContractValue.toLocaleString('en-GB')} collected
            </span>
            <span className="font-bold text-gold">{collectionRate}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full transition-all duration-700"
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="text-[10px] font-bold uppercase tracking-wider text-gold/60 hover:text-gold transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            View All Transactions →
          </button>
        </div>
      )}

      {/* ── All Transactions Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl glass border border-gold/20 rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[80vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/10 pb-4 shrink-0">
              <div className="flex items-center gap-2">
                <PoundSterling size={18} className="text-gold" />
                <h3 className="font-serif text-base font-bold text-foreground">
                  Transactions Ledger
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer border-none bg-transparent"
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 scrollbar-thin">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-3.5 rounded-xl border border-gold/10 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between gap-4 transition-all"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {payment.projects?.project_name || 'Custom Project'}
                    </p>
                    {payment.notes && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <FileText size={10} className="text-gold/40" />
                        {payment.notes}
                      </p>
                    )}
                    <p className="text-[9px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar size={9} />
                      {new Date(payment.created_at).toLocaleDateString('en-GB')} at {new Date(payment.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-serif font-bold text-gold">
                      +£{Number(payment.amount).toLocaleString('en-GB')}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-green-400 font-bold mt-0.5">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gold/10 pt-4 flex justify-end shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Ledger
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}
