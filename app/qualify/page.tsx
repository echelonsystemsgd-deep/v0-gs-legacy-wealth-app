"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function QualifyPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      router.replace(`/book?${searchParams.toString()}`)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-accent-gold" size={32} />
      <p className="text-xs text-muted-foreground tracking-wider uppercase font-semibold">
        Redirecting to booking portal...
      </p>
    </div>
  )
}
