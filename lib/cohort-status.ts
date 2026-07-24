import { createClient } from "@/lib/supabase/client"

export interface CohortStatus {
  totalQuota: number
  wonCount: number
  remainingSlots: number
}

/**
 * Single Source of Truth for Cohort Allocation Telemetry.
 * Queries Supabase 'leads' for won/closed leads and computes remaining allocation slots.
 */
export async function getCohortStatus(): Promise<CohortStatus> {
  const totalQuota = 2
  const supabase = createClient()

  try {
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .in("status", ["Won", "Closed", "Client", "won", "closed", "client"])

    if (!error && typeof count === "number") {
      const remainingSlots = Math.max(0, totalQuota - count)
      return { totalQuota, wonCount: count, remainingSlots }
    }
  } catch (err) {
    // Fallback if DB is unavailable
  }

  return { totalQuota, wonCount: 0, remainingSlots: 2 }
}
