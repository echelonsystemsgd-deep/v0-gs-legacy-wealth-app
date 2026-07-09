# Implementation Plan: Robust Metadata & URL Previews

This plan outlines the steps to implement a complete and robust metadata strategy for the Mercian Wealth website, including rich social media URL previews (Open Graph and Twitter Cards).

## Goal
Replace the current lack of URL previews with a snapshot of the website and establish comprehensive metadata for better SEO and social sharing experiences.

## 1. Asset Generation & Placement (URL Previews)

Next.js App Router automatically handles Open Graph and Twitter images if specific files are placed in the `app/` directory.

- **Action:** Generate high-quality preview images.
- **Files placed in `app/` directory:**
  - `app/opengraph-image.png` - 1200x630px, used for LinkedIn, Facebook, iMessage, Discord, etc.
  - `app/twitter-image.png` - 1200x630px, used specifically for X/Twitter previews.

## 2. Global Metadata in `app/layout.tsx`

The `metadata` object in `app/layout.tsx` has been updated to include complete Open Graph and Twitter properties, as well as additional SEO fields.

**Target updates implemented in `app/layout.tsx`:**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://mercianwealth.com'),
  title: {
    default: 'Mercian Wealth | Luxury AI-Powered Websites',
    template: '%s | Mercian Wealth'
  },
  description: 'Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.',
  applicationName: 'Mercian Wealth',
  keywords: ['AI Automation', 'Luxury Websites', 'Digital Assets', 'Web Development', 'Business Growth'],
  authors: [{ name: 'Mercian Wealth' }],
  creator: 'Mercian Wealth',
  publisher: 'Mercian Wealth',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Mercian Wealth | Luxury AI-Powered Websites',
    description: 'Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.',
    url: 'https://mercianwealth.com',
    siteName: 'Mercian Wealth',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Mercian Wealth Website Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mercian Wealth | Luxury AI-Powered Websites',
    description: 'Custom digital systems and autonomic AI architectures engineered to secure category dominance for market leaders. Vetted partnerships only.',
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
}
```

## 3. Metadata for Specific Pages

We define specific `metadata` exports in subroute `page.tsx` files. This allows Next.js to merge the global metadata with page-specific titles and descriptions.

## Completed Specifications

1. **Production URL:** `https://mercianwealth.com`
2. **Social Handles:** `@mercianwealth`
3. **Snapshot Image:** Static `opengraph-image.png` and `twitter-image.png` configured and built in root.

## Next Steps

All steps in this plan have been successfully implemented and validated in the codebase. No further tasks are outstanding.
