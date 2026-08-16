/**
 * Lightweight sliding-window in-memory rate limiter for serverless routes.
 * Prevents automated endpoint abuse, spam scripts, and Resend API quota exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[]
}

const ipStore = new Map<string, RateLimitRecord>()

// Periodically clean up stale entries (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of ipStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000)
      if (record.timestamps.length === 0) {
        ipStore.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}

export interface RateLimitOptions {
  limit?: number
  windowMs?: number
}

/**
 * Checks whether an IP address has exceeded the specified rate limit.
 * @param identifier Client IP or identifier string
 * @param options limit (default: 8 requests) and windowMs (default: 60,000ms / 1 min)
 * @returns { success: boolean, remaining: number, resetMs: number }
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetMs: number } {
  const limit = options.limit ?? 8
  const windowMs = options.windowMs ?? 60 * 1000
  const now = Date.now()

  const cleanIp = identifier || 'unknown-ip'
  let record = ipStore.get(cleanIp)

  if (!record) {
    record = { timestamps: [] }
    ipStore.set(cleanIp, record)
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs)

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0]
    const resetMs = Math.max(0, windowMs - (now - oldestTimestamp))
    return {
      success: false,
      remaining: 0,
      resetMs,
    }
  }

  record.timestamps.push(now)
  return {
    success: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  }
}
