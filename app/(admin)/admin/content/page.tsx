'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, RefreshCw, AlertTriangle, Check, Layers, FileJson, Sparkles, CheckCircle2, DollarSign, Plus, X, Star } from 'lucide-react'
import type { PricingTier } from '@/lib/pricing'

type SectionKey = 'hero' | 'cta' | 'process' | 'faq' | 'footer' | 'pricing_setup' | 'pricing_retainer'

const DEFAULT_SECTIONS: Record<SectionKey, any> = {
  hero: {
    badge: 'NEXT-GEN AI AGENCY',
    title: 'We Architect High-End Digital Assets',
    subtitle: 'Premium web design, elite AI integrations, and lead generation systems tailored for legacy businesses.',
    primary_cta: 'Secure a Strategy Call',
    secondary_cta: 'Explore Our Services',
  },
  cta: {
    title: 'Ready to Elevate Your Digital Footprint?',
    subtitle: 'Let\'s build a bespoke digital presence or AI chatbot system that operates 24/7 to scale your business.',
    button_text: 'Secure Your Strategy Session',
  },
  process: {
    steps: [
      { step: '01', title: 'Strategy & Architecture', desc: 'Deep dive into your workflow and map out the blueprint.' },
      { step: '02', title: 'High-Fidelity Design', desc: 'Crafting the visual layout matching premium luxury standards.' },
      { step: '03', title: 'Engineering & Integration', desc: 'Building responsive frontends and programming custom AI features.' },
      { step: '04', title: 'Deployment & Scaling', desc: 'Going live, optimising speed, and establishing database pipelines.' },
    ]
  },
  faq: {
    items: [
      { q: 'How long does a standard web project take?', a: 'Typically 3 to 6 weeks depending on complex integrations like custom AI agents or dashboard logins.' },
      { q: 'Can you integrate custom AI chatbots with our existing system?', a: 'Yes. We build custom workflows that interface with CRM databases, calendar booking systems, and live agent handoffs.' },
      { q: 'Do you charge a recurring fee?', a: 'No. We build custom bespoke setups where you own the intellectual property. Any optional maintenance packages are quoted separately.' },
    ]
  },
  footer: {
    copyright: '© 2026 Mercian Wealth. All Rights Reserved.',
    email: 'contact@mercianwealth.com',
    phone: '+44 7851 055929',
    address: 'London, UK',
    twitter_url: 'https://twitter.com',
    linkedin_url: 'https://www.linkedin.com/in/gs-legacy-wealth/',
  },
  pricing_setup: [
    { id: 'authority-suite', name: 'Authority Suite', price: '2,750', interval: '£687.50 deposit to initiate', milestoneBreakdown: '4 milestone stages of 25% (£687.50) linked to build progress', description: 'A luxury digital front-office that projects absolute authority.', features: ['Bespoke Next.js Authority Platform (5 Pages)', 'Calendly Scheduling Integration', 'Stripe Payment Gateway Integration', 'Core SEO Blueprint & Schema Setup', 'Supercharged Speed Profile (95+ Mobile)', '30 Days Dedicated Post-Launch Support'], cta: 'Request Alignment', featured: false, tag: 'Authority Suite' },
    { id: 'operations-machine', name: 'Operations Machine', price: '5,500', interval: '£1,375 deposit to initiate', milestoneBreakdown: '4 milestone stages of 25% (£1,375) linked to build progress', description: 'Your complete digital systems layer.', features: ['Everything in Authority Suite (up to 10 Pages)', 'Custom Backend Admin Dashboard', 'Custom Secure Client Portal Integration', 'Autonomic Lead & CRM Automations', 'Automated Stripe Billing & Invoices', '90 Days Dedicated Post-Launch Support'], cta: 'Initiate Audit', featured: true, tag: 'Operations Machine' },
    { id: 'revenue-engine', name: 'Revenue Engine', price: '9,800', interval: '£2,450 deposit to initiate', milestoneBreakdown: '4 milestone stages of 25% (£2,450) linked to build progress', description: 'The ultimate growth and automation infrastructure.', features: ['Everything in Operations Machine (Unlimited Pages)', 'Bespoke Cold Email Outreach System', 'Custom-Trained AI Agent Concierge', 'Full Brand Identity Suite (Logos, Guidelines)', 'Priority VIP Developer Slack Support', 'Weekly Growth & Scaling Roadmaps'], cta: 'Initiate Audit', featured: false, tag: 'Revenue Engine' },
  ],
  pricing_retainer: [
    { id: 'authority-suite', name: 'Pilot Support', price: '499', interval: 'billed monthly', milestoneBreakdown: '', description: 'Continuous hosting, top-tier performance audits, and priority developer hours.', features: ['Premium Dedicated Ultra-Fast CDN Hosting', 'Weekly Security & Speed Audits', '3 Hours Design & Copywriting Updates/mo', 'Monthly Traffic & SEO Analytics Report', '24/7 Critical System Monitoring', 'Same-Day Urgent Edits Turnaround'], cta: 'Request Alignment', featured: false, tag: 'Authority Suite' },
    { id: 'operations-machine', name: 'Co-Pilot Growth', price: '1,290', interval: 'billed monthly', milestoneBreakdown: '', description: 'Custom scaling campaigns, search engine dominance, and continuous autonomic AI system tuning.', features: ['Everything in Pilot Support', 'Continuous AI Agent Re-training & Updates', '1 Custom High-Converting Landing Page/mo', 'Advanced SEO Content & Competitor Strategy', 'Weekly Lead Funnel Optimisation', '10 Dedicated Developer/Designer Hours/mo'], cta: 'Initiate Audit', featured: true, tag: 'Operations Machine' },
    { id: 'revenue-engine', name: 'Enterprise Autonomic Partner', price: '2,850', interval: 'billed monthly', milestoneBreakdown: '', description: 'Your complete external fractional Chief Technology & Marketing Team.', features: ['Everything in Co-Pilot Growth', 'Weekly High-Level Growth Consulting Call', 'Unlimited Minor System & UI Adjustments', 'New AI Workflow Builds & Automations', 'Bespoke Cold Email/Marketing System setups', 'Direct Slack Hotline to Core Founders'], cta: 'Initiate Audit', featured: false, tag: 'Revenue Engine' },
  ],
}

