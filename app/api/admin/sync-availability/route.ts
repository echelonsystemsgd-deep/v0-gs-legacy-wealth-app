import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 })
    }

    // 2. Validate admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 })
    }

    // 3. Check for Calendly API token
    const apiKey = process.env.CALENDLY_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        error: 'Calendly API token is not configured. Please configure CALENDLY_API_KEY in your Supabase secrets or environment.'
      }, { status: 400 })
    }

    // 4. Fetch Calendly User profile to get URI
    const userRes = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!userRes.ok) {
      const errorText = await userRes.text()
      console.error('Calendly User fetch failed:', errorText)
      return NextResponse.json({ error: `Calendly profile fetch failed: ${userRes.statusText}` }, { status: 500 })
    }

    const userData = await userRes.json()
    const userUri = userData.resource?.uri

    if (!userUri) {
      return NextResponse.json({ error: 'Failed to extract User URI from Calendly profile' }, { status: 500 })
    }

    // 5. Fetch user availability schedules
    const schedulesRes = await fetch(`https://api.calendly.com/user_availability_schedules?user=${encodeURIComponent(userUri)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!schedulesRes.ok) {
      const errorText = await schedulesRes.text()
      console.error('Calendly Schedules fetch failed:', errorText)
      return NextResponse.json({ error: `Calendly schedules fetch failed: ${schedulesRes.statusText}` }, { status: 500 })
    }

    const schedulesData = await schedulesRes.json()
    const schedules = schedulesData.collection || []
    
    // Get the default schedule, or the first one in the list
    const defaultSchedule = schedules.find((s: any) => s.default) || schedules[0]
    if (!defaultSchedule) {
      return NextResponse.json({ error: 'No Calendly availability schedules found for this user.' }, { status: 400 })
    }

    const rules = defaultSchedule.rules || []
    const wdayToNum: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    }

    const availabilityRulesToInsert: { day_of_week: number; start_time: string; end_time: string }[] = []

    for (const rule of rules) {
      if (rule.type === 'wday' && rule.wday && rule.intervals) {
        const dayOfWeek = wdayToNum[rule.wday.toLowerCase()]
        if (dayOfWeek !== undefined) {
          for (const interval of rule.intervals) {
            if (interval.from && interval.to) {
              availabilityRulesToInsert.push({
                day_of_week: dayOfWeek,
                start_time: `${interval.from}:00`,
                end_time: `${interval.to}:00`,
              })
            }
          }
        }
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
    }

    // 6. Delete old availability rules and insert new ones
    const { error: deleteError } = await supabaseAdmin
      .from('availability_rules')
      .delete()
      .gte('day_of_week', 0) // delete all

    if (deleteError) {
      console.error('Failed to clear availability rules:', deleteError)
      throw new Error(`Failed to clear local availability rules: ${deleteError.message}`)
    }

    if (availabilityRulesToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('availability_rules')
        .insert(availabilityRulesToInsert)

      if (insertError) {
        console.error('Failed to insert availability rules:', insertError)
        throw new Error(`Failed to insert local availability rules: ${insertError.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${availabilityRulesToInsert.length} availability slots from Calendly schedule "${defaultSchedule.name}".`,
      count: availabilityRulesToInsert.length
    })

  } catch (err: any) {
    console.error('Calendly availability sync failed:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
