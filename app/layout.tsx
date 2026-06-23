import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cinzel, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import { StickyCTAButton } from '@/components/sticky-cta-button'
import { Watermark } from '@/components/watermark'
import { TabRetention } from '@/components/tab-retention'
import { Toaster } from '@/components/ui/sonner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://gslegacywealth.com'
  ),
  title: {
    default: 'GS Legacy Wealth AI | Luxury AI-Powered Websites',
    template: '%s | GS Legacy Wealth AI'
  },
  description: 'Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.',
  applicationName: 'GS Legacy Wealth',
  keywords: ['AI Automation', 'Luxury Websites', 'Digital Assets', 'Web Development', 'Business Growth'],
  authors: [{ name: 'GS Legacy Wealth' }],
  creator: 'GS Legacy Wealth AI',
  publisher: 'GS Legacy Wealth AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'GS Legacy Wealth AI | Luxury AI-Powered Websites',
    description: 'Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.',
    url: 'https://gslegacywealth.com',
    siteName: 'GS Legacy Wealth AI',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'GS Legacy Wealth AI Website Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GS Legacy Wealth AI | Luxury AI-Powered Websites',
    description: 'Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.',
    images: ['/twitter-image.png'],
    creator: '@gslegacywealth',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/GS_Legacy_Wealth-removebg-preview.png?v=2',
    shortcut: '/GS_Legacy_Wealth-removebg-preview.png?v=2',
    apple: '/GS_Legacy_Wealth-removebg-preview.png?v=2',
  },
  // DNS prefetch for Calendly embed (reduces first-load latency by ~150–200 ms)
  other: {
    'preconnect-calendly': 'https://calendly.com',
    'preconnect-calendly-assets': 'https://assets.calendly.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cinzel.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" theme="dark" richColors closeButton />
        <Watermark position="center" opacity={0.06} />
        <TabRetention />
        <StickyCTAButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {/*
          Calendly widget.js — loaded at root so it is available for both:
          1. The inline embed on /book (step 2)
          2. CalendlyPopupButton on any marketing page
          afterInteractive loads right after hydration so window.Calendly is
          ready before the user can reach the calendar step.
        */}
        {/*
          Calendly popup CSS — REQUIRED for initPopupWidget() to render the
          popup overlay correctly. Without this stylesheet the JS fires but
          the modal is invisible (no backdrop, no frame). The inline embed
          on /book does NOT need this; only the popup CTA does.
        */}
        <link
          rel="stylesheet"
          href="https://assets.calendly.com/assets/external/widget.css"
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
