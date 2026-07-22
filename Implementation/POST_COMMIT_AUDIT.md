# Post-Commit & Incident Audit Log

## DATABASE INCIDENT 2026-07-21

### 1. Incident Summary
On 2026-07-21, a script intended for another project (a real estate portal) was accidentally executed on the Supabase database instance (`ladebhmyywkcqtyazxxk`). This action dropped `public.profiles` and recreated it with an incompatible schema, causing loss of user profile records, missing columns required by the application, and infinite recursion errors in Row Level Security (RLS) policies.

### 2. Root Causes Identified
* **Schema Collision**: The `public.profiles` table was replaced with a legacy schema containing only `id`, `full_name`, `role`, and `created_at`.
* **Missing Columns**: Columns `first_name`, `last_name`, `email`, `is_suspended`, `avatar_url`, `phone_number`, `address_line1`, `address_line2`, `post_code`, `city`, `updated_at`, and `has_completed_tour` were removed.
* **RLS Policy Recursion**: Direct inline subqueries on `public.profiles` within policies on `public.profiles` caused `infinite recursion detected in policy for relation "profiles"` runtime errors.
* **Data Loss**: Existing user profile entries, including the admin account for `gslegacywealth@gmail.com`, were wiped.

### 3. Remediation & Fixes Executed (2026-07-22)
* **Real Estate Artifact Removal**: Dropped invalid tables (`properties`, `inquiries`, `saved_properties`, `boundary_alerts`, `viewing_requests`) and purged real estate seed data profiles (`Arthur Pendragon`, `Victoria Ashworth`, `Albert Stirling`).
* **Schema Restoration**: Altered `public.profiles` to restore all missing columns and set defaults. Added `admin`, `user`, and `client` enum values to `public.user_role`.
* **RLS Repair**: Replaced recursive RLS policies on `public.profiles` with non-recursive policies (`auth.uid() = id` and `is_admin()`). Defined `public.is_admin()` with `SECURITY DEFINER SET search_path = public`.
* **Trigger Restoration**: Restored `public.handle_new_user()` trigger function to automatically provision profile records for newly registered auth users.
* **Profile Provisioning**: Re-created and linked the admin profile record for `gslegacywealth@gmail.com` (`id: 32e053a9-ae7a-4bc8-95cc-d0c91f454af9`) with `role = 'admin'` and `is_suspended = false`, and auto-provisioned missing profiles for all existing auth users.
