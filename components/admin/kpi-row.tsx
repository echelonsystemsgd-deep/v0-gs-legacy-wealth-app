'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
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
  TrendingUp,
  Loader2,
  Plus,
  ExternalLink,
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
  projectedMRR: number
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
  projectedMRR,
  leadsCount,
  projectsCount,
  sessionsCount,
  projectsFinancials,
  recentPayments,
}: AdminKpiRowProps) {
  const [expandedPanel, setExpandedPanel] = useState<'sales' | 'pipeline' | null>(null)
  const [activeModal, setActiveModal] = useState<'leads' | 'projects' | 'bookings' | null>(null)
  const [modalData, setModalData] = useState<any[]>([])
  const [modalLoading, setModalLoading] = useState(false)

  const handleOpenPreviewModal = async (type: 'leads' | 'projects' | 'bookings') => {
    setActiveModal(type)
    setModalLoading(true)
    setModalData([])
    
    try {
      const supabase = createClient()
      if (type === 'leads') {
        const { data } = await supabase
          .from('leads')
          .select('id, name, business_name, email, created_at, status')
          .eq('is_archived', false)
          .order('created_at', { ascending: false })
          .limit(3)
        setModalData(data || [])
      } else if (type === 'projects') {
        const { data } = await supabase
          .from('projects')
          .select('id, project_name, client_name, status, contract_value')
          .eq('is_archived', false)
          .order('created_at', { ascending: false })
          .limit(3)
        setModalData(data || [])
      } else if (type === 'bookings') {
        const { data } = await supabase
          .from('strategy_sessions')
          .select('id, scheduled_at, status, leads(name, business_name)')
          .eq('status', 'Scheduled')
          .order('scheduled_at', { ascending: true })
          .limit(3)
        
        const formatted = (data || []).map((s: any) => ({
          id: s.id,
          scheduled_at: s.scheduled_at,
          status: s.status,
          client_name: s.leads?.name || 'Partner',
          business_name: s.leads?.business_name || 'Direct Mandate'
        }))
        setModalData(formatted)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setModalLoading(false)
    }
  }

  const togglePanel = (panel: 'sales' | 'pipeline') => {
    setExpandedPanel((prev) => (prev === panel ? null : panel))
  }

  return (
    <section className="space-y-3">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-6">
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
        <button
          onClick={() => handleOpenPreviewModal('leads')}
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer text-left w-full"
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
        </button>

        {/* Standard: Active Mandates */}
        <button
          onClick={() => handleOpenPreviewModal('projects')}
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer text-left w-full"
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
        </button>

        {/* Standard: Scheduled Briefings */}
        <button
          onClick={() => handleOpenPreviewModal('bookings')}
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer text-left w-full"
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
        </button>

        {/* Standard: MRR Run Rate */}
        <button
          onClick={() => handleOpenPreviewModal('mrr' as any)}
          className="p-3.5 sm:p-6 glass rounded-2xl border border-gold/10 hover:border-gold/25 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4 relative group cursor-pointer text-left w-full"
        >
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground block">
              MRR Run Rate
            </span>
            <p className="text-lg sm:text-2xl font-serif font-bold text-gradient-gold truncate">
              £{projectedMRR.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all">
            <TrendingUp size={18} className="text-gold" />
          </div>
        </button>
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

      {/* ── Metric Cards Detail Preview Modal ───────────────────────────────── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass border border-gold/20 rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-foreground">
                  {activeModal === 'leads'
                    ? 'Inbound Pipelines Telemetry'
                    : activeModal === 'projects'
                    ? 'Active Mandates Summary'
                    : activeModal === 'bookings'
                    ? 'Upcoming Strategy Briefings'
                    : 'MRR Goal Target Tracker'}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {activeModal === 'leads'
                    ? 'Recently intercepted marketing and sales leads'
                    : activeModal === 'projects'
                    ? 'Latest active client dev mandates'
                    : activeModal === 'bookings'
                    ? 'Next scheduled strategic vetting calls'
                    : 'Retainer metrics relative to £10,000/mo baseline'}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {modalLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-gold" size={24} />
                  <p className="text-xxs font-bold text-gold/60 uppercase tracking-widest animate-pulse font-mono">Syncing telemetry...</p>
                </div>
              ) : activeModal === 'mrr' ? (
                (() => {
                  const currentMRR = modalData.reduce((sum, p) => sum + (Number(p.retainer_amount) || 0), 0)
                  const targetMRR = 10000
                  const percentage = Math.min(Math.round((currentMRR / targetMRR) * 100), 100)
                  return (
                    <div className="space-y-5">
                      {/* Goal Meter */}
                      <div className="p-4 rounded-xl bg-gold/5 border border-gold/15 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-foreground font-serif">
                          <span>£10,000/mo Monthly Profit Target</span>
                          <span className="text-gold font-mono">{percentage}% Achieved</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden border border-gold/10">
                          <div className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                          <span>Current MRR: £{currentMRR.toLocaleString('en-GB')}</span>
                          <span>Remaining: £{Math.max(targetMRR - currentMRR, 0).toLocaleString('en-GB')}</span>
                        </div>
                      </div>

                      {/* Retainer List */}
                      <div className="space-y-2.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gold/70 block">Retainer Clients Breakdown</label>
                        {modalData.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground/60 italic border border-dashed border-gold/10 rounded-xl">
                            No active projects on monthly retainers.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {modalData.map((item) => (
                              <div key={item.id} className="p-3.5 rounded-xl border border-gold/10 bg-white/[0.01] hover:border-gold/20 flex items-center justify-between gap-3 transition-all">
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-foreground truncate">{item.project_name}</h4>
                                  <p className="text-[10px] text-muted-foreground truncate">Client: {item.client_name}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs font-mono font-bold text-gold">£{Number(item.retainer_amount).toLocaleString('en-GB')}/mo</span>
                                  <Link
                                    href={`/admin/projects/${item.id}`}
                                    onClick={() => setActiveModal(null)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-gold transition-all"
                                    title="Adjust Retainer Settings"
                                  >
                                    <ExternalLink size={12} />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()
              ) : modalData.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground/60 italic border border-dashed border-gold/10 rounded-xl">
                  No active logs found in this channel.
                </div>
              ) : (
                <div className="space-y-3">
                  {modalData.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-gold/10 bg-white/[0.01] hover:border-gold/25 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-xs font-bold text-foreground truncate">
                          {activeModal === 'leads' ? item.name : activeModal === 'projects' ? item.project_name : item.client_name}
                        </h4>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          activeModal === 'leads'
                            ? item.status === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gold/10 text-gold border border-gold/20'
                            : activeModal === 'projects'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {activeModal === 'leads' ? item.status : activeModal === 'projects' ? item.status : item.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>
                          {activeModal === 'leads'
                            ? item.business_name || 'Direct Personal'
                            : activeModal === 'projects'
                            ? `Client: ${item.client_name}`
                            : item.business_name}
                        </span>
                        <span>
                          {activeModal === 'leads'
                            ? new Date(item.created_at).toLocaleDateString('en-GB')
                            : activeModal === 'projects'
                            ? `Valuation: £${(item.contract_value || 0).toLocaleString('en-GB')}`
                            : new Date(item.scheduled_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gold/10 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl border border-gold/15 hover:bg-white/5 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer order-last sm:order-first"
              >
                Close
              </button>
              
              <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
                <Link
                  href={
                    activeModal === 'leads'
                      ? '/admin/leads?status=New'
                      : activeModal === 'projects'
                      ? '/admin/projects?filter=active'
                      : activeModal === 'bookings'
                      ? '/admin/bookings?status=Scheduled'
                      : '/admin/projects?filter=retainer'
                  }
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/25 hover:border-gold/45 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  {activeModal === 'mrr' ? 'Manage Active Retainers' : 'Open Console'} <ExternalLink size={11} />
                </Link>
                
                {activeModal === 'leads' && (
                  <Link
                    href="/admin/leads?create=true"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    Add Manual Lead <Plus size={11} />
                  </Link>
                )}
                {activeModal === 'projects' && (
                  <Link
                    href="/admin/projects?create=true"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    Provision Mandate <Plus size={11} />
                  </Link>
                )}
                {activeModal === 'bookings' && (
                  <Link
                    href="/admin/bookings?schedule=true"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    Book Vetting Call <Plus size={11} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
