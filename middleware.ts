import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session tokens
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Helper to fetch user profile role
  const getUserProfile = async () => {
    if (!user) return null
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_suspended')
      .eq('id', user.id)
      .single()
    return profile
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const profile = await getUserProfile()
    if (!profile || profile.role !== 'admin' || profile.is_suspended) {
      // If a standard user tries to access admin, redirect them to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Protect all /dashboard/* routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const profile = await getUserProfile()
    if (profile?.is_suspended) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Admins can also access dashboard if they want, or we can leave it open for users
  }

  // Protect all /profile routes
  if (pathname.startsWith('/profile')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const profile = await getUserProfile()
    if (profile?.is_suspended) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users away from login/auth pages
  if ((pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') && user) {
    const profile = await getUserProfile()
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ],
}

