import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out from Supabase Auth
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error.message)
  }

  // Redirect back to login page
  return NextResponse.redirect(new URL('/login', request.url), {
    status: 302,
  })
}
