import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mercianwealth.com'
  const lastModified = new Date()

  const routes = [
    '',
    '/services',
    '/process',
    '/portfolio',
    '/pricing',
    '/contact',
    '/book',
    '/testimonials',
    '/terms',
    '/privacy',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/book' || route === '/pricing' ? 0.9 : 0.8,
  }))
}
