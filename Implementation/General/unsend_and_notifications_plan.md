# Implementation Plan: Chat Message Unsending & Instant Notification System (Updated)

This document outlines the detailed design and implementation steps for completing the message unsending (deletion) and instant notifications (both in-app and out-of-app) for the GS Legacy Wealth communication portals. 

---

## Current Status & Gap Analysis

Many of the frontend and client-side components have already been implemented, but the backend database policies, triggers, and the client email fallback notifications are currently missing.

| Feature Component | Status | Location / Implementation Details |
| :--- | :---: | :--- |
| **Real-time Chat Sync (Frontend)** |  **Done** | Listening to `INSERT` and `DELETE` events in [MessagesClientContainer](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/messages-client-container.tsx) and [AdminMessageDesk](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28admin%29/admin/messages/page.tsx). |
| **UI Unsend Handlers** |  **Done** | Client UI enforces a 15-minute window restriction; Admin UI allows unrestricted deletion. |
| **In-App Notifications** |  **Done** | Browser HTML5 Notification permission requests, dual-note AudioContext synthesized chiming, and tab title flashing (`💬 New Message!`) are fully built. |
| **`notify-admin` Edge Function** |  **Done** | Function exists at [notify-admin](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/functions/notify-admin/index.ts) with Discord and Slack formatting. |
| **Admin Out-of-App (Webhook)** | **Partial** | Triggered client-side via manual invoke fallback rather than database webhooks. |
| **Database Deletion RLS Policies** | ❌ **Missing** | No `DELETE` policies on `public.messages` in migration files. |
| **Database Notification Webhook** | ❌ **Missing** | No database webhook trigger on `public.messages` to call `notify-admin` upon insertion. |
| **Client Out-of-App (Email)** | ❌ **Missing** | No integration sending emails to offline clients when they receive messages/notifications. |

---

## User Review Required

> [!IMPORTANT]
> **Supabase Secrets Configuration**
> * For webhook notifications to fire, `DISCORD_WEBHOOK_URL` and `SLACK_WEBHOOK_URL` must be set in Supabase secrets.
> * For client email notifications to work, `RESEND_API_KEY` must be configured in Supabase secrets or local `.env` depending on host.
> * We will deploy an Edge Function (`send-email-notification`) to handle the Resend email transmission securely.

> [!TIP]
> **Ensuring Zero-Downtime Notifications**
> Moving from client-side edge function invocation to database-level webhook triggers guarantees notification delivery even if the client's network drops or they close the window immediately after sending a message.

---

## Proposed Changes

### 1. Database & Security (Supabase)

#### [NEW] [Database RLS & Webhook Trigger Migration](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260626160000_messages_unsend_and_webhook.sql)
We will create a new migration containing the database-level security and webhook triggers:
1. **Unsend Deletion RLS Policy**:
   ```sql
   CREATE POLICY "Clients can delete own messages within 15 minutes" ON public.messages
   FOR DELETE
   TO authenticated
   USING (
     sender_id = auth.uid() 
     AND created_at > now() - interval '15 minutes'
   );
   ```
2. **Database Trigger Webhook for Admins**:
   - Create a postgres trigger function `public.notify_admin_on_message_insert()`.
   - The function queries the sender's role from `public.profiles`.
   - If the sender is a **client**, it queries their name, constructs the JSON payload, and initiates an HTTP POST request using `net.http_post` to call the `notify-admin` Edge function.
   - Bind this trigger to `AFTER INSERT ON public.messages`.

#### [NEW] [Client Email Notification Trigger Migration](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260626170000_client_email_notifications.sql)
1. **Database Trigger Webhook for Clients**:
   - Create a postgres trigger function `public.notify_client_on_notification_insert()`.
   - When a row is inserted into `public.user_notifications` (which occurs when an admin sends a message, project update, or milestone progress), the trigger extracts the user's email from `public.profiles`.
   - Fires an HTTP POST request using `net.http_post` to invoke our new `send-email-notification` Edge function.
   - Bind this trigger to `AFTER INSERT ON public.user_notifications`.

---

### 2. Edge Functions (Supabase)

#### [NEW] [send-email-notification Edge Function](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/functions/send-email-notification/index.ts)
A lightweight Edge function that reads `RESEND_API_KEY` from environment secrets and posts to `https://api.resend.com/emails`:
* **Payload**: Receives `email`, `title`, and `description` from the database webhook.
* **Email Template**: Formats a clean, professional HTML message representing a portal update (e.g. *"You have received a new update on your GS Legacy Wealth portal: [Title] - [Description]. Log in to reply."*).

---

### 3. Frontend Cleanup

#### [MODIFY] [MessagesClientContainer](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/messages-client-container.tsx)
* Remove the manual client-side `supabase.functions.invoke('notify-admin')` fallback inside `handleSendMessage`. Since the database trigger will handle the webhook automatically upon insertion, this client-side call is no longer required and would cause duplicate alerts.

---

## Verification Plan

### Automated / Database Verification
1. Insert a test message from a simulated client and verify that the trigger calls `notify-admin` and posts successfully to Discord/Slack.
2. Attempt to delete a message sent 20 minutes ago as a client, verifying it fails due to the RLS policy.
3. Delete a message sent 2 minutes ago as a client, verifying it succeeds.
4. Insert a notification for a client in `public.user_notifications` and verify the trigger calls the `send-email-notification` Edge function.

### Manual Verification
1. Open the Discord/Slack channels and confirm real-time webhook embeds are received upon sending a message.
2. Check email inbox for a test client notification and inspect the formatting.
