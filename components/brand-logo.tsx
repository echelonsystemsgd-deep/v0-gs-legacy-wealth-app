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
      <span style={{ color: "#FFFFFF", fontSize: "inherit" }}>Mercian</span>
      <span
        style={{
          color: "#DAA640",
          fontSize: "0.85em",
          background: "rgba(218, 166, 64, 0.15)",
          padding: "0.15em 0.4em",
          borderRadius: "0.3em",
          border: "1px solid rgba(218, 166, 64, 0.3)",
        }}
      >
        Wealth
      </span>
    </span>
  )
}

function ModernBrandBadge({ className }: { className?: string }) {
  return (
    <div className={`h-full w-full rounded-xl bg-[#020E28] border border-[#DAA640]/40 flex items-center justify-center gap-1.5 px-3 py-1.5 shadow-lg shadow-[#DAA640]/10 ${className || ""}`}>
      <svg className="w-5 h-5 text-[#DAA640] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Storefront Awning + Tech Grid lines */}
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span className="font-mono font-extrabold text-xs tracking-wider text-white">MW</span>
    </div>
  )
}

export function BrandLogo({
  variant = "logo",
  alt = "Mercian Wealth",
  wordmarkOnly = false,
  className,
  ...props
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false)
  const src = variant === "watermark" ? BRAND_WATERMARK : BRAND_LOGO

  if (wordmarkOnly) {
    return <WordmarkLogo className={className as string | undefined} />
  }

  if (imgError) {
    return <ModernBrandBadge className={className as string | undefined} />
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
      onError={() => setImgError(true)}
      unoptimized
    />
  )
}
