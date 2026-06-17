# 🏛️ GS Legacy Wealth AI — Developer Hub

Welcome to the **GS Legacy Wealth AI** web application and administrative hub. This repository is built as a hybrid architecture combining a high-performance **Next.js App Router** frontend with a robust **Supabase** backend. It is designed to engineer luxury digital assets, streamline client onboarding, showcase agency portfolio/testimonials, and handle lead/project operations.

---

## 🚀 Technical Stack

This project is built using modern, type-safe, and highly performant technologies:

### Frontend & UI
* **Framework**: [Next.js 16.2 (App Router)](https://nextjs.org/) & **React 19** (configured in [package.json](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/package.json))
* **Language**: **TypeScript** (fully typed)
* **Styling**: **Tailwind CSS v4** (`@tailwindcss/postcss`) & [Framer Motion](https://www.framer.com/motion/) for premium, fluid animations. (Directives located in [app/globals.css](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/globals.css))
* **Component Library**: Custom elements built on top of [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
* **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev)
* **Data Visualization**: [Recharts](https://recharts.org/) (for dashboard analytics)

### Backend & Infrastructure
* **BaaS Provider**: [Supabase](https://supabase.com/)
* **Database**: **PostgreSQL** with Row-Level Security (RLS) policies
* **Authentication**: **Supabase Auth** with server-side validation using `@supabase/ssr` (integrated via [middleware.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/middleware.ts))
* **File Storage**: **Supabase Storage** (configured with public buckets for assets, and private buckets for secure client deliverables)
* **Serverless Logic**: **Deno-powered Supabase Edge Functions** (TypeScript)
* **Error Tracking**: **Sentry** (configured in [next.config.mjs](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/next.config.mjs))
* **Email Service**: **Resend** integration for automated transactional mailings.

---

## 🎛️ Integrations & Slack Alert System

The application leverages several core webhooks and APIs to maintain real-time tracking, lead validation, and collaborative communication:

### 1. Developer & Administrative Slack Alert Notifications
Whenever critical events occur on the platform, automated notifications are dispatched to both Slack and Discord:
* **Slack & Discord Webhook Router**: Triggered automatically via database changes (using PostgreSQL webhook triggers mapping to the `notify-admin` Supabase Edge Function).
* **Source Code**: Located in [notify-admin/index.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/functions/notify-admin/index.ts).
* **Environment Configuration**: Set `SLACK_WEBHOOK_URL` and `DISCORD_WEBHOOK_URL` inside your Supabase dashboard or local edge function env file.
* **Notification Scopes**:
  * **Lead Intake**: Fires when a prospect fills out the public questionnaire (INSERT on the `leads` table). It formats a Slack attachment card detailing the applicant's name, company, email, interest, and message.
  * **Strategy Session Booking**: Fires when a new appointment is confirmed (INSERT on the `strategy_sessions` table), summarizing scheduling dates, Calendly IDs, and notes.

### 2. Live Platform Status Monitor
* The developer dashboard and landing pages include a console feed component ([results.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/results.tsx)) designed to showcase system actions.
* It simulates the end-to-end user journey, printing logs such as:
  ```text
  [SLACK] Dispatching sales notification to team #alerts
  ```

### 3. Client Collaboration (Founder Slack Hotline)
* As specified in the Agency plans ([pricing.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/pricing.tsx)), Elite tier clients gain direct access to a private founder channel:
  * **Founder Slack Channel**: Instant, high-touch engineering and consulting access directly to core partners, replacing traditional ticketing systems.

### 4. Calendly Webhook Sync
* Located in [calendly-webhook/index.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/functions/calendly-webhook/index.ts).
* Synchronizes calendar booking events (`invitee.created`, `invitee.canceled`) automatically:
  * Links appointments with existing record metrics by matching emails.
  * Updates lead status to `Call Booked` and schedules/cancels events dynamically inside the `strategy_sessions` table.

---

## 📁 Project Directory Structure

```text
v0-gs-legacy-wealth-app/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── leads/             # Leads management list & details page
│   │   │   ├── projects/          # Kanban tracking and project management Workspace
│   │   │   ├── portfolio/         # CRUD manager for agency portfolio
│   │   │   ├── testimonials/      # CRUD manager for testimonials
│   │   │   ├── content/           # Marketing copy layout JSON manager
│   │   │   ├── media/             # Supabase storage media asset manager
│   │   │   ├── settings/          # Admin account and platform configurations
│   │   │   ├── logs/              # Activity and security audit logs viewer
│   │   │   └── page.tsx           # Admin Overview Dashboard (KPIs & Charts)
│   │   └── layout.tsx             # Glassmorphic sidebar shell & providers
│   ├── (auth)/
│   │   ├── login/                 # Secure login page
│   │   ├── signup/                # User registration
│   │   ├── forgot-password/       # Password recovery triggers
│   │   └── reset-password/        # Password reset callback page
│   ├── (user)/
│   │   └── dashboard/             # Standard User/Client Client Space & mockup dashboard
│   ├── book/                      # Public booking page and qualifier questionnaire
│   ├── contact/                   # Public agency contact form
│   ├── success/                   # Post-qualification success page
│   ├── globals.css                # Global CSS variables & Tailwind directives
│   ├── layout.tsx                 # Root app layout (custom cursors, watermark, analytics)
│   └── page.tsx                   # Public Agency Landing Page
├── components/
│   ├── ui/                        # Low-level accessible components (table, card, dialog, etc.)
│   ├── admin/                     # Specialized dashboard components (sidebar, milestones, dropzones)
│   ├── booking-flow.tsx           # Multi-step scheduling flow and lead qualification logic
│   ├── custom-cursor.tsx          # Interactive cursor tracking component
│   └── navbar.tsx & footer.tsx    # Header & navigation links
├── hooks/                         # Custom React hooks (e.g. use-toast, theme, etc.)
├── lib/
│   └── supabase/                  # Supabase clients for both browser and server runtime
├── supabase/
│   ├── config.toml                # Local Supabase dev config
│   ├── migrations/                # Core Postgres DB schema & RLS rules SQL migrations
│   └── functions/                 # Deno Serverless edge endpoints (Calendly, admin operations, notifications)
└── Implementation/                # Historical plans, strategies, and implementation references
```

---

## 🗄️ Database & Schema Overview

The database is built on PostgreSQL inside Supabase. Tables include:

* **`profiles`**: Tied to `auth.users` via triggers; stores user roles (`admin` vs `user`), profiles, and account suspension flags (`is_suspended`).
* **`leads`**: Tracks lead qualifications, service interests, and initial questionnaires.
* **`projects`**: Manages client lifecycle stages (`Discovery` ➔ `Design` ➔ `Development` ➔ `Revision` ➔ `Complete`).
* **`project_assets`**: Holds records of secure project assets uploaded in private buckets.
* **`strategy_sessions`**: Session slots synced from Calendly.
* **`portfolio_items` & `testimonials`**: Dynamic portfolio records displayed on the frontend.
* **`website_content`**: A key-value JSONB catalog storing content and copy for the website.
* **`login_history` & `activity_logs`**: Logs tracking authentication events and changes to profiles (linked via [admin-user-actions/index.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/functions/admin-user-actions/index.ts)).

### Security & Row Level Security (RLS)
* **RLS is strictly enabled** on all database tables.
* Public anonymous clients only have read privileges to `portfolio_items` / `testimonials`, and write permissions to insert into `leads`.
* Admin paths `/admin/*` are restricted via [middleware.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/middleware.ts), which queries roles from the `profiles` table.
* Secure assets use Supabase Storage private buckets generating short-lived signed URLs for approved administrators and project clients.

---

## ⚙️ Getting Started & Local Development

### 1. Pre-requisites & Installations
Clone the repository and install dependencies using npm:
```bash
npm install
```

### 2. Setup Local Environment Variables
Create your local environment file:
```bash
cp .env.local.example .env.local
```
Configure your credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client-facing application. Access the administrator workspace at `/admin`.

### 4. Supabase CLI & Edge Functions
To deploy database migrations, test edge functions locally, or push updates:
* **Link Local Project**:
  ```bash
  npx supabase link --project-ref your-project-ref
  ```
* **Start Local DB Stack**:
  ```bash
  npx supabase start
  ```
* **Apply Migrations**:
  ```bash
  npx supabase db push
  ```
* **Serve Edge Functions Locally**:
  ```bash
  npx supabase functions serve --env-file .env.local
  ```

---

## 🛡️ Git Workflow & Developer Guidelines

Developers **must** follow the guidelines in [GITHUB_ISSUES_GUIDE.md](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/GITHUB_ISSUES_GUIDE.md):
1. **Issue Search**: Verify whether an issue exists before writing code. If not, create one.
2. **Issue Names**: Prefix issue titles with `feat:`, `fix:`, `refactor:`, `docs:`, or `chore:`.
3. **Branching & Pull Requests**: Work in structured feature branches, submit PRs, and cross-reference issue numbers.
4. **RLS Policies**: Never write a migration that disables RLS. Ensure that every table has proper access controls.
5. **Private Uploads**: Always upload client deliverables to private buckets and access them via generated signed URLs.
