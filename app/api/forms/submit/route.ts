import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { checkRateLimit } from '@/lib/rate-limit'

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Get absolute logo URL for branded emails
const getLogoUrl = () => {
  const prodUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mercianwealth.co.uk'
  return `${prodUrl}/MercianWealthLogo.jpeg`
}

export async function POST(request: Request) {
  try {
    // 0. Extract client IP and enforce rate limiting (max 10 requests per 2 minutes)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1'

    const rateLimit = checkRateLimit(clientIp, { limit: 10, windowMs: 2 * 60 * 1000 })
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment before trying again.' },
        { status: 429 }
      )
    }

    const payload = await request.json()
    const { 
      source, 
      name, 
      email, 
      business_name, 
      phone, 
      website, 
      notes, 
      linkedin_url, 
      service_interested,
      // Honeypot fields (should be empty for legitimate users)
      _hp_company,
      hp_title,
      website_url_hp,
      // Optional ROI calculator telemetry
      roi_leakage,
      roi_annual_savings,
      roi_missed_calls,
      roi_monthly_rev
    } = payload

    // Silent trap for bot submissions
    if (_hp_company || hp_title || website_url_hp) {
      console.warn(`[API/Submit] Honeypot triggered from IP: ${clientIp}. Silently dropping submission.`)
      return NextResponse.json({ success: true, lead: null, filtered: true })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    if (!source) {
      return NextResponse.json({ error: 'Form source identifier is required' }, { status: 400 })
    }

    // Build consolidated notes including ROI calculator telemetry if present
    let consolidatedNotes = notes || ''
    if (roi_leakage || roi_annual_savings || roi_monthly_rev) {
      const roiSummary = `\n[ROI Calculator Telemetry]\nMonthly Rev: ${roi_monthly_rev || 'N/A'}\nMissed Opportunities/Calls: ${roi_missed_calls || 'N/A'}\nEst. Monthly Leakage: £${roi_leakage || 0}\nEst. Annual Savings: £${roi_annual_savings || 0}`
      consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n${roiSummary}` : roiSummary.trim()
    }

    // 1. Persist submission in Supabase (Non-blocking fallback if DB is not configured or fails)
    let dbError = null
    let insertedLead = null
    let dbSaved = false

    if (supabaseAdmin) {
      try {
        if (source === 'booking_form') {
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
                name: name || existingLead.name,
                business_name: business_name || existingLead.business_name,
                website: website || existingLead.website,
                phone: phone || existingLead.phone,
                linkedin_url: linkedin_url || existingLead.linkedin_url,
                notes: consolidatedNotes || existingLead.notes,
                service_interested: service_interested || existingLead.service_interested,
                status: 'New',
                source: 'booking_form',
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
                name: name || 'Anonymous Scheduler',
                email: email,
                business_name: business_name || 'N/A (Booking Form)',
                phone: phone || null,
                linkedin_url: linkedin_url || null,
                website: website || null,
                notes: consolidatedNotes || 'Booking request qualification',
                service_interested: service_interested || null,
                status: 'New',
                source: 'booking_form',
              })
              .select()
              .single()

            dbError = error
            insertedLead = data
          }
        } else if (source === 'contact_form') {
          // Normal insert for contact form
          const { data, error } = await supabaseAdmin.from('leads').insert({
            name: name || 'Anonymous Contact',
            email: email,
            business_name: business_name || 'N/A (Contact Form)',
            phone: phone || null,
            notes: consolidatedNotes || 'Contact Form Submission',
            status: 'New',
            source: 'contact_form',
          }).select().single()

          dbError = error
          insertedLead = data
        } else if (source === 'portfolio_waitlist') {
          // Insert for portfolio waitlist
          const { data, error } = await supabaseAdmin.from('leads').insert({
            name: name || 'Anonymous Visitor',
            email: email,
            business_name: 'N/A (Portfolio Waitlist)',
            website: website || null, // Stores the portfolio item URL
            notes: consolidatedNotes || 'Waitlist registration for under-construction site',
            status: 'New',
            source: 'portfolio_waitlist',
          }).select().single()

          dbError = error
          insertedLead = data
        } else if (source === 'fast_track_audit') {
          // Insert for fast-track Loom audit
          const { data, error } = await supabaseAdmin.from('leads').insert({
            name: name || 'Anonymous Fast-Track',
            email: email,
            business_name: business_name || 'N/A (Fast-Track Loom Audit)',
            website: website || null, // Stores the target website URL to audit
            notes: consolidatedNotes || 'Request for a 5-minute Loom video audit of existing site.',
            status: 'New',
            source: 'fast_track_audit',
          }).select().single()

          dbError = error
          insertedLead = data
        } else if (source === 'local_business_form') {
          // Insert for local business form
          const { data, error } = await supabaseAdmin.from('leads').insert({
            name: name || 'Anonymous Local Lead',
            email: email,
            business_name: business_name || 'N/A (Local Business Form)',
            phone: phone || null,
            service_interested: service_interested || null,
            notes: consolidatedNotes || 'Local Business Form Submission',
            status: 'New',
            source: 'local_business_form',
            lead_type: 'local_business',
            source_url: payload.source_url || 'https://mercianwealth.com/local',
            local_business_niche: payload.local_business_niche || null,
          }).select().single()

          dbError = error
          insertedLead = data
        } else {
          return NextResponse.json({ error: `Unsupported form source: ${source}` }, { status: 400 })
        }

        if (dbError) {
          console.error('Database write failed:', dbError.message)
          return NextResponse.json({ error: `Database write failed: ${dbError.message}` }, { status: 500 })
        } else {
          dbSaved = true
        }
      } catch (err: any) {
        console.error('Unhandled database error during lead submission:', err.message || err)
        return NextResponse.json({ error: `Database error: ${err.message || err}` }, { status: 500 })
      }
    } else {
      console.warn('Supabase admin client not initialized. Missing environment variables. Skipping database persistence.')
      return NextResponse.json({ error: 'Database client not initialized. Verify SUPABASE_SERVICE_ROLE_KEY and URL in environment configuration.' }, { status: 500 })
    }

    // 2. Email Notifications (Transactional via Resend)
    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Skipping email alerts.')
    } else {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mercian Wealth <onboarding@resend.dev>'
      const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC'
      const cleanSource = source.replace('_', ' ').toUpperCase()

      // Email A: Notification to business owner (mercianwealthgs@gmail.com)
      const ownerEmailHtml = `
        <div style="background-color: #0A1128; color: #F0EDE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #D4AF37; font-family: sans-serif; font-size: 24px; margin: 0 0 10px 0; letter-spacing: 1.5px; font-weight: bold;">MERCIAN WEALTH</h2>
            <p style="color: #A0AEC0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">New Inbound Lead Submission</p>
          </div>
          
          <div style="border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 20px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; width: 140px; font-weight: bold;">Form Source:</td>
                <td style="padding: 8px 0; color: #D4AF37; font-size: 14px; font-weight: bold;">${cleanSource}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${name || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Email Address:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px; font-family: monospace;">${email}</td>
              </tr>
              ${business_name ? `
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Business/Brand:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${business_name}</td>
              </tr>` : ''}
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Phone Number:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px; font-family: monospace;">${phone}</td>
              </tr>` : ''}
              ${service_interested ? `
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Service Interest:</td>
                <td style="padding: 8px 0; color: #D4AF37; font-size: 14px;">${service_interested}</td>
              </tr>` : ''}
              ${linkedin_url ? `
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">LinkedIn URL:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;"><a href="${linkedin_url}" style="color: #D4AF37; text-decoration: underline;">${linkedin_url}</a></td>
              </tr>` : ''}
              ${website ? `
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Website URL:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;"><a href="${website}" style="color: #D4AF37; text-decoration: underline;">${website}</a></td>
              </tr>` : ''}
              <tr>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px; font-weight: bold;">Timestamp:</td>
                <td style="padding: 8px 0; color: #A0AEC0; font-size: 13px;">${timestamp}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #101B3B; padding: 20px; border-left: 3px solid #D4AF37; border-radius: 4px; margin-bottom: 30px;">
            <h4 style="color: #D4AF37; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message / Inquiry Details</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #F0EDE6;">${consolidatedNotes || 'No message details provided.'}</p>
          </div>

          <div style="text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 20px;">
            <a href="https://supabase.com/dashboard/project/ladebhmyywkcqtyazxxk/editor" style="display: inline-block; background-color: #D4AF37; color: #0A1128; font-weight: bold; text-decoration: none; padding: 12px 24px; border: 1px solid #F5D77F; border-radius: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">View in CRM Dashboard</a>
          </div>
        </div>
      `

      // Email B: Confirmation to the Customer (Lead)
      let customerGreeting = name ? `Dear ${name.split(' ')[0]}` : 'Hello'
      let customerSubject = "Inquiry Received — Mercian Wealth"
      let customerBodyHeader = "We have received your details."
      let customerBodyText = "A member of our team is conducting an initial assessment of your requirements and will contact you directly within 12 hours."
      let actionButtonText = "Book Strategy Call"
      let actionButtonUrl = "https://mercianwealth.com/book"

      if (source === 'booking_form') {
        customerSubject = "Details Confirmed — Mercian Wealth"
        customerBodyHeader = "Your qualification details are secured."
        customerBodyText = "Thank you for completing the strategy call qualifier. If you did not finish booking your session in the calendar, please click the button below to reserve a slot."
        actionButtonText = "Choose Call Slot"
      } else if (source === 'portfolio_waitlist') {
        customerSubject = "Waitlist Registered — Mercian Wealth"
        customerBodyHeader = "You are in the queue."
        customerBodyText = "We have recorded your email request for early access. You will receive an immediate notification as soon as the platform goes live."
        actionButtonText = "Explore Our Systems"
        actionButtonUrl = "https://mercianwealth.com/portfolio"
      } else if (source === 'fast_track_audit') {
        customerSubject = "Fast-Track Audit Request Secured — Mercian Wealth"
        customerBodyHeader = "Your Loom audit request is scheduled."
        customerBodyText = `Thank you for requesting a 5-minute speed, SEO, and operational leverage review of your site: ${website || 'your brand'}. An engineering lead will record and transmit your video audit link within 12 hours.`
        actionButtonText = "Book Full Systems Consultation"
        actionButtonUrl = "https://mercianwealth.com/book"
      }

      const customerEmailHtml = `
        <div style="background-color: #0A1128; color: #F0EDE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 35px;">
            <img src="${getLogoUrl()}" alt="Mercian Wealth Logo" style="height: 60px; margin-bottom: 15px; display: inline-block; border-radius: 4px;" />
            <h2 style="color: #D4AF37; font-family: sans-serif; font-size: 26px; margin: 0 0 5px 0; font-weight: bold; letter-spacing: 1.5px;">MERCIAN WEALTH</h2>
            <p style="color: #A0AEC0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Bespoke Digital Systems & Automation</p>
          </div>

          <div style="border-top: 1px solid rgba(212, 175, 55, 0.25); padding-top: 30px; margin-bottom: 30px;">
            <p style="font-size: 16px; font-weight: bold; color: #FFFFFF; margin: 0 0 15px 0;">${customerGreeting},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #F0EDE6; margin: 0 0 20px 0;">${customerBodyHeader} ${customerBodyText}</p>
            <p style="font-size: 14px; line-height: 1.7; color: #A0AEC0; margin: 0 0 30px 0;">We work with a limited client cohort each month to guarantee founder-level engineering and direct attention for every deployment.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${actionButtonUrl}" style="display: inline-block; background-color: #D4AF37; color: #0A1128; font-weight: bold; text-decoration: none; padding: 14px 28px; border: 1px solid #F5D77F; border-radius: 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">${actionButtonText}</a>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 25px; text-align: center; font-size: 12px; color: #A0AEC0;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #D4AF37;">MERCIAN WEALTH</p>
            <p style="margin: 0 0 15px 0; font-style: italic;">Engineered for High-Performance Growth.</p>
            <p style="margin: 0; font-size: 10px; color: rgba(255,255,255,0.5);">If you have any questions, reply directly to this email or reach us on WhatsApp.</p>
          </div>
        </div>
      `

      // Dispatch emails asynchronously
      try {
        // 1. Notify Owner
        await resend.emails.send({
          from: fromEmail,
          to: process.env.ADMIN_NOTIFY_EMAIL || 'mercianwealthgs@gmail.com',
          subject: `✨ [New Lead] ${name || email} via ${cleanSource}`,
          html: ownerEmailHtml,
        })

        // 2. Confirm to Customer (only if domain is verified/configured, or if sandbox email fits)
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: customerSubject,
          html: customerEmailHtml,
        })
      } catch (emailError: any) {
        // Log error but do NOT crash the response, since the database insert succeeded
        console.error('Failed to send Resend emails:', emailError.message || emailError)
      }
    }

    // 3. Dispatch to n8n Webhook with Resilient Timeout & Single-Retry
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      const { utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, user_agent } = payload
      const webhookPayload = {
        lead_id: insertedLead?.id || null,
        source,
        lead_type: payload.lead_type || (source === 'local_business_form' ? 'local_business' : 'studio'),
        source_url: payload.source_url || null,
        local_business_niche: payload.local_business_niche || null,
        service_interested: service_interested || null,
        name: name || null,
        email,
        business_name: business_name || null,
        phone: phone || null,
        website: website || null,
        notes: notes || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_term: utm_term || null,
        utm_content: utm_content || null,
        referrer: referrer || null,
        user_agent: user_agent || null,
        timestamp: new Date().toISOString(),
      }

      console.log(`[API/Submit] Dispatching payload to n8n (${source}):`, n8nWebhookUrl)

      const dispatchN8n = async (attempt = 1) => {
        try {
          const res = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
            signal: AbortSignal.timeout(6000), // 6 second resilient timeout
          })

          if (!res.ok && attempt < 2) {
            console.warn(`[API/Submit] n8n returned ${res.status}. Retrying once...`)
            await new Promise(r => setTimeout(r, 600))
            await dispatchN8n(attempt + 1)
          }
        } catch (err: any) {
          if (attempt < 2) {
            console.warn(`[API/Submit] n8n dispatch attempt ${attempt} failed (${err.name || err.message}). Retrying...`)
            await new Promise(r => setTimeout(r, 600))
            await dispatchN8n(attempt + 1)
          } else {
            console.error('[API/Submit] n8n webhook failed after retries:', err.message || err)
          }
        }
      }

      // Execute webhook dispatch non-blockingly for optimal client response time
      dispatchN8n().catch(err => console.error('[API/Submit] n8n unhandled exception:', err))
    }

    return NextResponse.json({ success: true, lead: insertedLead })
  } catch (err: any) {
    console.error('Form submission handler error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
