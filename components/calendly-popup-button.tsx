"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Brand-aligned Calendly colour params (mirrors CSS custom properties)
// ---------------------------------------------------------------------------
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  "https://calendly.com/gslegacywealth/30min"

const CALENDLY_PARAMS = new URLSearchParams({
  background_color: process.env.NEXT_PUBLIC_CALENDLY_BG_COLOR ?? "0A0A0A",
  text_color: process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR ?? "F0EDE6",
  primary_color: process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR ?? "C9A227",
  hide_landing_page_details: "1",
  hide_gdpr_banner: "1",
})

const STYLED_CALENDLY_URL = `${CALENDLY_URL}?${CALENDLY_PARAMS.toString()}`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CalendlyPopupButtonProps {
  /** Button label text */
  label?: string
  /** Optional name/email to pre-fill inside the Calendly popup */
  prefill?: { name?: string; email?: string }
  /** Additional class names forwarded to the Button wrapper */
  className?: string
  /** If true renders as an outline variant instead of the primary variant */
  outline?: boolean
}

/**
 * CalendlyPopupButton
 *
 * Triggers `Calendly.initPopupWidget()` using the same widget.js that is
 * loaded at root layout level (`strategy="lazyOnload"`).
 *
 * Graceful degradation: if window.Calendly is not yet loaded (blocked by an
 * ad-blocker or not yet hydrated), the button falls back to a standard Next.js
 * Link navigating the user to the full `/book` inline embed page.
 */
export function CalendlyPopupButton({
  label = "Book a Free Call",
  prefill,
  className,
  outline = false,
}: CalendlyPopupButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const Calendly = (window as any).Calendly

      // If Calendly widget script has loaded, open popup
      if (Calendly && typeof Calendly.initPopupWidget === "function") {
        e.preventDefault()
        Calendly.initPopupWidget({
          url: STYLED_CALENDLY_URL,
          ...(prefill && {
            prefill: {
              name: prefill.name ?? "",
              email: prefill.email ?? "",
            },
          }),
        })
      }
      // Otherwise let the fallback <Link> handle navigation to /book
    },
    [prefill]
  )

  return (
    // Wrap in a Link so that if JS is blocked / Calendly unavailable,
    // the element is still a valid anchor that navigates to /book.
    <Link href="/book" passHref legacyBehavior>
      <Button
        asChild={false}
        variant={outline ? "outline" : "default"}
        size="lg"
        onClick={handleClick}
        id="calendly-popup-cta"
        className={cn(
          "flex items-center gap-2",
          outline && "border-accent-gold/40 text-accent-gold hover:bg-accent-gold/10",
          className
        )}
      >
        <PhoneCall size={16} className="shrink-0" />
        {label}
      </Button>
    </Link>
  )
}
