# Implementation Plan - Terms of Service & Privacy Policy Redesign

This plan outlines the redesign of the public-facing Terms of Service and Privacy Policy pages. By migrating them from dull text blocks to premium, visual, and scannable trust documents, we build client authority and transparency.

## Proposed Changes

We will redesign both documents to introduce a plain-English trust card at the top, add styled Lucide icons for section anchors, and highlight key trust-building clauses.

---

### Pages Redesign

#### [MODIFY] [terms/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/terms/page.tsx)
- Import Lucide icons: `Scale`, `Layers`, `Award`, `ShieldAlert`, `Sparkles`.
- Add a **Plain English Commitments Card** highlighting:
  - **100% IP Transfer**: You own completed code, assets, and database mappings upon milestone release.
  - **Milestone-Based Investment**: Clear billing checkpoints tied strictly to verified deliverables.
  - **Launch Support**: Hard-coded support terms for post-launch maintenance and telemetry.
- Format legal sections with side icons, custom borders, and highlighted key phrases.

#### [MODIFY] [privacy/page.tsx](file:///c:/Users/Deepg/OneDrive/Desktop/The%20Real%20World/Campuses/AI%20Automation/New%20Lessons/CODING/v0-gs-legacy-wealth-app/app/privacy/page.tsx)
- Import Lucide icons: `Database`, `Cpu`, `Share2`, `Lock`, `Sparkles`.
- Add a **Plain English Privacy Card** highlighting:
  - **100% Confidentiality**: Leads and system interactions are never sold or rented.
  - **Zero Tracking Abuse**: No advertising trackers or data profiling.
  - **Secure Enclaves**: Secure data transit via Supabase Row-Level Security (RLS).
- Format legal sections with side icons, custom borders, and highlighted key phrases.

---

## Verification Plan

### Static Verification
- Verify TypeScript compiles cleanly with `npx tsc --noEmit`.
- Check styling matches the site-wide brand tokens (`gold`, `bg-secondary`, `font-serif`).
