# Implementation Plan for GS Legacy Wealth – Full Backend & Dashboard

## Goal Description
Create a full backend (Supabase) and an admin/customer dashboard for the existing GS Legacy Wealth booking webapp. The backend will handle authentication, service offerings, bookings, user roles, and audit history. The front‑end will expose unique page slugs, use Shadcn‑styled UI components, show toast notifications at the top‑left, and use modals only for confirmations.

---

### User Review Required
> **IMPORTANT**
> Please confirm the proposed page slugs, database tables, and edge‑function responsibilities. If you need extra pages, additional fields, or a different role model, let me know before we start coding.

---

### Open Questions
> **WARNING**
> 1. Do you want a separate **Reports** page or should reporting be embedded in the admin dashboard?
> 2. Will you ever need **social login** (Google/Apple) or is email/password sufficient for now?
> 3. Should the `payment_status` column be prepared for Stripe integration now, or can we add it later?

---

### Proposed Changes

#### 1. Supabase Project & Configuration
- Create a Supabase project named `gs-legacy-wealth`.
- Enable **Auth**, **Database**, **Edge Functions**, (optional) **Storage**.
- Add these env variables in a `.env` file (root of the repo):

```text
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 2. Database Schema (PostgreSQL)

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | `id` uuid PK, `email`, `role` enum(`admin`,`client`,`banned`), `created_at` | Auth users & role model |
| `service_offerings` | `id`, `title`, `description`, `price`, `max_slots`, `location`, `status` enum(`active`,`inactive`), `start_date`, `end_date` | Sellable services (e.g., “Premium AI Site Build”) |
| `bookings` | `id`, `user_id` FK, `offering_id` FK, `status` enum(`pending`,`confirmed`,`canceled`,`completed`), `scheduled_at`, `cancel_reason`, `payment_status` enum(`offline`,`paid`,`unpaid`) | Booking records |
| `login_history` | `id`, `user_id` FK, `login_at`, `ip_address`, `user_agent` | Audit of sign‑ins |
| `booking_history` | `id`, `booking_id` FK, `event` enum(`created`,`status_changed`,`canceled`), `details` jsonb, `timestamp` | Booking audit trail |
| `admin_actions` | `id`, `admin_id` FK, `action_type`, `target_id`, `notes`, `timestamp` | Admin activity log |

*RLS policies will give admins full access, clients only their own rows, and banned users no access.*

#### 3. Edge Functions (Backend Logic)

| Function | HTTP Method | Responsibility |
|----------|-------------|----------------|
| `auth_signup` | POST | Register a user, set role `client`. |
| `auth_login` | POST | Verify credentials, issue JWT, insert into `login_history`. |
| `admin_create_service` | POST | Create a new `service_offerings` (admin only). |
| `admin_update_service` | PATCH | Update fields of a service offering. |
| `admin_delete_service` | DELETE | Soft‑delete (set `status='inactive'`). |
| `admin_get_dashboard` | GET | Return aggregated stats for the admin dashboard. |
| `customer_book_service` | POST | Create a booking, enforce `max_slots` atomically. |
| `customer_cancel_booking` | POST | Set status to `canceled`, record `cancel_reason`. |
| `admin_manage_user` | POST | Ban/unban users (change `role`). |
| `admin_record_offline_payment` | POST | Update `payment_status` to `offline` with receipt text. |
| `health_check` | GET | Simple ping for monitoring. |

All functions validate the Supabase JWT (`auth.getUser`) and respect RLS.

#### 4. Front‑End Pages (Slug‑Based)

| Slug | Description |
|------|-------------|
| `/` | Landing page – keep existing colour palette. |
| `/signup` | Sign‑up form (email/password). |
| `/login` | Login form. |
| `/profile` | Customer profile view/edit. |
| `/services` | List of active service offerings (Shadcn‑styled cards). |
| `/services/[slug]` | Detail page with description, price, schedule picker, “Book now”. |
| `/bookings` | Customer dashboard – upcoming & past bookings, cancel button. |
| `/admin` | Admin overview – summary cards (users, bookings, revenue placeholder). |
| `/admin/services` | CRUD UI for service offerings. |
| `/admin/bookings` | Manage all bookings (filter, status change, notes). |
| `/admin/users` | User management (role change, ban/unban). |
| `/admin/payments` | View offline payment records. |
| `/admin/reports` | Simple charts for bookings & revenue. |
| `/settings` | Global settings (future Stripe keys, email templates). |
| `/*` | Friendly 404 page. |

*All navigation uses full‑page routes. Modals are used **only** for confirmations (e.g., cancel booking). Toasts appear in the **top‑left**.*

#### 5. UI / UX Guidelines
- **Colour palette** – reuse the current primary/secondary/accent colors; expose via CSS variables in `src/styles/vars.css`.
- **Typography** – Google Font **Inter** for body, **Outfit** for headings (matches existing site).
- **Buttons** – Shadcn primary solid, secondary outline, disabled muted.
- **Cards** – Glass‑morphism style (blurred, semi‑transparent) for service cards and admin widgets.
- **Forms** – Shadcn‑styled inputs with clear focus outlines.
- **Responsive** – Mobile‑first breakpoints (sm 640 px, md 768 px, lg 1024 px); tables scroll on small screens.
- **Accessibility** – `aria-label`s, focus outlines, AA contrast ratios.

#### 6. Deployment & CI/CD
1. **Deploy Edge Functions** – `supabase functions deploy <name>`.
2. **Host Front‑End** – Supabase Static Hosting or Vercel (both accept the env vars).
3. **GitHub Actions** (optional):
```yaml
- name: Install deps
  run: npm ci
- name: Build front‑end
  run: npm run build
- name: Push DB schema
  run: supabase db push
- name: Deploy functions
  run: supabase functions deploy --project-id ${{ secrets.SUPABASE_PROJECT_ID }}
- name: Deploy site
  run: supabase deploy
```

#### 7. Verification Plan
**Automated Tests**
- Jest unit tests for each Edge Function (mock Supabase client).
- Cypress end‑to‑end flow: sign‑up → login → view services → book → cancel; admin CRUD flow; role enforcement (403 on `/admin/*`).

**Manual Checks**
- Deploy to a dev Supabase project.
- Use Postman to hit each API with a JWT and verify responses.
- Walk through UI pages, confirm toast placement, modal style, and responsive behavior.
- Verify `login_history` and `booking_history` records after each action.

---

### Acceptance Criteria
- All tables and Edge Functions exist in Supabase and pass the automated test suite.
- Admin dashboard shows correct summary cards, service CRUD UI, booking list, and user management.
- Customer can sign‑up, log in, view services, book a slot (respecting `max_slots`), and cancel.
- No code is deployed to production yet; everything runs on the Supabase dev environment.
- Documentation (`README.md`) includes setup, deployment, and testing instructions.

---

*End of implementation plan.*
