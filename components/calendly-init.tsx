"use client"

import Script from "next/script"

/**
 * CalendlyInit
 *
 * Loads the Calendly widget.js script site-wide so it is available for:
 *   1. The inline embed on /book (step 2 of the vetting flow)
 *   2. initPopupWidget() calls from StickyCTAButton and CalendlyPopupButton
 *
 * INTENTIONAL: The Calendly badge widget (initBadgeWidget) is NOT initialised
 * here. A floating "Book now" pill contradicts the brand's positioning of
 * selective, scarce access. Booking entry points are gated behind our own
 * 5-step qualification flow — visitors apply; we confirm. Floating badges
 * signal availability and accessibility, which undermines that authority.
 *
 * Must be a Client Component because Next.js <Script onReady> is an event
 * handler prop — disallowed in React Server Components.
 */
export function CalendlyInit() {
  return (
    <Script
      src="https://assets.calendly.com/assets/external/widget.js"
      strategy="afterInteractive"
    />
  )
}

