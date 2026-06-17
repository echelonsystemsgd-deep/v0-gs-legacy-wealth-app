'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Zap,
  Loader2,
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

interface DashboardClientContainerProps {
  profile: Profile
  lead: Lead | null
  project: Project | null
  initialAssets: Asset[]
}

export default function DashboardClientContainer({
  profile,
  lead: initialLead,
  project,
  initialAssets,
}: DashboardClientContainerProps) {
  const router = useRouter()
  const supabase = createClient()

  // Local States
  const [lead, setLead] = useState<Lead | null>(initialLead)
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadName, setUploadName] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // Lead Info Edit State (for Users who haven't completed details)
  const [businessName, setBusinessName] = useState(lead?.business_name || '')
  const [phone, setPhone] = useState(lead?.phone || profile.phone_number || '')
  const [website, setWebsite] = useState(lead?.website || '')
  const [service, setService] = useState(lead?.service_interested || 'AI Automation')
  const [savingLead, setSavingLead] = useState(false)
  const [leadSuccessMsg, setLeadSuccessMsg] = useState<string | null>(null)

  // Handlers
  const handleSaveLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingLead(true)
    setLeadSuccessMsg(null)

    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    const email = lead?.email || (await supabase.auth.getUser()).data.user?.email || ''

    if (lead) {
      // Update existing lead
      const { error } = await supabase
        .from('leads')
        .update({
          business_name: businessName,
          phone,
          website,
          service_interested: service,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id)

      if (error) {
        setLeadSuccessMsg('Error saving details.')
      } else {
        setLead((prev) =>
          prev
            ? { ...prev, business_name: businessName, phone, website, service_interested: service }
            : null
        )
        setLeadSuccessMsg('Business details updated successfully!')
      }
    } else {
      // Create new lead in CRM corresponding to this account email
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({
          name: fullName || 'Registered User',
          business_name: businessName || 'To Be Specified',
          email,
          phone: phone || null,
          website: website || null,
          service_interested: service,
          status: 'New',
          source: 'dashboard',
        })
        .select()
        .single()

      if (error) {
        setLeadSuccessMsg('Error creating lead entry.')
      } else {
        setLead(newLead)
        setLeadSuccessMsg('Business details registered with CRM!')
      }
    }
    setSavingLead(false)
    setTimeout(() => setLeadSuccessMsg(null), 4000)
  }

  const handleSimulatedFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return
    if (!uploadName.trim()) {
      setUploadError('Please specify a filename.')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    // Simulate file insertion into project_assets
    const { data: newAsset, error } = await supabase
      .from('project_assets')
      .insert({
        project_id: project.id,
        file_name: uploadName.endsWith('.pdf') || uploadName.endsWith('.png') || uploadName.endsWith('.zip') 
          ? uploadName 
          : `${uploadName}.pdf`,
        file_url: `https://ladebhmyywkcqtyazxxk.supabase.co/storage/v1/object/public/assets/${uploadName}`,
        file_size: Math.floor(Math.random() * 8500000) + 150000, // Random bytes between 150kb and 8.5mb
        file_type: uploadName.includes('.') ? uploadName.split('.').pop() : 'pdf',
        uploaded_by: profile.id,
      })
      .select()
      .single()

    if (error) {
      setUploadError('Could not upload asset: ' + error.message)
    } else if (newAsset) {
      setAssets((prev) => [newAsset, ...prev])
      setUploadName('')
    }
    setIsUploading(false)
  }

  // Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Project Progress Mapping
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

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0EDE6] relative overflow-hidden flex flex-col justify-between">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/3 blur-[130px]" />
      </div>

      <div className="max-w-5xl w-full mx-auto px-4 py-12 space-y-10 relative z-10 flex-1">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gold/15">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
              <Sparkles size={12} className="animate-pulse" />{' '}
              {profile.role === 'client' ? 'Active Client Suite' : 'Registered Member Suite'}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {getGreeting()}, {profile.first_name || 'Partner'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {profile.role === 'client'
                ? 'Track your live AI project status, deliverables, and asset pipeline.'
                : 'Complete your business profile, review capabilities, and schedule your launch strategy call.'}
            </p>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl border border-gold/15 hover:border-gold/30 hover:bg-gold/5 text-sm text-muted-foreground hover:text-gold transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </form>
        </header>

        {/* -------------------- USER (PROSPECT) DASHBOARD VIEW -------------------- */}
        {profile.role !== 'client' && (
          <div className="space-y-8 animate-fade-in">
            {/* User Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Account Status Card */}
              <div className="p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <User size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Portal Status</p>
                  <h3 className="text-lg font-serif font-bold text-foreground mt-0.5">Registered Member</h3>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-bold text-gold uppercase tracking-wider">
                  Awaiting Promotion
                </span>
              </div>

              {/* CRM Status Card */}
              <div className="p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Compass size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Consultation Pipeline</p>
                  <h3 className="text-lg font-serif font-bold text-foreground mt-0.5">
                    {lead ? lead.status : 'Not Registered'}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {lead?.status === 'New' && 'Reviewing your preliminary account.'}
                  {lead?.status === 'Contacted' && 'Check your email for custom proposals.'}
                  {lead?.status === 'Call Booked' && 'Your strategy call is logged.'}
                  {!lead && 'Please input details below.'}
                </p>
              </div>

              {/* Call Booking Card */}
              <div className="p-6 glass rounded-2xl border border-gold/10 hover:border-gold/20 transition-all duration-300 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Calendar size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Strategy Session</p>
                  <h3 className="text-lg font-serif font-bold text-foreground mt-0.5">
                    {lead?.status === 'Call Booked' ? 'Call Scheduled' : 'Awaiting Booking'}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Book a time to upgrade your account to client status.
                </p>
              </div>
            </div>

            {/* Onboarding Roadmap */}
            <section className="p-8 glass rounded-2xl border border-gold/10 space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck size={20} className="text-gold" /> Client Onboarding Roadmap
                </h2>
                <p className="text-sm text-muted-foreground">Follow these luxury onboarding steps to initiate development.</p>
              </div>

              <div className="relative border-l border-gold/10 pl-6 ml-3 space-y-8 py-2">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Step 1: Secure Account Created</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Credentials registered successfully. Standard user profile auto-generated.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border ${
                    lead?.status === 'Call Booked'
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-gold/10 border-gold animate-pulse'
                  }`}>
                    {lead?.status === 'Call Booked' ? (
                      <CheckCircle2 size={10} className="text-green-400" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Step 2: Book 1-on-1 AI Strategy Session</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Connect with our engineering lead to map out your custom digital assets.</p>
                    </div>
                    {lead?.status !== 'Call Booked' && (
                      <Link
                        href="/book"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-background font-bold text-xs hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all duration-300"
                      >
                        Book Call <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border ${
                    lead?.business_name
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-gold/10 border-gold/30'
                  }`}>
                    {lead?.business_name ? (
                      <CheckCircle2 size={10} className="text-green-400" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Step 3: Submit Business Profile & Target Goals</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lead?.business_name 
                        ? `Registered business: "${lead.business_name}"` 
                        : 'Submit details below so we can construct your personalized proposal.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Forms and Case Studies */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Profile Input Form */}
              <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-foreground">Business Profile Form</h3>
                  <p className="text-xs text-muted-foreground">Provide details to customize your launch roadmap.</p>
                </div>

                <form onSubmit={handleSaveLeadDetails} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 size={11} className="text-gold" /> Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Sovereign Realty Group"
                      className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Phone size={11} className="text-gold" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7700 900077"
                      className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Globe size={11} className="text-gold" /> Current Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase size={11} className="text-gold" /> Core Automation Need
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-lg px-3 py-2.5 text-xs text-foreground outline-none transition-all"
                    >
                      <option value="AI Automation" className="bg-[#0A0A0A]">AI Workflows & Integrations</option>
                      <option value="Luxury Custom Web" className="bg-[#0A0A0A]">Custom Luxury Design & Dev</option>
                      <option value="Executive CRM" className="bg-[#0A0A0A]">Elite CRM Setup & Systems</option>
                      <option value="Consulting" className="bg-[#0A0A0A]">AI Strategy Consultation</option>
                    </select>
                  </div>

                  {leadSuccessMsg && (
                    <div className="bg-gold/10 border border-gold/20 rounded-lg px-3 py-2 text-xxs text-gold">
                      {leadSuccessMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingLead}
                    className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-background font-bold text-xs hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {savingLead ? <Loader2 size={13} className="animate-spin" /> : 'Save Profile Details'}
                  </button>
                </form>
              </section>

              {/* AI Authority Vault Case Studies */}
              <section className="space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                    <Zap size={16} className="text-gold" /> Authority Vault
                  </h3>
                  <p className="text-xs text-muted-foreground">Review custom systems designed by GS Legacy Wealth AI.</p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: 'Sovereign AI Agent Core',
                      desc: 'Automates 94% of standard incoming leads with custom voice/text models matching brand voice.',
                      roi: '+42% Booking Rate',
                    },
                    {
                      title: 'Premium UX Digital Asset',
                      desc: 'Engineered high-end fluid web designs and visual authority for capital funds, improving investor trust.',
                      roi: '2.4x Engagement Lift',
                    },
                    {
                      title: 'Legacy CRM & Predictive Pipeline',
                      desc: 'Synced AI algorithms directly into lead systems to score prospects and auto-generate executive briefings.',
                      roi: '89% Deal Close Prediction',
                    },
                  ].map((study) => (
                    <div
                      key={study.title}
                      className="p-5 rounded-xl bg-card border border-gold/10 hover:border-gold/20 transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-xs font-bold text-foreground group-hover:text-gold transition-colors">
                          {study.title}
                        </h4>
                        <span className="text-[10px] font-bold text-gold uppercase tracking-wider font-mono">
                          {study.roi}
                        </span>
                      </div>
                      <p className="text-xxs text-muted-foreground mt-1.5 leading-relaxed">
                        {study.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* -------------------- CLIENT PORTAL VIEW -------------------- */}
        {profile.role === 'client' && (
          <div className="space-y-8 animate-fade-in">
            {/* Active Project Milestones Timeline */}
            <section className="p-8 glass rounded-2xl border border-gold/10 space-y-6">
              <div className="space-y-1">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                      {project ? project.project_name : 'Custom Digital Project'}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Service Type:{' '}
                      <span className="text-gold font-semibold">{project?.service_type || 'Luxury Development'}</span>
                    </p>
                  </div>
                  {project && (
                    <div className="text-right">
                      <p className="text-xxs uppercase tracking-widest text-muted-foreground">Target Launch</p>
                      <p className="text-xs font-bold text-gold mt-0.5 font-mono">
                        {project.target_launch_date
                          ? new Date(project.target_launch_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'TBD'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {project ? (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span>Development Pipeline Progress</span>
                      <span className="text-gold font-mono">{getProgressPercentage(project.status)}%</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2.5 overflow-hidden border border-gold/10">
                      <div
                        className="bg-gradient-to-r from-gold via-gold-light to-gold h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                        style={{ width: `${getProgressPercentage(project.status)}%` }}
                      />
                    </div>
                  </div>

                  {/* Horizontal Timeline Steps */}
                  <div className="grid grid-cols-5 gap-2 pt-2 text-center">
                    {[
                      { key: 'Discovery', label: '1. Discovery' },
                      { key: 'Design', label: '2. Design UI' },
                      { key: 'Development', label: '3. Core Dev' },
                      { key: 'Revision', label: '4. Revisions' },
                      { key: 'Complete', label: '5. Launch' },
                    ].map((step, idx) => {
                      const stages = ['Discovery', 'Design', 'Development', 'Revision', 'Complete']
                      const activeIdx = stages.indexOf(project.status)
                      const isCompleted = stages.indexOf(step.key) < activeIdx
                      const isActiveStep = step.key === project.status

                      return (
                        <div key={step.key} className="space-y-1.5">
                          <div className="flex justify-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all ${
                                isCompleted
                                  ? 'bg-green-500/10 border-green-500 text-green-400'
                                  : isActiveStep
                                  ? 'bg-gold/20 border-gold text-gold shadow-[0_0_8px_rgba(212,175,55,0.3)] animate-pulse'
                                  : 'bg-background border-gold/10 text-muted-foreground'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-semibold block uppercase tracking-wider ${
                              isActiveStep ? 'text-gold' : 'text-muted-foreground'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Clock size={28} className="text-gold/20 mb-2 animate-spin" />
                  <h4 className="text-sm font-semibold text-foreground">Project Workspace Initializing</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Our team is currently setting up your workspace blueprint, milestones, and target timelines in the CRM. Check back shortly.
                  </p>
                </div>
              )}
            </section>

            {/* Asset Vault & File Uploader */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Asset Uploader Card */}
              <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                    <Upload size={16} className="text-gold" /> Asset Vault Submit
                  </h3>
                  <p className="text-xs text-muted-foreground">Upload brand logos, copy briefs, or asset zip folders.</p>
                </div>

                {project ? (
                  <form onSubmit={handleSimulatedFileUpload} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Asset Name / Label</label>
                      <input
                        type="text"
                        required
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="e.g. Brand Logos Vector Pack"
                        className="w-full bg-background/50 border border-gold/10 hover:border-gold/20 focus:border-gold/45 rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                      />
                    </div>

                    <div className="border border-dashed border-gold/15 hover:border-gold/30 rounded-xl p-6 text-center transition-all bg-background/20">
                      <FileText size={28} className="text-gold/30 mx-auto mb-2" />
                      <span className="text-xxs text-muted-foreground block">
                        Simulation Mode: Enter label above and click upload to register file in project.
                      </span>
                    </div>

                    {uploadError && (
                      <div className="bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2 text-xxs text-red-400">
                        {uploadError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-background font-bold text-xs hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isUploading ? <Loader2 size={13} className="animate-spin" /> : 'Register Asset in Project'}
                    </button>
                  </form>
                ) : (
                  <div className="p-6 border border-dashed border-gold/10 rounded-xl text-center text-xs text-muted-foreground">
                    Please await project initialization before uploading assets.
                  </div>
                )}
              </section>

              {/* Uploaded Files List */}
              <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-serif font-bold text-foreground">Registered Assets</h3>
                  <p className="text-xs text-muted-foreground">Files available for design and development.</p>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {assets.length === 0 ? (
                    <div className="text-center py-12 border border-gold/5 rounded-xl">
                      <FileText size={24} className="text-gold/10 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No assets submitted yet.</p>
                    </div>
                  ) : (
                    assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-3.5 rounded-lg bg-background/50 border border-gold/8 hover:border-gold/15 flex items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-lg bg-gold/10 border border-gold/25 text-gold shrink-0">
                            <FileText size={14} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-foreground truncate">{asset.file_name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                              {asset.file_size ? `${(asset.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'} •{' '}
                              {new Date(asset.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={asset.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-gold/5 border border-gold/15 text-[10px] font-bold text-gold hover:bg-gold/10 transition-all"
                        >
                          View
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Performance Analytics & ROI Preview */}
            <section className="p-6 glass rounded-2xl border border-gold/10 space-y-6">
              <div className="space-y-0.5">
                <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
                  <BarChart3 size={16} className="text-gold" /> AI Core Performance Command
                </h3>
                <p className="text-xs text-muted-foreground">Review analytics once your AI automations go live.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Lead Work Hours Saved',
                    value: '42.5 hrs',
                    subtitle: 'This Billing Period',
                    accent: 'text-green-400',
                  },
                  {
                    label: 'Automated AI Chats',
                    value: '387 sessions',
                    subtitle: '94% Resolution Rate',
                    accent: 'text-gold',
                  },
                  {
                    label: 'Average Response Delay',
                    value: '1.4 seconds',
                    subtitle: 'vs 14m Manual Time',
                    accent: 'text-blue-400',
                  },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-card border border-gold/5 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {stat.label}
                    </p>
                    <div>
                      <h4 className={`text-2xl font-serif font-bold ${stat.accent}`}>{stat.value}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{stat.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <footer className="w-full border-t border-gold/10 py-6 text-center text-xs text-muted-foreground relative z-10 bg-[#050505]/80 backdrop-blur-md">
        © {new Date().getFullYear()} GS Legacy Wealth AI. All rights reserved.
      </footer>
    </div>
  )
}
