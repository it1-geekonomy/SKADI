import { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/constants/blogs' 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theskadi.com' 
  const currentDate = new Date().toISOString()

  // Static pages with priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // {
    //   url: `${baseUrl}/#problem`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/#roi`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/#fix`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/#pricing`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Blog post priorities
  const blogPriorities: Record<string, number> = {
    'business-losing-leads-due-to-missed-calls': 0.9,
    'growing-businesses-automate-calls-ai-solutions': 0.9,
    'handle-100-plus-customer-calls-without-call-center': 0.8,
    'automate-customer-calls-using-ai': 0.8,
    'reduce-missed-calls-small-business': 0.8,
    'ai-voice-agents-increase-sales-conversions': 0.7,
    'manual-vs-ai-call-automation-better-for-business': 0.7,
    'how-much-revenue-us-businesses-lose-to-missed-calls': 0.7,
    'how-to-never-miss-a-customer-call-again': 0.7,
    'why-80-of-website-leads-prefer-calling-before-buying': 0.7,
    'ai-voice-agents-book-appointments-without-humans': 0.7,
  }

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => {
    const priority = blogPriorities[post.slug] || 0.6
    return {
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority,
    }
  })

  return [...staticPages, ...blogPages]
}