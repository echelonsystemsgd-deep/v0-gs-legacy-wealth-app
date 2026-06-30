import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const {
      first_name,
      last_name,
      email,
      industry,
      tier,
      gdpr_consent,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer,
      user_agent,
    } = payload

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 })
    }

    const name = `${first_name} ${last_name}`
    const business_name = industry || 'N/A'

    let dbSaved = false
    let insertedLead = null
    let dbError = null

    // 1. Save to Supabase (Non-blocking fallback)
    if (supabaseAdmin) {
      try {
        // Check if lead already exists by email
        const { data: existingLead, error: selectError } = await supabaseAdmin
          .from('leads')
          .select('*')
          .eq('email', email)
          .maybeSingle()

        if (selectError) {
          dbError = selectError
        } else if (existingLead) {
          // Update existing lead
          const { data, error } = await supabaseAdmin
            .from('leads')
            .update({
              name,
              first_name,
              last_name,
              business_name,
              industry,
              tier,
              gdpr_consent: !!gdpr_consent,
              source_page: source_page || 'Unknown',
              status: 'New',
              source: 'audit_modal',
            })
            .eq('id', existingLead.id)
            .select()
            .single()

          dbError = error
          insertedLead = data
        } else {
          // Create new lead
          const { data, error } = await supabaseAdmin
            .from('leads')
            .insert({
              name,
              first_name,
              last_name,
              email,
              business_name,
              industry,
              tier,
              gdpr_consent: !!gdpr_consent,
              source_page: source_page || 'Unknown',
              status: 'New',
              source: 'audit_modal',
            })
            .select()
            .single()

          dbError = error
          insertedLead = data
        }

        if (dbError) {
          console.error('[API/Audit] Supabase write failed:', dbError.message)
        } else {
          dbSaved = true
        }
      } catch (err: any) {
        console.error('[API/Audit] Unhandled database error:', err.message || err)
      }
    } else {
      console.warn('[API/Audit] Supabase admin client not initialized. Skipping database write.')
    }

    // 2. Dispatch to n8n Webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    let n8nDispatched = false
    let n8nError = null

    const webhookPayload = {
      lead_id: insertedLead?.id || null,
      first_name,
      last_name,
      name,
      email,
      industry,
      business_name,
      tier: tier || 'Unspecified',
      gdpr_consent: !!gdpr_consent,
      source_page: source_page || 'Unknown',
      source: 'audit_modal',
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_term: utm_term || null,
      utm_content: utm_content || null,
      referrer: referrer || null,
      user_agent: user_agent || null,
      timestamp: new Date().toISOString(),
    }

    if (n8nWebhookUrl) {
      try {
        console.log('[API/Audit] Dispatching payload to n8n:', n8nWebhookUrl)
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })

        if (response.ok) {
          n8nDispatched = true
          console.log('[API/Audit] Successfully forwarded lead to n8n.')
        } else {
          const text = await response.text()
          n8nError = `n8n returned status ${response.status}: ${text}`
          console.error('[API/Audit] Failed to forward lead to n8n:', n8nError)
        }
      } catch (err: any) {
        n8nError = err.message || String(err)
        console.error('[API/Audit] Error dispatching to n8n webhook:', n8nError)
      }
    } else {
      console.warn('[API/Audit] N8N_WEBHOOK_URL environment variable is missing. Skipping webhook dispatch.')
    }

    return NextResponse.json({
      success: true,
      dbSaved,
      n8nDispatched,
      leadId: insertedLead?.id || null,
      warning: n8nError || (n8nWebhookUrl ? null : 'N8N_WEBHOOK_URL not configured'),
    })

  } catch (err: any) {
    console.error('[API/Audit] Unhandled request error:', err.message || err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
