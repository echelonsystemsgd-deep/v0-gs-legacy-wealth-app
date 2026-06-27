import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import ProfileClientContainer from '@/components/profile/profile-client-container'

export const metadata = {
  title: 'Profile Settings',
  description: 'Manage your personal details, profile picture, and address information.',
}

export default async function ProfilePage() {
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

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <PageHeader 
        title="Account"
        highlight="Profile"
        subtitle="Manage your personal details, contact coordinates, and secure digital credentials."
      />
      <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
        <ProfileClientContainer initialProfile={profile} email={user.email || ''} userRole={profile.role} />
      </div>
      <Footer />
    </main>
  )
}
