'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DollarSign, Save, Loader2, RefreshCw, Check, Plus, X, Star,
  Zap, ChevronDown, ChevronUp, AlertTriangle, Sparkles
} from 'lucide-react'
import { SITE_COPY } from '@/lib/site-copy'
import type { PricingTier } from '@/lib/pricing'

// ── Types ─────────────────────────────────────────────────────────────────────

type BillingModel = 'oneTime' | 'monthly' | 'revShare'

const MODEL_CONFIG: Record<BillingModel, { label: string; dbKey: string; prefix: string; suffix: string; color: string }> = {
  oneTime:  { label: 'One-Time Setup',   dbKey: 'pricing_setup_tiers',    prefix: '£', suffix: '',  color: '#DAA640' },
  monthly:  { label: 'Monthly Retainer', dbKey: 'pricing_retainer_tiers', prefix: '£', suffix: '/mo', color: '#60A5FA' },
  revShare: { label: '% Revenue Share',  dbKey: 'pricing_revshare_tiers', prefix: '',  suffix: '%', color: '#34D399' },
}

// ── Defaults from site-copy ───────────────────────────────────────────────────

function makeTierId(name: string, idx: number): string {
  return name?.toLowerCase().replace(/\s+/g, '-') || `tier-${idx}`
}

const DEFAULTS: Record<BillingModel, PricingTier[]> = {
  oneTime:  SITE_COPY.pricingPage.oneTimeTiers.map((t, i) => ({ id: makeTierId(t.name, i), ...t } as PricingTier)),
  monthly:  SITE_COPY.pricingPage.monthlyTiers.map((t, i) => ({ id: makeTierId(t.name, i), ...t } as PricingTier)),
  revShare: SITE_COPY.pricingPage.revenueShareTiers.map((t, i) => ({ id: makeTierId(t.name, i), ...t } as PricingTier)),
}

