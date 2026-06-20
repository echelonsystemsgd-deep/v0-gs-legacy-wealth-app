import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn(
      'Warning: NEXT_PUBLIC_SUPABASE_URL is not set or is using the placeholder. ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_URL is configured in your Vercel Project Settings (Production environment) ' +
      'and that you trigger a redeploy (ideally with clean build cache).'
    )
  }

  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key'
  )
}

