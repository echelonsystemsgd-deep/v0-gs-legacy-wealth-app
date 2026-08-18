/**
 * lib/email-templates.ts
 *
 * Ultra-Luxury, Mobile-Responsive Transactional Email Templates for Resend.
 * Brand Suite: Canvas Midnight Navy (#020E28), Surface Navy (#07153B), Imperial Gold (#DAA640), Luminous Warm Gold (#EBB755).
 * Built with bulletproof HTML tables compatible with Gmail, Apple Mail, Outlook, iOS & Android.
 */

export interface LeadEmailPayload {
  source: string
  name?: string | null
  email: string
  business_name?: string | null
  phone?: string | null
  website?: string | null
  notes?: string | null
  linkedin_url?: string | null
  service_interested?: string | null
  roi_monthly_rev?: string | number | null
  roi_missed_calls?: string | null
  roi_annual_savings?: string | number | null
  timestamp?: string
  crmUrl?: string
}

export interface BookingEmailPayload {
  name: string
  email: string
  businessName?: string | null
  meetingDate: string
  meetingTime: string
  meetingLink?: string | null
  timezone?: string
  phone?: string | null
  notes?: string | null
}

export interface ClientInvitePayload {
  name: string
  email: string
  companyName?: string | null
  loginUrl: string
  temporaryPassword?: string | null
}

export interface DepositReceiptPayload {
  name: string
  email: string
  companyName?: string | null
  packageName: string
  depositAmount: string | number
  totalAmount?: string | number | null
  invoiceNumber: string
  date: string
  portalUrl?: string
}

export interface LoomAuditPayload {
  name: string
  email: string
  websiteUrl: string
  loomVideoUrl: string
  thumbnailUrl?: string
  keyTakeaways?: string[]
}

const BRAND = {
  name: 'Mercian Wealth',
  tagline: 'UK AI Automations & High-Performance Web Design',
  logoUrl: 'https://mercianwealth.com/MercianWealthLogo.jpeg',
  siteUrl: 'https://mercianwealth.com',
  primaryGold: '#DAA640',
  warmGold: '#EBB755',
  bgNavy: '#020E28',
  cardNavy: '#07153B',
  elevatedNavy: '#0C1D4D',
  textLight: '#F0EDE6',
  textMuted: '#94A3B8',
  supportEmail: 'mercianwealthgs@gmail.com',
  supportPhone: '+44 7851 055929',
  whatsappUrl: 'https://wa.me/447851055929?text=Hi%20Mercian%20Wealth,%20I%20have%20an%20inquiry.'
}

export function escapeHtml(str?: string | null): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 1. OWNER LEAD ALERT (SPEED-TO-LEAD TRIAGE MACHINE)
 * Sent to mercianwealthgs@gmail.com with 1-click Call, WhatsApp, and CRM actions.
 */