export default function ContentPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<SectionKey>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sectionData, setSectionData] = useState<any>(null)
  const [rawJson, setRawJson] = useState<string>('')
  const [editMode, setEditMode] = useState<'form' | 'json'>('form')
  const [toast, setToast] = useState<string | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const fetchSection = useCallback(async (key: SectionKey) => {
    setLoading(true)
    setJsonError(null)
    const { data, error } = await supabase
      .from('website_content')
      .select('*')
      .eq('section_key', key)
      .single()

    if (error || !data) {
      // Use defaults if not in DB yet
      setSectionData(DEFAULT_SECTIONS[key])
      setRawJson(JSON.stringify(DEFAULT_SECTIONS[key], null, 2))
    } else {
      setSectionData(data.content)
      setRawJson(JSON.stringify(data.content, null, 2))
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchSection(activeTab)
  }, [activeTab, fetchSection])

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...sectionData, [field]: value }
    setSectionData(updated)
    setRawJson(JSON.stringify(updated, null, 2))
  }

  const handleJsonChange = (val: string) => {
    setRawJson(val)
    try {
      const parsed = JSON.parse(val)
      setSectionData(parsed)
      setJsonError(null)
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON format')
    }
  }

  const handleSave = async () => {
    if (jsonError) {
      showToast('Cannot save. Please fix JSON formatting errors.')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    // Map UI tab keys to actual section_key values in the DB
    const dbKey = activeTab === 'pricing_setup' ? 'pricing_setup_tiers'
      : activeTab === 'pricing_retainer' ? 'pricing_retainer_tiers'
      : activeTab

    const { error } = await supabase
      .from('website_content')
      .upsert(
        {
          section_key: dbKey,
          content: sectionData,
          updated_at: new Date().toISOString(),
          updated_by: user?.id || null
        },
        { onConflict: 'section_key' }
      )

    setSaving(false)
    if (error) {
      showToast(`Error saving: ${error.message}`)
    } else {
      showToast(`Section "${activeTab}" saved successfully.`)
      // Trigger on-demand cache revalidation for pricing pages
      if (activeTab === 'pricing_setup' || activeTab === 'pricing_retainer') {
        try {
          await fetch('/api/revalidate-pricing', {
            method: 'POST',
            headers: { 'x-admin-key': 'mercian-wealth-admin-revalidate' },
          })
        } catch {
          // Non-fatal — the 60s background revalidation will still pick it up
        }
      }
    }
  }

  const resetToDefault = () => {
    if (window.confirm('Reset this section to its default templates? Unsaved changes will be lost.')) {
      setSectionData(DEFAULT_SECTIONS[activeTab])
      setRawJson(JSON.stringify(DEFAULT_SECTIONS[activeTab], null, 2))
      setJsonError(null)
      showToast('Reset to default template values.')
    }
  }

  const isPricingTab = activeTab === 'pricing_setup' || activeTab === 'pricing_retainer'

  // Per-tier save for pricing mode
  const handleSaveTier = async (tierIndex: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    const tiers = Array.isArray(sectionData) ? [...sectionData] : []
    const dbKey = activeTab === 'pricing_setup' ? 'pricing_setup_tiers' : 'pricing_retainer_tiers'
    const { error } = await supabase
      .from('website_content')
      .upsert(
        { section_key: dbKey, content: tiers, updated_at: new Date().toISOString(), updated_by: user?.id || null },
        { onConflict: 'section_key' }
      )
    if (error) {
      showToast(`Error saving tier: ${error.message}`)
    } else {
      showToast(`Tier "${tiers[tierIndex]?.name}" saved successfully.`)
      try {
        await fetch('/api/revalidate-pricing', {
          method: 'POST',
          headers: { 'x-admin-key': 'mercian-wealth-admin-revalidate' },
        })
      } catch { /* non-fatal */ }
    }
  }

  const updateTierField = (tierIndex: number, field: string, value: any) => {
    const tiers = Array.isArray(sectionData) ? [...sectionData] : []
    tiers[tierIndex] = { ...tiers[tierIndex], [field]: value }
    setSectionData(tiers)
    setRawJson(JSON.stringify(tiers, null, 2))
  }

  const updateTierFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const tiers = Array.isArray(sectionData) ? [...sectionData] : []
    const features = [...(tiers[tierIndex]?.features ?? [])]
    features[featureIndex] = value
    updateTierField(tierIndex, 'features', features)
  }

  const addTierFeature = (tierIndex: number) => {
    const tiers = Array.isArray(sectionData) ? [...sectionData] : []
    const features = [...(tiers[tierIndex]?.features ?? []), '']
    updateTierField(tierIndex, 'features', features)
  }

  const removeTierFeature = (tierIndex: number, featureIndex: number) => {
    const tiers = Array.isArray(sectionData) ? [...sectionData] : []
    const features = [...(tiers[tierIndex]?.features ?? [])]
    features.splice(featureIndex, 1)
    updateTierField(tierIndex, 'features', features)
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-gold/80 uppercase">
            <Sparkles size={12} /> Customiser CMS Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">Website Content</h1>
          <p className="text-sm text-muted-foreground">Modify landing page text and configuration values instantly.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <div className="bg-card border border-gold/15 rounded-xl p-0.5 flex">
            <button
              onClick={() => setEditMode('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                editMode === 'form' ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={13} /> Visual Editor
            </button>
            <button
              onClick={() => setEditMode('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                editMode === 'json' ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileJson size={13} /> Raw JSON
            </button>
          </div>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-gold/15 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all cursor-pointer"
            title="Reset to static template values"
          >
            <RefreshCw size={13} /> Reset Section
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!jsonError}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-xs font-bold disabled:opacity-50 hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        {(['hero', 'cta', 'process', 'faq', 'footer', 'pricing_setup', 'pricing_retainer'] as SectionKey[]).map((tab) => {
          const labels: Record<SectionKey, string> = {
            hero: 'Hero',
            cta: 'CTA',
            process: 'Process',
            faq: 'FAQ',
            footer: 'Footer',
            pricing_setup: 'Setup Tiers',
            pricing_retainer: 'Retainer Tiers'
          }
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {labels[tab]}
            </button>
          )
        })}
      </div>


      {loading ? (
        <div className="glass rounded-2xl border border-gold/10 p-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="text-gold animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Retrieving content structure...</p>
        </div>
      ) : editMode === 'json' ? (
        <div className="space-y-3">
          {jsonError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-xl flex items-center gap-2">
              <AlertTriangle size={14} />
              <span>{jsonError}</span>
            </div>
          )}
          <textarea
            value={rawJson}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={20}
            className="w-full font-mono text-xs bg-background/80 border border-gold/15 rounded-2xl p-5 text-foreground outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
      ) : (
        <div className="glass rounded-2xl border border-gold/10 p-6 space-y-6">
          {/* Render layout forms depending on tab */}
          {activeTab === 'hero' && sectionData && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Badge Text</label>
                <input
                  value={sectionData.badge ?? ''}
                  onChange={(e) => handleFieldChange('badge', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Main Hero Title</label>
                <input
                  value={sectionData.title ?? ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hero Subtitle</label>
                <textarea
                  value={sectionData.subtitle ?? ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  rows={3}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Primary CTA Button</label>
                <input
                  value={sectionData.primary_cta ?? ''}
                  onChange={(e) => handleFieldChange('primary_cta', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Secondary CTA Button</label>
                <input
                  value={sectionData.secondary_cta ?? ''}
                  onChange={(e) => handleFieldChange('secondary_cta', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          )}

          {activeTab === 'cta' && sectionData && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">CTA Section Title</label>
                <input
                  value={sectionData.title ?? ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">CTA Section Subtitle</label>
                <textarea
                  value={sectionData.subtitle ?? ''}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  rows={3}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">CTA Button Text</label>
                <input
                  value={sectionData.button_text ?? ''}
                  onChange={(e) => handleFieldChange('button_text', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          )}

          {activeTab === 'process' && sectionData && sectionData.steps && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gold flex items-center gap-1.5"><Sparkles size={14} /> Workflow Steps</h3>
                <button
                  onClick={() => {
                    const steps = [...(sectionData.steps || [])]
                    const stepNum = String(steps.length + 1).padStart(2, '0')
                    steps.push({ step: stepNum, title: 'New Step', desc: '' })
                    handleFieldChange('steps', steps)
                  }}
                  className="text-xs font-bold text-gold hover:text-gold-light border border-gold/20 hover:border-gold/45 rounded-lg px-3 py-1.5 bg-white/5 transition-all"
                >
                  + Add Step
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {(sectionData.steps as any[]).map((stepObj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-gold/10 relative space-y-4">
                    <button
                      type="button"
                      onClick={() => {
                        const steps = [...sectionData.steps]
                        steps.splice(idx, 1)
                        const resequenced = steps.map((s, i) => ({ ...s, step: String(i + 1).padStart(2, '0') }))
                        handleFieldChange('steps', resequenced)
                      }}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-xs font-bold"
                    >
                      Delete
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 text-xs font-bold text-gold flex items-center justify-center shrink-0">
                        {stepObj.step}
                      </span>
                      <input
                        value={stepObj.title ?? ''}
                        onChange={(e) => {
                          const steps = [...sectionData.steps]
                          steps[idx] = { ...stepObj, title: e.target.value }
                          handleFieldChange('steps', steps)
                        }}
                        placeholder="Step Title"
                        className="w-full bg-background/60 border border-gold/10 hover:border-gold/20 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none transition-all"
                      />
                    </div>
                    <textarea
                      value={stepObj.desc ?? ''}
                      onChange={(e) => {
                        const steps = [...sectionData.steps]
                        steps[idx] = { ...stepObj, desc: e.target.value }
                        handleFieldChange('steps', steps)
                      }}
                      placeholder="Step Description"
                      rows={2}
                      className="w-full bg-background/60 border border-gold/10 hover:border-gold/20 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none transition-all resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && sectionData && sectionData.items && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gold flex items-center gap-1.5"><Sparkles size={14} /> Questions &amp; Answers</h3>
                <button
                  onClick={() => {
                    const items = [...(sectionData.items || [])]
                    items.push({ q: 'New Question', a: '' })
                    handleFieldChange('items', items)
                  }}
                  className="text-xs font-bold text-gold hover:text-gold-light border border-gold/20 hover:border-gold/45 rounded-lg px-3 py-1.5 bg-white/5 transition-all"
                >
                  + Add Q&amp;A
                </button>
              </div>
              <div className="space-y-4">
                {(sectionData.items as any[]).map((faqItem, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-gold/10 relative space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        const items = [...sectionData.items]
                        items.splice(idx, 1)
                        handleFieldChange('items', items)
                      }}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-300 text-xs font-bold"
                    >
                      Delete
                    </button>
                    <div className="space-y-1.5">
                      <label className="text-xxs font-bold text-muted-foreground uppercase tracking-widest">Question {idx + 1}</label>
                      <input
                        value={faqItem.q ?? ''}
                        onChange={(e) => {
                          const items = [...sectionData.items]
                          items[idx] = { ...faqItem, q: e.target.value }
                          handleFieldChange('items', items)
                        }}
                        className="w-full bg-background/60 border border-gold/10 hover:border-gold/20 rounded-lg px-3 py-2 text-xs text-foreground outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xxs font-bold text-muted-foreground uppercase tracking-widest">Answer</label>
                      <textarea
                        value={faqItem.a ?? ''}
                        onChange={(e) => {
                          const items = [...sectionData.items]
                          items[idx] = { ...faqItem, a: e.target.value }
                          handleFieldChange('items', items)
                        }}
                        rows={2}
                        className="w-full bg-background/60 border border-gold/10 hover:border-gold/20 rounded-lg px-3 py-2 text-xs text-foreground outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'footer' && sectionData && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Copyright Notice</label>
                <input
                  value={sectionData.copyright ?? ''}
                  onChange={(e) => handleFieldChange('copyright', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact Email</label>
                <input
                  type="email"
                  value={sectionData.email ?? ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact Phone</label>
                <input
                  value={sectionData.phone ?? ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Agency Address</label>
                <input
                  value={sectionData.address ?? ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Twitter Link</label>
                <input
                  value={sectionData.twitter_url ?? ''}
                  onChange={(e) => handleFieldChange('twitter_url', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">LinkedIn Link</label>
                <input
                  value={sectionData.linkedin_url ?? ''}
                  onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                  className="w-full bg-background/60 border border-gold/15 hover:border-gold/25 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* â”€â”€ Pricing Tier Editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {isPricingTab && sectionData && Array.isArray(sectionData) && editMode === 'form' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <DollarSign size={15} className="text-gold" />
                <p className="text-xs font-bold uppercase tracking-widest text-gold/80">
                  {activeTab === 'pricing_setup' ? 'One-Time Setup Fee Tiers' : 'Monthly Retainer Tiers'}
                </p>
                <span className="ml-auto text-[10px] text-muted-foreground bg-gold/5 border border-gold/10 px-2 py-1 rounded-lg">
                  Changes saved per-tier — public page updates instantly
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {(sectionData as PricingTier[]).map((tier, tierIdx) => (
                  <div key={tier.id ?? tierIdx} className="rounded-2xl border border-gold/15 bg-white/[0.015] p-5 space-y-4 flex flex-col">

                    {/* Tier header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gold/60">Tier {tierIdx + 1}</p>
                        <input
                          value={tier.name ?? ''}
                          onChange={(e) => updateTierField(tierIdx, 'name', e.target.value)}
                          className="w-full bg-transparent border-b border-gold/20 focus:border-gold/50 py-1 text-sm font-bold text-foreground outline-none transition-all"
                          placeholder="Tier Name"
                        />
                      </div>
                      <button
                        type="button"
                        title={tier.featured ? 'Remove featured badge' : 'Mark as featured'}
                        onClick={() => updateTierField(tierIdx, 'featured', !tier.featured)}
                        className={`p-1.5 rounded-lg border transition-all shrink-0 mt-4 ${
                          tier.featured
                            ? 'bg-gold/15 border-gold/40 text-gold'
                            : 'bg-white/5 border-gold/10 text-muted-foreground hover:text-gold'
                        }`}
                      >
                        <Star size={13} fill={tier.featured ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Price (£)</label>
                        <div className="flex items-center border border-gold/15 hover:border-gold/30 rounded-xl bg-background/60 px-3 py-2 gap-1.5">
                          <span className="text-xs text-gold font-bold">£</span>
                          <input
                            value={tier.price ?? ''}
                            onChange={(e) => updateTierField(tierIdx, 'price', e.target.value)}
                            className="w-full bg-transparent text-xs text-foreground outline-none font-mono"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Interval / Deposit</label>
                        <input
                          value={tier.interval ?? ''}
                          onChange={(e) => updateTierField(tierIdx, 'interval', e.target.value)}
                          className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all"
                          placeholder="e.g. £687.50 deposit"
                        />
                      </div>
                    </div>

                    {/* Milestone (only for setup) */}
                    {activeTab === 'pricing_setup' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Milestone Breakdown</label>
                        <input
                          value={tier.milestoneBreakdown ?? ''}
                          onChange={(e) => updateTierField(tierIdx, 'milestoneBreakdown', e.target.value)}
                          className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all"
                          placeholder="e.g. 4 stages of 25%..."
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                      <textarea
                        value={tier.description ?? ''}
                        onChange={(e) => updateTierField(tierIdx, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all resize-none"
                        placeholder="Tier description..."
                      />
                    </div>

                    {/* CTA */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">CTA Button Text</label>
                      <input
                        value={tier.cta ?? ''}
                        onChange={(e) => updateTierField(tierIdx, 'cta', e.target.value)}
                        className="w-full bg-background/60 border border-gold/15 hover:border-gold/30 rounded-xl px-3 py-2 text-xs text-foreground outline-none transition-all"
                        placeholder="e.g. Request Alignment"
                      />
                    </div>

                    {/* Features */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Features ({tier.features?.length ?? 0})</label>
                        <button
                          type="button"
                          onClick={() => addTierFeature(tierIdx)}
                          className="flex items-center gap-1 text-[9px] font-bold text-gold hover:text-gold-light border border-gold/20 rounded-lg px-2 py-1 bg-white/5 transition-all"
                        >
                          <Plus size={10} /> Add
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {(tier.features ?? []).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5">
                            <span className="text-gold text-[10px] shrink-0">✓</span>
                            <input
                              value={feat}
                              onChange={(e) => updateTierFeature(tierIdx, fIdx, e.target.value)}
                              className="flex-1 min-w-0 bg-background/40 border border-gold/10 hover:border-gold/25 rounded-lg px-2.5 py-1.5 text-xs text-foreground outline-none transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => removeTierFeature(tierIdx, fIdx)}
                              className="p-1 text-muted-foreground hover:text-red-400 transition-colors shrink-0"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview strip */}
                    <div className="rounded-xl border border-gold/8 bg-black/30 p-3 space-y-1">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-gold/40 mb-2">Live Preview</p>
                      <p className="text-xs font-bold text-foreground">{tier.name || '—'}</p>
                      <p className="text-xl font-mono font-black text-gold">£{tier.price || '0'}</p>
                      <p className="text-[10px] text-muted-foreground">{tier.interval || '—'}</p>
                      <div className="mt-1.5 space-y-0.5">
                        {(tier.features ?? []).slice(0, 3).map((f, i) => (
                          <p key={i} className="text-[9px] text-muted-foreground flex items-center gap-1"><span className="text-gold">✓</span>{f}</p>
                        ))}
                        {(tier.features?.length ?? 0) > 3 && (
                          <p className="text-[9px] text-gold/50">+{(tier.features?.length ?? 0) - 3} more features</p>
                        )}
                      </div>
                    </div>

                    {/* Per-tier save */}
                    <button
                      type="button"
                      onClick={() => handleSaveTier(tierIdx)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-gold/80 to-gold text-background text-xs font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all"
                    >
                      <Save size={12} /> Save {tier.name || 'Tier'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
