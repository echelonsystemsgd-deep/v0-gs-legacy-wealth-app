/**
 * app/api/revalidate-pricing/route.ts
 *
 * On-demand cache revalidation endpoint for pricing data.
 * Called by the admin pricing editor immediately after a successful save,
 * ensuring the public pricing page and homepage update instantly rather
 * than waiting for the 60-second background revalidation window.
 *
 * Security: requires the x-admin-key header matching ADMIN_REVALIDATE_SECRET
 * env var (falls back to a default for dev convenience if unset).
 *
 * Usage:
 *   POST /api/revalidate-pricing
 *   Headers: { "x-admin-key": "<secret>" }
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const ADMIN_SECRET = process.env.ADMIN_REVALIDATE_SECRET ?? 'gs-legacy-admin-revalidate'

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-admin-key')

  if (key !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    revalidateTag('pricing')
    return NextResponse.json({
      revalidated: true,
      tag: 'pricing',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation failed', detail: String(err) },
      { status: 500 }
    )
  }
}
