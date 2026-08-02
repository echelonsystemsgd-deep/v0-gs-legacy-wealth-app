const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-token',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookToken = Deno.env.get('INTERNAL_WEBHOOK_TOKEN')
    if (webhookToken && req.headers.get('x-webhook-token') !== webhookToken) {
      console.warn('Unauthorized invocation: invalid webhook token.')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payload = await req.json()
    const { table, type, record } = payload

    if (!record) {
      return new Response(JSON.stringify({ error: 'Missing record' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const discordWebhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL')
    const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL')

    if (!discordWebhookUrl && !slackWebhookUrl) {
      console.log('Notification skipped: Neither DISCORD_WEBHOOK_URL nor SLACK_WEBHOOK_URL environment variable is set.')
      return new Response(JSON.stringify({ success: true, message: 'No webhook endpoints configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let message = ''
    let embeds = []

    if (table === 'leads' && type === 'INSERT') {
      const isLocal = record.lead_type === 'local_business'
      message = isLocal ? `🍞 **[NEW LOCAL BUSINESS LEAD]**` : `✨ **New Inbound Lead Received!**`
      embeds = [
        {
          title: isLocal ? `🍞 Local Storefront Inquiry: ${record.business_name || record.name}` : `Project Inquiry Application: ${record.name}`,
          color: isLocal ? 16753920 : 13938487, // Orange/Amber for local vs Gold for enterprise
          fields: [
            { name: 'Lead Type', value: record.lead_type || 'enterprise', inline: true },
            { name: 'Local Niche', value: record.local_business_niche || '—', inline: true },
            { name: 'Business Name', value: record.business_name || '—', inline: true },
            { name: 'Contact Email', value: record.email || '—', inline: true },
            { name: 'Phone / WhatsApp', value: record.phone || '—', inline: true },
            { name: 'Service Interested', value: record.service_interested || '—', inline: false },
            { name: 'Source URL', value: record.source_url || record.source || 'website', inline: false },
            { name: 'Notes', value: record.notes || 'No message provided', inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    } else if (table === 'strategy_sessions' && type === 'INSERT') {
      message = `📅 **New Strategy Session Booked!**`
      embeds = [
        {
          title: `Calendly Schedule Confirmed`,
          color: 44256, // Green #00AC40
          fields: [
            { name: 'Scheduled Date', value: new Date(record.scheduled_at).toLocaleString(), inline: false },
            { name: 'Status', value: record.status || 'Scheduled', inline: true },
            { name: 'Event reference', value: record.calendly_event_id || '—', inline: true },
            { name: 'Notes', value: record.notes || '—', inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    } else if (table === 'messages' && type === 'INSERT') {
      message = `💬 **New Client Message!**`
      embeds = [
        {
          title: `Message from ${record.sender_name || 'Client'}`,
          color: 13938487, // Gold #D4AF37
          fields: [
            { name: 'Content', value: record.content || '—', inline: false },
            { name: 'Dashboard Link', value: 'https://mercianwealth.com/admin/messages', inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    } else {
      // Catch-all system fallback
      message = `🔔 DB Trigger Event: ${type} on table "${table}"`
    }

    // 1. Send Discord alert if configured
    if (discordWebhookUrl) {
      const response = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          embeds: embeds.length > 0 ? embeds : undefined
        })
      })
      if (!response.ok) {
        console.error(`Discord response error: ${response.status} ${await response.text()}`)
      }
    }

    // 2. Send Slack alert if configured
    if (slackWebhookUrl) {
      const response = await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${message}\n${embeds.map(e => `*${e.title}*\n${e.fields.map(f => `> *${f.name}*: ${f.value}`).join('\n')}`).join('\n')}`
        })
      })
      if (!response.ok) {
        console.error(`Slack response error: ${response.status} ${await response.text()}`)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
