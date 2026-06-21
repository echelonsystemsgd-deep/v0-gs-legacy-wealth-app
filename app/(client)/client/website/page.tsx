import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Globe, ExternalLink, Sparkles, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function ClientWebsitePage() {
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

  const activeUrl = project.preview_url || project.live_url

  return (
    <div className="space-y-6 sm:space-y-10 relative h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gold uppercase">
            <Sparkles size={12} className="animate-pulse" /> Launch Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            My Website
          </h1>
          <p className="text-sm text-muted-foreground">
            View staging builds, review design progress, and check your live web application.
          </p>
        </div>

        {activeUrl && (
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-gold/10 hover:bg-gold/15 text-gold border border-gold/25 transition-all duration-300 w-full sm:w-fit"
          >
            Launch Site <ExternalLink size={12} />
          </a>
        )}
      </div>

      {!activeUrl ? (
        /* Empty State */
        <div className="p-8 sm:p-12 glass rounded-2xl border border-gold/10 text-center max-w-2xl mx-auto space-y-6 flex-1 flex flex-col justify-center items-center">
          <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center">
            <Globe size={28} className="text-gold" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-serif font-bold text-foreground">Site Preview Coming Soon</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your staging environment is not deployed yet. Once we finish the wireframing phase and begin development, we will host your build here for real-time reviews.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/client/messages"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-purple-500/10 hover:bg-purple-500/15 text-foreground border border-purple-500/20 transition-all duration-300"
            >
              Ask Team <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      ) : (
        /* Active Staging Build Iframe */
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-[#111111] border border-gold/10 px-4 py-2.5 rounded-xl text-xs text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="truncate">Staging URL: <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">{activeUrl}</a></span>
          </div>

          <div className="flex-1 min-h-[500px] lg:min-h-[600px] glass rounded-2xl border border-gold/15 overflow-hidden shadow-2xl relative">
            <iframe
              src={activeUrl}
              title="Site Preview"
              className="w-full h-full border-0 bg-black"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  )
}
