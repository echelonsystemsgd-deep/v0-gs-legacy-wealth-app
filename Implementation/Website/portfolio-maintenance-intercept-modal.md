# Portfolio Maintenance Intercept Modal

## Background

The portfolio section on the GS Legacy Wealth site currently shows live client websites in a browser-preview modal when visitors click **"View Live Site"**. One client's website is not yet complete — if a visitor clicks through and submits an enquiry on that unfinished site, it will never reach the client.

This plan introduces an **intercept modal** that fires _before_ the site preview loads for any portfolio item flagged as `underConstruction: true`. The intercept informs the visitor the site is coming soon and optionally allows them to register interest, turning a limitation into a lead capture opportunity.

---

## Proposed Changes

### `components/portfolio.tsx`

This is the only file that needs to change.

#### Step 1 — Flag the incomplete portfolio item

Add an `underConstruction` boolean to the relevant item in the `portfolioItems` array.

```ts
// Before
{
  title: "Stamp Valuation App",
  ...
  href: "https://v0-stamp-valuation-app.vercel.app",
  image: "/stamp-app-preview.png",
},

// After — add flag to whichever item is under construction
{
  title: "Stamp Valuation App",
  ...
  href: "https://v0-stamp-valuation-app.vercel.app",
  image: "/stamp-app-preview.png",
  underConstruction: true,   // <-- added
},
```

> **IMPORTANT:** Which portfolio item should be flagged? The Stamp Valuation App is the only one with a real `href` and screenshot. Please confirm whether this is the item to flag, or if it is one of the others (Elite Fitness Studio, Prestige Properties, etc.).

---

#### Step 2 — New `UnderConstructionModal` component (inline)

A new self-contained modal component added inside `portfolio.tsx`, rendered _before_ the `SitePreviewModal`. It will:

- Appear with a smooth fade + scale animation (matching the existing `SitePreviewModal` style)
- Show a 🚧 construction icon with premium gold branding
- Display a short, professional message explaining the site is coming soon
- Offer a **"Notify Me When It's Live"** email capture field (optional — can be disabled)
- Have a **"Close"** button
- Match the existing dark glassmorphism aesthetic of the site

**Visual design:**
```
┌────────────────────────────────────────────┐
│                   🚧                       │
│        Coming Soon                         │
│                                            │
│  This website is currently being crafted   │
│  to the highest standard. Check back soon  │
│  for the finished experience.              │
│                                            │
│  ┌──────────────────────────┐  [Notify Me] │
│  │  your@email.com          │              │
│  └──────────────────────────┘              │
│                                            │
│              [ Close ]                     │
└────────────────────────────────────────────┘
```

---

#### Step 3 — Intercept click logic

The existing click handler in both desktop and mobile overlays currently calls:
```ts
onClick={() => setActiveModal(item)}
```

This will be updated to:
```ts
onClick={() => item.underConstruction ? setConstructionModal(item) : setActiveModal(item)}
```

A second state variable `constructionModal` will be added alongside the existing `activeModal`.

---

#### Step 4 — Visual badge on the card

When `underConstruction: true`, the card will show a subtle **"Coming Soon"** pill badge (replacing or sitting alongside the "Legacy Partner" badge), so it's visually clear to visitors at a glance.

---

## State Changes Summary

| State variable       | Purpose                                              |
|----------------------|------------------------------------------------------|
| `activeModal`        | Existing — opens the full site preview iframe        |
| `constructionModal`  | New — opens the maintenance intercept modal          |

---

## Open Questions

1. **Which portfolio item** is the one under construction? Please confirm the title so the correct one is flagged.
2. **Email capture**: Do you want the "Notify Me" email input in the modal, or just a clean informational message with a Close button? The email capture could feed into your existing Supabase backend.
3. **Button label on the card**: Should the card button still say "View Live Site" (intercept fires after the click), or change to "Coming Soon" upfront?

---

## Verification Plan

### Manual Verification
- Confirm the flagged card shows the "Coming Soon" badge on hover
- Click "View Live Site" on the flagged card → intercept modal should appear, **not** the iframe preview
- Click "View Live Site" on the unflagged card → iframe preview should open as normal
- Close button dismisses the intercept modal cleanly
- Test on mobile layout (mobile footer buttons also trigger the modal)

