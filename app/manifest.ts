import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mercian Wealth',
    short_name: 'Mercian Wealth',
    description: 'AI-Powered Websites & Automated Storefronts for UK Local Businesses',
    start_url: '/',
    display: 'standalone',
    background_color: '#020E28',
    theme_color: '#020E28',
    icons: [
      {
        src: '/MercianWealthLogo.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/MercianWealthLogo.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
