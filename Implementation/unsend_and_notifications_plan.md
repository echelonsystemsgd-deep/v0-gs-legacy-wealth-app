# Implementation Plan: Chat Message Unsending & Instant Notification System

This document outlines the detailed design and implementation steps for adding message unsending (deletion) and instant notifications (both in-app and out-of-app) to the GS Legacy Wealth communication portals, ensuring 100% free operation using built-in browser capabilities and Supabase features.

---

## User Review Required

> [!IMPORTANT]
> **RLS & Time Constraints for Deletion (Unsend)**
> * We will implement a **15-minute time limit** on message unsending for clients to preserve conversational integrity and prevent historical chat modifications. Admins will retain unrestricted deletion privileges.
> * **Permissions:** Web browser native notification alerts require explicit user permission. The app will prompt users upon visiting the messages hub.

> [!TIP]
> **100% Free Notification Architecture**
> * **In-App:** Audio alerts, toast popups, and tab title flashing are entirely client-side and free.
> * **Out-of-App (Admin):** Slack/Discord Webhooks will be integrated with database triggers to notify you immediately on your phone/desktop when a client sends a message. This is 100% free and does not require paid push services.
> * **Out-of-App (Client):** We can utilize HTML5 notifications when the browser is open in the background, or fallback to your Resend email configuration.

---

## Proposed Changes

### 1. Database & Security (Supabase)

#### [MODIFY] [Supabase Row-Level Security Policies](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260531100000_rls.sql)
We will add a new RLS policy for the `public.messages` table to allow clients to delete messages they sent, restricted to the last 15 minutes:
```sql
CREATE POLICY "Clients can delete own messages within 15 minutes" ON public.messages
FOR DELETE
TO authenticated
USING (
  sender_id = auth.uid() 
  AND created_at > now() - interval '15 minutes'
);
```

---

### 2. Real-Time Chat Sync (Frontend)

#### [MODIFY] [MessagesClientContainer](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/components/client/messages-client-container.tsx)
* **Real-time Deletion Listener:** Chained `.on` trigger on the postgres changes channel to listen for `DELETE` events and filter out the unsent message from state.
* **UI Trash Icon:** Add a hover state for client messages. If the message belongs to the current user and was sent within 15 minutes, render a garbage/unsend button (`Trash2`).
* **Unsend Action:** Call `supabase.from('messages').delete().eq('id', messageId)` with loading spinners and error handle.

#### [MODIFY] [AdminMessageDesk](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/%28admin%29/admin/messages/page.tsx)
* **Real-time Deletion Listener:** Expand `postgres_changes` listener to handle global `DELETE` events.
* **UI Trash Icon:** Display a delete option next to any message sent by the admin (without time restrictions) or allow deletion of client messages for moderation.

---

### 3. Notification Mechanics (Free Services)

#### [MODIFY] [notify-admin Edge Function](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/functions/notify-admin/index.ts)
We will add handling for `table === 'messages' && type === 'INSERT'` events:
* When a message is inserted, check the sender. If it's a client sending a message, query the project details and forward an embed to Discord/Slack.
* Discord embed will show:
  * Title: `💬 New Client Message: [Client Name]`
  * Description: Preview of the text content.
  * Field: `Project Link` -> direct link to `/admin/messages` for the administrator.

#### [NEW] [Database Webhook for Messages](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/supabase/migrations/20260625203000_message_notification_webhook.sql)
Add a database trigger on `public.messages` table to fire an HTTP webhook to `notify-admin` edge function upon new insertions.

#### [MODIFY] [Client and Admin Chat UIs]
We will add browser-based notifications to the frontend:
1. **HTML5 Notification API:**
   * Request permission on page mount (`Notification.requestPermission()`).
   * Trigger native system notification if message is received while `document.hidden` is true (background tab).
2. **Audio alerts:** Use a lightweight, free notification sound played via Javascript `Audio` object.
3. **Tab title flashing:** Implement a `setInterval` that flashes `(1) New message | GS Legacy Wealth` in the browser tab title when the tab is blurred/inactive.

---

## Verification Plan

### Automated / Database Verification
* Run PostgreSQL statements to confirm RLS policies for `DELETE` block deletions where `sender_id != auth.uid()` or `created_at` is older than 15 minutes.
* Verify webhook triggers fire successfully when inserting records to the `messages` table.

### Manual Verification
* Log into the client dashboard, send a message, and check if the unsend button appears and disappears after 15 minutes.
* Unsend a message and confirm it is immediately removed from the admin's screen in real-time.
* Minimize the browser, send a message from admin to client, and verify that the client receives a native OS browser notification.
* Verify Discord/Slack receives instant webhook pings when clients submit chat messages.
