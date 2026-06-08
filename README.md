# GS Legacy Wealth AI — Developer Documentation

Welcome to the **GS Legacy Wealth AI** web application and administrative portal. This repository is built as a hybrid architecture combining a high-performance **Next.js App Router** frontend with a robust **Supabase** backend. It is designed to engineer luxury digital assets, streamline client onboarding, showcase agency portfolio/testimonials, and handle lead/project operations.

---

## 🚀 Tech Stack

This project is built using modern, type-safe, and highly performant technologies:

### Frontend & UI
* **Framework**: [Next.js 16.2 (App Router)](https://nextjs.org/) & **React 19**
* **Language**: **TypeScript** (fully typed)
* **Styling**: **Tailwind CSS v4** (`@tailwindcss/postcss`) & [Framer Motion](https://www.framer.com/motion/) for premium, fluid animations.
* **Component Library**: custom components built on top of [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
* **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev)
* **Data Visualization**: [Recharts](https://recharts.org/) (for dashboard analytics)

### Backend & Infrastructure
* **BaaS Provider**: [Supabase](https://supabase.com/)
* **Database**: **PostgreSQL** with Row-Level Security (RLS) policies
* **Authentication**: **Supabase Auth** with server-side validation using `@supabase/ssr`
* **File Storage**: **Supabase Storage** (configured with public buckets for assets, and private buckets for client deliverables)
* **Serverless Edge Logic**: **Deno-powered Supabase Edge Functions** (TypeScript)

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
│   │   ├── forgot-password/       # Password recovery triggers
│   │   └── reset-password/        # Password reset callback page
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
│   └── functions/                 # Deno Serverless edge endpoints (Calendly webhooks, administrative roles)
└── Implementation/                # Historical plans, strategies, and implementation references
```

---

## 🗄️ Database & Schema Overview

The Supabase PostgreSQL database is structured around the following core tables (refer to [20260531000000_schema.sql](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260531000000_schema.sql)):

* **`profiles`**: Links to `auth.users`; holds user identity, roles (`admin` vs `user`), and accounts suspend state.
* **`leads`**: Tracks public inquiries, contact entries, and booking questionnaire submissions.
* **`projects`**: Manages client lifecycle stages (`Discovery` ➔ `Design` ➔ `Development` ➔ `Revision` ➔ `Complete`).
* **`project_assets`**: Holds records of secure project assets uploaded in private buckets.
* **`strategy_sessions`**: Booked slots synced via Calendly webhooks or inputted manually.
* **`portfolio_items` & `testimonials`**: Marketing data displayed on the public landing page.
* **`website_content`**: Key-value JSONB table storing editable website copy.
* **`login_history` & `activity_logs`**: Security audit logging tables tracking updates, deletions, and logs.

### Security & Row Level Security (RLS)
* **RLS is enabled** on all database tables.
* Anonymous public users have permissions to read `portfolio_items` and `testimonials` and write inserts to `leads` (contact form submissions).
* The dashboard `/admin` routes require authentication and checks if the user's role is set to `admin`.
* Private storage buckets (e.g., `project-assets`) generate short-lived signed URLs for authenticated administrators and relevant client profiles.

---

## ⚙️ Getting Started

### 1. Clone & Install Dependencies
Run the installation process using npm:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the local environment sample and fill in the required Supabase credentials:
```bash
cp .env.local.example .env.local
```

Open `.env.local` and enter your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Keep this secret! (Only used server-side)
```

### 3. Local Development Server
Launch the next development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client-facing website and landing experience. The admin console can be reached at `/admin` (requires login credentials).

### 4. Supabase CLI & Edge Functions
If you are developing Database migrations or editing Deno serverless edge functions:

* **Link your project**:
  ```bash
  npx supabase link --project-ref your-project-ref
  ```
* **Start local Supabase stack**:
  ```bash
  npx supabase start
  ```
* **Run migrations**:
  ```bash
  npx supabase db push
  ```
* **Run Edge Functions locally**:
  ```bash
  npx supabase functions serve --env-file .env.local
  ```

---

## 🛠️ Key Administration Flows

### 1. Securing Admin Dashboard Access
Client authentication is validated via Next.js server middleware ([middleware.ts](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/middleware.ts)):
* When a user attempts to access `/admin/*`, the middleware refreshes the Supabase token.
* If no session is present, the user is redirected to `/login`.
* If a session is present, the middleware checks the database `profiles` table to verify that the user's `role` is `'admin'` and `is_suspended` is `false`.

### 2. Calendly Synchronization
Bookings are automated via the `calendly-webhook` edge function. 
* Calendly webhooks trigger on event creation.
* The hook handles linking incoming event emails to existing `leads`.
* Updates lead state to `'Call Booked'` and creates strategy session records dynamically.

### 3. Asset Upload Pipeline
Uploading media or project deliverables utilizes drag-and-drop secure upload modules:
* Files are uploaded to Supabase Storage buckets.
* On completion, database triggers log uploads inside the corresponding `project_assets` or `media_assets` databases.

---

## 📝 Best Practices & Guidelines
* **Database migrations**: Never modify database schemas directly via the Supabase dashboard interface in production. Always create SQL migration files inside `supabase/migrations` and apply them using the CLI.
* **Component Styling**: This project uses **Tailwind CSS v4**. Avoid arbitrary margins or hardcoded text sizes; use defined theme scales and components to maintain a premium visual style.
* **Client Security**: Do not expose client deliverables publicly. Always upload client-specific project assets to private buckets and access them via generated signed URLs.
