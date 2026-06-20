import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
    }

    const { email, fullName, phone, company } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1. Check if the user already exists in auth or public profiles
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (existingProfile) {
      // If profile exists, promote them to client role
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          role: 'client',
          full_name: fullName || existingProfile.full_name,
          phone_number: phone || existingProfile.phone_number,
          address_line2: company || existingProfile.address_line2
        })
        .eq('id', existingProfile.id)

      if (updateError) throw updateError
      return NextResponse.json({ success: true, message: 'Existing member promoted to client.', profile: existingProfile })
    }

    // 2. Invite the user via Supabase Auth Admin
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName || '',
        phone_number: phone || '',
        address_line2: company || ''
      }
    })

    if (inviteError) {
      console.warn('Invite failed, falling back to direct createUser:', inviteError.message)
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || '',
          phone_number: phone || '',
          address_line2: company || ''
        }
      })
      if (createError) throw createError

      // Update the user's role to 'client' in public.profiles
      const { error: roleError } = await supabaseAdmin
        .from('profiles')
        .update({
          role: 'client',
          full_name: fullName || '',
          phone_number: phone || '',
          address_line2: company || ''
        })
        .eq('id', createData.user.id)

      if (roleError) throw roleError
      return NextResponse.json({ success: true, message: 'Client account created.', user: createData.user })
    }

    if (inviteData && inviteData.user) {
      const { error: roleError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: inviteData.user.id,
          email: email,
          role: 'client',
          full_name: fullName || '',
          phone_number: phone || '',
          address_line2: company || ''
        })

      if (roleError) throw roleError
    }

    return NextResponse.json({ success: true, message: 'Client invitation dispatched.', user: inviteData.user })
  } catch (err: any) {
    console.error('Client onboarding failed:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
