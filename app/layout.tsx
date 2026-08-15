import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cinzel, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CalendlyInit } from '@/components/calendly-init'
import './globals.css'
import { StickyCTAButton } from '@/components/sticky-cta-button'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Watermark } from '@/components/watermark'
import { TabRetention } from '@/components/tab-retention'
import { Toaster } from '@/components/ui/sonner'
import { SITE_COPY } from '@/lib/site-copy'
import { WhatsAppButton } from '@/components/whatsapp-button'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mercianwealth.com'),
  title: {
    default: SITE_COPY.metadata.layout.defaultTitle,
    template: SITE_COPY.metadata.layout.titleTemplate,
  },
  description: SITE_COPY.metadata.layout.description,
  applicationName: 'Mercian Wealth',
  keywords: [
    "AI Automation for Local Business",
    "Bakery Websites & Booking",
    "Caterer Booking Systems",
    "Local Service Automation",
    "24/7 Deposit Capture",
    "Mercian Wealth",
    "Automated Storefronts",
    "Instant Booking Systems"
  ],
  authors: [{ name: 'Mercian Wealth' }],
  creator: 'Mercian Wealth',
  publisher: 'Mercian Wealth',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: SITE_COPY.metadata.layout.defaultTitle,
    description: SITE_COPY.metadata.layout.description,
    url: 'https://mercianwealth.com',
    siteName: 'Mercian Wealth',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Mercian Wealth — AI Websites & Business Automation for Local Service Businesses',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_COPY.metadata.layout.defaultTitle,
    description: SITE_COPY.metadata.layout.description,
    images: ['/twitter-image.png'],
    creator: '@mercianwealth',
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
    icon: [
      { url: '/MercianWealthLogo.jpeg', type: 'image/jpeg' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/MercianWealthLogo.jpeg',
    apple: '/MercianWealthLogo.jpeg',
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cinzel.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased">
          {children}
          <StickyCTAButton />
          <ScrollToTop />
        <Toaster position="top-right" theme="dark" richColors closeButton />
        <Watermark position="center" opacity={0.20} />
        <TabRetention />
        <WhatsAppButton />
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
        {/*
          CalendlyInit is a Client Component — it owns the <Script> tag so
          the onReady event handler is legal (RSC cannot use event handlers).
          It also initialises the brand-gold badge widget once the script loads.
        */}
        <CalendlyInit />
      </body>
    </html>
  )
}
