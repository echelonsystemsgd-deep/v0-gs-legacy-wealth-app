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
}

export function BrandLogo({
  variant = "logo",
  alt = "GS Legacy Wealth",
  ...props
}: BrandLogoProps) {
  const { getSection } = useWebsiteContent()
  const data = getSection('branding', {
    logoUrl: BRAND_LOGO,
    watermarkUrl: BRAND_WATERMARK,
  })

  const primary = variant === "watermark" ? data.watermarkUrl : data.logoUrl
  const [src, setSrc] = useState(primary)

  useEffect(() => {
    setSrc(primary)
  }, [primary])

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
