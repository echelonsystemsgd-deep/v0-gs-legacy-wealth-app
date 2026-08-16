import { createClient } from "@/lib/supabase/client"

export interface CohortStatus {
  totalQuota: number
  wonCount: number
  remainingSlots: number
  cohortStatus?: "open" | "closing_soon" | "waitlist_only"
  bannerActive?: boolean
  bannerText?: string
  bannerLink?: string
}

const DEFAULT_STATUS: CohortStatus = {
  totalQuota: 2,
  wonCount: 0,
  remainingSlots: 2,
  cohortStatus: "open",
  bannerActive: true,
  bannerText: "Custom AI Automations & Digital Storefronts — Test Live Order Demo",
  bannerLink: "/local",
}

/**
 * Single Source of Truth for Cohort Allocation Telemetry.
 * Queries Supabase 'website_content' for dynamic settings and 'leads' for won/closed leads.
 */
export async function getCohortStatus(): Promise<CohortStatus> {
  let totalQuota = 2
  let manualOverride: number | null = null
  let cohortStatus: "open" | "closing_soon" | "waitlist_only" = "open"
  let bannerActive = true
  let bannerText = DEFAULT_STATUS.bannerText
  let bannerLink = DEFAULT_STATUS.bannerLink

  try {
    const supabase = createClient()

    // 1. Fetch dynamic settings from website_content if configured
    const { data: settingsData } = await supabase
      .from("website_content")
      .select("content")
      .eq("section_key", "cohort_scarcity_settings")
      .maybeSingle()

    if (settingsData && settingsData.content) {
      const content = settingsData.content as any
      if (typeof content.total_quota === "number") totalQuota = content.total_quota
      if (typeof content.manual_override_slots === "number") manualOverride = content.manual_override_slots
      if (content.cohort_status) cohortStatus = content.cohort_status
      if (typeof content.banner_active === "boolean") bannerActive = content.banner_active
      if (content.banner_text) bannerText = content.banner_text
      if (content.banner_link) bannerLink = content.banner_link
    }

    // 2. Fetch actual won count from CRM leads
    const { count, error } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .in("status", ["Won", "Closed", "Client", "won", "closed", "client"])

    const wonCount = (!error && typeof count === "number") ? count : 0

    // 3. Compute remaining slots (manual override takes precedence if defined)
    const computedRemaining = Math.max(0, totalQuota - wonCount)
    const remainingSlots = manualOverride !== null ? Math.max(0, manualOverride) : computedRemaining

    return {
      totalQuota,
      wonCount,
      remainingSlots,
      cohortStatus,
      bannerActive,
      bannerText,
      bannerLink,
    }
  } catch (err) {
    // Graceful fallback if DB is unconfigured or network is down
    return DEFAULT_STATUS
  }
}
