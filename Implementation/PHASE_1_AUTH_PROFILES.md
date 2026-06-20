# Phase 1: Auth & Profiles Implementation Plan (Revised)

This implementation plan focuses on setting up the entire Supabase database schema upfront, followed by building the authentication flow and mockup dashboards to thoroughly test user registration, login, and role-based access control.

> [!NOTE]
> **Status: COMPLETED (2026-06-20)**
> All tasks in this phase have been successfully implemented, verified, and compiled.

## User Review Required

> [!IMPORTANT]
> - Since we will manually create the first admin user in Supabase, the default signup flow will assign the `user` role to new registrations. Are you okay with this?
> - We will create a mockup user dashboard specifically to test standard user access, alongside the mockup admin dashboard. Let us know if there are specific mockup elements you'd like to see.

## Proposed Tasks & Checklists

### 1. Supabase Initialization & Database Migration
- [x] **Supabase Setup**:
  - Ensure `@supabase/supabase-js` and `@supabase/ssr` are installed.
  - Setup `lib/supabase/client.ts` and `lib/supabase/server.ts`.
  - Verify environment variables in `.env.local`.
- [x] **Full Database Schema**:
  - Create `supabase/migrations/20260531000000_schema.sql` to initialize **all tables** from the backend plan:
    - Enums: `user_role`, `lead_status`, `project_status`, `booking_status`.
    - Tables: `profiles`, `leads`, `projects`, `project_assets`, `portfolio_items`, `testimonials`, `website_content`, `media_assets`, `strategy_sessions`, `login_history`, `activity_logs`.
- [x] **Role & Profile Triggers**:
  - Include the `handle_new_user` trigger to automatically create a `profiles` entry for new signups with the default `user` role.
  - Include `updated_at` triggers for relevant tables.
- [x] **Row Level Security (RLS)**:
  - Create `supabase/migrations/20260531100000_rls.sql` to enable RLS on all tables, setting baseline policies (e.g., Admins have full access, Users can read/update their own profile).

### 2. Authentication Flow & Role Handling
- [x] **Login Page**:
  - Create `app/(auth)/login/page.tsx` with email/password authentication.
- [x] **Signup Page**:
  - Create `app/(auth)/signup/page.tsx` with email/password registration.
- [x] **Protected Route Middleware**:
  - Configure `middleware.ts` to secure routes based on the session and user role:
    - Redirect unauthenticated users to `/login`.
    - Restrict `/admin/*` routes to users with the `admin` role.
    - Route standard `user` accounts to the user dashboard.

### 3. Mockup Dashboards for Testing
- [x] **Admin Dashboard Mockup**:
  - Create `app/(admin)/admin/page.tsx` as a placeholder to verify successful admin login and role authorization.
- [x] **User Dashboard Mockup**:
  - Create `app/(user)/dashboard/page.tsx` (or similar) to verify standard user login, ensuring they cannot access the `/admin` area.

### 4. User Profiles & Navbar Dropdown Integration
- [x] **Middleware Route Protection**:
  - Add `/profile` to the middleware configurations to restrict access to authenticated users.
- [x] **Dynamic Navbar Header**:
  - Implement active session listener using Supabase client in `components/navbar.tsx`.
  - Swap the static "Login" button with a luxury profile picture avatar (or placeholder) dropdown when logged in.
  - Dropdown options: User metadata summary (name, email, role), Link to Dashboard/Admin panel (role-based), Link to Profile, and Log Out.
- [x] **Profile Page Route**:
  - Create `app/profile/page.tsx` to handle authentication verification and server-side profile pre-fetching.
- [x] **Profile Edit Container**:
  - Build `components/profile/profile-client-container.tsx` with luxury gold styling, containing fields for First Name, Last Name, Phone Number, Address Line 1, Address Line 2, City, Post Code, and read-only Email/Role.
  - Integrate interactive avatar changer supporting local file previews/Base64/storage upload fallbacks.

### 5. Supabase Storage Profile Picture Integration
- [x] **Supabase Storage Migration**:
  - Create `supabase/migrations/20260620101000_avatar_storage.sql` to define the private `'avatars'` storage bucket.
  - Apply storage policies limiting file size to 1MB and allowed image MIME types.
- [x] **Storage RLS Policies**:
  - Define INSERT, UPDATE, DELETE policies on `storage.objects` allowing authenticated users to manage files strictly in their user-id folder (`split_part(name, '/', 1) = auth.uid()::text`).
  - Define SELECT policy allowing owners to view their own avatars, and admins to select any avatar file (`public.is_admin()`).
- [x] **Dynamic Signed URLs in Navbar**:
  - Implement dynamic URL resolution in `components/navbar.tsx` to generate signed URLs for private storage avatar paths.
- [x] **Profile Picture Upload & Cleanup**:
  - Modify `components/profile/profile-client-container.tsx` to upload canvas-compressed JPEG blobs directly to the `'avatars'` bucket.
  - Ensure previous avatar files are deleted from the user's folder before upload to prevent storage leaks.

### 6. Admin Sales & Revenue Dashboard Integration
- [x] **Database Migration for Financials**:
  - Create `supabase/migrations/20260620102200_admin_revenue.sql` adding `contract_value` and `amount_paid` columns to `projects`.
  - Create `payments` table and write RLS policies allowing only admins to access or modify transactions.
  - Implement `update_project_amount_paid` trigger keeping project paid balances synchronized automatically.
- [x] **Admin Dashboard UI Redesign**:
  - Update `app/(admin)/admin/page.tsx` to query and calculate Total Sales and Active Revenue Pipeline.
  - Add a Recent Transactions panel listing recent payments dynamically.
  - Expand metrics grid to 4 cards, including Sales and Pipeline figures.

## Verification Plan

### Automated Tests
- Run `npx supabase start` and apply migrations locally to ensure the full schema is created successfully.
- Verify building completes without errors via `npm run build`.

### Manual Verification
- **User Role Test**: Use the Signup page to register a new user. Verify they are assigned the `user` role in the DB, and can access the User Dashboard mockup but are blocked from the Admin Dashboard mockup.
- **Admin Role Test**: Manually create an admin user (or change a user's role to `admin` in the Supabase Studio). Log in via the Login page and verify access to the Admin Dashboard mockup.
- **Profile Edit Test**: Navigate to `/profile`, fill in all profile fields, update the profile picture, and save. Verify the details persist after refreshing the page and are correctly written to the Supabase database.
- **Navbar Dropdown Test**: Verify the dropdown correctly links standard users to `/dashboard` and admins to `/admin`, displays their profile details, and executes Sign Out successfully.
- **Storage Profile Picture Test**: Log in as a standard user. Upload an avatar. Verify it creates a file in the `'avatars'` storage bucket under your user ID folder and deletes any previous avatar files.
- **Storage Privacy & RLS Test**: Verify that standard users cannot access another user's avatar path directly, while admin users can successfully read all avatar files.
- **Sales & Pipeline Calculation Test**: Update a project value and log payments in Supabase. Verify the Admin Dashboard correctly aggregates the sums and displays the correct values in "Total Sales" and "Active Pipeline" cards.
- **Transaction Log Test**: Verify that recent transactions populate chronologically on the dashboard feed showing the correct notes and amounts.



