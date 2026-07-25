'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Info, Lock, Unlock, Check, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

type ProjectProps = {
  project: {
    id: string
    project_name: string
    contract_value: number
    amount_paid: number
    status: string
    contract_type: string | null
    retainer_amount: number
    one_time_fee: number
    rev_share_percentage: number
    service_type: string | null
  }
}

export function ProjectTelemetry({ project }: ProjectProps) {
  const router = useRouter()
  const supabase = createClient()
  const [enrolling, setEnrolling] = useState<string | null>(null)

  const contractValue = Number(project.contract_value) || 0
  const amountPaid = Number(project.amount_paid) || 0
  const contractType = project.contract_type

  const hasContract = !!contractType
  const percent = hasContract && contractValue > 0 ? Math.min(Math.round((amountPaid / contractValue) * 100), 100) : 0

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (percent / 100) * circumference

  const milestones = [
    { name: 'Discovery', threshold: 0, desc: 'The strategic foundation. Unlocked upon project initialisation — brand consultation, intelligence gathering, and requirement documentation commences.' },
    { name: 'Design', threshold: 25, desc: 'Precision brand execution and Figma architecture blueprints. Unlocks upon 25% settlement — your visual identity takes form.' },
    { name: 'Development', threshold: 50, desc: 'Core system build, database schema, and automation pipelines. Unlocks upon 50% settlement — the engine comes online.' },
    { name: 'Revision', threshold: 75, desc: 'Staging environment preview, lead-form verification and refinement. Unlocks upon 75% settlement — your system is tested under operational conditions.' },
    { name: 'Complete', threshold: 100, desc: 'Live deployment, domain delegation and full handover. Unlocks upon 100% settlement — your asset is live and operational.' },
  ]

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const firstLocked = milestones.find(m => hasContract && percent < m.threshold)

  const handleEnroll = async (type: string) => {
    setEnrolling(type)
    let value = 0
    if (type === 'retainer') value = project.retainer_amount || 0
    else if (type === 'one_time') value = project.one_time_fee || 0
    else if (type === 'rev_share') value = 0 // Rev share valuation is percentage-based, contract_value handled dynamically

    const { error } = await supabase
      .from('projects')
      .update({
        contract_type: type,
        contract_value: value,
      })
      .eq('id', project.id)

    setEnrolling(null)
    if (error) {
      toast.error(`Enrollment failed: ${error.message}`)
    } else {
      toast.success('Successfully enrolled in contract scheme!')
      router.refresh()
    }
  }

  const getContractTypeName = (type: string | null) => {
    if (type === 'retainer') return 'Monthly Retainer'
    if (type === 'one_time') return 'One-Time Setup Fee'
    if (type === 'rev_share') return 'Performance Royalty Yield (PRY)'
    return 'Pending Setup'
  }

  // Render Contract Selection Screen if not enrolled
  const serviceTypeLower = (project.service_type || '').toLowerCase()
  const isAuthority = serviceTypeLower.includes('catalyst') || serviceTypeLower.includes('authority') || project.one_time_fee === 1850 || project.one_time_fee === 2750 || project.one_time_fee === 3500 || project.retainer_amount === 395 || project.retainer_amount === 499
  const isOperations = serviceTypeLower.includes('leverage') || serviceTypeLower.includes('operations') || project.one_time_fee === 3850 || project.one_time_fee === 5500 || project.one_time_fee === 5800 || project.retainer_amount === 750 || project.retainer_amount === 1290 || project.retainer_amount === 1450
  const isRevenue = serviceTypeLower.includes('enterprise') || serviceTypeLower.includes('revenue') || project.one_time_fee === 7500 || project.one_time_fee === 9800 || project.retainer_amount === 1450 || project.retainer_amount === 2850 || project.retainer_amount === 2950

  const retainerPerks = isRevenue
    ? [
        "Everything in Leverage Growth",
        "Weekly High-Level Growth Consulting Call",
        "Unlimited Minor System & UI Adjustments",
        "New AI Workflow Builds & Automations",
        "100% White-Labeled & Unbranded Enterprise Infrastructure",
        "Bespoke Cold Email/Marketing System setups",
        "Direct Slack Hotline to Core Founders"
      ]
    : isOperations
    ? [
        "Everything in Launch Support",
        "Continuous AI Agent Re-training & Updates",
        "1 Custom High-Converting Landing Page/mo",
        "Advanced SEO Content & Competitor Strategy",
        "Optional \"Built by Mercian Wealth\" Seal or Complimentary Removal",
        "10 Dedicated Developer/Designer Hours/mo",
        "Priority 4-Hour Urgent SLA Response"
      ]
    : isAuthority
    ? [
        "Premium Dedicated Ultra-Fast CDN Hosting",
        "Weekly Security & Speed Audits",
        "3 Hours Design & Copywriting Updates/mo",
        "Monthly Traffic & SEO Analytics Report",
        "Discreet \"Built by Mercian Wealth\" Digital Seal Included",
        "24/7 Critical System Monitoring",
        "Same-Day Urgent Edits Turnaround"
      ]
    : [];

  const setupPerks = isRevenue
    ? [
        "Everything in System Leverage (Unlimited Pages)",
        "Automated Cold Outreach Infrastructure",
        "Custom-Trained AI Agent Concierge",
        "Full Corporate Brand Identity Suite",
        "100% White-Labeled & Proprietary Delivery (Zero Agency Branding)",
        "Direct Slack Hotline to Principal Founders",
        "Weekly Systems Scaling Strategy Roadmaps"
      ]
    : isOperations
    ? [
        "Everything in Launch Catalyst (up to 10 Pages)",
        "Custom Relational Database Integration (Supabase)",
        "Autonomous Pipeline Routing & CRM Orchestration",
        "Custom Secure Client Portal Integration",
        "Automated Stripe Billing & Invoice Engine",
        "Optional \"Built by Mercian Wealth\" Digital Seal or Complimentary White-Labeling",
        "90 Days Dedicated Post-Launch Support"
      ]
    : isAuthority
    ? [
        "Bespoke Next.js Authority Platform (5 Pages)",
        "Autonomous Lead Capture & Calendly Setup",
        "Core SEO Blueprint & Schema Setup",
        "Supercharged Speed Profile (98+ Mobile)",
        "Discreet \"Built by Mercian Wealth\" Digital Seal (White-Label upgrade available)",
        "30 Days Dedicated Post-Launch Support"
      ]
    : [];

  const pryPerks = [
    "Unlimited System builds & updates at zero upfront cost",
    "Active CRM & Lead Capture maintenance for life",
    "Sub-60s Triage & Lead Routing automation",
    "Continuous AI fine-tuning & conversion optimization"
  ]

  if (!hasContract) {
    return (
      <div data-tour="telemetry-deck" className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 flex flex-col space-y-5 h-full shadow-lg">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gold uppercase tracking-wider">Contract Enrollment Desk</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Configure and enroll in your preferred service plan. The admin has specified the following tailored options for your mandate:
          </p>
        </div>

        <div className="space-y-3.5">
          {/* Retainer Option */}
          <div className="p-3.5 rounded-xl border border-gold/15 bg-white/[0.01] hover:border-gold/30 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  Monthly Retainer {isRevenue ? "(Enterprise)" : isOperations ? "(Co-Pilot)" : isAuthority ? "(Pilot)" : ""}
                </span>
                <span className="text-xs font-mono font-bold text-gold">{project.retainer_amount > 0 ? `${formatCurrency(project.retainer_amount)}/mo` : 'TBD'}</span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-normal">
                Continuous operational strategy, updates, and maintenance support billed monthly.
              </p>
              {retainerPerks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[8px] font-bold text-accent-gold uppercase tracking-wider">Perks Included:</span>
                  <div className="space-y-1">
                    {retainerPerks.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[8px] text-muted-foreground">
                        <span className="text-accent-gold text-[10px] leading-none shrink-0">•</span>
                        <span className="leading-tight">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => handleEnroll('retainer')}
              disabled={enrolling !== null || project.retainer_amount <= 0}
              className="w-full py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
            >
              {enrolling === 'retainer' ? 'Enrolling...' : 'Enroll in Retainer'}
            </button>
          </div>

          {/* One-Time Setup Option */}
          <div className="p-3.5 rounded-xl border border-gold/15 bg-white/[0.01] hover:border-gold/30 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  One-Time Setup {isRevenue ? "(Revenue Engine)" : isOperations ? "(Operations Machine)" : isAuthority ? "(Authority Suite)" : ""}
                </span>
                <span className="text-xs font-mono font-bold text-gold">{project.one_time_fee > 0 ? formatCurrency(project.one_time_fee) : 'TBD'}</span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-normal">
                Complete asset deployment, configuration, and structural handover at a flat rate.
              </p>
              {setupPerks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[8px] font-bold text-accent-gold uppercase tracking-wider">Deliverables:</span>
                  <div className="space-y-1">
                    {setupPerks.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[8px] text-muted-foreground">
                        <span className="text-accent-gold text-[10px] leading-none shrink-0">•</span>
                        <span className="leading-tight">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => handleEnroll('one_time')}
              disabled={enrolling !== null || project.one_time_fee <= 0}
              className="w-full py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
            >
              {enrolling === 'one_time' ? 'Enrolling...' : 'Enroll in Setup'}
            </button>
          </div>

          {/* PRY Option */}
          <div className="p-3.5 rounded-xl border border-gold/15 bg-white/[0.01] hover:border-gold/30 transition-all flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground text-gradient-gold">Performance Royalty Yield (PRY)</span>
                <span className="text-xs font-mono font-bold text-gold">{project.rev_share_percentage > 0 ? `${project.rev_share_percentage}% Rev` : 'TBD'}</span>
              </div>
              <p className="text-[9px] text-muted-foreground leading-normal">
                Strategic co-investment scheme. We provision your system for life in exchange for a performance-based royalty yield.
              </p>
              <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                <span className="text-[8px] font-bold text-accent-gold uppercase tracking-wider">Royalty Agreement Perks:</span>
                <div className="space-y-1">
                  {pryPerks.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[8px] text-muted-foreground">
                      <span className="text-accent-gold text-[10px] leading-none shrink-0">•</span>
                      <span className="leading-tight">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleEnroll('rev_share')}
              disabled={enrolling !== null || project.rev_share_percentage <= 0}
              className="w-full py-1.5 rounded-lg bg-gradient-to-r from-gold/20 to-gold-light/20 hover:from-gold/30 hover:to-gold-light/30 text-gold text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer border border-gold/30"
            >
              {enrolling === 'rev_share' ? 'Enrolling...' : 'Activate PRY Agreement'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div data-tour="telemetry-deck" className="p-6 glass rounded-2xl border border-gold/10 flex flex-col items-center space-y-6 relative overflow-hidden h-full shadow-lg">
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Financial Telemetry</h3>
          <p className="text-[9px] text-muted-foreground font-mono truncate">{getContractTypeName(contractType)}</p>
        </div>
        <span className="text-[8px] text-gold/75 font-mono bg-gold/5 px-2 py-0.5 rounded border border-gold/15 tracking-widest flex items-center gap-1 font-bold">
          <ShieldCheck size={9} /> SECURED
        </span>
      </div>

      {/* Circular Progress Gauge */}
      {contractType === 'rev_share' ? (
        <div className="py-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(201,162,39,0.15)]">
            <DollarSign size={20} className="text-gold" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-gradient-gold">{project.rev_share_percentage}%</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground block mt-1">Active Royalty yield</span>
          </div>
          <p className="text-[9px] text-muted-foreground/60 max-w-[180px] mx-auto leading-normal">
            Your PRY agreement is active. Revenue percentage yields are automatically tracked and settled.
          </p>
        </div>
      ) : (
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(201, 162, 39, 0.05)"
              strokeWidth="8"
              fill="transparent"
            />
            {hasContract && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#goldGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(201, 162, 39, 0.4))'
                }}
              />
            )}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent-gold)" />
                <stop offset="100%" stopColor="#E5C453" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            {hasContract && contractValue > 0 ? (
              <>
                <span className="text-2xl font-serif font-bold text-gradient-gold">
                  {percent}%
                </span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                  Settled
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-serif font-bold text-muted-foreground">
                  Pending
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 px-2 mt-1">
                  Awaiting Settlement
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Financial Details */}
      {contractType !== 'rev_share' && (
        <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-center">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">
              Total Contract
            </span>
            <span className="text-xs font-bold text-foreground font-mono">
              {contractValue > 0 ? formatCurrency(contractValue) : 'TBD'}
            </span>
          </div>
          <div className="space-y-1 border-l border-white/5">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">
              Settled Balance
            </span>
            <span className="text-xs font-bold text-gold font-mono">
              {formatCurrency(amountPaid)}
            </span>
          </div>
        </div>
      )}

      {/* Interactive Milestones Checklist */}
      <div className="w-full space-y-3 pt-2">
        <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
          <Info size={11} className="text-gold" /> Phase Unlock Milestones
        </h4>
        
        <div className="space-y-2.5">
          {milestones.map((m) => {
            const stages = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']
            const currentStageIndex = stages.indexOf(project.status)
            const milestoneIndex = stages.indexOf(m.name)
            
            // If PRY (rev_share), milestones unlock automatically based on currentStageIndex since there is no contract_value threshold.
            const isUnlocked = contractType === 'rev_share' 
              ? (milestoneIndex !== -1 && milestoneIndex <= currentStageIndex)
              : (hasContract && percent >= m.threshold) || (milestoneIndex !== -1 && milestoneIndex <= currentStageIndex)
              
            const isHovered = activeTooltip === m.name
            const requiredAmount = (m.threshold / 100) * contractValue

            return (
              <div 
                key={m.name} 
                className="relative"
                onMouseEnter={() => setActiveTooltip(m.name)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div 
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-300 border ${
                    isUnlocked 
                      ? 'bg-gold/[0.03] border-gold/15 text-foreground' 
                      : 'bg-white/[0.01] border-transparent text-muted-foreground/45'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_8px_rgba(201,162,39,0.25)]' 
                      : 'bg-black/20 border-white/5 text-muted-foreground/30'
                  }`}>
                    {isUnlocked ? (
                      <Check size={11} className="stroke-[3]" />
                    ) : (
                      <Lock size={9} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold">{m.name}</span>
                      {hasContract && contractType !== 'rev_share' && (
                        <span className="text-[9px] font-mono text-muted-foreground/60">
                          {m.threshold}% ({formatCurrency(requiredAmount)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Micro-tooltip */}
                {isHovered && (
                  <div className="absolute left-0 bottom-full mb-2 w-full bg-[#130D24] border border-gold/25 p-3 rounded-xl shadow-2xl z-20 animate-fade-in text-left">
                    <div className="flex items-center gap-1.5 mb-1">
                      {isUnlocked ? (
                        <Unlock size={11} className="text-gold" />
                      ) : (
                        <Lock size={11} className="text-muted-foreground/50" />
                      )}
                      <span className="text-xs font-bold text-foreground">{m.name} Milestone</span>
                      <span className={`text-[9px] ml-auto font-bold px-1.5 py-0.5 rounded ${
                        isUnlocked ? 'bg-gold/15 text-gold' : 'bg-white/5 text-muted-foreground/60'
                      }`}>
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {m.desc}
                    </p>
                    {!isUnlocked && hasContract && contractType !== 'rev_share' && (
                      <p className="text-[10px] text-gold font-mono mt-1.5 border-t border-white/5 pt-1">
                        {firstLocked?.name === m.name ? (
                          <>Requires additional {formatCurrency(requiredAmount - amountPaid)} settled to unlock (Target: {formatCurrency(requiredAmount)}).</>
                        ) : (
                          <>Requires {formatCurrency(requiredAmount)} total settled to unlock.</>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
