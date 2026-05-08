import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'
import { fallbackArticles } from '@/lib/content'

const staticPaths = [
  '/',
  '/pet-boarding-for-cat-and-dog-in-lucknow',
  '/dog-boarding-in-lucknow',
  '/cat-boarding-in-lucknow',
  '/best-dog-and-cat-boarding-in-lucknow',
  '/pet-shop-in-lucknow',
  '/pet-store-in-lucknow',
  '/dog-grooming-in-lucknow',
  '/cat-grooming-in-lucknow',
  '/puppy-for-sale-in-lucknow',
  '/kitten-for-sale-in-lucknow',
  '/puppy-for-sale-in-uttar-pradesh',
  '/kitten-for-sale-in-uttar-pradesh',
  '/pet-boarding-in-gomti-nagar',
  '/dog-hostel-in-lucknow',
  '/dog-creche-in-lucknow',
  '/find-a-pet',
  '/register',
  '/contact',
  '/reviews',
  '/blog',
  '/gallery',
  '/dogs',
  '/dogs/boarding',
  '/dogs/breeds',
  '/dogs/health',
  '/dogs/grooming',
  '/dogs/behaviour-training',
  '/cats',
  '/cats/boarding',
  '/cats/breeds',
  '/cats/health',
  '/cats/grooming',
  '/cats/behaviour-training',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()
  return [...staticPaths, ...fallbackArticles.map((article) => article.full_path)].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.includes('lucknow') ? 0.9 : 0.7,
  }))
}
