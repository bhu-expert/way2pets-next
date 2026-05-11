import { getRows } from './supabase'

export interface Article {
  title: string
  slug: string
  full_path: string
  pet_type: 'dog' | 'cat' | 'both' | 'general'
  excerpt: string
  content_markdown: string
  status: string
  published_at?: string
  faq_json?: Array<{ question: string; answer: string }>
}

export const fallbackArticles: Article[] = [
  {
    title: 'Top 10 Dog Breeds in India',
    slug: 'top-10-dog-breeds-in-india',
    full_path: '/dogs/breeds/top-10-dog-breeds-in-india',
    pet_type: 'dog',
    excerpt: 'A practical India-focused guide to popular dog breeds, family suitability, grooming needs and climate considerations.',
    status: 'published',
    content_markdown: '# Top 10 Dog Breeds in India\n\nChoosing a dog in India should consider family lifestyle, apartment size, heat tolerance, grooming needs and long-term care.\n\n## Popular family breeds\n\nLabrador Retriever, Golden Retriever, Beagle, Indian Spitz, Indie dogs, Shih Tzu, Pug, German Shepherd, Cocker Spaniel and Dachshund are commonly considered by Indian families.\n\n## Way2Pets guidance\n\nBefore selecting a puppy, speak with an experienced pet handler about diet, vaccination, grooming, boarding and behaviour needs.',
  },
  {
    title: 'Best Dog Breeds for Indian Families',
    slug: 'best-dog-breeds-for-indian-families',
    full_path: '/dogs/breeds/best-dog-breeds-for-indian-families',
    pet_type: 'dog',
    excerpt: 'How to choose a family dog for Indian homes, kids, apartments and first-time pet parents.',
    status: 'published',
    content_markdown: '# Best Dog Breeds for Indian Families\n\nThe best family dog is not just about breed popularity. Temperament, exercise needs, grooming and heat tolerance matter.\n\n## Good options\n\nLabradors, Golden Retrievers, Beagles, Indian Spitz and Indie dogs can work well for many families when trained and cared for properly.',
  },
  {
    title: 'Best Cat Boarding in Lucknow',
    slug: 'best-cat-boarding-in-lucknow',
    full_path: '/cats/boarding/best-cat-boarding-in-lucknow',
    pet_type: 'cat',
    excerpt: 'What cat parents should check before choosing cat boarding in Lucknow.',
    status: 'published',
    content_markdown: '# Best Cat Boarding in Lucknow\n\nCats need calm handling, clean litter, familiar food routines and low-stress spaces.\n\n## What to check\n\nAsk about hygiene, feeding, medication, escape safety and whether the handlers understand cat behaviour.',
  },
]

export async function getArticle(fullPath: string) {
  try {
    const rows = await getRows<Article>(`blog_posts?full_path=eq.${encodeURIComponent(fullPath)}&status=eq.published&select=*`, false)
    return rows?.[0] || fallbackArticles.find((article) => article.full_path === fullPath) || null
  } catch {
    return fallbackArticles.find((article) => article.full_path === fullPath) || null
  }
}

export async function getPublishedArticles(limit = 24) {
  try {
    const rows = await getRows<Article>(`blog_posts?status=eq.published&select=*&order=published_at.desc&limit=${limit}`, false)
    return rows && rows.length > 0 ? rows : fallbackArticles
  } catch {
    return fallbackArticles
  }
}

export function renderMarkdown(markdown: string) {
  return markdown.split('\n').filter(Boolean).map((line, index) => {
    if (line.startsWith('# ')) return { type: 'h1', text: line.replace('# ', ''), key: index }
    if (line.startsWith('## ')) return { type: 'h2', text: line.replace('## ', ''), key: index }
    return { type: 'p', text: line, key: index }
  })
}
