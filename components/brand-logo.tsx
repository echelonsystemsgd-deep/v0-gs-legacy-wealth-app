"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import {
  BRAND_LOGO,
  BRAND_WATERMARK,
} from "@/lib/brand-assets"

type BrandLogoProps = Omit<ImageProps, "src" | "alt"> & {
  variant?: "logo" | "watermark"
  alt?: string
  /** When true, always shows the text wordmark regardless of image asset status */
  wordmarkOnly?: boolean
}

/**
 * WordmarkLogo — text fallback used when wordmarkOnly is explicitly requested.
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
      <span style={{ color: "#38BDF8", fontSize: "inherit" }}>Mercian</span>
      <span
        style={{
          color: "#F59E0B",
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
  const src = variant === "watermark" ? BRAND_WATERMARK : BRAND_LOGO

  if (wordmarkOnly) {
    return <WordmarkLogo className={className as string | undefined} />
  }

  const hasFill = (props as any).fill
  const imgWidth = hasFill ? undefined : (props as any).width || 140
  const imgHeight = hasFill ? undefined : (props as any).height || 40

  return (
    <Image
      {...(hasFill ? {} : { width: imgWidth, height: imgHeight })}
      {...props}
      src={src}
      alt={alt}
      className={className}
      unoptimized
    />
  )
}
