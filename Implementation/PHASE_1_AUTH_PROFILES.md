# Phase 1: Auth & Profiles Implementation Plan (Revised)

This implementation plan focuses on setting up the entire Supabase database schema upfront, followed by building the authentication flow and mockup dashboards to thoroughly test user registration, login, and role-based access control.

## User Review Required

> [!IMPORTANT]
> - Since we will manually create the first admin user in Supabase, the default signup flow will assign the `user` role to new registrations. Are you okay with this?
> - We will create a mockup user dashboard specifically to test standard user access, alongside the mockup admin dashboard. Let us know if there are specific mockup elements you'd like to see.

## Proposed Tasks & Checklists

### 1. Supabase Initialization & Database Migration
- [ ] **Supabase Setup**:
  - Ensure `@supabase/supabase-js` and `@supabase/ssr` are installed.
  - Setup `lib/supabase/client.ts` and `lib/supabase/server.ts`.
  - Verify environment variables in `.env.local`.
- [ ] **Full Database Schema**:
  - Create `supabase/migrations/20260531000000_schema.sql` to initialize **all tables** from the backend plan:
    - Enums: `user_role`, `lead_status`, `project_status`, `booking_status`.
    - Tables: `profiles`, `leads`, `projects`, `project_assets`, `portfolio_items`, `testimonials`, `website_content`, `media_assets`, `strategy_sessions`, `login_history`, `activity_logs`.
- [ ] **Role & Profile Triggers**:
  - Include the `handle_new_user` trigger to automatically create a `profiles` entry for new signups with the default `user` role.
  - Include `updated_at` triggers for relevant tables.
- [ ] **Row Level Security (RLS)**:
  - Create `supabase/migrations/20260531100000_rls.sql` to enable RLS on all tables, setting baseline policies (e.g., Admins have full access, Users can read/update their own profile).

### 2. Authentication Flow & Role Handling
- [ ] **Login Page**:
  - Create `app/(auth)/login/page.tsx` with email/password authentication.
- [ ] **Signup Page**:
  - Create `app/(auth)/signup/page.tsx` with email/password registration.
- [ ] **Protected Route Middleware**:
  - Configure `middleware.ts` to secure routes based on the session and user role:
    - Redirect unauthenticated users to `/login`.
    - Restrict `/admin/*` routes to users with the `admin` role.
    - Route standard `user` accounts to the user dashboard.

### 3. Mockup Dashboards for Testing
- [ ] **Admin Dashboard Mockup**:
  - Create `app/(admin)/admin/page.tsx` as a placeholder to verify successful admin login and role authorization.
- [ ] **User Dashboard Mockup**:
  - Create `app/(user)/dashboard/page.tsx` (or similar) to verify standard user login, ensuring they cannot access the `/admin` area.

## Verification Plan

### Automated Tests
- Run `npx supabase start` and apply migrations locally to ensure the full schema is created successfully.

### Manual Verification
- **User Role Test**: Use the Signup page to register a new user. Verify they are assigned the `user` role in the DB, and can access the User Dashboard mockup but are blocked from the Admin Dashboard mockup.
- **Admin Role Test**: Manually create an admin user (or change a user's role to `admin` in the Supabase Studio). Log in via the Login page and verify access to the Admin Dashboard mockup.
