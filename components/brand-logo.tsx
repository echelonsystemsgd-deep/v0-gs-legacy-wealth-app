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
        alignItems: "center",
        gap: "0.25em",
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        userSelect: "none",
        fontWeight: 800,
      }}
    >
      <span
        style={{
          color: "#38BDF8",            /* Electric Cyan Primary */
          fontSize: "inherit",
        }}
      >
        Mercian
      </span>
      <span
        style={{
          color: "#F59E0B",            /* Warm Amber Accent */
          fontSize: "0.85em",
          background: "rgba(245, 158, 11, 0.15)",
          padding: "0.15em 0.4em",
          borderRadius: "0.3em",
          border: "1px solid rgba(245, 158, 11, 0.3)",
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

  const hasFill = (props as any).fill
  const imgWidth = hasFill ? undefined : (props as any).width || 140
  const imgHeight = hasFill ? undefined : (props as any).height || 40

  return (
    // LOGO_SWAP: Update BRAND_LOGO in lib/brand-assets.ts when the final
    // Mercian Wealth asset is ready — this <Image> will automatically pick it up.
    <Image
      {...(hasFill ? {} : { width: imgWidth, height: imgHeight })}
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

