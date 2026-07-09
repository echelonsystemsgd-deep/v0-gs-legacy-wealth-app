import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { email, has_website, monthly_revenue, primary_interest } = payload

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    let dbSaved = false
    let updatedLead = null
    let dbError = null

    // Determine target tier based on revenue
    let tier = 'General Lead'
    if (monthly_revenue === '£50,000+') {
      tier = 'Elite'
    } else if (monthly_revenue === '£20,000 – £50,000') {
      tier = 'Legacy'
    } else if (monthly_revenue === '£5,000 – £20,000') {
      tier = 'Launch'
    }

    const qualificationNotes = `\n[Qualification Survey]\nHas Website: ${has_website}\nMonthly Revenue: ${monthly_revenue}\nPrimary Interest: ${primary_interest}`

    // 1. Update lead in Supabase (Non-blocking fallback)
    if (supabaseAdmin) {
      try {
        const { data: existingLead, error: selectError } = await supabaseAdmin
          .from('leads')
          .select('*')
          .eq('email', email)
          .maybeSingle()

        if (selectError) {
          dbError = selectError
        } else if (existingLead) {
          // Update the existing lead with the qualification answers
          const combinedNotes = existingLead.notes 
            ? `${existingLead.notes}${qualificationNotes}` 
            : qualificationNotes.trim()

          const { data, error } = await supabaseAdmin
            .from('leads')
            .update({
              service_interested: primary_interest || existingLead.service_interested,
              tier: tier || existingLead.tier,
              notes: combinedNotes,
              status: monthly_revenue === 'Under £5,000' ? 'Contacted' : 'Call Booked', // Set status based on triage
            })
            .eq('id', existingLead.id)
            .select()
            .single()

          dbError = error
          updatedLead = data
        } else {
          // If lead somehow does not exist, create it (fallback)
          const { data, error } = await supabaseAdmin
            .from('leads')
            .insert({
              email,
              name: 'Anonymous Survey Lead',
              business_name: 'N/A',
              service_interested: primary_interest || null,
              tier,
              notes: qualificationNotes.trim(),
              status: 'New',
              source: 'audit_survey',
            })
            .select()
            .single()

          dbError = error
          updatedLead = data
        }

        if (dbError) {
          console.error('[API/Qualify] Supabase update failed:', dbError.message)
        } else {
          dbSaved = true
        }
      } catch (err: any) {
        console.error('[API/Qualify] Unhandled database error:', err.message || err)
      }
    }

    // 2. Dispatch updated payload to n8n Webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    let n8nDispatched = false
    let n8nError = null

    if (n8nWebhookUrl) {
      try {
        const webhookPayload = {
          lead_id: updatedLead?.id || null,
          email,
          has_website,
          monthly_revenue,
          primary_interest,
          tier,
          source: 'audit_survey',
          timestamp: new Date().toISOString(),
          details: updatedLead || null,
        }

        console.log('[API/Qualify] Dispatching updated payload to n8n:', n8nWebhookUrl)
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })

        if (response.ok) {
          n8nDispatched = true
        } else {
          const text = await response.text()
          n8nError = `n8n returned status ${response.status}: ${text}`
        }
      } catch (err: any) {
        n8nError = err.message || String(err)
      }
    }

    return NextResponse.json({
      success: true,
      dbSaved,
      n8nDispatched,
      leadId: updatedLead?.id || null,
      warning: n8nError,
    })

  } catch (err: any) {
    console.error('[API/Qualify] Unhandled request error:', err.message || err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
