"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import {
  BRAND_LOGO,
  BRAND_LOGO_FALLBACK,
  BRAND_WATERMARK,
} from "@/lib/brand-assets"

type BrandLogoProps = Omit<ImageProps, "src" | "alt"> & {
  variant?: "logo" | "watermark"
  alt?: string
}

export function BrandLogo({
  variant = "logo",
  alt = "GS Legacy Wealth",
  ...props
}: BrandLogoProps) {
  const primary = variant === "watermark" ? BRAND_WATERMARK : BRAND_LOGO
  const [src, setSrc] = useState(primary)

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => {
        if (src !== BRAND_LOGO_FALLBACK) setSrc(BRAND_LOGO_FALLBACK)
      }}
    />
  )
}
