import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClientContainer from '@/components/dashboard/dashboard-client-container'

export default async function UserDashboardPage() {
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // Find matching lead in CRM by email
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('email', user.email)
    .maybeSingle()

  // Find projects matching client name
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .or(`client_name.ilike.%${profile.first_name}%,client_name.ilike.%${fullName}%`)
    .maybeSingle()

  // Fetch project assets if project exists
  let initialAssets: any[] = []
  if (project) {
    const { data: assets } = await supabase
      .from('project_assets')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
    initialAssets = assets ?? []
  }

  return (
    <DashboardClientContainer
      profile={profile}
      lead={lead}
      project={project}
      initialAssets={initialAssets}
    />
  )
}
