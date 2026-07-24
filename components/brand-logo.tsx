"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect } from "react"
import {
  BRAND_LOGO,
  BRAND_LOGO_FALLBACK,
  BRAND_WATERMARK,
} from "@/lib/brand-assets"
import { useWebsiteContent } from "@/hooks/use-website-content"

type BrandLogoProps = Omit<ImageProps, "src" | "alt"> & {
  variant?: "logo" | "watermark"
  alt?: string
  /** When true, always shows the text wordmark regardless of image asset status */
  wordmarkOnly?: boolean
}

/**
 * WordmarkLogo — interim branded text treatment used until the final
 * Mercian Wealth logo file is available.
 *
 * LOGO_SWAP: Replace this component call with the <Image> tag once
 * the final asset is placed at /public/MercianWealthlogo.jpeg (or .png).
 * See lib/brand-assets.ts for the central path constants.
 */
function WordmarkLogo({ className }: { className?: string }) {
  return (
    <span
      className={className}
      aria-label="Mercian Wealth"
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.2em",
        fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif",
        letterSpacing: "0.06em",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      <span
        style={{
          color: "#C5A059",            /* Antique Polished Gold — brand token */
          fontWeight: 700,
          fontSize: "inherit",
        }}
      >
        Mercian
      </span>
      <span
        style={{
          color: "#A3A8B4",            /* Sterling Silver — brand token */
          fontWeight: 400,
          fontSize: "inherit",
        }}
      >
        Wealth
      </span>
    </span>
  )
}

export function BrandLogo({
  variant = "logo",
  alt = "Mercian Wealth",
  wordmarkOnly = false,
  className,
  ...props
}: BrandLogoProps) {
  const { getSection } = useWebsiteContent()
  const data = getSection("branding", {
    logoUrl: BRAND_LOGO,
    watermarkUrl: BRAND_WATERMARK,
  })

  const primary = variant === "watermark" ? data.watermarkUrl : data.logoUrl

  // Track whether the image failed to load — fall back to wordmark
  const [imgError, setImgError] = useState(false)
  const [src, setSrc] = useState(primary)

  useEffect(() => {
    setSrc(primary)
    setImgError(false)
  }, [primary])

  // Always show wordmark if explicitly requested or asset unavailable
  if (wordmarkOnly || imgError) {
    return <WordmarkLogo className={className as string | undefined} />
  }

  const isFill = Boolean((props as any).fill)
  const imageDimensions = !isFill
    ? {
        width: (props as any).width || 140,
        height: (props as any).height || 40,
      }
    : {}

  return (
    // LOGO_SWAP: Update BRAND_LOGO in lib/brand-assets.ts when the final
    // Mercian Wealth asset is ready — this <Image> will automatically pick it up.
    <Image
      {...imageDimensions}
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        // Fall through to wordmark if both primary and fallback fail
        if (src !== BRAND_LOGO_FALLBACK) {
          setSrc(BRAND_LOGO_FALLBACK)
        } else {
          setImgError(true)
        }
      }}
    />
  )
}

