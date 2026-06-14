import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CustomCursor } from '@/components/custom-cursor'
import { StickyCTAButton } from '@/components/sticky-cta-button'
import { Watermark } from '@/components/watermark'
import { TabRetention } from '@/components/tab-retention'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GS Legacy Wealth AI | Luxury AI-Powered Websites',
    template: '%s | GS Legacy Wealth AI'
  },
  description: 'We engineer digital assets that create authority, automate growth, and generate revenue. Premium AI-powered websites for ambitious businesses.',
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
    description: 'Premium AI-powered websites for ambitious businesses. We engineer digital assets that create authority and generate revenue.',
    url: 'https://gslegacywealth.com',
    siteName: 'GS Legacy Wealth AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GS Legacy Wealth AI | Luxury AI-Powered Websites',
    description: 'Premium AI-powered websites for ambitious businesses.',
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
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
    <html lang="en" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Watermark position="center" opacity={0.06} />
        <TabRetention />
        <CustomCursor />
        <StickyCTAButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
