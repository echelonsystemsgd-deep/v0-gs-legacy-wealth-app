import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, payload } = body

    if (!event || !payload) {
      return NextResponse.json({ error: 'Invalid Calendly payload' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      console.warn('Supabase admin client not initialized in Calendly webhook.')
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 })
    }

    const { email, name, questions_and_answers, text_reminder_number } = payload
    const calendlyEventUri = payload.event || '' // e.g. "https://api.calendly.com/scheduled_events/12345"
    const calendlyEventId = calendlyEventUri.split('/').pop() || calendlyEventUri

    if (event === 'invitee.created') {
      const scheduledAt = payload.scheduled_event?.start_time || new Date().toISOString()
      
      // Parse answers
      let businessName = 'N/A'
      let websiteUrl = ''
      let notes = 'Scheduled via Calendly'

      if (questions_and_answers && Array.isArray(questions_and_answers)) {
        questions_and_answers.forEach((q: any) => {
          const question = q.question?.toLowerCase() || ''
          const answer = q.answer || ''
          if (question.includes('company') || question.includes('business')) {
            businessName = answer
          } else if (question.includes('website')) {
            websiteUrl = answer
          } else if (question.includes('notes') || question.includes('tell us') || question.includes('anything else')) {
            notes = answer
          }
        })
      }

      // Check if lead exists
      const { data: existingLead, error: selectError } = await supabaseAdmin
        .from('leads')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      let leadId = null

      if (existingLead) {
        leadId = existingLead.id
        // Update lead status
        await supabaseAdmin
          .from('leads')
          .update({
            status: 'Call Booked',
            phone: text_reminder_number || existingLead.phone,
            business_name: businessName !== 'N/A' ? businessName : existingLead.business_name,
            website: websiteUrl || existingLead.website,
            notes: notes !== 'Scheduled via Calendly' ? notes : existingLead.notes,
          })
          .eq('id', existingLead.id)
      } else {
        // Create new lead
        const { data: newLead, error: insertError } = await supabaseAdmin
          .from('leads')
          .insert({
            name: name || 'Anonymous Scheduler',
            email: email,
            business_name: businessName,
            phone: text_reminder_number || null,
            website: websiteUrl || null,
            notes: notes,
            status: 'Call Booked',
            source: 'calendly',
          })
          .select()
          .single()

        if (insertError) {
          console.error('Failed to insert lead from Calendly webhook:', insertError.message)
          return NextResponse.json({ error: 'Failed to create lead record' }, { status: 500 })
        }
        leadId = newLead.id
      }

      // Upsert strategy session
      const { error: sessionError } = await supabaseAdmin
        .from('strategy_sessions')
        .upsert({
          lead_id: leadId,
          calendly_event_id: calendlyEventId,
          scheduled_at: scheduledAt,
          status: 'Scheduled',
          notes: notes,
        }, { onConflict: 'calendly_event_id' })

      if (sessionError) {
        console.error('Failed to create strategy session from Calendly webhook:', sessionError.message)
        return NextResponse.json({ error: 'Failed to record strategy session' }, { status: 500 })
      }

      return NextResponse.json({ success: true, event: 'invitee.created', leadId })
    } 
    
    if (event === 'invitee.canceled') {
      // Find strategy session
      const { data: session, error: selectSessionError } = await supabaseAdmin
        .from('strategy_sessions')
        .select('*')
        .eq('calendly_event_id', calendlyEventId)
        .maybeSingle()

      if (session) {
        // Update session status to Canceled
        await supabaseAdmin
          .from('strategy_sessions')
          .update({ status: 'Canceled' })
          .eq('id', session.id)

        if (session.lead_id) {
          // Reset lead status to Contacted
          await supabaseAdmin
            .from('leads')
            .update({ status: 'Contacted' })
            .eq('id', session.lead_id)
        }
        return NextResponse.json({ success: true, event: 'invitee.canceled', sessionId: session.id })
      }

      return NextResponse.json({ success: true, message: 'Session not found for cancellation' })
    }

    return NextResponse.json({ message: `Webhook event ${event} not processed` })
  } catch (err: any) {
    console.error('Error in Calendly Webhook endpoint:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
