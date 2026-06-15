# Implementation Plan: Concierge Fallback Error Screen

## Background

When visitors register their interest in the portfolio under-construction modal, any database insertion errors (e.g., local Supabase connection issues) currently output a raw technical alert (like `TypeError: Failed to fetch (placeholder.supabase.co)`) and leave the form visible.

This plan replaces that error state with a premium fallback card. If a database sync error is caught, the form is removed and the visitor is presented with a direct luxury email concierge option using **gslegacywealth@gmail.com**.

---

## Proposed Changes

### `components/portfolio.tsx`

We will update the `UnderConstructionModal` component:

1. **State Addition**: Add a `copied` state to handle the "Copied to clipboard!" animation/feedback.
2. **Click-to-Copy & Mailto Action**: Introduce a function to copy the email `gslegacywealth@gmail.com` to the visitor's clipboard and trigger a graceful message.
3. **Condition-Based Fallback UI**:
   - If `errorMsg` is set (e.g., Supabase offline), we replace the `<form>` section entirely with the Concierge Fallback card.

---

### Visual Design of the Fallback State

```
┌────────────────────────────────────────────┐
│                   ✉️                       │
│          Registry Offline                  │
│                                            │
│  Our automated queue is currently undergoing  │
│  modernization. To secure early access,    │
│  please contact our concierge directly:     │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │      gslegacywealth@gmail.com        │  │
│  └──────────────────────────────────────┘  │
│          (Click to copy & email)           │
│                                            │
│              [ Go Back ]                   │
└────────────────────────────────────────────┘
```

---

## Verification Plan

### Manual Verification
- Simulate an error by entering a invalid/mock Supabase URL or forcing the fetch to fail.
- Confirm the input boxes and submit buttons disappear completely.
- Verify the luxury Concierge card appears with the custom text.
- Click on the email address box and verify:
  1. The text changes to a gold "Copied to clipboard!" notification.
  2. The email client opens automatically (via `mailto:` link).
- Close button still functions to dismiss the modal.