export function generateOwnerLeadEmail(payload: LeadEmailPayload): string {
  const cleanSource = escapeHtml((payload.source || 'Website').replace(/_/g, ' ').toUpperCase())
  const time = payload.timestamp || new Date().toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC'
  const safeName = escapeHtml(payload.name) || 'Not Provided'
  const safeEmail = escapeHtml(payload.email)
  const safePhone = escapeHtml(payload.phone)
  const safeBusiness = escapeHtml(payload.business_name)
  const safeService = escapeHtml(payload.service_interested)
  const safeWebsite = escapeHtml(payload.website)
  const safeNotes = escapeHtml(payload.notes)

  const cleanPhoneDigits = payload.phone ? payload.phone.replace(/\D/g, '') : ''
  const whatsappPrefill = encodeURIComponent(`Hi ${payload.name ? payload.name.split(' ')[0] : 'there'}, thanks for reaching out to Mercian Wealth! I received your inquiry regarding ${payload.service_interested || 'our AI & web automation systems'}. When is a good time for a quick 5-min chat?`)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inbound Lead — ${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #010817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010817; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${BRAND.cardNavy}; border: 1px solid rgba(218, 166, 64, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0C1D4D 0%, #07153B 100%); padding: 30px 24px; text-align: center; border-bottom: 1px solid rgba(218, 166, 64, 0.25);">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" style="height: 52px; width: 52px; border-radius: 10px; border: 1px solid rgba(218, 166, 64, 0.4); margin-bottom: 12px; display: inline-block;">
              <h1 style="margin: 0; color: ${BRAND.primaryGold}; font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</h1>
              <p style="margin: 4px 0 0 0; color: ${BRAND.textMuted}; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">⚡ Inbound Lead Alert — ${cleanSource}</p>
            </td>
          </tr>

          <!-- 1-Click Speed-to-Lead Triage Bar -->
          ${cleanPhoneDigits ? `
          <tr>
            <td style="background-color: #020E28; padding: 14px 24px; border-bottom: 1px solid rgba(218, 166, 64, 0.2); text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 11px; font-weight: 700; color: ${BRAND.warmGold}; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">🚀 Quick Response Actions:</span>
                    <a href="https://wa.me/${cleanPhoneDigits}?text=${whatsappPrefill}" target="_blank" style="display: inline-block; background-color: #10B981; color: #020E28; font-size: 12px; font-weight: 800; text-decoration: none; padding: 8px 16px; border-radius: 6px; margin: 0 4px;">💬 WhatsApp Lead</a>
                    <a href="tel:${safePhone}" style="display: inline-block; background-color: #38BDF8; color: #020E28; font-size: 12px; font-weight: 800; text-decoration: none; padding: 8px 16px; border-radius: 6px; margin: 0 4px;">📞 Call Direct</a>
                    <a href="mailto:${safeEmail}" style="display: inline-block; background-color: #DAA640; color: #020E28; font-size: 12px; font-weight: 800; text-decoration: none; padding: 8px 16px; border-radius: 6px; margin: 0 4px;">✉️ Email Reply</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- Lead Information Table -->
          <tr>
            <td style="padding: 28px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600; width: 140px;">Client Name:</td>
                  <td style="padding: 8px 0; color: #FFFFFF; font-size: 15px; font-weight: 700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Email Address:</td>
                  <td style="padding: 8px 0; color: ${BRAND.warmGold}; font-size: 14px; font-family: monospace;">
                    <a href="mailto:${safeEmail}" style="color: ${BRAND.warmGold}; text-decoration: none; font-weight: 700;">${safeEmail}</a>
                  </td>
                </tr>
                ${safePhone ? `
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px; font-family: monospace;">
                    <a href="tel:${safePhone}" style="color: #38BDF8; text-decoration: none; font-weight: 700;">${safePhone}</a>
                  </td>
                </tr>` : ''}
                ${safeBusiness ? `
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Company / Brand:</td>
                  <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px; font-weight: 600;">${safeBusiness}</td>
                </tr>` : ''}
                ${safeService ? `
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Service Interest:</td>
                  <td style="padding: 8px 0; color: ${BRAND.primaryGold}; font-size: 14px; font-weight: 700;">${safeService}</td>
                </tr>` : ''}
                ${safeWebsite ? `
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Website URL:</td>
                  <td style="padding: 8px 0; color: #FFFFFF; font-size: 13px;">
                    <a href="${safeWebsite.startsWith('http') ? safeWebsite : 'https://' + safeWebsite}" target="_blank" style="color: ${BRAND.primaryGold}; text-decoration: underline;">${safeWebsite}</a>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Submission Time:</td>
                  <td style="padding: 8px 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: monospace;">${time}</td>
                </tr>
              </table>

              <!-- ROI Calculator Telemetry -->
              ${(payload.roi_monthly_rev || payload.roi_annual_savings || payload.roi_missed_calls) ? `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020E28; border: 1px solid rgba(218, 166, 64, 0.25); border-radius: 12px; padding: 16px; margin: 16px 0;">
                <tr>
                  <td colspan="2" style="padding-bottom: 8px; color: ${BRAND.primaryGold}; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                    📊 Telemetry: Interactive ROI Calculator Capture
                  </td>
                </tr>
                ${payload.roi_monthly_rev ? `
                <tr>
                  <td style="color: ${BRAND.textMuted}; font-size: 12px; padding: 3px 0;">Monthly Revenue:</td>
                  <td style="color: #FFFFFF; font-size: 13px; font-weight: 700; font-family: monospace;">£${Number(payload.roi_monthly_rev).toLocaleString()}</td>
                </tr>` : ''}
                ${payload.roi_missed_calls ? `
                <tr>
                  <td style="color: ${BRAND.textMuted}; font-size: 12px; padding: 3px 0;">Admin Bottleneck:</td>
                  <td style="color: #FFFFFF; font-size: 13px; font-weight: 700;">${escapeHtml(payload.roi_missed_calls)}</td>
                </tr>` : ''}
                ${payload.roi_annual_savings ? `
                <tr>
                  <td style="color: ${BRAND.textMuted}; font-size: 12px; padding: 3px 0;">Projected Value Unlocked:</td>
                  <td style="color: #34D399; font-size: 14px; font-weight: 800; font-family: monospace;">£${Number(payload.roi_annual_savings).toLocaleString()} / year</td>
                </tr>` : ''}
              </table>` : ''}

              <!-- Inquiry Notes -->
              <div style="background-color: ${BRAND.bgNavy}; border-left: 4px solid ${BRAND.primaryGold}; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: ${BRAND.primaryGold}; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Client Requirements / Notes:</h4>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #FFFFFF; white-space: pre-wrap;">${safeNotes || 'No additional notes provided.'}</p>
              </div>

              <!-- Primary Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td align="center">
                    <a href="${payload.crmUrl || 'https://supabase.com/dashboard/project/ladebhmyywkcqtyazxxk/editor'}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #DAA640 0%, #B88528 100%); color: #020E28; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 20px rgba(218, 166, 64, 0.3);">
                      Open In CRM Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #020E28; padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: ${BRAND.textMuted};">
              <p style="margin: 0;">${BRAND.name} Automated Ingestion Gateway • UK & EU GDPR Compliant</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 2. CUSTOMER GENERAL INQUIRY CONFIRMATION
 * Sent to the lead with 12-hour SLA reassurance.
 */
export function generateCustomerConfirmationEmail(payload: LeadEmailPayload): string {
  const firstName = payload.name ? escapeHtml(payload.name.split(' ')[0]) : 'there'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation — ${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #010817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010817; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${BRAND.cardNavy}; border: 1px solid rgba(218, 166, 64, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0C1D4D 0%, #07153B 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(218, 166, 64, 0.25);">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" style="height: 60px; width: 60px; border-radius: 12px; border: 1px solid rgba(218, 166, 64, 0.4); margin-bottom: 12px; display: inline-block;">
              <h1 style="margin: 0; color: ${BRAND.primaryGold}; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</h1>
              <p style="margin: 4px 0 0 0; color: ${BRAND.textMuted}; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">${BRAND.tagline}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 16px 0;">Hello ${firstName},</p>
              
              <p style="font-size: 15px; line-height: 1.7; color: ${BRAND.textLight}; margin: 0 0 20px 0;">
                Thank you for reaching out to <strong>${BRAND.name}</strong>. We have successfully received your inquiry regarding our <strong>AI Automation Systems & High-Performance Web Design</strong>.
              </p>

              <div style="background-color: ${BRAND.bgNavy}; border: 1px solid rgba(218, 166, 64, 0.25); border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: ${BRAND.primaryGold}; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">✦ What Happens Next</h3>
                <ul style="margin: 0; padding-left: 18px; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.8;">
                  <li><strong>Technical Review:</strong> Our engineering lead is evaluating your inquiry and business profile.</li>
                  <li><strong>12-Hour SLA:</strong> You will receive a direct reply with a custom roadmap proposal within 12 hours.</li>
                  <li><strong>Founder-Level Attention:</strong> We work with a strictly capped cohort each month to guarantee flawless execution.</li>
                </ul>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 30px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${BRAND.siteUrl}/book" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #DAA640 0%, #B88528 100%); color: #020E28; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 15px 32px; border-radius: 10px; box-shadow: 0 4px 20px rgba(218, 166, 64, 0.3); margin-bottom: 12px;">
                      Book Free 15-Min Strategy Call →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${BRAND.whatsappUrl}" target="_blank" style="color: #34D399; font-size: 13px; font-weight: 600; text-decoration: underline;">
                      Have an urgent question? Chat with us on WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020E28; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: ${BRAND.textMuted};">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND.primaryGold};">${BRAND.name} • United Kingdom</p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5;">
                Engineered for High-Converting Digital Operations & AI Infrastructure.<br>
                UK & EU GDPR Compliant with strict data sovereignty guarantees.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 3. STRATEGY CALL / MEETING CONFIRMED
 * Sent to the client with meeting link, preparation checklist, and 1-click Google/Outlook calendar add.
 */
export function generateBookingConfirmedEmail(payload: BookingEmailPayload): string {
  const firstName = payload.name ? escapeHtml(payload.name.split(' ')[0]) : 'there'
  const meetingUrl = payload.meetingLink || 'https://meet.google.com/new'
  const safeDate = escapeHtml(payload.meetingDate)
  const safeTime = escapeHtml(payload.meetingTime)

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('AI Automation & Web Strategy Session — Mercian Wealth')}&details=${encodeURIComponent(`Strategy Session with Mercian Wealth.\n\nVideo Meeting Room: ${meetingUrl}\nDirect WhatsApp: ${BRAND.supportPhone}`)}&location=${encodeURIComponent(meetingUrl)}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strategy Call Confirmed — ${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #010817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010817; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${BRAND.cardNavy}; border: 1px solid rgba(218, 166, 64, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0C1D4D 0%, #07153B 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(218, 166, 64, 0.25);">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" style="height: 60px; width: 60px; border-radius: 12px; border: 1px solid rgba(218, 166, 64, 0.4); margin-bottom: 12px; display: inline-block;">
              <h1 style="margin: 0; color: ${BRAND.primaryGold}; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</h1>
              <p style="margin: 4px 0 0 0; color: #34D399; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">✓ Strategy Session Locked & Confirmed</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 12px 0;">Hello ${firstName},</p>
              
              <p style="font-size: 15px; line-height: 1.7; color: ${BRAND.textLight}; margin: 0 0 24px 0;">
                Your 1-on-1 AI Automation & Web Diagnostic Session is officially scheduled. We have reserved founder-level engineering time for your business.
              </p>

              <!-- Meeting Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020E28; border: 1px solid rgba(218, 166, 64, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600; width: 130px;">📅 Date:</td>
                  <td style="padding: 6px 0; color: #FFFFFF; font-size: 15px; font-weight: 700;">${safeDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">⏰ Time:</td>
                  <td style="padding: 6px 0; color: ${BRAND.warmGold}; font-size: 15px; font-weight: 700; font-family: monospace;">${safeTime} (${escapeHtml(payload.timezone) || 'GMT / UK Time'})</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">📹 Video Link:</td>
                  <td style="padding: 6px 0; color: #38BDF8; font-size: 14px;">
                    <a href="${meetingUrl}" target="_blank" style="color: #38BDF8; text-decoration: underline; font-weight: 700;">Click Here to Join Meeting →</a>
                  </td>
                </tr>
              </table>

              <!-- 1-Click Calendar Add Bar -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${googleCalUrl}" target="_blank" style="display: inline-block; background-color: #020E28; border: 1px solid rgba(218, 166, 64, 0.4); color: ${BRAND.warmGold}; font-size: 11px; font-weight: 700; text-decoration: none; padding: 8px 16px; border-radius: 6px; margin: 0 4px;">+ Add to Google Calendar</a>
                  </td>
                </tr>
              </table>

              <!-- What We Will Cover -->
              <div style="background-color: ${BRAND.bgNavy}; border-left: 4px solid ${BRAND.primaryGold}; padding: 18px 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: ${BRAND.primaryGold}; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">✦ On This Call, We Will Cover:</h4>
                <ol style="margin: 0; padding-left: 18px; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.8;">
                  <li><strong>Speed & Conversion Audit:</strong> Live technical inspection of your current site and bounce rate.</li>
                  <li><strong>Revenue Leakage Identification:</strong> Calculating exact missed booking numbers past business hours.</li>
                  <li><strong>Custom AI Pipeline Blueprint:</strong> Designing your automated WhatsApp, deposit & CRM sync architecture.</li>
                </ol>
              </div>

              <!-- What to Bring Checklist -->
              <div style="background-color: #020E28; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 8px 0; color: ${BRAND.warmGold}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">📋 Quick Preparation Checklist:</h4>
                <ul style="margin: 0; padding-left: 16px; color: ${BRAND.textMuted}; font-size: 13px; line-height: 1.6;">
                  <li>Approximate monthly customer volume or missed inquiries.</li>
                  <li>Current tools you use (e.g. Xero, Stripe, WhatsApp, Calendly).</li>
                </ul>
              </div>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 28px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${meetingUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #DAA640 0%, #B88528 100%); color: #020E28; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 15px 34px; border-radius: 10px; box-shadow: 0 4px 20px rgba(218, 166, 64, 0.3);">
                      Join Video Meeting Room →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <a href="${BRAND.whatsappUrl}" target="_blank" style="color: #34D399; font-size: 12px; font-weight: 600; text-decoration: underline;">
                      Running late or need to reschedule? Message us on WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020E28; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: ${BRAND.textMuted};">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND.primaryGold};">${BRAND.name} • Direct Engineering Line</p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5;">
                Phone / WhatsApp: ${BRAND.supportPhone} • ${BRAND.supportEmail}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 4. CLIENT PORTAL WAR ROOM INVITATION
 */
export function generateClientInviteEmail(payload: ClientInvitePayload): string {
  const firstName = payload.name ? escapeHtml(payload.name.split(' ')[0]) : 'there'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Client Portal Access — ${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #010817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010817; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${BRAND.cardNavy}; border: 1px solid rgba(218, 166, 64, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0C1D4D 0%, #07153B 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(218, 166, 64, 0.25);">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" style="height: 60px; width: 60px; border-radius: 12px; border: 1px solid rgba(218, 166, 64, 0.4); margin-bottom: 12px; display: inline-block;">
              <h1 style="margin: 0; color: ${BRAND.primaryGold}; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</h1>
              <p style="margin: 4px 0 0 0; color: #38BDF8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">Client War Room Access Provisioned</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 14px 0;">Welcome ${firstName},</p>
              
              <p style="font-size: 15px; line-height: 1.7; color: ${BRAND.textLight}; margin: 0 0 24px 0;">
                Your dedicated client portal workspace for <strong>${escapeHtml(payload.companyName) || 'your project'}</strong> has been created. You can now track live sprint milestones, review design mockups, inspect automated workflows, and access your secure document vault.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020E28; border: 1px solid rgba(218, 166, 64, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600; width: 130px;">Authorized Email:</td>
                  <td style="padding: 6px 0; color: #FFFFFF; font-size: 14px; font-weight: 700; font-family: monospace;">${escapeHtml(payload.email)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Access Level:</td>
                  <td style="padding: 6px 0; color: ${BRAND.primaryGold}; font-size: 14px; font-weight: 700;">Verified Client Partner</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 28px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${payload.loginUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #DAA640 0%, #B88528 100%); color: #020E28; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 15px 34px; border-radius: 10px; box-shadow: 0 4px 20px rgba(218, 166, 64, 0.3);">
                      Access Client Portal Workspace →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020E28; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: ${BRAND.textMuted};">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND.primaryGold};">${BRAND.name} Client Operations</p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5;">
                Protected by 256-Bit SSL Encryption and UK & EU GDPR Data Residency Standards.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 5. DEPOSIT PAYMENT RECEIPT & SPRINT KICKOFF
 */
export function generateDepositReceiptEmail(payload: DepositReceiptPayload): string {
  const firstName = payload.name ? escapeHtml(payload.name.split(' ')[0]) : 'there'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deposit Received & Kickoff — ${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #010817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010817; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${BRAND.cardNavy}; border: 1px solid rgba(218, 166, 64, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0C1D4D 0%, #07153B 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(218, 166, 64, 0.25);">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" style="height: 60px; width: 60px; border-radius: 12px; border: 1px solid rgba(218, 166, 64, 0.4); margin-bottom: 12px; display: inline-block;">
              <h1 style="margin: 0; color: ${BRAND.primaryGold}; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</h1>
              <p style="margin: 4px 0 0 0; color: #34D399; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">✓ Payment Confirmed — Sprint 1 Commencing</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 14px 0;">Hello ${firstName},</p>
              
              <p style="font-size: 15px; line-height: 1.7; color: ${BRAND.textLight}; margin: 0 0 24px 0;">
                We have received your upfront deposit payment for <strong>${escapeHtml(payload.packageName)}</strong>. Your dedicated sprint calendar is locked, and development has officially begun.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020E28; border: 1px solid rgba(218, 166, 64, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600; width: 140px;">Invoice Number:</td>
                  <td style="padding: 6px 0; color: #FFFFFF; font-size: 13px; font-family: monospace;">${escapeHtml(payload.invoiceNumber)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Package Selected:</td>
                  <td style="padding: 6px 0; color: #FFFFFF; font-size: 14px; font-weight: 700;">${escapeHtml(payload.packageName)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Deposit Amount Paid:</td>
                  <td style="padding: 6px 0; color: #34D399; font-size: 16px; font-weight: 800; font-family: monospace;">£${escapeHtml(String(payload.depositAmount))}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px; font-weight: 600;">Transaction Date:</td>
                  <td style="padding: 6px 0; color: ${BRAND.textMuted}; font-size: 13px;">${escapeHtml(payload.date)}</td>
                </tr>
              </table>

              <div style="background-color: ${BRAND.bgNavy}; border: 1px solid rgba(218, 166, 64, 0.25); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 12px 0; color: ${BRAND.primaryGold}; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">✦ Next 14-Day Sprint Milestones</h4>
                <ul style="margin: 0; padding-left: 18px; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.8;">
                  <li><strong>Days 1–3:</strong> UI/UX architecture and responsive wireframe sign-off.</li>
                  <li><strong>Days 4–8:</strong> WhatsApp Cloud webhook build, database schema, and payment pipeline.</li>
                  <li><strong>Days 9–12:</strong> End-to-end sandbox stress testing and client staging review.</li>
                  <li><strong>Days 13–14:</strong> Custom domain propagation, DNS lock, and official Go-Live.</li>
                </ul>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 28px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${payload.portalUrl || BRAND.siteUrl + '/login'}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #DAA640 0%, #B88528 100%); color: #020E28; font-size: 14px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 15px 34px; border-radius: 10px; box-shadow: 0 4px 20px rgba(218, 166, 64, 0.3);">
                      Open Project Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020E28; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: ${BRAND.textMuted};">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND.primaryGold};">${BRAND.name} Financial Operations</p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5;">
                Official UK VAT Invoice Generated • Processed via Stripe UK Payment Rails
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 6. FAST-TRACK LOOM VIDEO AUDIT DELIVERY
 */
export function generateLoomAuditEmail(payload: LoomAuditPayload): string {
  const firstName = payload.name ? escapeHtml(payload.name.split(' ')[0]) : 'there'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Video Audit is Ready — ${BRAND.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #010817; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.textLight};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #010817; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${BRAND.cardNavy}; border: 1px solid rgba(218, 166, 64, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #0C1D4D 0%, #07153B 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(218, 166, 64, 0.25);">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" style="height: 60px; width: 60px; border-radius: 12px; border: 1px solid rgba(218, 166, 64, 0.4); margin-bottom: 12px; display: inline-block;">
              <h1 style="margin: 0; color: ${BRAND.primaryGold}; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${BRAND.name}</h1>
              <p style="margin: 4px 0 0 0; color: #38BDF8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">🎥 Custom Video Audit & Opportunity Roadmap</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 14px 0;">Hello ${firstName},</p>
              
              <p style="font-size: 15px; line-height: 1.7; color: ${BRAND.textLight}; margin: 0 0 24px 0;">
                Our engineering team has completed a personalized 5-minute video audit of your digital presence for: <strong>${escapeHtml(payload.websiteUrl)}</strong>.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020E28; border: 2px solid ${BRAND.primaryGold}; border-radius: 14px; overflow: hidden; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 30px 20px; background: linear-gradient(180deg, #0C1D4D 0%, #020E28 100%);">
                    <div style="font-size: 40px; margin-bottom: 10px;">▶️</div>
                    <h3 style="margin: 0 0 6px 0; color: #FFFFFF; font-size: 18px; font-weight: 800;">Watch Your 5-Minute Technical Audit</h3>
                    <p style="margin: 0 0 18px 0; color: ${BRAND.textMuted}; font-size: 12px;">Reviewing speed, conversion friction, and missed WhatsApp order capture</p>
                    <a href="${payload.loomVideoUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #DAA640 0%, #B88528 100%); color: #020E28; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 13px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(218, 166, 64, 0.4);">
                      Click Here to Watch Video →
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 28px; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="${BRAND.siteUrl}/book" target="_blank" style="display: inline-block; background: transparent; border: 2px solid ${BRAND.primaryGold}; color: ${BRAND.primaryGold}; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; padding: 13px 28px; border-radius: 10px;">
                      Schedule Implementation Call →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020E28; padding: 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: ${BRAND.textMuted};">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND.primaryGold};">${BRAND.name} • Engineering Advisory</p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5;">
                Engineered exclusively for high-growth United Kingdom enterprises.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
