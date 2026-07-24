'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserNotificationCenter } from '@/components/dashboard/user-notification-center'
import { Watermark } from '@/components/watermark'
import {
  Calendar,
  ArrowRight,
  Compass,
  Clock,
  User,
  Sparkles,
  LogOut,
  CheckCircle2,
  FileText,
  Upload,
  BarChart3,
  Globe,
  Phone,
  Building2,
  Lock,
  ShieldCheck,
  Briefcase,
  Zap,
  Loader2,
  LayoutDashboard,
  FolderOpen,
  TrendingUp,
  CheckCheck,
  X,
  ExternalLink,
} from 'lucide-react'

type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  role: string
  phone_number: string | null
}

type Lead = {
  id: string
  name: string
  business_name: string
  email: string
  phone: string | null
  website: string | null
  service_interested: string | null
  status: string
}

type Project = {
  id: string
  client_name: string
  project_name: string
  description: string | null
  service_type: string | null
  status: string
  start_date: string | null
  target_launch_date: string | null
}

type Asset = {
  id: string
  file_name: string
  file_url: string
  file_size: number | null
  file_type: string | null
  created_at: string
}

type Session = {
  id: string
  lead_id: string | null
  calendly_event_id: string | null
  scheduled_at: string
  status: 'Scheduled' | 'Canceled' | 'No Show' | 'Completed'
  notes: string | null
  outcomes: string | null
}

interface DashboardClientContainerProps {
  profile: Profile
  lead: Lead | null
  project: Project | null
  initialAssets: Asset[]
  testimonials?: any[]
  portfolioItems?: any[]
  initialSession?: Session | null
  defaultTab?: 'overview' | 'profile' | 'vault'
}

// ─── Tab Definitions ──────────────────────────────────────────────────────────
type ClientTab = 'overview' | 'assets' | 'insights'
type UserTab = 'overview' | 'profile' | 'vault'

