# Resend Transactional Email Ecosystem Architecture

## Overview
A complete, luxury-branded transactional email ecosystem powered by Resend (`RESEND_API_KEY`). Designed specifically for UK AI Automation & High-Performance Web Design operations with bulletproof HTML table layouts compatible across Apple Mail, Gmail, Outlook, iOS, and Android.

---

## 🏛️ Brand Design Standard
- **Canvas Primary**: Midnight Navy `#020E28`
- **Surface Cards**: `#07153B`
- **Accent Monogram**: Imperial Gold `#DAA640`
- **Text Highlight**: Luminous Warm Gold `#EBB755`
- **Typography**: Clean system sans-serif with high contrast and readable line-height
- **Legal & Compliance**: UK & EU GDPR compliance and data sovereignty badge on all outgoing emails

---

## 📧 The 6 Core Email Templates (`lib/email-templates.ts`)

### 1. Inbound Lead Alert (`generateOwnerLeadEmail`)
- **Recipient**: `mercianwealthgs@gmail.com`
- **Triggers**: Form submission on `/contact`, `/local`, or `/book`.
- **Payload**: Full name, business, phone with 1-click WhatsApp link, ROI calculator telemetry, inquiry notes, and 1-click CRM link.

### 2. General Inquiry Confirmation (`generateCustomerConfirmationEmail`)
- **Recipient**: Prospective client.
- **Triggers**: Contact / local business inquiry submission.
- **Payload**: Personalized greeting, 12-hour SLA commitment, founder-level attention, strategy call CTA, and WhatsApp direct contact.

### 3. Strategy Call & Meeting Confirmed (`generateBookingConfirmedEmail`)
- **Recipient**: Prospective client who scheduled a call.
- **Triggers**: Completed Calendly or custom booking flow.
- **Payload**: Date & time in UK GMT/BST, video call link (Google Meet/Zoom), 1-click Google/Outlook/Apple Calendar add links, pre-call preparation checklist, and WhatsApp support.

### 4. Client Portal War Room Invite (`generateClientInviteEmail`)
- **Recipient**: Onboarded client.
- **Triggers**: Admin invites client from dashboard (`/api/admin/invite-client`).
- **Payload**: One-click secure login link, credentials, vault access overview, and kickoff instructions.

### 5. Deposit Receipt & Project Kickoff (`generateDepositReceiptEmail`)
- **Recipient**: Client who paid a 50% upfront deposit or retainer.
- **Triggers**: Stripe checkout completion webhook.
- **Payload**: Official VAT receipt, payment breakdown, 14-day sprint roadmap, and portal link.

### 6. Fast-Track Loom Video Audit Delivery (`generateLoomAuditEmail`)
- **Recipient**: Lead requesting site audit.
- **Triggers**: Fast-track review request.
- **Payload**: High-res clickable Loom video preview, 3 key automation/speed recommendations, and strategy call booking CTA.

---

## ⚡ Active Ingestion Routes
- `POST /api/forms/submit` -> Dispatches `generateOwnerLeadEmail` and `generateCustomerConfirmationEmail` / `generateBookingConfirmedEmail`
- `POST /api/admin/invite-client` -> Dispatches `generateClientInviteEmail`
- `POST /api/webhooks/stripe` -> Dispatches `generateDepositReceiptEmail`
