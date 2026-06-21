import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { FolderKanban, CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type ProjectStage = {
  name: string
  key: 'Discovery' | 'Design' | 'Development' | 'Revision' | 'Complete'
  subtitle: string
  description: string
  deliverables: string[]
}

const STAGES: ProjectStage[] = [
  {
    name: '1. Discovery & Strategy',
    key: 'Discovery',
    subtitle: 'Consultation & Planning',
    description: 'We align on your legacy objectives, map project scopes, sign agreements, and plan structural features.',
    deliverables: ['Creative Brief Completion', 'Scope of Work Approved', 'Tech & Integrations Mapped'],
  },
  {
    name: '2. UI/UX Design',
    key: 'Design',
    subtitle: 'Visualizing Your Brand',
    description: 'Our design team crafts visual prototypes and wireframes in Figma to show you exactly how the product will look.',
    deliverables: ['Figma Wireframes Delivered', 'Color Palette & Typography Selection', 'Design Review & Signoff'],
  },
  {
    name: '3. Technical Development',
    key: 'Development',
    subtitle: 'Building the Platform',
    description: 'We code the frontend pages, connect Supabase servers, configure security roles, and link booking automation.',
    deliverables: ['Next.js App Built', 'Supabase DB Configured', 'Content & Media Integrated'],
  },
  {
    name: '4. Revision & Signoff',
    key: 'Revision',
    subtitle: 'Polishing & Refining',
    description: 'We host your site on a private staging link, compile feedback, perform speed reviews, and run diagnostic tests.',
    deliverables: ['Staging Link Live', 'Revision Loops Finished', 'SEO Audits & Optimization'],
  },
  {
    name: '5. Launch & Handoff',
    key: 'Complete',
    subtitle: 'Going Live',
    description: 'The platform launches publicly on your domain, backup strategies are checked, and admin training is completed.',
    deliverables: ['Domain Routing Complete', 'Production DB Active', 'Admin Training Handoff'],
  },
]

export default async function ClientProgressPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .maybeSingle()

  if (!project) {
    redirect('/client')
  }

  const statusList = STAGES.map(s => s.key)
  const currentStageIndex = statusList.indexOf(project.status)

  return (
    <div className="space-y-6 sm:space-y-10 relative">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
          <Sparkles size={12} className="animate-pulse" /> Live Tracker
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Project Progress
        </h1>
        <p className="text-sm text-muted-foreground">
          Detailed breakdown of your project roadmap. We check off items as we complete them.
        </p>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Timeline checklist */}
        <section className="lg:col-span-2 space-y-6">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex
            const isActive = idx === currentStageIndex
            const isPending = idx > currentStageIndex

            return (
              <div
                key={stage.key}
                className={`p-6 glass rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-gold/40 bg-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.05)]'
                    : isCompleted
                      ? 'border-gold/10 bg-white/[0.01]'
                      : 'border-transparent bg-transparent opacity-40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-serif font-bold text-foreground">
                      {stage.name}
                    </h2>
                    <p className="text-xs text-gold/80 font-medium font-sans">
                      {stage.subtitle}
                    </p>
                  </div>
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : isActive ? (
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shrink-0 animate-pulse">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground/30 shrink-0">
                      <Circle size={16} />
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {stage.description}
                </p>

                {/* Sub deliverables */}
                <div className="mt-5 pt-4 border-t border-gold/10 space-y-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Milestone Deliverables
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {stage.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={12} className={isCompleted || (isActive && dIdx === 0) ? 'text-gold' : 'text-muted-foreground/30'} />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
            <h3 className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
              <FolderKanban size={16} className="text-gold" /> Build Details
            </h3>

            <div className="divide-y divide-gold/10 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-semibold text-foreground">
                  {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Est. Launch</span>
                <span className="font-semibold text-foreground">
                  {project.target_launch_date ? new Date(project.target_launch_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground">Service Type</span>
                <span className="font-semibold text-foreground capitalize">
                  {project.service_type || 'Full Website Build'}
                </span>
              </div>
            </div>
          </section>

          {/* Help Center Card */}
          <section className="p-6 glass rounded-2xl border border-gold/10 space-y-4">
            <h3 className="text-sm font-serif font-bold text-foreground">Project Notes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you have any feedback regarding designs, content updates, or copy revisions, please communicate with us inside the portal messages feed.
            </p>
            <Link
              href="/client/messages"
              className="w-full py-2.5 px-4 rounded-xl bg-[#1A0A2E]/50 hover:bg-[#1A0A2E]/70 border border-purple-500/20 hover:border-purple-500/40 text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-between"
            >
              Message Team <ArrowRight size={12} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
