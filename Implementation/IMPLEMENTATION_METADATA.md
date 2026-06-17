# Implementation Plan: Robust Metadata & URL Previews

This plan outlines the steps to implement a complete and robust metadata strategy for the GS Legacy Wealth AI website, including rich social media URL previews (Open Graph and Twitter Cards).

## Goal
Replace the current lack of URL previews with a snapshot of the website and establish comprehensive metadata for better SEO and social sharing experiences.

## 1. Asset Generation & Placement (URL Previews)

Next.js App Router automatically handles Open Graph and Twitter images if specific files are placed in the `app/` directory.

- **Action:** We will generate a high-quality snapshot of the website (1200x630 pixels) to serve as the preview image.
- **Files to create in `app/` directory:**
  - `app/opengraph-image.png` (or `.jpg`) - 1200x630px, used for LinkedIn, Facebook, iMessage, Discord, etc.
  - `app/twitter-image.png` (or `.jpg`) - 1200x630px, used specifically for X/Twitter previews.
- **Alternative (Dynamic):** If we want the image to include dynamic text later, we can use `app/opengraph-image.tsx` using Next.js `ImageResponse`. For now, a static snapshot is the quickest and most robust solution.

## 2. Expanding Global Metadata in `app/layout.tsx`

We will update the `metadata` object in `app/layout.tsx` to include complete Open Graph and Twitter properties, as well as additional SEO fields.

**Target updates in `app/layout.tsx`:**

```typescript
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
    url: 'https://gslegacywealth.com', // Replace with actual production URL
    siteName: 'GS Legacy Wealth AI',
    images: [
      {
        url: '/opengraph-image.png', // Automatically resolved by Next.js if placed in app/
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
    description: 'Premium AI-powered websites for ambitious businesses.',
    images: ['/twitter-image.png'], // Automatically resolved
    creator: '@gslegacywealth', // Replace with actual handle if available
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
  // existing icons config...
}
```

## 3. Metadata for Specific Pages (Optional but Recommended)

If the site has multiple distinct pages (e.g., `/about`, `/services`), we should define specific `metadata` exports in those route's `page.tsx` files. This allows Next.js to merge the global metadata with page-specific titles and descriptions.

## Open Questions & Required Information

> [!IMPORTANT]
> To proceed effectively, please provide the following details:

1. **Production URL:** What is the actual or intended domain name for the production website? (e.g., `https://gslegacywealth.com`)
2. **Social Handles:** Do you have an official Twitter handle or other social links we should include in the metadata?
3. **Snapshot Image:** Do you want me to generate an initial mockup snapshot image using the `generate_image` tool, or would you prefer to provide a screenshot of the site once it's closer to the final design?

## Next Steps

Once you review and approve this plan (and provide the requested details), I can execute the changes to `app/layout.tsx` and generate/place the required preview image files.
