import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const cookieStore = cookies()

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
        <header className="border-b border-[#D4AF37]/20 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif text-[#D4AF37]">Admin Dashboard Mockup</h1>
            <p className="text-[#B8B8B8] mt-2">Welcome back, {profile?.first_name || 'Admin'}!</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm border border-[#2a2a2a] px-4 py-2 rounded hover:border-[#D4AF37] transition-colors">
              Sign Out
            </button>
          </form>
        </header>

        <section className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-lg">
            <h3 className="text-lg font-medium text-[#B8B8B8]">Your Role</h3>
            <p className="text-2xl mt-2 text-white font-mono">{profile?.role}</p>
          </div>
          <div className="p-6 bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-lg">
            <h3 className="text-lg font-medium text-[#B8B8B8]">User ID</h3>
            <p className="text-sm mt-2 text-white truncate font-mono">{user.id}</p>
          </div>
        </section>

        <section className="p-8 bg-[#111111] border border-[#D4AF37]/10 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-serif text-[#D4AF37] mb-4">You have full access.</h2>
          <p className="text-[#B8B8B8]">
            This is a mock dashboard to prove that the authentication flow and middleware role checks are functioning correctly.
            Only users with the <code className="text-[#D4AF37]">admin</code> role can view this page.
          </p>
        </section>
      </div>
    </div>
  )
}
