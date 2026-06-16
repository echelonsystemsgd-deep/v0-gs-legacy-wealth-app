import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('--- DB CLIENT INIT DIAGNOSTICS ---')
console.log('NEXT_PUBLIC_SUPABASE_URL is defined:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_URL is defined:', !!process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY is defined:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log('----------------------------------')

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null
