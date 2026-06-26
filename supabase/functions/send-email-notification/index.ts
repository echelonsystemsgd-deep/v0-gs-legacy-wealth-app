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

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable.')
      return new Response(JSON.stringify({ error: 'Mail dispatch backend not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { email, title, description } = await req.json()

    if (!email || !title) {
      return new Response(JSON.stringify({ error: 'Missing email or title parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Sending email notification to ${email} for: ${title}`)

    // Send email via Resend
    // Resend allows sending from "onboarding@resend.dev" for free testing.
    // Domain authenticated accounts should override using SENDER_EMAIL secret.
    const senderEmail = Deno.env.get('SENDER_EMAIL') || 'GS Legacy Wealth <onboarding@resend.dev>'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Portal Update</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #000000;
            color: #ffffff;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0a0a0a;
            border: 1px solid #c9a227;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
            border-bottom: 1px solid rgba(201, 162, 39, 0.15);
            padding-bottom: 20px;
            margin-bottom: 24px;
            text-align: center;
          }
          .logo {
            color: #c9a227;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          h1 {
            font-size: 18px;
            font-weight: bold;
            color: #c9a227;
            margin-top: 0;
            margin-bottom: 16px;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #a3a3a3;
            margin-bottom: 24px;
          }
          .content-box {
            background-color: rgba(201, 162, 39, 0.05);
            border-left: 3px solid #c9a227;
            padding: 16px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            color: #f0ede6;
            margin-bottom: 28px;
          }
          .btn-container {
            text-align: center;
            margin-bottom: 16px;
          }
          .btn {
            background-color: #c9a227;
            color: #000000;
            text-decoration: none;
            padding: 12px 28px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 8px;
            display: inline-block;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background-color: #dfb83d;
          }
          .footer {
            margin-top: 40px;
            font-size: 11px;
            text-align: center;
            color: #525252;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">GS Legacy Wealth</div>
          </div>
          <h1>${title}</h1>
          <p>You have a new update in your client portal workspace:</p>
          <div class="content-box">
            ${description || '—'}
          </div>
          <div class="btn-container">
            <a href="https://gslegacywealth.com/client/messages" class="btn">View Messages Hub</a>
          </div>
          <p style="font-size: 12px; color: #525252; text-align: center;">
            This is an automated notification. Please do not reply directly to this email.
          </p>
          <div class="footer">
            &copy; 2026 GS Legacy Wealth. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: senderEmail,
        to: email,
        subject: `[Portal Update] ${title}`,
        html: htmlContent,
      }),
    })

    const responseData = await response.json()
    if (!response.ok) {
      console.error(`Resend API error: ${response.status} ${JSON.stringify(responseData)}`)
      return new Response(JSON.stringify({ error: responseData.message || 'Resend API failure' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Email successfully dispatched: ID ${responseData.id}`)
    return new Response(JSON.stringify({ success: true, id: responseData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    console.error(`Send email exception: ${err.message}`)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