---

## July 14, 2026: View Project Flow with Request System Schema Modal

### Goal & Strategy
We want to transition the website portfolio section to gate all project cards behind a premium "Request System Schema" modal. This captures visitor details (leads) for exclusive NDA-protected project blueprints, case studies, and walkthroughs, storing them in Supabase and forwarding them to n8n for automated email follow-up.

### 1. Response to Open Questions

#### One — Vercel API Route Recommendation
- **Recommendation:** Create a **dedicated Vercel API route** at `/api/portfolio/request` (file: `app/api/portfolio/request/route.ts`).
- **Justification:**
  1. **Separation of Concerns:** Gating portfolio case studies is a top-of-funnel lead generation activity, whereas booking forms are high-intent bottom-of-funnel scheduling actions. Keeping them separate avoids bloating `app/api/forms/submit/route.ts` (which is already over 300 lines with multiple templates).
  2. **Clean Database Targeting:** A dedicated route makes it simpler to write to the new `portfolio_requests` table without modifying conditional blocks in the core `leads` API.
  3. **Webhook Reliability & Isolation:** By sending the payload to n8n with its own unique endpoint or event headers, n8n can instantly categorize the lead and trigger the appropriate email nurture sequence without needing complex router switches or filters in the webhook receiver.
  4. **Unique Automated Response:** When a user requests a blueprint, they should get a transaction-specific email delivering that specific system schema. Storing the email template in a dedicated endpoint keeps templates clean and modular.

#### Two — Supabase Table Structure
- **Recommendation:** Create a new table `public.portfolio_requests` instead of inserting these leads into the existing `leads` table.
- **Table Schema (SQL):**
  ```sql
  CREATE TABLE public.portfolio_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      project_name TEXT NOT NULL, -- Name of the portfolio item requested (e.g. 'Prestige Properties')
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      referrer TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL
  );

  -- Enable RLS
  ALTER TABLE public.portfolio_requests ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Allow anonymous inserts to portfolio_requests"
      ON public.portfolio_requests FOR INSERT
      WITH CHECK (true);

  CREATE POLICY "Allow admins full access to portfolio_requests"
      ON public.portfolio_requests FOR ALL
      TO authenticated
      USING (exists (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::user_role
      ));
      
  -- Indexes for performance
  CREATE INDEX idx_portfolio_requests_email ON public.portfolio_requests(email);
  CREATE INDEX idx_portfolio_requests_project ON public.portfolio_requests(project_name);
  ```
- **Conflict Analysis:** There are no conflicts with the existing schema. This table sits alongside the existing `leads` and `portfolio_items` tables, keeping marketing-funnel micro-conversions distinct from full client profiles or strategy call bookings.

#### Three — Propose n8n Automation & Email Sequence
When the webhook is triggered, the n8n automation should capture the lead and execute the following high-ticket nurture sequence:
1. **Email 1: Immediate Fulfill (0-5 Mins Delay)**
   - **Subject:** 🔓 [Requested Blueprint] Sanitized System Schema for {Project Name}
   - **Message:** Deliver a direct link to the sanitized system schema blueprint (PDF or private Notion document) and a 3-minute Loom video walking through the architecture. Highlight key operational metrics achieved (e.g., "how we automated 97% of lead follow-ups for Prestige Properties").
   - **Value:** Instant reciprocity and proof of execution.
2. **Email 2: Diagnostic Value (24 Hours Delay)**
   - **Subject:** The "Manual Admin Tax" draining high-ticket agencies
   - **Message:** Contrast manual operations with autonomic systems. Share statistics on lead conversion decay over time and show how to run a "Deficit Diagnostic" on their business using the online calculator.
   - **Value:** Positions the agency's problems as operational issues with quantifiable solutions.
3. **Email 3: Trust & Case Study (48 Hours Delay)**
   - **Subject:** Case Study: Reclaiming 30 hours per week (and lost listings)
   - **Message:** Share a testimonial or breakdown of our partnership model. Explain why we limit cohort intakes to 2 companies per month to maintain founder-level quality control.
   - **Value:** Social proof, FOMO, and credibility.
