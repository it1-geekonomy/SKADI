import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://theskadi.com',
      lastModified: '2026-05-04T11:04:19+00:00',
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}
