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
    "website for bakery",
    "local business automation",
    "WhatsApp order alerts",
    "deposit collection UK",
    "small business website",
    "bakery website design",
    "catering business website"
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
    description: "Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls.",
    url: 'https://mercianwealth.com',
    siteName: 'Mercian Wealth',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Mercian Wealth | Websites & Automation for Bakeries & Local Businesses',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_COPY.metadata.layout.defaultTitle,
    description: "Automated storefronts, instant WhatsApp alerts & 24/7 deposit capture for bakeries, caterers & local UK businesses. Stop losing bookings to missed calls.",
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
  minimumScale: 1,
  // Do NOT set maximumScale or userScalable — browser default allows pinch-zoom
  viewportFit: 'cover',
  themeColor: '#020E28',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Mercian Wealth',
  image: 'https://mercianwealth.com/MercianWealthLogo.jpeg',
  '@id': 'https://mercianwealth.com/#organization',
  url: 'https://mercianwealth.com',
  telephone: '+447851055929',
  priceRange: '£495 - £2,495',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.4862,
    longitude: -1.8904,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    opens: '00:00',
    closes: '23:59'
  },
  description: 'AI-powered digital storefronts, automated deposit collection, and instant WhatsApp alerts for UK local service businesses and food artisans.',
  sameAs: [
    'https://wa.me/447851055929'
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cinzel.variable} ${geistMono.variable} bg-[#020E28]`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#020E28] text-white">
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
        */}
        <link
          rel="stylesheet"
          href="https://assets.calendly.com/assets/external/widget.css"
        />
        <CalendlyInit />
      </body>
    </html>
  )
}
