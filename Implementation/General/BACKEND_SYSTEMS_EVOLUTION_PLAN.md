# Backend Systems Evolution & Integrity Architecture

**Status:** Planned  
**Target:** Admin Dashboard, Client Operations Machine, and Public API Resilience  
**Date:** August 2026

---

## 1. Executive Summary & Context
Following the comprehensive Navy + Gold frontend brand overhaul and conversion architecture fixes, the backend architecture is evolving to replace static mockups and hardcoded telemetry with robust, database-backed systems. 

This document outlines the evolutionary steps required to bring the backend up to the high-polish standard of the frontend, eliminating data inconsistencies, securing public endpoints, and elevating the client portal into a key enterprise asset for the **Operations Machine** (£10,000) tier.

---

## 2. Admin Dashboard & Dynamic CMS Evolution

### A. Dynamic Data Management (Supabase-backed CMS)
| Component | Current State | Proposed Database & Admin Tooling |
| :--- | :--- | :--- |
| **Unified Scarcity Counter** | Static quota (`2`) hardcoded in `lib/cohort-status.ts`. | **Dynamic Cohort Engine:** Add `system_settings` key-value or `cohort_settings` table (`month_year`, `total_quota`, `manual_override_count`, `is_closed`). Connect `/admin/settings` to allow one-click adjustments without code commits. |
| **Real Testimonials** | Static copy array in `lib/site-copy.ts`. | **Live Testimonials CMS:** Connect `components/testimonials.tsx` to read from the `testimonials` table in Supabase (ordered by `is_featured`, `created_at`), with graceful fallback to `SITE_COPY` if offline. |
| **Portfolio Items & Badges** | Static mock data in `components/portfolio.tsx`. | **Portfolio CMS:** Connect `components/portfolio.tsx` to `portfolio_items` table in Supabase. Allow admin toggling of badge types (`Live Deployment`, `Interactive Sandbox`, `Client Prototype`), tags, and metrics in `/admin/portfolio`. |
| **Announcement Banner** | Static copy in `components/announcement-bar.tsx`. | **Broadcast Banner CMS:** Backed by `announcements` table for dynamic sitewide alerts (e.g. "Only 1 Cohort Slot Remaining"). |

### B. Sensible Admin Dashboard Pillars
1. **Lead & Discovery Pipeline:**
   - Unified triage for all form sources (`booking_form`, `contact_form`, `portfolio_waitlist`, `fast_track_audit`, `local_business_form`).
   - **ROI Calculator Submissions:** Log user input variables (industry, revenue, missed call volume, estimated cost leakage) directly attached to the lead record.
   - **Loom Audit Pipeline:** Fast-track video delivery workflow with one-click transactional email dispatch.
2. **n8n Automation Pipeline & Webhook Telemetry:**
   - Webhook logging & dispatch audit trail in `/admin/logs`.
   - Dead-letter queue with one-click re-dispatch for missed n8n webhooks.
3. **Content Engine:**
   - Direct image uploads to Supabase Storage buckets (`testimonials`, `portfolio-previews`).

---

## 3. Client Portal Architecture ("Operations Machine")

### A. Core Client Capabilities
1. **Interactive Milestone & Deployment Tracker:**
   - Phased delivery roadmap (`Phase 1: Architecture` ➔ `Phase 2: Build` ➔ `Phase 3: UAT & Staging` ➔ `Phase 4: Production Handover`).
   - Formal stage sign-off gates with immutable timestamped approval in Supabase.
2. **Staging & Deliverables Hub:**
   - Secure sandbox links, Loom walkthrough embeds, and interactive documentation.
3. **Encrypted Secure Vault:**
   - Safe input mechanism for client third-party API credentials (Stripe keys, WhatsApp IDs, Webhooks).
4. **Billing & Retainer Management:**
   - Stripe Customer Billing Portal integration for self-service invoice downloads and retainer management.
5. **Support Ticket Desk:**
   - Structured escalation with automated WhatsApp/Slack alerts to the founder via n8n.

---

## 4. Backend Health, Security & Resilience

1. **Rate Limiting & Honeypot Protection:**
   - In-memory / Upstash rate limiting on `/api/forms/submit`, `/api/qualify`, and `/api/audit`.
   - Hidden honeypot fields (`_hp_company`, `website_url_hp`) to trap automated bot submissions before hitting Resend or DB.
2. **Resilient Webhook Queue:**
   - Outbound webhooks stored in a `webhook_queue` table to guarantee zero-drop delivery even during n8n server restarts.
3. **Resend Domain Fallbacks:**
   - Robust transactional error handling preventing silent failures if non-verified domain emails are triggered.
4. **Row Level Security (RLS) Verification:**
   - Audit all client project queries to strictly enforce `auth.uid() = client_id`.

---

## 5. Prioritization Matrix (Impact vs. Effort)

| Item | Description | Impact | Effort | Priority |
| :--- | :--- | :---: | :---: | :---: |
| **1. Rate Limiting & Honeypots** | In-memory token bucket + honeypot on public form APIs to stop bot spam and protect Resend quotas. | **HIGH** | **LOW** | **P1 (Quick Win)** |
| **2. Dynamic Scarcity & Cohort CMS** | Back `getCohortStatus()` with Supabase `system_settings` table & admin edit modal. | **HIGH** | **LOW** | **P1 (Quick Win)** |
| **3. Database-Backed Testimonials & Portfolio** | Connect frontend components to Supabase tables with instant static fallbacks. | **HIGH** | **MED** | **P1 (High ROI)** |
| **4. Resilient Webhook Queue & Admin Logs** | Record outbound n8n payloads with retry & manual replay capability in admin logs. | **HIGH** | **MED** | **P2** |
| **5. Client Stage Sign-Off & Milestone Approvals** | Complete `/client` milestone approval pipeline and automated founder notification. | **HIGH** | **MED** | **P2** |
| **6. ROI Calculator Submission Telemetry** | Capture ROI calculator metric state and attach to CRM lead record. | **MED** | **LOW** | **P2** |
| **7. Stripe Customer Billing Portal** | Add self-serve invoice and retainer portal link in client dashboard. | **MED** | **MED** | **P3** |
| **8. Encrypted Client Vault** | Secure credential intake for onboarding client API keys. | **MED** | **HIGH** | **P3** |