// ── Tier Card ─────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  model,
  index,
  onChange,
  onSave,
  saving,
  saved,
}: {
  tier: PricingTier
  model: BillingModel
  index: number
  onChange: (updated: PricingTier) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  const [expanded, setExpanded] = useState(index === 0)
  const cfg = MODEL_CONFIG[model]

  const update = (patch: Partial<PricingTier>) => onChange({ ...tier, ...patch })

  const addFeature = () => update({ features: [...(tier.features || []), ''] })
  const removeFeature = (i: number) => update({ features: tier.features.filter((_, fi) => fi !== i) })
  const updateFeature = (i: number, val: string) => {
    const feats = [...tier.features]
    feats[i] = val
    update({ features: feats })
  }

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      tier.featured
        ? 'border-[#DAA640]/50 bg-gradient-to-b from-[#DAA640]/8 to-[#07153B]/60 shadow-[0_0_40px_rgba(218,166,64,0.08)]'
        : 'border-white/8 bg-[#07153B]/50'
    }`}>
      {/* Card Header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0">
          {tier.featured && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DAA640]/15 border border-[#DAA640]/30 text-[#DAA640] text-[10px] font-bold uppercase tracking-wider">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
          <span className="font-sans font-bold text-white text-base sm:text-lg truncate">
            {tier.name || `Tier ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="font-mono font-extrabold text-lg sm:text-xl" style={{ color: cfg.color }}>
            {cfg.prefix}{tier.price}{cfg.suffix}
          </span>
          {expanded ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
        </div>
      </button>

      {/* Expanded Body */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
          {/* Row 1: Name + Featured toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Tier Name</label>
              <input
                className="w-full bg-[#020E28] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#DAA640]/50 transition-colors"
                value={tier.name}
                onChange={e => update({ name: e.target.value })}
                placeholder="e.g. Essential Storefront"
              />
            </div>
            <div className="sm:w-40 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Featured Tier</label>
              <button
                onClick={() => update({ featured: !tier.featured })}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  tier.featured
                    ? 'bg-[#DAA640]/15 border-[#DAA640]/40 text-[#DAA640]'
                    : 'bg-white/4 border-white/10 text-white/40 hover:text-white/60'
                }`}
              >
                <Star size={14} fill={tier.featured ? 'currentColor' : 'none'} />
                {tier.featured ? 'Featured' : 'Not Featured'}
              </button>
            </div>
          </div>

          {/* Row 2: Price + Interval */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-36 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Price {cfg.prefix && `(${cfg.prefix})`}{cfg.suffix && `/ ${cfg.suffix}`}
              </label>
              <div className="relative">
                {cfg.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: cfg.color }}>
                    {cfg.prefix}
                  </span>
                )}
                <input
                  className={`w-full bg-[#020E28] border border-white/10 rounded-xl py-2.5 text-sm text-white focus:outline-none focus:border-[#DAA640]/50 transition-colors ${cfg.prefix ? 'pl-7' : 'pl-3'} pr-3`}
                  value={tier.price}
                  onChange={e => update({ price: e.target.value })}
                  placeholder="e.g. 495"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Interval Label</label>
              <input
                className="w-full bg-[#020E28] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#DAA640]/50 transition-colors"
                value={tier.interval}
                onChange={e => update({ interval: e.target.value })}
                placeholder="e.g. one-time setup fee"
              />
            </div>
          </div>

          {/* Row 3: Milestone */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Milestone / Subheading</label>
            <input
              className="w-full bg-[#020E28] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#DAA640]/50 transition-colors"
              value={tier.milestoneBreakdown || ''}
              onChange={e => update({ milestoneBreakdown: e.target.value })}
              placeholder="e.g. Complete build & launch in 7 days"
            />
          </div>

          {/* Row 4: Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">Description</label>
            <textarea
              rows={2}
              className="w-full bg-[#020E28] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#DAA640]/50 transition-colors resize-none"
              value={tier.description}
              onChange={e => update({ description: e.target.value })}
              placeholder="Short paragraph describing this tier..."
            />
          </div>

          {/* Row 5: Features */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Features ({tier.features?.length || 0})
            </label>
            <div className="space-y-2">
              {(tier.features || []).map((f, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <span className="text-[#DAA640]/60 text-xs shrink-0">✓</span>
                  <input
                    className="flex-1 bg-[#020E28] border border-white/8 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#DAA640]/40 transition-colors"
                    value={f}
                    onChange={e => updateFeature(fi, e.target.value)}
                    placeholder={`Feature ${fi + 1}`}
                  />
                  <button
                    onClick={() => removeFeature(fi)}
                    className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addFeature}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#DAA640]/70 hover:text-[#DAA640] transition-colors cursor-pointer mt-1"
            >
              <Plus size={13} /> Add Feature
            </button>
          </div>

          {/* Row 6: CTA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/40">CTA Button Text</label>
            <input
              className="w-full bg-[#020E28] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#DAA640]/50 transition-colors"
              value={tier.cta}
              onChange={e => update({ cta: e.target.value })}
              placeholder="e.g. Book your free 15 minute audit"
            />
          </div>

          {/* Save Tier Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DAA640] text-[#020E28] text-xs font-bold hover:bg-[#EBB755] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(218,166,64,0.25)]"
            >
              {saved ? <Check size={14} /> : saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Tier'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PricingManagerPage() {
  const supabase = createClient()

  const [activeModel, setActiveModel] = useState<BillingModel>('oneTime')
  const [allTiers, setAllTiers] = useState<Record<BillingModel, PricingTier[]>>({
    oneTime:  [...DEFAULTS.oneTime],
    monthly:  [...DEFAULTS.monthly],
    revShare: [...DEFAULTS.revShare],
  })
  const [loadingModel, setLoadingModel] = useState<BillingModel | null>(null)
  const [savingTier, setSavingTier] = useState<string | null>(null)  // `${model}-${index}`
  const [savedTier, setSavedTier] = useState<string | null>(null)
  const [savingAll, setSavingAll] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // Fetch all 3 models from Supabase on mount
  const fetchAll = useCallback(async () => {
    const entries = Object.entries(MODEL_CONFIG) as [BillingModel, typeof MODEL_CONFIG[BillingModel]][]
    for (const [model, cfg] of entries) {
      setLoadingModel(model)
      try {
        const { data } = await supabase
          .from('website_content')
          .select('content')
          .eq('section_key', cfg.dbKey)
          .maybeSingle()

        if (data?.content && Array.isArray(data.content) && data.content.length > 0) {
          setAllTiers(prev => ({ ...prev, [model]: data.content }))
        }
        // else: keep DEFAULTS already set
      } catch { /* keep defaults */ }
    }
    setLoadingModel(null)
  }, [supabase])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Update a single tier in state
  const handleTierChange = (model: BillingModel, idx: number, updated: PricingTier) => {
    setAllTiers(prev => {
      const copy = [...prev[model]]
      copy[idx] = updated
      return { ...prev, [model]: copy }
    })
  }

  // Save a single tier (upserts the whole model array)
  const handleSaveTier = async (model: BillingModel, idx: number) => {
    const key = `${model}-${idx}`
    setSavingTier(key)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('website_content')
      .upsert(
        { section_key: MODEL_CONFIG[model].dbKey, content: allTiers[model], updated_at: new Date().toISOString(), updated_by: user?.id || null },
        { onConflict: 'section_key' }
      )
    setSavingTier(null)
    if (error) { showToast(`Error: ${error.message}`); return }
    setSavedTier(key)
    setTimeout(() => setSavedTier(null), 2500)
    triggerRevalidate()
  }

  // Save all 3 models at once
  const handleSaveAll = async () => {
    setSavingAll(true)
    const { data: { user } } = await supabase.auth.getUser()
    const models = Object.entries(MODEL_CONFIG) as [BillingModel, typeof MODEL_CONFIG[BillingModel]][]
    let errorMsg: string | null = null
    for (const [model, cfg] of models) {
      const { error } = await supabase
        .from('website_content')
        .upsert(
          { section_key: cfg.dbKey, content: allTiers[model], updated_at: new Date().toISOString(), updated_by: user?.id || null },
          { onConflict: 'section_key' }
        )
      if (error) { errorMsg = error.message; break }
    }
    setSavingAll(false)
    if (errorMsg) { showToast(`Error: ${errorMsg}`); return }
    showToast('✓ All pricing saved — live site updating now.')
    triggerRevalidate()
  }

  // Reset all models to SITE_COPY defaults
  const handleResetAll = () => {
    if (!window.confirm('Reset all pricing to live site-copy defaults? This will not save to the database.')) return
    setAllTiers({ oneTime: [...DEFAULTS.oneTime], monthly: [...DEFAULTS.monthly], revShare: [...DEFAULTS.revShare] })
    showToast('Reset to defaults — click Save All to persist.')
  }

  // Force-sync defaults to Supabase
  const handleSyncFromSiteCopy = async () => {
    if (!window.confirm('Overwrite all database pricing with current site-copy defaults?')) return
    setSyncing(true)
    const { data: { user } } = await supabase.auth.getUser()
    const models = Object.entries(MODEL_CONFIG) as [BillingModel, typeof MODEL_CONFIG[BillingModel]][]
    let errorMsg: string | null = null
    for (const [model, cfg] of models) {
      const { error } = await supabase
        .from('website_content')
        .upsert(
          { section_key: cfg.dbKey, content: DEFAULTS[model], updated_at: new Date().toISOString(), updated_by: user?.id || null },
          { onConflict: 'section_key' }
        )
      if (error) { errorMsg = error.message; break }
    }
    if (!errorMsg) {
      setAllTiers({ oneTime: [...DEFAULTS.oneTime], monthly: [...DEFAULTS.monthly], revShare: [...DEFAULTS.revShare] })
    }
    setSyncing(false)
    if (errorMsg) { showToast(`Sync failed: ${errorMsg}`); return }
    showToast('✓ All pricing synced from live site-copy and saved.')
    triggerRevalidate()
  }

  const triggerRevalidate = async () => {
    try {
      await fetch('/api/revalidate-pricing', {
        method: 'POST',
        headers: { 'x-admin-key': 'mercian-wealth-admin-revalidate' },
      })
    } catch { /* non-fatal */ }
  }

  const currentTiers = allTiers[activeModel]
  const isLoading = loadingModel !== null

  return (
    <div className="min-h-screen bg-[#020E28] text-white pb-32 lg:pb-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#07153B] border border-[#DAA640]/30 text-sm font-semibold text-[#DAA640] shadow-2xl animate-in slide-in-from-top-2 duration-300">
          <Check size={15} />
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">

        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-[#DAA640]/80 uppercase">
                <DollarSign size={12} /> Pricing Manager
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Pricing Control Centre</h1>
              <p className="text-sm text-white/50">Edit all three billing models — changes save to the live site instantly.</p>
            </div>

            {/* Action Buttons — desktop */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={handleSyncFromSiteCopy}
                disabled={syncing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/8 transition-all cursor-pointer disabled:opacity-50"
              >
                {syncing ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                {syncing ? 'Syncing...' : 'Sync Defaults'}
              </button>
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
              >
                <RefreshCw size={13} /> Reset All
              </button>
              <button
                onClick={handleSaveAll}
                disabled={savingAll}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#DAA640] text-[#020E28] text-xs font-extrabold hover:bg-[#EBB755] transition-all cursor-pointer disabled:opacity-50 shadow-[0_4px_20px_rgba(218,166,64,0.3)]"
              >
                {savingAll ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {savingAll ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(MODEL_CONFIG) as [BillingModel, typeof MODEL_CONFIG[BillingModel]][]).map(([model, cfg]) => (
              <div key={model} className="rounded-xl bg-[#07153B]/60 border border-white/6 px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{allTiers[model].length}</p>
                <p className="text-[10px] text-white/30 mt-0.5">tiers</p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Model Tabs */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 min-w-max sm:min-w-0 bg-[#07153B]/60 p-1 rounded-2xl border border-white/6">
            {(Object.entries(MODEL_CONFIG) as [BillingModel, typeof MODEL_CONFIG[BillingModel]][]).map(([model, cfg]) => (
              <button
                key={model}
                onClick={() => setActiveModel(model)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeModel === model
                    ? 'bg-[#020E28] text-white shadow-lg'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: activeModel === model ? cfg.color : 'rgba(255,255,255,0.15)' }}
                />
                {cfg.label}
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  activeModel === model ? 'bg-white/10 text-white/60' : 'bg-white/5 text-white/20'
                }`}>
                  {allTiers[model].length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Model Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MODEL_CONFIG[activeModel].color }} />
            <h2 className="font-sans font-bold text-white text-lg">
              {MODEL_CONFIG[activeModel].label} Tiers
            </h2>
            {isLoading && <Loader2 size={14} className="animate-spin text-white/30" />}
          </div>
          {activeModel === 'revShare' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={10} /> Performance Model
            </span>
          )}
        </div>

        {/* Tier Cards */}
        <div className="space-y-4">
          {currentTiers.map((tier, idx) => (
            <TierCard
              key={`${activeModel}-${tier.id || idx}`}
              tier={tier}
              model={activeModel}
              index={idx}
              onChange={updated => handleTierChange(activeModel, idx, updated)}
              onSave={() => handleSaveTier(activeModel, idx)}
              saving={savingTier === `${activeModel}-${idx}`}
              saved={savedTier === `${activeModel}-${idx}`}
            />
          ))}
        </div>

        {/* Info notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-400/5 border border-blue-400/15">
          <AlertTriangle size={14} className="text-blue-400/70 mt-0.5 shrink-0" />
          <p className="text-xs text-white/40 leading-relaxed">
            Changes save to Supabase and are reflected on the public pricing page within 60 seconds (via cache revalidation). 
            Use <strong className="text-white/60">"Save Tier"</strong> for quick per-card saves or <strong className="text-white/60">"Save All"</strong> to push all three models at once.
          </p>
        </div>
      </div>

      {/* Mobile Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden z-50 px-4 pb-safe-area-inset-bottom pb-4 pt-3 bg-[#020E28]/95 backdrop-blur-md border-t border-white/8">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <button
            onClick={handleResetAll}
            className="flex-none flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleSyncFromSiteCopy}
            disabled={syncing}
            className="flex-none flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {syncing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          </button>
          <button
            onClick={handleSaveAll}
            disabled={savingAll}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#DAA640] text-[#020E28] text-sm font-extrabold hover:bg-[#EBB755] transition-all cursor-pointer disabled:opacity-50 shadow-[0_4px_20px_rgba(218,166,64,0.3)]"
          >
            {savingAll ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {savingAll ? 'Saving All...' : 'Save All Pricing'}
          </button>
        </div>
      </div>
    </div>
  )
}
