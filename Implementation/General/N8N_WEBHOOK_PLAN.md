# Operational & Integration Audit Intercept Flow

This implementation plan outlines the engineering steps to intercept the audit CTAs on `gslegacywealth.com`. Instead of routing users directly to Calendly (`/book`), we will capture structured details via a luxury branded modal form on the landing page. The data is saved to Supabase (extending the existing `leads` table schema) and sent to n8n (via a Vercel serverless API route to prevent CORS issues) before redirecting the lead to Calendly with pre-filled parameters.

## User Review Required

> [!IMPORTANT]
> **Database Schema Compatibility**: The existing `leads` table already contains several columns (`name`, `business_name`, `email`, `phone`, `status`, etc.) and is queried actively by the admin dashboard. To prevent breaking existing dashboard views, we will add new fields (`first_name`, `last_name`, `industry`, `tier`, `gdpr_consent`, `source_page`) to the existing `leads` table rather than recreating it. When inserting, we will populate BOTH the old fields (e.g. `name` as `first_name + ' ' + last_name`) and the new fields.
>
> **Environment Configuration**: We need to configure the `N8N_WEBHOOK_URL` in Vercel. We will add a placeholder value in `.env` and `.env.local` for local development.

## Open Questions

- *Calendly Booking URL*: We will use the existing `NEXT_PUBLIC_CALENDLY_URL` from environment variables, pre-filling the `name` and `email` parameters on redirect. Is there any additional parameter from Calendly that needs mapping?

## Proposed Changes

---

### Database Layer (Supabase)

We need to add the new audit form fields to the existing `leads` table.

#### [NEW] [20260629140000_add_audit_lead_fields.sql](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260629140000_add_audit_lead_fields.sql)
Create a new migration script to add the required columns:
```sql
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS source_page TEXT;
```

---

### Backend API (Vercel Route)

We will create a new API route specifically for processing the audit modal submission.

#### [NEW] [route.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/api/audit/route.ts)
A Next.js API route that:
- Reads `N8N_WEBHOOK_URL` and `SUPABASE_SERVICE_ROLE_KEY` from environment variables.
- Inserts the lead record into the Supabase database. It populates `name` with `${first_name} ${last_name}` and `business_name` with the selected `industry` (or a fallback) to maintain compatibility with existing NOT NULL database constraints and the admin panel dashboard.
- Sends the payload to `N8N_WEBHOOK_URL` via a server-to-server POST request.
- Logs and handles failures gracefully: if the webhook fails, the lead is still saved to Supabase, and the client is allowed to proceed to Calendly.

---

### Frontend Components & Context

#### [NEW] [audit-modal-context.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/audit-modal-context.tsx)
Provides a context provider (`AuditModalProvider`) and a custom hook (`useAuditModal`) to control the open/close state of the modal and prefill the selected tier. Reads URL search params using a safe `useEffect` method to avoid server-side de-optimization.

#### [NEW] [audit-modal.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/audit-modal.tsx)
A premium dark luxury modal matching the GS Legacy Wealth brand.
- Implemented using Radix UI `Dialog` components.
- Form fields:
  - First Name & Last Name (grid on desktop)
  - Email Address
  - Industry/Business Type (single-select dropdown pre-filled from selected tier or `?tier=...` query parameter)
  - GDPR Consent Checkbox: *"I agree to be contacted by GS Legacy Wealth regarding my audit request. View our Privacy Policy."*
- Handles validation, inline error state display, and disabled button state during in-flight requests.
- Upon success, redirects the user to the Calendly scheduling URL with query params: `name` and `email` prefilled.

#### [MODIFY] [layout.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/layout.tsx)
Wrap `{children}` with `AuditModalProvider` and render `<AuditModal />` at the root so any marketing page button can trigger it.

#### [MODIFY] [hero.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/hero.tsx)
Intercept the primary CTA button. Instead of linking to `/book`, trigger the `openModal()` function.

#### [MODIFY] [cta.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/cta.tsx)
Intercept the "Initiate Operational Audit" button. Trigger `openModal('Operations Machine')`.

#### [MODIFY] [pricing.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/pricing.tsx)
Intercept pricing card buttons. Trigger `openModal(tier.tag)`.

#### [MODIFY] [sticky-cta-button.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/sticky-cta-button.tsx)
Intercept the sticky button click. Trigger `openModal()`.

---

### Environment Configuration

#### [MODIFY] [.env](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/.env)
#### [MODIFY] [.env.local](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/.env.local)
Add `N8N_WEBHOOK_URL` configuration placeholders.

---

## Verification Plan

### Automated Tests
- Build test: `npm run build` to verify Next.js routes compile successfully without de-optimization alerts.

### Manual Verification
- **Form Submission & Redirect**: Click CTAs to open the modal. Fill in name, email, select industry, check consent, submit. Verify the page transitions seamlessly to Calendly with pre-filled query params.
- **Supabase lead check**: Inspect database state via the admin panel dashboard (`/admin/leads`) or Supabase query to confirm a new lead record has been added with both new and old fields populated correctly.
- **n8n Webhook check**: Verify that the API route logged sending a request to the n8n webhook.
- **Error Handling**: Temporarily change `N8N_WEBHOOK_URL` to an invalid or slow domain. Submit the form. Verify the submission still succeeds, saves to Supabase, and redirects to Calendly without showing a failure screen.
