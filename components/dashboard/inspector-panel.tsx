'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useInspector } from '@/hooks/use-inspector'
import { X, FileText, User, Calendar, ExternalLink, Activity, DollarSign, HelpCircle, Briefcase } from 'lucide-react'

export function InspectorPanel() {
  const { isOpen, setIsOpen } = useInspector()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [isAdmin, setIsAdmin] = useState(false)
  const [isClientPortal, setIsClientPortal] = useState(false)
  
  // Data States
  const [leadData, setLeadData] = useState<any>(null)
  const [projectData, setProjectData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Determine current portal and roles
  const leadId = searchParams.get('leadId')
  const projectId = searchParams.get('projectId')
  const clientId = searchParams.get('clientId')

  useEffect(() => {
    setIsAdmin(pathname.startsWith('/admin'))
    setIsClientPortal(pathname.startsWith('/client'))
  }, [pathname])

  // Fetch contextual data
  useEffect(() => {
    if (!isOpen) return

    async function fetchAdminData() {
      setLoading(true)
      try {
        if (leadId) {
          const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single()
          setLeadData(lead)
          
          // Fetch logs related to this lead
          const { data: logs } = await supabase
            .from('activity_logs')
            .select('*')
            .eq('target_id', leadId)
            .order('created_at', { ascending: false })
            .limit(5)
          setActivityLogs(logs ?? [])
        } else {
          setLeadData(null)
        }

        if (projectId) {
          const { data: proj } = await supabase.from('projects').select('*').eq('id', projectId).single()
          setProjectData(proj)
        } else {
          setProjectData(null)
        }

        if (clientId) {
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', clientId).single()
          setProfileData(prof)
        } else {
          setProfileData(null)
        }
      } catch (err) {
        console.error('Error fetching admin inspector data:', err)
      } finally {
        setLoading(false)
      }
    }

    async function fetchClientData() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch active project for the client
          const { data: proj } = await supabase
            .from('projects')
            .select('*')
            .eq('client_id', user.id)
            .maybeSingle()
          setProjectData(proj)

          // Fetch user profile
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          setProfileData(prof)
        }
      } catch (err) {
        console.error('Error fetching client inspector data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchAdminData()
    } else if (isClientPortal) {
      fetchClientData()
    }
  }, [isOpen, leadId, projectId, clientId, isAdmin, isClientPortal, supabase])

  // Clear query parameters
  const clearSelection = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('leadId')
    params.delete('projectId')
    params.delete('clientId')
    router.push(`${pathname}?${params.toString()}`)
  }

  if (!isOpen) return null

  return (
    <aside className="w-[280px] shrink-0 border-l border-gold/10 bg-[#0D0D0D] text-foreground flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 z-20 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gold/10">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-gold" />
          <span className="font-serif text-xs font-bold uppercase tracking-wider text-gold-light">Console Inspector</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-gold/5 transition-all cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 discord-scroll text-xs">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <span className="animate-pulse">Retrieving telemetry...</span>
          </div>
        ) : isAdmin ? (
          // ADMIN CONSOLE VIEWS
          leadId && leadData ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 font-sans">
                  # Vetting Response
                </p>
                <div className="bg-[#050505] p-3 rounded-lg border border-gold/5 space-y-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Lead ID</p>
                    <p className="font-mono text-[9px] break-all select-all text-gold">{leadData.id}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Company / Name</p>
                    <p className="font-semibold text-foreground">{leadData.business_name} / {leadData.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Email / Phone</p>
                    <p className="text-foreground">{leadData.email}</p>
                    {leadData.phone && <p className="text-muted-foreground">{leadData.phone}</p>}
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Target Service</p>
                    <p className="text-gold font-medium">{leadData.service_interested || 'None specified'}</p>
                  </div>
                  {leadData.website && (
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold">Website</p>
                      <a
                        href={leadData.website.startsWith('http') ? leadData.website : `https://${leadData.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        {leadData.website} <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                  {leadData.notes && (
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold">Vetting Statement</p>
                      <p className="text-muted-foreground leading-relaxed italic">"{leadData.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 font-sans">
                  # Telemetry Trail
                </p>
                <div className="space-y-2">
                  {activityLogs.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground italic">No operations recorded for lead</p>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="bg-[#050505] p-2.5 rounded-lg border border-gold/5 text-[10px]">
                        <div className="flex justify-between text-muted-foreground text-[8px] mb-0.5">
                          <span>{log.action_type}</span>
                          <span>{new Date(log.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-foreground font-mono">{log.target_table || 'system'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={clearSelection}
                className="w-full py-2 bg-gold/5 hover:bg-gold/10 text-gold border border-gold/20 hover:border-gold/30 rounded-lg text-center font-medium transition-all cursor-pointer"
              >
                Reset Inspector focus
              </button>
            </div>
          ) : projectId && projectData ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 font-sans">
                  # Active Parameters
                </p>
                <div className="bg-[#050505] p-3 rounded-lg border border-gold/5 space-y-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Project Name</p>
                    <p className="font-semibold text-foreground text-sm">{projectData.project_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Partner Client</p>
                    <p className="text-foreground">{projectData.client_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Orchestration Phase</p>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] bg-gold/10 text-gold border border-gold/20 uppercase font-mono">
                      {projectData.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Launch Matrix</p>
                    <p className="text-foreground">
                      Target: {projectData.target_launch_date ? new Date(projectData.target_launch_date).toLocaleDateString() : 'Unscheduled'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={clearSelection}
                className="w-full py-2 bg-gold/5 hover:bg-gold/10 text-gold border border-gold/20 hover:border-gold/30 rounded-lg text-center font-medium transition-all cursor-pointer"
              >
                Reset Inspector focus
              </button>
            </div>
          ) : clientId && profileData ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 font-sans">
                  # Console Profile
                </p>
                <div className="bg-[#050505] p-3 rounded-lg border border-gold/5 space-y-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Full Name</p>
                    <p className="font-semibold text-foreground">{profileData.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Permissions Tier</p>
                    <p className="text-gold font-mono uppercase">{profileData.role}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Joined System</p>
                    <p className="text-muted-foreground">
                      {new Date(profileData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={clearSelection}
                className="w-full py-2 bg-gold/5 hover:bg-gold/10 text-gold border border-gold/20 hover:border-gold/30 rounded-lg text-center font-medium transition-all cursor-pointer"
              >
                Reset Inspector focus
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 text-muted-foreground">
              <HelpCircle size={24} className="text-gold/30" />
              <p className="font-serif italic">Console Idle</p>
              <p className="text-[10px] max-w-[180px] leading-relaxed">
                Highlight a pipeline item in your table list to reveal metrics in real-time.
              </p>
            </div>
          )
        ) : isClientPortal ? (
          // CLIENT PORTAL VIEWS (Active client summary details)
          projectData ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 font-sans">
                  # Sovereign Blueprint
                </p>
                <div className="bg-[#050505] p-3 rounded-lg border border-gold/5 space-y-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Active Build</p>
                    <p className="font-semibold text-foreground text-sm">{projectData.project_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Architecture Phase</p>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] bg-gold/10 text-gold border border-gold/20 uppercase font-mono">
                      {projectData.status}
                    </span>
                  </div>
                  {projectData.live_url && (
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold">Production Node</p>
                      <a
                        href={projectData.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 mt-0.5 font-mono text-[10px]"
                      >
                        Launch Production <ExternalLink size={8} />
                      </a>
                    </div>
                  )}
                  {projectData.preview_url && (
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold">Staging Blueprint</p>
                      <a
                        href={projectData.preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 mt-0.5 font-mono text-[10px]"
                      >
                        Inspect Preview <ExternalLink size={8} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 font-sans">
                  # Operations Contacts
                </p>
                <div className="bg-[#050505] p-2.5 rounded-lg border border-gold/5 space-y-2 text-[10px]">
                  <p className="text-foreground font-semibold">Operations Desk</p>
                  <p className="text-muted-foreground">For emergencies or architectural escalations:</p>
                  <p className="text-gold font-mono">ops@mercianwealth.com</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 text-muted-foreground">
              <Briefcase size={24} className="text-gold/30" />
              <p className="font-serif italic">Console Setup</p>
              <p className="text-[10px] max-w-[180px] leading-relaxed">
                Your sovereign project parameters are loading. A representative will provision access shortly.
              </p>
            </div>
          )
        ) : (
          // USER / PROSPECT CONSOLE VIEWS
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 text-muted-foreground">
            <User size={24} className="text-gold/30" />
            <p className="font-serif italic">Vetting Inactive</p>
            <p className="text-[10px] max-w-[180px] leading-relaxed">
              Complete your intake vetting questionnaire and book an evaluation to establish system parameters.
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