export default function DashboardClientContainer({
  profile,
  lead: initialLead,
  project,
  initialAssets,
  testimonials = [],
  portfolioItems = [],
  initialSession = null,
  defaultTab = 'overview',
}: DashboardClientContainerProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local States
  const [lead, setLead] = useState<Lead | null>(initialLead)
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Lead Info Edit State
  const [businessName, setBusinessName] = useState(lead?.business_name || '')
  const [phone, setPhone] = useState(lead?.phone || profile.phone_number || '')
  const [website, setWebsite] = useState(lead?.website || '')
  const [service, setService] = useState(lead?.service_interested || 'AI Automation')
  const [savingLead, setSavingLead] = useState(false)
  const [leadSuccessMsg, setLeadSuccessMsg] = useState<string | null>(null)

  // Tabs
  const [clientTab, setClientTab] = useState<ClientTab>('overview')
  const [userTab, setUserTab] = useState<UserTab>(defaultTab)

  useEffect(() => {
    if (defaultTab) {
      setUserTab(defaultTab)
    }
  }, [defaultTab])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingLead(true)
    setLeadSuccessMsg(null)

    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    const email = lead?.email || (await supabase.auth.getUser()).data.user?.email || ''

    if (lead) {
      const { error } = await supabase
        .from('leads')
        .update({ business_name: businessName, phone, website, service_interested: service, updated_at: new Date().toISOString() })
        .eq('id', lead.id)

      if (error) {
        setLeadSuccessMsg('Error saving details.')
      } else {
        setLead((prev) => prev ? { ...prev, business_name: businessName, phone, website, service_interested: service } : null)
        setLeadSuccessMsg('Business details updated successfully!')
      }
    } else {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({ name: fullName || 'Registered User', business_name: businessName || 'To Be Specified', email, phone: phone || null, website: website || null, service_interested: service, status: 'New', source: 'dashboard' })
        .select().single()

      if (error) { setLeadSuccessMsg('Error creating lead entry.') }
      else { setLead(newLead); setLeadSuccessMsg('Business details registered with CRM!') }
    }
    setSavingLead(false)
    setTimeout(() => setLeadSuccessMsg(null), 4000)
  }

  const handleFileUpload = async (file: File) => {
    if (!project) return
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    const { data: newAsset, error } = await supabase
      .from('project_assets')
      .insert({
        project_id: project.id,
        file_name: file.name,
        file_url: `https://ladebhmyywkcqtyazxxk.supabase.co/storage/v1/object/public/assets/${file.name}`,
        file_size: file.size,
        file_type: file.type || file.name.split('.').pop() || 'file',
        uploaded_by: profile.id,
      })
      .select().single()

    if (error) {
      setUploadError('Could not register asset: ' + error.message)
    } else if (newAsset) {
      setAssets((prev) => [newAsset, ...prev])
      setUploadSuccess(`"${file.name}" registered successfully.`)
    }
    setIsUploading(false)
    setTimeout(() => setUploadSuccess(null), 4000)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'Discovery': return 20
      case 'Design': return 40
      case 'Development': return 60
      case 'Revision': return 80
      case 'Complete': return 100
      default: return 10
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl w-full mx-auto space-y-6 relative z-10 flex-1">
      {/* ── Page Heading ─────────────────────────────────────────────────── */}
      <div className="space-y-1 pb-6 border-b border-gold/15">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
          <Sparkles size={12} className="animate-pulse" />
          {profile.role === 'client' ? 'Active Client Suite' : 'Cohort Intake Vetting'}
        </div>
        <h1 className="hidden sm:block text-2xl sm:text-3xl font-serif font-bold text-foreground">
          {profile.role === 'client' ? `${getGreeting()}, ${profile.first_name || 'Partner'}` : 'Qualified Sandbox Intake'}
        </h1>
        <p className="text-xs text-muted-foreground max-w-md">
          {profile.role === 'client'
            ? 'Track your live AI project, deliverables, and asset pipeline.'
            : 'Temporary sandbox clearance active. We accept exactly 3 priority build mandates monthly. Request a briefing below to secure your allocation.'}
        </p>
      </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CLIENT DASHBOARD (tabbed)
        ════════════════════════════════════════════════════════════════════ */}
        {profile.role === 'client' && (
          <div className="space-y-6 animate-fade-in">

            {/* Tab Bar */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/8 rounded-xl w-fit">
              {([
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'assets', label: 'Assets', icon: FolderOpen },
                { id: 'insights', label: 'Analytics', icon: TrendingUp },
              ] as { id: ClientTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setClientTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    clientTab === id
                      ? 'bg-gold/15 text-gold border border-gold/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* ── Overview Tab ──────────────────────────────────────────── */}
            {clientTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Progress Card */}
                <section className="p-5 sm:p-8 glass rounded-2xl border border-gold/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                        {project ? project.project_name : 'Project Workspace'}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Service: <span className="text-gold font-semibold">{project?.service_type || 'Luxury Development'}</span>
                      </p>
                    </div>
                    {project && (
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-xxs uppercase tracking-widest text-muted-foreground">Target Launch</p>
                        <p className="text-sm font-bold text-gold mt-0.5 font-mono">
                          {project.target_launch_date
                            ? new Date(project.target_launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'TBD'}
                        </p>
                      </div>
                    )}
                  </div>

                  {project ? (
                    <div className="space-y-5">
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-foreground">
                          <span>Pipeline Progress</span>
                          <span className="text-gold font-mono">{getProgressPercentage(project.status)}%</span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden border border-gold/10">
                          <div
                            className="bg-gradient-to-r from-gold via-gold-light to-gold h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                            style={{ width: `${getProgressPercentage(project.status)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stage pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {['Discovery', 'Design', 'Development', 'Revision', 'Complete'].map((stage, idx) => {
                          const stages = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']
                          const activeIdx = stages.indexOf(project.status)
                          const isCompleted = stages.indexOf(stage) < activeIdx
                          const isActive = stage === project.status
                          return (
                            <div
                              key={stage}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                isCompleted
                                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                  : isActive
                                  ? 'bg-gold/15 border-gold/40 text-gold shadow-[0_0_8px_rgba(212,175,55,0.2)] animate-pulse'
                                  : 'bg-white/[0.03] border-white/8 text-muted-foreground/60'
                              }`}
                            >
                              {isCompleted && <CheckCheck size={10} />}
                              {idx + 1}. {stage}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock size={28} className="text-gold/20 mb-2 animate-spin" />
                      <h4 className="text-sm font-semibold text-foreground">Workspace Initializing</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        Our team is configuring your project milestones. Check back shortly.
                      </p>
                    </div>
                  )}
                </section>

                {/* Quick actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Upload Asset', sub: 'Send brand files or briefs', icon: Upload, action: () => setClientTab('assets') },
                    { label: 'View Analytics', sub: 'Live automation metrics', icon: BarChart3, action: () => setClientTab('insights') },
                    { label: 'Book Call', sub: 'Schedule a check-in', icon: Calendar, href: '/dashboard/book' },
                  ].map((item) => (
                    item.href ? (
                      <Link key={item.label} href={item.href}
                        className="p-4 sm:p-5 glass rounded-xl border border-gold/10 hover:border-gold/25 transition-all group flex items-center gap-4">
                        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold/15 transition-all">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                      </Link>
                    ) : (
                      <button key={item.label} onClick={item.action}
                        className="p-4 sm:p-5 glass rounded-xl border border-gold/10 hover:border-gold/25 transition-all group flex items-center gap-4 w-full text-left">
                        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold/15 transition-all">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* ── Assets Tab ────────────────────────────────────────────── */}
            {clientTab === 'assets' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Upload Zone */}
                  <section className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                        <Upload size={16} className="text-gold" /> Upload Asset
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Upload brand files, briefs, logos, or ZIP packs.</p>
                    </div>

                    {project ? (
                      <div className="space-y-3">
                        {/* Drag & Drop Zone */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() => !isUploading && fileInputRef.current?.click()}
                          className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                            dragOver
                              ? 'border-gold/60 bg-gold/5'
                              : 'border-gold/15 hover:border-gold/35 hover:bg-gold/[0.02] bg-background/20'
                          }`}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 size={28} className="text-gold animate-spin" />
                              <p className="text-xs font-semibold text-gold">Registering file…</p>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <Upload size={20} className="text-gold" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-foreground">Drop file here or click to select</p>
                                <p className="text-xs text-muted-foreground mt-0.5">PDF, PNG, ZIP, MP4 and more accepted</p>
                              </div>
                            </>
                          )}
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInputChange} />

                        {uploadSuccess && (
                          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-sm text-green-400">
                            <CheckCircle2 size={15} />
                            {uploadSuccess}
                          </div>
                        )}
                        {uploadError && (
                          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-sm text-red-400">
                            <X size={15} />
                            {uploadError}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-gold/10 rounded-xl text-center text-xs text-muted-foreground">
                        Awaiting project initialization before uploads are available.
                      </div>
                    )}
                  </section>

                  {/* Registered Assets */}
                  <section className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-foreground">Registered Assets</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Files available for design and development.</p>
                    </div>

                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                      {assets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 border border-gold/5 rounded-xl text-center">
                          <FileText size={24} className="text-gold/10 mb-2" />
                          <p className="text-xs text-muted-foreground">No assets uploaded yet.</p>
                        </div>
                      ) : assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="p-3 sm:p-3.5 rounded-xl bg-background/40 border border-gold/8 hover:border-gold/20 flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 text-gold shrink-0">
                              <FileText size={13} />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-semibold text-foreground truncate">{asset.file_name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                {formatFileSize(asset.file_size)} · {new Date(asset.created_at).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>
                          <a
                            href={asset.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-gold/5 border border-gold/15 text-[10px] font-bold text-gold hover:bg-gold/10 transition-all shrink-0"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* ── Insights Tab ──────────────────────────────────────────── */}
            {clientTab === 'insights' && (
              <div className="space-y-6">
                <section className="p-5 sm:p-6 glass rounded-2xl border border-gold/10 space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                      <BarChart3 size={16} className="text-gold" /> AI Core Performance
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Live automation analytics once your systems go live.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Work Hours Saved', value: '42.5 hrs', sub: 'This billing period', accent: 'text-green-400', bg: 'bg-green-500/5 border-green-500/15' },
                      { label: 'AI Chat Sessions', value: '387', sub: '94% resolution rate', accent: 'text-gold', bg: 'bg-gold/5 border-gold/15' },
                      { label: 'Avg Response Time', value: '1.4s', sub: 'vs 14 min manual', accent: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/15' },
                    ].map((stat) => (
                      <div key={stat.label} className={`p-4 sm:p-5 rounded-xl border space-y-2 ${stat.bg}`}>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</p>
                        <h4 className={`text-2xl font-serif font-bold ${stat.accent}`}>{stat.value}</h4>
                        <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <Lock size={16} className="text-gold/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Full analytics dashboard activates when your AI systems go live.</p>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            USER / PROSPECT DASHBOARD (tabbed)
        ════════════════════════════════════════════════════════════════════ */}
        {profile.role !== 'client' && (
          <div className="space-y-10 animate-fade-in">

            {/* Tab Bar */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/8 rounded-xl w-fit overflow-x-auto">
              {([
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'profile', label: 'Business Profile', icon: Building2 },
                { id: 'vault', label: 'Authority Vault', icon: Zap },
              ] as { id: UserTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setUserTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    userTab === id
                      ? 'bg-gold/15 text-gold border border-gold/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* ── Overview Tab ──────────────────────────────────────────── */}
            {userTab === 'overview' && (
              <div className="space-y-8">
                {/* Onboarding Overview Status */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 glass rounded-xl border border-gold/10 hover:border-gold/20 transition-all space-y-3">
                    <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <User size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Security Clearance</p>
                      <h3 className="text-base font-serif font-bold text-foreground mt-0.5">Sandbox Access</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-bold text-gold uppercase tracking-wider">
                      Vetting Pending
                    </span>
                  </div>

                  <div className="p-5 glass rounded-xl border border-gold/10 hover:border-gold/20 transition-all space-y-3">
                    <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Compass size={16} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">CRM Pipeline Status</p>
                      <h3 className="text-base font-serif font-bold text-foreground mt-0.5">{lead ? lead.status : 'Unregistered Sandbox'}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {lead?.status === 'New' && 'Analyzing preliminary account parameters.'}
                      {lead?.status === 'Contacted' && 'Vetting stage active. Inspect your communication log.'}
                      {lead?.status === 'Call Booked' && 'Operational alignment audit confirmed.'}
                      {!lead && 'Submit operational parameters to initialize CRM record.'}
                    </p>
                  </div>
                </div>

                {/* VIP Strategy Session Spotlight / Scheduled Session */}
                {session && session.status === 'Scheduled' ? (
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/25 relative overflow-hidden space-y-5">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <CheckCircle2 size={120} className="text-green-500" />
                    </div>
                    
                    <div className="space-y-2 max-w-lg">
                      <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                        Strategy Session Scheduled
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        Your Vetting Session is Confirmed
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We have allocated an integration engineering slot for you. Your session is scheduled for:
                      </p>
                      <div className="p-4 rounded-xl bg-black/40 border border-gold/10 inline-block font-mono text-sm text-gold mt-1">
                        {new Date(session.scheduled_at).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                      <Link
                        href="/dashboard/book"
                        className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Reschedule / Modify Call
                      </Link>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Sparkles size={12} className="text-gold animate-pulse" /> Meeting link has been dispatched to your email
                      </div>
                    </div>
                  </div>
                ) : lead?.status === 'Call Booked' ? (
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-400" /> Operational Audit Confirmed
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Your session allocation is locked. Our lead architect is analyzing your preliminary business parameters to isolate margin friction prior to the call.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 border border-green-500/25 rounded-lg text-green-400 text-xs font-bold font-mono">
                      Allocated
                    </span>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gold/15 to-transparent border border-gold/25 relative overflow-hidden space-y-6">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Calendar size={120} className="text-gold" />
                    </div>
                    
                    <div className="space-y-2 max-w-lg">
                      <span className="px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-bold text-gold uppercase tracking-wider">
                        Allocation Vetting
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        Request System Architecture Alignment & Allocation
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To maintain system integrity and throughput, we restrict monthly client intake to exactly 3 priority builds. In this 30-minute operational audit with our engineering lead, we will map your structural bottlenecks and draft a custom telemetry flowchart (valued at £1,500).
                      </p>
                    </div>

                    {lead?.business_name ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider">
                          <CheckCircle2 size={14} className="text-green-400" /> Enterprise parameters registered.
                        </div>
                        <Link
                          href="/dashboard/book"
                          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-serif font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
                        >
                          Open Visual Booking Calendar <ArrowRight size={13} />
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link
                          href="/dashboard/book"
                          className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          Book Vetting Session Now <ArrowRight size={13} />
                        </Link>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Sparkles size={12} className="text-gold animate-pulse" /> Vetted alignment only · Strictly limited bandwidth allocations
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* The Blueprint Journey & Locked Suite Grid */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left: Locked Dashboard Gamification */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Operational Telemetry Suite</h3>
                    
                    <div className="relative rounded-2xl border border-gold/10 overflow-hidden bg-white/[0.01]">
                      {/* Blur overlay */}
                      <div className="absolute inset-0 bg-[#050505]/75 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-3 animate-pulse shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                          <Lock className="text-gold" size={20} />
                        </div>
                        <h4 className="font-serif text-sm font-bold text-foreground">Interactive Development Telemetry</h4>
                        <p className="text-[10px] text-muted-foreground mt-2 max-w-xs leading-relaxed">
                          Provisioning active systems triggers sub-second staging render channels, database schema mapping, and automated asset delivery pipelines here.
                        </p>
                        {lead?.status !== 'Call Booked' ? (
                          <Link href="/dashboard/book" className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold text-background text-[10px] font-bold hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
                            Apply for Vetting to Unlock <ArrowRight size={10} />
                          </Link>
                        ) : (
                          <span className="mt-4 px-2.5 py-1 rounded bg-gold/10 border border-gold/25 text-gold text-[9px] font-semibold">
                            Awaiting Vetting Audit Outcome
                          </span>
                        )}
                      </div>

                      {/* Dummy background content resembling client suite */}
                      <div className="p-5 opacity-20 select-none pointer-events-none space-y-4">
                        <div className="h-3 w-1/4 bg-white/20 rounded" />
                        <div className="p-3 border border-white/10 rounded-xl space-y-3">
                          <div className="h-4 w-1/3 bg-white/20 rounded" />
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className="bg-white/30 h-full rounded-full w-2/3" />
                          </div>
                          <div className="flex gap-2">
                            <div className="h-4 w-12 bg-white/20 rounded-full" />
                            <div className="h-4 w-12 bg-white/20 rounded-full" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 border border-white/10 rounded-xl h-16" />
                          <div className="p-3 border border-white/10 rounded-xl h-16" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: The Blueprint Journey Stepper */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Mandate Activation Blueprint</h3>
                    
                    <section className="p-5 glass rounded-2xl border border-gold/10 space-y-5">
                      <div className="relative border-l border-gold/10 pl-6 ml-3 space-y-6 py-1">
                        {/* Step 1 */}
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                            <CheckCircle2 size={9} className="text-green-400" />
                          </div>
                          <h4 className="text-xs font-bold text-foreground">Step 1: Security Clearance Active</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Sandbox profile established and vetted.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border ${
                            lead?.business_name ? 'bg-green-500/20 border-green-500' : 'bg-gold/10 border-gold/30'
                          }`}>
                            {lead?.business_name
                              ? <CheckCircle2 size={9} className="text-green-400" />
                              : <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="text-xs font-bold text-foreground">Step 2: Define System Parameters</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {lead?.business_name ? `Parameters registered: "${lead.business_name}"` : 'Outline enterprise infrastructure bottleneck.'}
                              </p>
                            </div>
                            {!lead?.business_name && (
                              <button onClick={() => setUserTab('profile')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-gold/20 text-gold text-[10px] font-bold hover:bg-gold/10 transition-all self-start sm:self-auto shrink-0">
                                Complete <ArrowRight size={10} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                          <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border ${
                            lead?.status === 'Call Booked' ? 'bg-green-500/20 border-green-500' : 'bg-gold/10 border-gold animate-pulse'
                          }`}>
                            {lead?.status === 'Call Booked'
                              ? <CheckCircle2 size={9} className="text-green-400" />
                              : <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="text-xs font-bold text-foreground">Step 3: Secure Priority Briefing</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Strictly restricted to 2 priority cohort build allocations per cohort.</p>
                            </div>
                            {lead?.status !== 'Call Booked' && (
                              <Link href="/dashboard/book"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gold text-background font-bold text-[10px] hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all self-start sm:self-auto shrink-0">
                                Apply Now <ArrowRight size={10} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Objection Neutralization Parameters */}
                <section className="p-6 glass rounded-2xl border border-gold/10 space-y-6 bg-white/[0.01]">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-gold" /> System Parameters & Sovereignty Guarantees
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">We eliminate structural friction and address common objections transparently.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-5 text-xs">
                    <div className="space-y-2 border-r border-gold/10 pr-4 last:border-0">
                      <h4 className="font-serif font-bold text-foreground text-xs">Code & Data Sovereignty</h4>
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        Every system is engineered using containerized Next.js/Supabase architectures. You own 100% of the codebase and database sovereignty upon handover. Zero proprietary vendor lock-ins.
                      </p>
                    </div>
                    <div className="space-y-2 border-r border-gold/10 pr-4 last:border-0">
                      <h4 className="font-serif font-bold text-foreground text-xs">Capital Optimization</h4>
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        Our custom builds are capital assets, not recurring expenses. Autonomous qualifiers and conduits typically offset equivalent manual labor within 45 days of deployment.
                      </p>
                    </div>
                    <div className="space-y-2 last:border-0">
                      <h4 className="font-serif font-bold text-foreground text-sm">21-Day Launch Protocol</h4>
                      <p className="text-muted-foreground leading-relaxed text-[11px]">
                        To preserve system quality, we strictly limit capacity. We operate on a guaranteed 21-business-day timeline from strategic signoff to live telemetric testing. Waiting compounds operational drag.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Flagship Systems & Testimonials Showcase */}
                <div className="border-t border-gold/10 pt-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-foreground">Bespoke Deployments</h3>
                      <p className="text-xs text-muted-foreground">Verified production engines operating at sub-second render speeds with sovereign databases.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {portfolioItems && portfolioItems.length > 0 ? (
                      portfolioItems.map((item) => (
                        <div key={item.id} className="glass border border-gold/10 hover:border-gold/20 rounded-2xl overflow-hidden group transition-all flex flex-col justify-between">
                          <div className="relative h-40 w-full overflow-hidden bg-[#111]">
                            {item.cover_image ? (
                              <img src={item.cover_image} alt={item.project_name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gold/5">
                                <Globe className="text-gold/20" size={32} />
                              </div>
                            )}
                            <div className="absolute top-3 right-3 bg-[#050505]/80 backdrop-blur-md border border-gold/20 rounded-lg px-2.5 py-1 text-[9px] font-bold text-gold uppercase tracking-wider">
                              {item.industry || 'Bespoke Build'}
                            </div>
                          </div>
                          <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-foreground group-hover:text-gold transition-colors">{item.project_name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">{item.description}</p>
                            </div>
                            {item.website_link && (
                              <a href={item.website_link} target="_blank" rel="noopener noreferrer" className="pt-2 text-[10px] font-bold text-gold flex items-center gap-1.5 self-start hover:underline">
                                View System <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="glass border border-gold/10 hover:border-gold/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gold font-bold uppercase tracking-wider">Asset Management</span>
                            <h4 className="text-sm font-bold text-foreground">Sovereign Property Group</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Elite web asset integrating real-time investor telemetry, secure auth credentials, and automatic property briefings.
                            </p>
                          </div>
                          <span className="text-xxs text-gold font-bold flex items-center gap-1">
                            2.4x Engagement Lift
                          </span>
                        </div>
                        <div className="glass border border-gold/10 hover:border-gold/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Custom Strategy Suite</span>
                            <h4 className="text-sm font-bold text-foreground">Kensington Advisory Group</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Onboarding systems linked with predictive scoring algorithms, strategy bookings, and custom CRM dashboards.
                            </p>
                          </div>
                          <span className="text-xxs text-indigo-400 font-bold flex items-center gap-1">
                            +42% Booking Rate Lift
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Testimonial Panel */}
                  <div className="bg-white/[0.01] border border-gold/10 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                      <Sparkles size={11} className="text-gold" /> Partner Experiences
                    </h4>
                    {testimonials && testimonials.length > 0 ? (
                      <div className="space-y-5 divide-y divide-gold/10">
                        {testimonials.map((t, idx) => (
                          <div key={t.id} className={`space-y-2 ${idx > 0 ? 'pt-4' : ''}`}>
                            <p className="text-xs text-foreground italic leading-relaxed">
                              &ldquo;{t.testimonial}&rdquo;
                            </p>
                            <p className="text-[10px] text-muted-foreground font-semibold">
                              — {t.client_name}, {t.company || 'Partner'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-foreground italic leading-relaxed">
                          &ldquo;The strategy call alone was worth it — they identified critical onboarding bottlenecks we had missed for two years. Our system went live within 4 weeks and auto-nurtures leads seamlessly.&rdquo;
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold">
                          — Daniel K., Founder, Kensington Advisory
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Business Profile Tab ──────────────────────────────────── */}
            {userTab === 'profile' && (
              <div className="max-w-lg">
                <section className="p-5 sm:p-7 glass rounded-2xl border border-gold/10 space-y-5">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-foreground">Operational Parameters Vetting</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Provide detailed enterprise parameters to evaluate system configuration and alignment.</p>
                  </div>

                  <form onSubmit={handleSaveLeadDetails} className="space-y-4">
                    {[
                      { key: 'businessName', label: 'Business Name', icon: Building2, value: businessName, setter: setBusinessName, type: 'text', placeholder: 'e.g. Sovereign Realty Group', required: true },
                      { key: 'phone', label: 'Phone Number', icon: Phone, value: phone, setter: setPhone, type: 'tel', placeholder: '+44 7700 900077', required: false },
                      { key: 'website', label: 'Current Website (optional)', icon: Globe, value: website, setter: setWebsite, type: 'url', placeholder: 'https://yourwebsite.com', required: false },
                    ].map(({ key, label, icon: Icon, value, setter, type, placeholder, required }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Icon size={11} className="text-gold" /> {label}
                        </label>
                        <input
                          type={type}
                          required={required}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                        />
                      </div>
                    ))}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Briefcase size={11} className="text-gold" /> Primary Leverage Target
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none transition-all"
                      >
                        <option value="AI Automation" className="bg-[#0A0A0A]">AI Workflows & Integrations</option>
                        <option value="Luxury Custom Web" className="bg-[#0A0A0A]">Custom Luxury Design & Dev</option>
                        <option value="Executive CRM" className="bg-[#0A0A0A]">Elite CRM Setup & Systems</option>
                        <option value="Consulting" className="bg-[#0A0A0A]">AI Strategy Consultation</option>
                      </select>
                    </div>

                    {leadSuccessMsg && (
                      <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                        leadSuccessMsg.includes('Error') ? 'bg-red-500/10 border border-red-500/25 text-red-400' : 'bg-gold/10 border border-gold/20 text-gold'
                      }`}>
                        {leadSuccessMsg.includes('Error') ? <X size={14} /> : <CheckCircle2 size={14} />}
                        {leadSuccessMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={savingLead}
                      className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {savingLead ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      {savingLead ? 'Saving…' : 'Save Profile'}
                    </button>
                  </form>
                </section>
              </div>
            )}

            {/* ── Authority Vault Tab ───────────────────────────────────── */}
            {userTab === 'vault' && (
              <div className="space-y-4">
                <div className="space-y-0.5 mb-2">
                  <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                    <Zap size={16} className="text-gold" /> Authority Vault
                  </h3>
                  <p className="text-xs text-muted-foreground">Case studies from Mercian Wealth AI-powered systems.</p>
                </div>

                {[
                  { title: 'Sovereign AI Agent Core', desc: 'Automates 94% of standard incoming leads with custom voice/text models matching brand voice.', roi: '+42% Booking Rate', accent: 'text-gold' },
                  { title: 'Premium UX Digital Asset', desc: 'Engineered high-end fluid web designs and visual authority for capital funds, improving investor trust.', roi: '2.4× Engagement Lift', accent: 'text-blue-400' },
                  { title: 'Legacy CRM & Predictive Pipeline', desc: 'Synced AI algorithms into lead systems to score prospects and auto-generate executive briefings.', roi: '89% Deal Close Prediction', accent: 'text-green-400' },
                ].map((study) => (
                  <div key={study.title} className="p-5 glass rounded-xl border border-gold/10 hover:border-gold/20 transition-all group">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-gold transition-colors">{study.title}</h4>
                      <span className={`text-xs font-bold uppercase tracking-wider font-mono ${study.accent} shrink-0`}>{study.roi}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{study.desc}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      {/* ── Mobile Bottom Navigation ─────────────────────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-20 border-t border-gold/10 bg-[#050505]/95 backdrop-blur-md">
        <div className="flex items-center h-16">
          {profile.role === 'client' ? (
            <>
              {([
                { id: 'overview' as ClientTab, label: 'Overview', icon: LayoutDashboard },
                { id: 'assets' as ClientTab, label: 'Assets', icon: FolderOpen },
                { id: 'insights' as ClientTab, label: 'Analytics', icon: TrendingUp },
              ]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setClientTab(id)}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 cursor-pointer ${
                    clientTab === id ? 'text-gold' : 'text-muted-foreground'
                  }`}
                >
                  <Icon size={20} strokeWidth={clientTab === id ? 2.5 : 1.5} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              {([
                { id: 'overview' as UserTab, label: 'Overview', icon: LayoutDashboard },
                { id: 'profile' as UserTab, label: 'Profile', icon: Building2 },
                { id: 'vault' as UserTab, label: 'Vault', icon: Zap },
              ]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setUserTab(id)}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 cursor-pointer ${
                    userTab === id ? 'text-gold' : 'text-muted-foreground'
                  }`}
                >
                  <Icon size={20} strokeWidth={userTab === id ? 2.5 : 1.5} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
