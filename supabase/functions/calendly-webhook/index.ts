import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const payload = await req.json()
    const eventType = payload.event // e.g. "invitee.created" or "invitee.canceled"
    const eventData = payload.payload

    if (!eventType || !eventData) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const email = eventData.email
    const name = eventData.name
    const scheduledAt = eventData.scheduled_start || eventData.start_time || new Date().toISOString()
    const eventId = eventData.event || eventData.uri

    if (eventType === 'invitee.created') {
      // 1. Check if lead exists by email
      let { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (leadError) throw leadError

      // 2. Create lead if missing
      if (!lead) {
        const { data: newLead, error: insertError } = await supabase
          .from('leads')
          .insert({
            name: name,
            business_name: eventData.questions_and_answers?.find((q: any) => q.question.toLowerCase().includes('company') || q.question.toLowerCase().includes('business'))?.answer || 'Unknown Business',
            email: email,
            phone: eventData.text_reminder_number || null,
            website: eventData.questions_and_answers?.find((q: any) => q.question.toLowerCase().includes('website'))?.answer || null,
            notes: `Calendly booking questions: ${JSON.stringify(eventData.questions_and_answers ?? [])}`,
            status: 'Call Booked',
            source: 'calendly'
          })
          .select('*')
          .single()

        if (insertError) throw insertError
        lead = newLead
      } else {
        // Update existing lead status
        await supabase
          .from('leads')
          .update({ status: 'Call Booked' })
          .eq('id', lead.id)
      }

      // 3. Upsert strategy session
      const { error: sessionError } = await supabase
        .from('strategy_sessions')
        .upsert({
          lead_id: lead.id,
          calendly_event_id: eventId,
          scheduled_at: scheduledAt,
          status: 'Scheduled',
          notes: `Invitee details pre-filled. Event details: ${eventData.uri || ''}`
        }, { onConflict: 'calendly_event_id' })

      if (sessionError) throw sessionError

    } else if (eventType === 'invitee.canceled') {
      // Find session by event id
      const { data: session } = await supabase
        .from('strategy_sessions')
        .select('id, lead_id')
        .eq('calendly_event_id', eventId)
        .maybeSingle()

      if (session) {
        // Update session status to canceled
        await supabase
          .from('strategy_sessions')
          .update({ status: 'Canceled', outcomes: 'Call canceled by invitee' })
          .eq('id', session.id)

        // Reset lead status to Contacted (or similar)
        if (session.lead_id) {
          await supabase
            .from('leads')
            .update({ status: 'Contacted' })
            .eq('id', session.lead_id)
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
