export const galleryCategories = ['boarding', 'grooming', 'puppies', 'kittens', 'happy-pets', 'facility', 'reviews', 'blog', 'hero', 'dogs', 'cats']

export const blogCategories = ['dogs', 'cats', 'general'] as const

export const blogSubcategories: Record<string, string[]> = {
  dogs: ['breeds', 'health', 'behaviour-training', 'boarding', 'grooming', 'puppies', 'food', 'adoption-buying-guide'],
  cats: ['breeds', 'health', 'behaviour-training', 'boarding', 'grooming', 'kittens', 'food', 'adoption-buying-guide'],
  general: ['pet-care', 'lucknow-pet-services', 'adoption', 'buying-guide', 'news'],
}

export const petCategories = ['dog', 'cat']
export const petSubcategories = ['puppy', 'kitten', 'adult', 'adoption', 'sale']

export function buildBlogPath(category: string, subcategory: string, slug: string) {
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, '')
  if (category === 'general') return `/blog/${cleanSlug}`
  return `/${category}/${subcategory || 'general'}/${cleanSlug}`
}

export function toPetType(category: string) {
  if (category === 'dogs') return 'dog'
  if (category === 'cats') return 'cat'
  if (category === 'dog' || category === 'cat') return category
  return 'general'
}
