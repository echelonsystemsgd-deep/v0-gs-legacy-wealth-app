import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'GS Legacy Wealth AI Website Preview'
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
          background: 'linear-gradient(to bottom right, #000000, #111111)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 215, 0, 0.2)', // Gold-ish border
            borderRadius: '24px',
            padding: '60px',
            background: 'rgba(20, 20, 20, 0.8)',
            boxShadow: '0 0 80px rgba(255, 215, 0, 0.05)',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 800,
              background: 'linear-gradient(to right, #ffffff, #aaaaaa)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
              fontFamily: 'sans-serif',
              lineHeight: 1.1,
            }}
          >
            GS Legacy Wealth AI
          </h1>
          <p
            style={{
              fontSize: 36,
              color: '#888888',
              textAlign: 'center',
              maxWidth: '800px',
              fontFamily: 'sans-serif',
              lineHeight: 1.4,
            }}
          >
            Luxury AI-Powered Websites for Ambitious Businesses
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
