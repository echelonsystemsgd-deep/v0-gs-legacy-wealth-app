# P0 Backend Integrity & Pipeline Hygiene Plan

## Objective
Address critical, positioning-agnostic backend bugs and data-integrity gaps before considering any higher-level features (client portal, CMS schema, pricing architecture).

---

## Scope & Decisions

1. **Immediate P0 Fixes (Executed):**
   - **Admin Financial Telemetry:** Remove hardcoded `+ 40000` artificial offsets so all financial metrics reflect genuine database transactions.
   - **Lead Pipeline Dispatch Coverage:** Ensure all lead sources (`booking_form`, `fast_track_audit`, `contact_form`, `portfolio_waitlist`, `local_business_form`) dispatch to the n8n webhook automation pipeline.
   - **Webhook Resilience:** Add timeout signals (`AbortSignal.timeout(6000)`) and non-blocking retry safeguards on external webhook calls.
   - **Transactional Email Alignment:** Replace legacy `#38bdf8` (cyan) and `#6d28d9` (purple) hexes with the unified Navy (`#0A1128`) and Champagne Gold (`#D4AF37`) design tokens.

2. **Deferred P1–P5 Architectural Work:**
   - Client Portal scope, Scarcity Quota models, Portfolio CMS schema, and Retainer workflows remain decoupled and paused until high-level business positioning (High-Ticket Studio vs. Local Automation vs. Hybrid) is finalized.

---

## Modified Files
- `app/(admin)/admin/page.tsx`
- `app/api/forms/submit/route.ts`
- `app/api/qualify/route.ts`
