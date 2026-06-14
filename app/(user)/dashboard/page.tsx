import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-[#2a2a2a] pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif text-white">Client Portal Mockup</h1>
            <p className="text-[#B8B8B8] mt-2">Welcome, {profile?.first_name || 'Client'}!</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm border border-[#2a2a2a] px-4 py-2 rounded hover:text-white transition-colors">
              Sign Out
            </button>
          </form>
        </header>

        <section className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-[#111111] border border-[#2a2a2a] rounded-xl">
            <h3 className="text-lg font-medium text-[#B8B8B8]">Your Role</h3>
            <p className="text-2xl mt-2 text-white font-mono">{profile?.role}</p>
          </div>
          <div className="p-6 bg-[#111111] border border-[#2a2a2a] rounded-xl">
            <h3 className="text-lg font-medium text-[#B8B8B8]">Account Status</h3>
            <p className="text-2xl mt-2 text-green-500 font-mono">Active</p>
          </div>
        </section>

        <section className="p-8 bg-[#111111] border border-[#2a2a2a] rounded-xl mt-8">
          <h2 className="text-xl font-medium text-white mb-4">Standard Access</h2>
          <p className="text-[#B8B8B8]">
            This is a mock dashboard for standard users. If you try to navigate to <code className="bg-[#050505] px-2 py-1 rounded">/admin</code>, you will be redirected back here.
          </p>
        </section>
      </div>
    </div>
  )
}
