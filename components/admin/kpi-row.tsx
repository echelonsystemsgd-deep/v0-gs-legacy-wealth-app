'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PoundSterling,
  Sparkles,
  Users,
  FolderKanban,
  Calendar,
  Info,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

type ProjectFinancial = {
  id: string
  project_name: string
  client_name: string
  status: string
  amount_paid: number | null
  contract_value: number | null
}

type Payment = {
  id: string
  amount: number | null
  notes: string | null
  status: string | null
  created_at: string
  projects: { project_name: string } | null
}

interface AdminKpiRowProps {
  totalSales: number
  totalPipeline: number
  leadsCount: number | null
  projectsCount: number | null
  sessionsCount: number | null
  projectsFinancials: ProjectFinancial[] | null
  recentPayments: Payment[] | null
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AdminKpiRow({
  totalSales,
  totalPipeline,
  leadsCount,
  projectsCount,
  sessionsCount,
  projectsFinancials,
  recentPayments,
}: AdminKpiRowProps) {
  const [expandedPanel, setExpandedPanel] = useState<'sales' | 'pipeline' | null>(null)

  const togglePanel = (panel: 'sales' | 'pipeline') => {
    setExpandedPanel((prev) => (prev === panel ? null : panel))
  }

  return (
    <section className="space-y-3">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
        {/* Hero: Capital Realised */}
        <button
          onClick={() => togglePanel('sales')}
          className={`p-3.5 sm:p-6 glass rounded-2xl border transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer text-left ${
            expandedPanel === 'sales'
              ? 'border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.12)]'
              : 'border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]'
          }`}
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                Capital Realised
              </span>
              <Info size={11} className="text-muted-foreground/45 group-hover:text-gold transition-colors shrink-0" />
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{totalSales.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-all">
              <PoundSterling size={18} className="text-gold" />
            </div>
            {expandedPanel === 'sales' ? (
              <ChevronUp size={10} className="text-gold/60" />
            ) : (
              <ChevronDown size={10} className="text-muted-foreground/40" />
            )}
          </div>
        </button>

        {/* Hero: Pipeline Value */}
        <button
          onClick={() => togglePanel('pipeline')}
          className={`p-3.5 sm:p-6 glass rounded-2xl border transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer text-left ${
            expandedPanel === 'pipeline'
              ? 'border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.12)]'
              : 'border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]'
          }`}
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                Projected Value
              </span>
              <Info size={11} className="text-muted-foreground/45 group-hover:text-gold transition-colors shrink-0" />
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{totalPipeline.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-all">
              <Sparkles size={18} className="text-gold" />
            </div>
            {expandedPanel === 'pipeline' ? (
              <ChevronUp size={10} className="text-gold/60" />
            ) : (
              <ChevronDown size={10} className="text-muted-foreground/40" />
            )}
          </div>
        </button>

        {/* Standard: Inbound Pipelines */}
        <Link
          href="/admin/leads"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">
              Inbound Pipelines
            </span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">
              {leadsCount ?? 0}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <Users size={18} className="text-gold" />
          </div>
        </Link>

        {/* Standard: Active Mandates */}
        <Link
          href="/admin/projects"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">
              Active Mandates
            </span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">
              {projectsCount ?? 0}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <FolderKanban size={18} className="text-gold" />
          </div>
        </Link>

        {/* Standard: Scheduled Briefings */}
        <Link
          href="/admin/bookings"
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 col-span-2 md:col-span-1 relative group cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">
              Scheduled Briefings
            </span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-foreground truncate">
              {sessionsCount ?? 0}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <Calendar size={18} className="text-gold" />
          </div>
        </Link>
      </div>

      {/* Inline Expand Panels */}
      {expandedPanel === 'sales' && (
        <div
          className="glass border border-gold/25 rounded-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-300"
          style={{ overflow: 'hidden' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-foreground">Capital Realised Breakdown</h3>
            <button
              onClick={() => setExpandedPanel(null)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <div className="divide-y divide-gold/10">
            {recentPayments && recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <div key={payment.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
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
                    <span className="text-sm font-serif font-bold text-gold">
                      +£{Number(payment.amount).toLocaleString('en-GB')}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-green-400 font-bold mt-0.5">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">No payments recorded yet.</p>
            )}
          </div>

        </div>
      )}

      {expandedPanel === 'pipeline' && (
        <div
          className="glass border border-gold/25 rounded-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-300"
          style={{ overflow: 'hidden' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-foreground">Active Projects Pipeline</h3>
            <button
              onClick={() => setExpandedPanel(null)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gold/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/[0.01]">
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Contract</th>
                  <th className="py-3 px-3">Paid</th>
                  <th className="py-3 px-3 text-right font-bold text-gold">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {projectsFinancials && projectsFinancials.length > 0 ? (
                  projectsFinancials.map((p) => {
                    const balance = (Number(p.contract_value) || 0) - (Number(p.amount_paid) || 0)
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3 px-3 font-semibold text-foreground">{p.project_name}</td>
                        <td className="py-3 px-3 text-muted-foreground">{p.client_name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-gold/5 border border-gold/20 text-[9px] font-bold text-gold">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          £{(Number(p.contract_value) || 0).toLocaleString('en-GB')}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          £{(Number(p.amount_paid) || 0).toLocaleString('en-GB')}
                        </td>
                        <td className="py-3 px-3 font-mono text-right font-bold text-gold">
                          £{balance.toLocaleString('en-GB')}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      No active mandates in pipeline.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-1">
            <Link
              href="/admin/projects"
              className="text-[10px] text-gold/70 hover:text-gold transition-colors font-semibold uppercase tracking-wider"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
