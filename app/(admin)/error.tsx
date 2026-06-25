"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin portal error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass rounded-2xl border border-accent-gold/20 p-8 text-center space-y-5">
        <AlertCircle className="mx-auto text-accent-gold" size={32} />
        <h1 className="font-serif text-xl font-bold text-foreground">Admin Portal Error</h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong loading this page. Your session is still active.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="sm">Try Again</Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
