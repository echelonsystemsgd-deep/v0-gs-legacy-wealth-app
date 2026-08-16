import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mercian Wealth | AI Websites & Automated Storefronts for UK Local Businesses'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#020E28',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '60px 80px',
        }}
      >
        {/* Subtle radial gold glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(218, 166, 64, 0.15) 0%, rgba(2, 14, 40, 0) 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Outer border frame */}
        <div
          style={{
            position: 'absolute',
            inset: '30px',
            border: '1px solid rgba(218, 166, 64, 0.25)',
            borderRadius: '24px',
          }}
        />

        {/* Brand Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(218, 166, 64, 0.12)',
            border: '1px solid rgba(218, 166, 64, 0.35)',
            padding: '8px 20px',
            borderRadius: '100px',
            color: '#DAA640',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}
        >
          ✦ Mercian Wealth Studio · UK
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.15,
            maxWidth: '1000px',
            marginBottom: '24px',
          }}
        >
          <span>Websites & Automated Storefronts</span>
          <span style={{ color: '#DAA640' }}>That Collect Deposits 24/7.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#94A3B8',
            fontSize: '22px',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
          }}
        >
          24/7 Mobile Lead Capture · Instant WhatsApp Phone Alerts · Upfront Stripe Deposits
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
