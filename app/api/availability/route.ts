import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Staleness threshold: 15 minutes
const STALENESS_THRESHOLD_MS = 15 * 60 * 1000

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
    }

    // 1. Fetch current availability rules from DB
    const { data: dbRules, error: dbError } = await supabaseAdmin
      .from('availability_rules')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (dbError) {
      console.error('Failed to fetch availability rules from DB:', dbError)
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
    }

    const apiKey = process.env.CALENDLY_API_KEY
    const isConfigured = !!apiKey

    // 2. Check if sync is needed (empty rules OR oldest rule is >15 minutes old)
    let shouldSync = false
    if (isConfigured) {
      if (!dbRules || dbRules.length === 0) {
        shouldSync = true
      } else {
        // Find the oldest created_at timestamp
        const oldestTime = Math.min(...dbRules.map(r => new Date(r.created_at).getTime()))
        const age = Date.now() - oldestTime
        if (age > STALENESS_THRESHOLD_MS) {
          shouldSync = true
        }
      }
    }

    // 3. Perform Sync if needed
    if (shouldSync && apiKey) {
      try {
        console.log('Calendly availability is stale. Syncing from Calendly...')
        
        // Fetch Calendly User profile
        const userRes = await fetch('https://api.calendly.com/users/me', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!userRes.ok) {
          throw new Error(`Calendly profile fetch failed: ${userRes.statusText}`)
        }

        const userData = await userRes.json()
        const userUri = userData.resource?.uri

        if (!userUri) {
          throw new Error('Failed to extract User URI from Calendly profile')
        }

        // Fetch user availability schedules
        const schedulesRes = await fetch(`https://api.calendly.com/user_availability_schedules?user=${encodeURIComponent(userUri)}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!schedulesRes.ok) {
          throw new Error(`Calendly schedules fetch failed: ${schedulesRes.statusText}`)
        }

        const schedulesData = await schedulesRes.json()
        const schedules = schedulesData.collection || []
        const defaultSchedule = schedules.find((s: any) => s.default) || schedules[0]

        if (defaultSchedule) {
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

          // Delete and insert new ones
          const { error: deleteError } = await supabaseAdmin
            .from('availability_rules')
            .delete()
            .gte('day_of_week', 0)

          if (deleteError) {
            throw deleteError
          }

          if (availabilityRulesToInsert.length > 0) {
            const { error: insertError } = await supabaseAdmin
              .from('availability_rules')
              .insert(availabilityRulesToInsert)

            if (insertError) {
              throw insertError
            }
          }

          // Fetch the fresh rules we just inserted
          const { data: updatedRules } = await supabaseAdmin
            .from('availability_rules')
            .select('*')
            .order('day_of_week', { ascending: true })
            .order('start_time', { ascending: true })

          return NextResponse.json({
            success: true,
            synced: true,
            rules: updatedRules ?? []
          })
        }
      } catch (syncErr: any) {
        console.error('Background Calendly sync failed, returning cached rules:', syncErr)
        return NextResponse.json({
          success: true,
          synced: false,
          error: syncErr.message || 'Sync failed',
          rules: dbRules
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced: isConfigured,
      rules: dbRules
    })

  } catch (err: any) {
    console.error('Get availability failed:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
