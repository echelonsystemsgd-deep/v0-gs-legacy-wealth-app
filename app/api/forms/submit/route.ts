import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { checkRateLimit } from '@/lib/rate-limit'
import { 
  generateOwnerLeadEmail, 
  generateCustomerConfirmationEmail,
  generateBookingConfirmedEmail,
  generateLoomAuditEmail
} from '@/lib/email-templates'

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
          // Check if lead already exists by email (take latest)
          const { data: existingLead, error: selectError } = await supabaseAdmin
            .from('leads')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(1)
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
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mercian Wealth <hello@mercianwealth.com>'
      const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC'
      const cleanSource = source.replace(/_/g, ' ').toUpperCase()

      const emailPayload = {
        source,
        name,
        email,
        business_name,
        phone,
        website,
        notes: consolidatedNotes,
        linkedin_url,
        service_interested,
        roi_monthly_rev,
        roi_missed_calls,
        roi_annual_savings,
        timestamp,
        crmUrl: 'https://supabase.com/dashboard/project/ladebhmyywkcqtyazxxk/editor'
      }

      // Email A: Notification to business owner (mercianwealthgs@gmail.com)
      const ownerEmailHtml = generateOwnerLeadEmail(emailPayload)

      // Email B: Confirmation to Customer (Lead)
      let customerSubject = "Inquiry Received — Mercian Wealth"
      let customerEmailHtml = ""

      if (source === 'booking_form') {
        customerSubject = "Strategy Call Details Confirmed — Mercian Wealth"
        customerEmailHtml = generateBookingConfirmedEmail({
          name: name || 'Client Partner',
          email,
          businessName: business_name || null,
          meetingDate: payload.meeting_date || 'Date Selected in Calendar',
          meetingTime: payload.meeting_time || 'Selected Time Slot (GMT)',
          meetingLink: payload.meeting_link || 'https://meet.google.com/new',
          timezone: 'GMT / UK Time',
          phone,
          notes: consolidatedNotes
        })
      } else if (source === 'fast_track_audit') {
        customerSubject = "Fast-Track Technical Audit Scheduled — Mercian Wealth"
        customerEmailHtml = generateLoomAuditEmail({
          name: name || 'Client Partner',
          email,
          websiteUrl: website || 'your brand website',
          loomVideoUrl: 'https://mercianwealth.com/book',
        })
      } else {
        if (source === 'portfolio_waitlist') {
          customerSubject = "Early Access Waitlist Registered — Mercian Wealth"
        }
        customerEmailHtml = generateCustomerConfirmationEmail(emailPayload)
      }

      // 1. Notify Owner (Separately insulated)
      try {
        await resend.emails.send({
          from: fromEmail,
          to: process.env.ADMIN_NOTIFY_EMAIL || 'mercianwealthgs@gmail.com',
          replyTo: email,
          subject: `✨ [New Lead] ${name || email} via ${cleanSource}`,
          html: ownerEmailHtml,
        })
      } catch (ownerEmailError: any) {
        console.error('Failed to send Owner lead alert email:', ownerEmailError.message || ownerEmailError)
      }

      // 2. Confirm to Customer (Separately insulated)
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          replyTo: process.env.ADMIN_NOTIFY_EMAIL || 'mercianwealthgs@gmail.com',
          subject: customerSubject,
          html: customerEmailHtml,
        })
      } catch (customerEmailError: any) {
        console.error('Failed to send Customer confirmation email:', customerEmailError.message || customerEmailError)
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
