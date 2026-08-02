import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Get absolute logo URL for branded emails
const getLogoUrl = () => {
  const prodUrl = 'https://mercianwealth.com'
  return `${prodUrl}/MercianWealthlogo.jpeg`
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { name, email, project_name } = payload

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
    }

    if (!project_name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    // 1. Persist submission in Supabase
    let dbError = null
    let insertedLead = null
    let dbSaved = false

    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('portfolio_requests')
          .insert({
            name,
            email,
            project_name,
            utm_source: payload.utm_source || null,
            utm_medium: payload.utm_medium || null,
            utm_campaign: payload.utm_campaign || null,
            utm_term: payload.utm_term || null,
            utm_content: payload.utm_content || null,
            referrer: payload.referrer || null,
            user_agent: payload.user_agent || null,
          })
          .select()
          .single()

        dbError = error
        insertedLead = data

        if (dbError) {
          console.error('Database write failed for portfolio request:', dbError.message)
          return NextResponse.json({ error: `Database write failed: ${dbError.message}` }, { status: 500 })
        } else {
          dbSaved = true
        }
      } catch (err: any) {
        console.error('Unhandled database error during portfolio request:', err.message || err)
        return NextResponse.json({ error: `Database error: ${err.message || err}` }, { status: 500 })
      }
    } else {
      console.warn('Supabase admin client not initialized. Skipping database persistence.')
      return NextResponse.json({ error: 'Database client not initialized. Verify SUPABASE_SERVICE_ROLE_KEY and URL in environment configuration.' }, { status: 500 })
    }

    // 2. Email Notifications (Transactional via Resend)
    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Skipping email alerts.')
    } else {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mercian Wealth <onboarding@resend.dev>'
      const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC'

      // Email A: Notification to business owner (mercianwealthgs@gmail.com)
      const ownerEmailHtml = `
        <div style="background-color: #0A0A0A; color: #F0EDE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #C9A227;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #C5A059; font-family: serif; font-size: 24px; margin: 0 0 10px 0; letter-spacing: 1px;">MERCIAN WEALTH</h2>
            <p style="color: #8E8E93; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">New System Schema Request</p>
          </div>
          
          <div style="border-top: 1px solid rgba(201, 162, 39, 0.2); padding-top: 20px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; width: 140px; font-weight: bold;">Requested Project:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px; font-weight: bold; color: #C9A227;">${project_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Email Address:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px; font-family: monospace;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Timestamp:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 13px; color: #8E8E93;">${timestamp}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; border-t: 1px solid rgba(201, 162, 39, 0.2); padding-top: 20px;">
            <a href="https://supabase.com/dashboard/project/ladebhmyywkcqtyazxxk/editor" style="display: inline-block; background-color: #6d28d9; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 12px 24px; border: 1px solid #C9A227; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">View in CRM Dashboard</a>
          </div>
        </div>
      `

      // Email B: Confirmation to the Customer (Lead)
      const customerGreeting = `Dear ${name.split(' ')[0]}`
      const customerSubject = `🔓 Schema Access Secured: ${project_name} — Mercian Wealth`
      const customerEmailHtml = `
        <div style="background-color: #0A0A0A; color: #F0EDE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #C9A227;">
          <div style="text-align: center; margin-bottom: 35px;">
            <img src="${getLogoUrl()}" alt="Mercian Wealth Logo" style="height: 60px; margin-bottom: 15px; display: inline-block;" />
            <h2 style="color: #C5A059; font-family: serif; font-size: 26px; margin: 0 0 5px 0; font-weight: bold; letter-spacing: 1px;">MERCIAN WEALTH</h2>
            <p style="color: #8E8E93; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Digital Systems & AI Engineering</p>
          </div>

          <div style="border-top: 1px solid rgba(201, 162, 39, 0.25); padding-top: 30px; margin-bottom: 30px;">
            <p style="font-size: 16px; font-weight: bold; color: #FFFFFF; margin: 0 0 15px 0;">${customerGreeting},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #F0EDE6; margin: 0 0 20px 0;">Your request for the sanitized system schema and case study for <strong>${project_name}</strong> has been secured.</p>
            <p style="font-size: 15px; line-height: 1.7; color: #F0EDE6; margin: 0 0 20px 0;">A digital systems architect is preparing the blueprint package and Loom walkthrough video. They will transmit these assets directly to this email address shortly.</p>
            <p style="font-size: 14px; line-height: 1.7; color: #8E8E93; margin: 0 0 30px 0;">We work only with a limited number of high-performing brands each month to guarantee founder-level engineering for every project.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://mercianwealth.com/book" style="display: inline-block; background-color: #6d28d9; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 14px 28px; border: 1px solid #C9A227; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.3s ease;">Book Systems Audit</a>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 25px; text-align: center; font-size: 12px; color: #8E8E93;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #C5A059;">MERCIAN WEALTH</p>
            <p style="margin: 0 0 15px 0; font-style: italic;">Align, Protect, Multiply, Legacy.</p>
            <p style="margin: 0; font-size: 10px; color: rgba(255,255,255,0.4);">If you have any questions, reply directly to this email or reach us on WhatsApp.</p>
          </div>
        </div>
      `

      // Dispatch emails
      try {
        // 1. Notify Owner
        await resend.emails.send({
          from: fromEmail,
          to: process.env.ADMIN_NOTIFY_EMAIL || 'mercianwealthgs@gmail.com',
          subject: `✨ [Schema Request] ${name} requested ${project_name}`,
          html: ownerEmailHtml,
        })

        // 2. Confirm to Customer
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: customerSubject,
          html: customerEmailHtml,
        })
      } catch (emailError: any) {
        console.error('Failed to send Resend emails for portfolio request:', emailError.message || emailError)
      }
    }

    // 3. Dispatch to n8n Webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      try {
        const { utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, user_agent } = payload
        const webhookPayload = {
          lead_id: insertedLead?.id || null,
          source: 'portfolio_request',
          name,
          email,
          project_name,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_term: utm_term || null,
          utm_content: utm_content || null,
          referrer: referrer || null,
          user_agent: user_agent || null,
          timestamp: new Date().toISOString(),
        }

        console.log('[API/PortfolioRequest] Dispatching payload to n8n:', n8nWebhookUrl)
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })
      } catch (err: any) {
        console.error('[API/PortfolioRequest] Error dispatching to n8n webhook:', err.message || err)
      }
    }

    return NextResponse.json({ success: true, lead: insertedLead })
  } catch (err: any) {
    console.error('Portfolio request submission handler error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
