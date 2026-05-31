'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, RefreshCw, AlertTriangle, Check, Layers, FileJson, Sparkles } from 'lucide-react'

type SectionKey = 'hero' | 'cta' | 'process' | 'faq' | 'footer'

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
      { step: '04', title: 'Deployment & Scaling', desc: 'Going live, optimizing speed, and establishing database pipelines.' },
    ]
  },
  faq: {
    items: [
      { q: 'How long does a standard web project take?', a: 'Typically 3 to 6 weeks depending on complex integrations like custom AI agents or dashboard logins.' },
      { q: 'Can you integrate custom AI chatbots with our existing system?', a: 'Yes. We program custom workflows that interface with CRM databases, calendar booking systems, and live agent handoffs.' },
      { q: 'Do you charge a recurring fee?', a: 'No. We build custom bespoke setups where you own the intellectual property. Any optional maintenance packages are quoted separately.' },
    ]
  },
  footer: {
    copyright: '© 2026 GS Legacy Wealth AI. All rights reserved.',
    email: 'agency@gslegacywealth.ai',
    phone: '+1 (555) 019-2831',
    address: 'London, UK',
    twitter_url: 'https://twitter.com',
    linkedin_url: 'https://linkedin.com',
  }
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

    const { error } = await supabase
      .from('website_content')
      .upsert(
        {
          section_key: activeTab,
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

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 left-4 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-sm font-medium text-green-400 shadow-xl flex items-center gap-2">
          <Check size={14} /> {toast}
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xxs font-bold uppercase tracking-[0.3em] text-gold/70">Customizer</p>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-1">Website Content</h1>
          <p className="text-sm text-muted-foreground mt-1">Modify landing page text and configuration values instantly.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-gold/15 rounded-xl p-0.5 flex">
            <button
              onClick={() => setEditMode('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                editMode === 'form' ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={13} /> Visual Editor
            </button>
            <button
              onClick={() => setEditMode('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                editMode === 'json' ? 'bg-gold text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileJson size={13} /> Raw JSON
            </button>
          </div>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-gold/15 text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
            title="Reset to static template values"
          >
            <RefreshCw size={13} /> Reset Section
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!jsonError}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-light text-background text-sm font-bold disabled:opacity-50 hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold/10 overflow-x-auto scrollbar-none gap-2">
        {(['hero', 'cta', 'process', 'faq', 'footer'] as SectionKey[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 border-b-2 text-sm font-semibold capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'border-gold text-gold bg-gold/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
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
                        // re-sequence step numbering
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
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gold flex items-center gap-1.5"><Sparkles size={14} /> Questions & Answers</h3>
                <button
                  onClick={() => {
                    const items = [...(sectionData.items || [])]
                    items.push({ q: 'New Question', a: '' })
                    handleFieldChange('items', items)
                  }}
                  className="text-xs font-bold text-gold hover:text-gold-light border border-gold/20 hover:border-gold/45 rounded-lg px-3 py-1.5 bg-white/5 transition-all"
                >
                  + Add Q&A
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
        </div>
      )}
    </div>
  )
}