4. **Email 4: Direct Invitation (72 Hours Delay)**
   - **Subject:** Let's draft your custom systems roadmap?
   - **Message:** A plain-text, personal invitation from the founder to schedule a 30-minute forensic operational audit.
   - **Value:** Direct path to booking.

#### Four — Existing Portfolio Component Structure
- **Analysis & Wiring:**
  - Currently, the component `components/portfolio.tsx` renders four projects (`DEFAULT_PORTFOLIO` or database items) in a grid.
  - Clicking "View Project" on hover or in the mobile view opens either the `SitePreviewModal` (using `activeModal` state) or the `UnderConstructionModal` (using `constructionModal` state).
  - Under the new flow, we want **every** portfolio item to trigger the email capture modal before showing any client builds.
  - **Wiring Changes:**
    1. We will rename `UnderConstructionModal` to `RequestSystemSchemaModal` and update its fields, texts, styling, and API call.
    2. We will update the `onClick` handler on both desktop hover and mobile buttons to always trigger `setRequestSchemaModal(item)` instead of the previous iframe preview.
    3. We will remove the `SitePreviewModal` as it is no longer accessed by public traffic.
    4. We will update `SITE_COPY.portfolioPage` to reflect the new copywriting.

---

### 2. Proposed Changes

#### Database Layer
- **[NEW]** `supabase/migrations/20260714230000_portfolio_requests.sql`
  - Contains SQL commands to create the `portfolio_requests` table, enable Row-Level Security, establish insert/admin policies, and add performance indexes.

#### Backend Layer
- **[NEW]** `app/api/portfolio/request/route.ts`
  - Accepts `POST` requests with visitor details (`name`, `email`, `project_name`) and UTM analytics.
  - Saves the lead directly into `portfolio_requests` using `supabaseAdmin`.
  - Uses Resend to dispatch a transactional notification to `info@mercianwealth.com` and a confirmation email (containing the mock blueprint access) to the visitor.
  - Forwards the full lead details to the configured `N8N_WEBHOOK_URL` to kick off the nurture sequence.

#### Website Components Layer
- **[MODIFY]** `lib/site-copy.ts`
  - Update copywriting definitions under `SITE_COPY.portfolioPage` to include:
    - `noticeTitle`: "Request System Schema & Case Study"
    - `noticeDescription`: "To protect client confidentiality, we gate our active system builds. Enter your name and business email to request the sanitized blueprints and case study."
    - `submitBtnText`: "Request System Schema"
- **[MODIFY]** `components/portfolio.tsx`
  - Refactor the modal: Rename `UnderConstructionModal` to `RequestSystemSchemaModal`.
  - Ensure style matches the Mercian Wealth brand: deep purple (`bg-[#130B24]`), silver text (`text-[#A3A8B4]`), and gold accents (`text-[#C5A059]`, `border-[#C5A059]`).
  - On successful submission, display the confirmation transition state inside the modal (does not close automatically, sets expectations of email receipt).
  - Wire up both desktop and mobile CTA buttons to open `RequestSystemSchemaModal`.

---

### 3. Verification Plan

#### Automated Testing
- We will test the new API endpoint `/api/portfolio/request` using a test script in the `scratch/` directory to ensure it:
  1. Rejects requests with missing name/email parameters.
  2. Writes data to Supabase successfully.
  3. Triggers Resend notification emails (if API key configured).
  4. Submits the payload to the n8n webhook.

#### Manual Verification
- Open the `/portfolio` page in a local development environment.
- Hover over any project card (e.g., *Prestige Properties*, *Elite Fitness Studio*) and click **"View Project"**.
- Verify that the gated request modal opens immediately, and the iframe modal is bypassed.
- Test responsiveness of the modal across mobile viewport (using Chrome DevTools) and tablet dimensions.
- Submit the form with valid entries:
  - Check that the modal transitions to the golden confirmation screen.
  - Confirm the database table has recorded the new row.
  - Confirm n8n has received the payload.
- Click the **"Go Back to Portfolio"** secondary link and check that the modal closes cleanly.

