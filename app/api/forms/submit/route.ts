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
    const { source, name, email, business_name, phone, website, notes, linkedin_url, service_interested } = payload

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    if (!source) {
      return NextResponse.json({ error: 'Form source identifier is required' }, { status: 400 })
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
                notes: notes || existingLead.notes,
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
                notes: notes || 'Booking request qualification',
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
            notes: notes || 'Contact Form Submission',
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
            notes: notes || 'Waitlist registration for under-construction site',
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
            notes: notes || 'Request for a 5-minute Loom video audit of existing site.',
            status: 'New',
            source: 'fast_track_audit',
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

      // Email A: Notification to business owner (gslegacywealth@gmail.com)
      const ownerEmailHtml = `
        <div style="background-color: #0A0A0A; color: #F0EDE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #C9A227;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #C5A059; font-family: serif; font-size: 24px; margin: 0 0 10px 0; letter-spacing: 1px;">MERCIAN WEALTH</h2>
            <p style="color: #8E8E93; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">New Inbound Form Submission</p>
          </div>
          
          <div style="border-top: 1px solid rgba(201, 162, 39, 0.2); padding-top: 20px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; width: 140px; font-weight: bold;">Form Source:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px; font-weight: bold; color: #C9A227;">${cleanSource}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px;">${name || 'Not Provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Email Address:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px; font-family: monospace;">${email}</td>
              </tr>
              ${business_name ? `
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Business/Brand:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px;">${business_name}</td>
              </tr>` : ''}
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Phone Number:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px; font-family: monospace;">${phone}</td>
              </tr>` : ''}
              ${linkedin_url ? `
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">LinkedIn URL:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px;"><a href="${linkedin_url}" style="color: #6d28d9; text-decoration: underline;">${linkedin_url}</a></td>
              </tr>` : ''}
              ${website ? `
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Website URL:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 14px;"><a href="${website}" style="color: #6d28d9; text-decoration: underline;">${website}</a></td>
              </tr>` : ''}
              <tr>
                <td style="padding: 8px 0; color: #8E8E93; font-size: 13px; font-weight: bold;">Timestamp:</td>
                <td style="padding: 8px 0; color: #F0EDE6; font-size: 13px; color: #8E8E93;">${timestamp}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #161616; padding: 20px; border-left: 3px solid #6d28d9; margin-bottom: 30px;">
            <h4 style="color: #C9A227; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message / Inquiry Details</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #F0EDE6;">${notes || 'No message details provided.'}</p>
          </div>

          <div style="text-align: center; border-t: 1px solid rgba(201, 162, 39, 0.2); padding-top: 20px;">
            <a href="https://supabase.com/dashboard/project/ladebhmyywkcqtyazxxk/editor" style="display: inline-block; background-color: #6d28d9; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 12px 24px; border: 1px solid #C9A227; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">View in CRM Dashboard</a>
          </div>
        </div>
      `

      // Email B: Confirmation to the Customer (Lead)
      let customerGreeting = name ? `Dear ${name.split(' ')[0]}` : 'Hello'
      let customerSubject = "Inquiry Received — Mercian Wealth"
      let customerBodyHeader = "We have received your details."
      let customerBodyText = "A member of our digital strategy team is conducting an initial assessment of your brand and will contact you directly within 12 hours."
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
        actionButtonText = "Explore Our Services"
        actionButtonUrl = "https://mercianwealth.com/portfolio"
      } else if (source === 'fast_track_audit') {
        customerSubject = "Fast-Track Audit Request Secured — Mercian Wealth"
        customerBodyHeader = "Your Loom audit request is scheduled."
        customerBodyText = `Thank you for requesting a 5-minute speed, SEO, and operational leverage review of your site: ${website || 'your brand'}. An engineering lead will record and transmit your video audit link within 12 hours.`
        actionButtonText = "Book Full Systems Consultation"
        actionButtonUrl = "https://mercianwealth.com/book"
      }

      const customerEmailHtml = `
        <div style="background-color: #0A0A0A; color: #F0EDE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: left; max-width: 600px; margin: 0 auto; border: 1px solid #C9A227;">
          <div style="text-align: center; margin-bottom: 35px;">
            <img src="${getLogoUrl()}" alt="Mercian Wealth Logo" style="height: 60px; margin-bottom: 15px; display: inline-block;" />
            <h2 style="color: #C5A059; font-family: serif; font-size: 26px; margin: 0 0 5px 0; font-weight: bold; letter-spacing: 1px;">MERCIAN WEALTH</h2>
            <p style="color: #8E8E93; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Digital Systems & AI Engineering</p>
          </div>

          <div style="border-top: 1px solid rgba(201, 162, 39, 0.25); padding-top: 30px; margin-bottom: 30px;">
            <p style="font-size: 16px; font-weight: bold; color: #FFFFFF; margin: 0 0 15px 0;">${customerGreeting},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #F0EDE6; margin: 0 0 20px 0;">${customerBodyHeader} ${customerBodyText}</p>
            <p style="font-size: 14px; line-height: 1.7; color: #8E8E93; margin: 0 0 30px 0;">We work only with a limited number of high-performing brands each month to guarantee founder-level engineering for every project.</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${actionButtonUrl}" style="display: inline-block; background-color: #6d28d9; color: #FFFFFF; font-weight: bold; text-decoration: none; padding: 14px 28px; border: 1px solid #C9A227; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.3s ease;">${actionButtonText}</a>
            </div>
          </div>

          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 25px; text-align: center; font-size: 12px; color: #8E8E93;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #C5A059;">MERCIAN WEALTH</p>
            <p style="margin: 0 0 15px 0; font-style: italic;">Building Wealth. Creating Legacy. Giving Back.</p>
            <p style="margin: 0; font-size: 10px; color: rgba(255,255,255,0.4);">If you have any questions, reply directly to this email or reach us on WhatsApp.</p>
          </div>
        </div>
      `

      // Dispatch emails asynchronously
      try {
        // 1. Notify Owner
        await resend.emails.send({
          from: fromEmail,
          to: 'info@mercianwealth.com',
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

    // 3. Dispatch to n8n Webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const shouldDispatchN8n = source === 'contact_form' || source === 'portfolio_waitlist'
    if (n8nWebhookUrl && shouldDispatchN8n) {
      try {
        const { utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, user_agent } = payload
        const webhookPayload = {
          lead_id: insertedLead?.id || null,
          source,
          name,
          email,
          business_name,
          phone: phone || null,
          website: website || null,
          notes,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_term: utm_term || null,
          utm_content: utm_content || null,
          referrer: referrer || null,
          user_agent: user_agent || null,
          timestamp: new Date().toISOString(),
        }

        console.log('[API/Submit] Dispatching payload to n8n:', n8nWebhookUrl)
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })
      } catch (err: any) {
        console.error('[API/Submit] Error dispatching to n8n webhook:', err.message || err)
      }
    }

    return NextResponse.json({ success: true, lead: insertedLead })
  } catch (err: any) {
    console.error('Form submission handler error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
