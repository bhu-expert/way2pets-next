import { getRows } from './supabase'

export type LocalizedText = {
  en: string
  hi: string
}

export type WebsiteSection = {
  id?: string
  section_key: string
  title_en?: string | null
  title_hi?: string | null
  subtitle_en?: string | null
  subtitle_hi?: string | null
  description_en?: string | null
  description_hi?: string | null
  image_url?: string | null
  button_text_en?: string | null
  button_text_hi?: string | null
  button_link?: string | null
  is_active?: boolean
  sort_order?: number
  metadata_json?: Record<string, unknown> | null
}

export type WebsiteSectionItem = {
  id?: string
  section_key: string
  item_key: string
  title_en?: string | null
  title_hi?: string | null
  subtitle_en?: string | null
  subtitle_hi?: string | null
  description_en?: string | null
  description_hi?: string | null
  image_url?: string | null
  icon_key?: string | null
  button_text_en?: string | null
  button_text_hi?: string | null
  button_link?: string | null
  is_active?: boolean
  sort_order?: number
  metadata_json?: Record<string, unknown> | null
}

export type WebsiteContent = {
  sections: Record<string, WebsiteSection>
  items: Record<string, WebsiteSectionItem[]>
}

const heroImage = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
const founderImage = 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'

export const defaultWebsiteSections: WebsiteSection[] = [
  {
    section_key: 'hero',
    title_en: "Lucknow's Natural Pet Care Experts",
    title_hi: 'लखनऊ के नेचुरल पेट केयर एक्सपर्ट्स',
    subtitle_en: 'Natural food. Cage-free boarding. Ethical adoption. Because your pet deserves the best.',
    subtitle_hi: 'नेचुरल फूड, केज-फ्री बोर्डिंग और सही पेट गाइडेंस — क्योंकि आपका पेट बेस्ट केयर deserve करता है।',
    image_url: heroImage,
    button_text_en: '',
    button_text_hi: '',
    button_link: '',
    is_active: true,
    sort_order: 10,
  },
  {
    section_key: 'our_story',
    title_en: 'Our Story:',
    title_hi: 'हमारी कहानी:',
    subtitle_en: 'From Passion to Purpose',
    subtitle_hi: 'Passion से Purpose तक',
    image_url: founderImage,
    button_text_en: 'Meet the Team',
    button_text_hi: 'टीम से मिलें',
    button_link: '/contact',
    metadata_json: {
      paragraph1_en: 'Way2Pets was founded by Ashish, a lifelong animal lover who was frustrated by the lack of honest, natural pet care options in Lucknow.',
      paragraph1_hi: 'Way2Pets की शुरुआत Ashish ने की, जो animal lover हैं और लखनऊ में ईमानदार, नेचुरल पेट केयर options की कमी से परेशान थे।',
      paragraph2_en: 'After years of researching dog nutrition and holistic health, he started Way2Pets with a simple mission: to give every pet the life they deserve — free from cages, processed food, and harmful chemicals.',
      paragraph2_hi: 'Dog nutrition और holistic health पर सालों की research के बाद उन्होंने Way2Pets शुरू किया, एक simple mission के साथ: हर पेट को cages, processed food और harmful chemicals से दूर बेहतर life देना।',
      paragraph3_en: 'Today, Way2Pets is trusted by hundreds of pet families across Lucknow for boarding, adoption, and natural food guidance.',
      paragraph3_hi: 'आज Lucknow की सैकड़ों pet families boarding, adoption और natural food guidance के लिए Way2Pets पर भरोसा करती हैं।',
      image_alt_en: 'Ashish - Founder of Way2Pets',
      image_alt_hi: 'Ashish - Way2Pets के फाउंडर',
    },
    is_active: true,
    sort_order: 30,
  },
  {
    section_key: 'difference',
    title_en: 'The Way2Pets Difference',
    title_hi: 'Way2Pets का फर्क',
    is_active: true,
    sort_order: 40,
  },
  {
    section_key: 'services',
    title_en: 'What We Offer',
    title_hi: 'हम क्या ऑफर करते हैं',
    is_active: true,
    sort_order: 50,
  },
  {
    section_key: 'testimonials',
    title_en: 'What Pet Parents Say',
    title_hi: 'पेट पेरेंट्स क्या कहते हैं',
    button_text_en: 'Read All Reviews',
    button_text_hi: 'सभी रिव्यू पढ़ें',
    button_link: '/reviews',
    is_active: true,
    sort_order: 60,
  },
  {
    section_key: 'contact',
    title_en: 'Visit Us',
    title_hi: 'हमसे मिलें',
    subtitle_en: 'Experience the difference in pet care.',
    subtitle_hi: 'पेट केयर का फर्क खुद experience करें।',
    button_text_en: 'Submit Inquiry',
    button_text_hi: 'पूछताछ भेजें',
    metadata_json: {
      address: '1/673, Vishal Khand 1, Gomti Nagar, Lucknow, UP 226010',
      phone: '+91 73761 26261',
      email: 'care@way2pets.com',
      timing_en: 'Mon–Sun: 10:00 AM – 8:00 PM',
      timing_hi: 'Mon–Sun: सुबह 10:00 – रात 8:00',
      form_heading_en: 'Send Us a Message',
      form_heading_hi: 'हमें मैसेज भेजें',
      topic_boarding_en: 'Boarding Inquiry',
      topic_boarding_hi: 'बोर्डिंग पूछताछ',
      topic_product_en: 'Product Inquiry',
      topic_product_hi: 'प्रोडक्ट पूछताछ',
      topic_grooming_en: 'Grooming Appointment',
      topic_grooming_hi: 'ग्रूमिंग अपॉइंटमेंट',
      topic_other_en: 'Other',
      topic_other_hi: 'अन्य',
    },
    is_active: true,
    sort_order: 70,
  },
  {
    section_key: 'footer',
    description_en: 'Natural food, cage-free boarding, ethical adoption and holistic care for pets in Lucknow.',
    description_hi: 'लखनऊ में pets के लिए नेचुरल फूड, केज-फ्री बोर्डिंग, सही अडॉप्शन और holistic care.',
    metadata_json: {
      phone: '+91 73761 26261',
      whatsapp: '917376126261',
      email: 'care@way2pets.com',
      facebook: 'https://www.facebook.com/way2pets/',
      instagram: 'https://www.instagram.com/way2petslko/',
      copyright_en: '© 2024 Way2Pets.com. All rights reserved.',
      copyright_hi: '© 2024 Way2Pets.com. सभी अधिकार सुरक्षित।',
    },
    is_active: true,
    sort_order: 90,
  },
]

export const defaultWebsiteItems: WebsiteSectionItem[] = [
  { section_key: 'feature_cards', item_key: 'natural_food', icon_key: 'fas fa-seedling', title_en: 'Natural Food', title_hi: 'नेचुरल फूड', subtitle_en: 'No processed kibble', subtitle_hi: 'प्रोसेस्ड किबल नहीं', is_active: true, sort_order: 10 },
  { section_key: 'feature_cards', item_key: 'cage_free_boarding', icon_key: 'fas fa-home', title_en: 'Cage-Free Boarding', title_hi: 'केज-फ्री बोर्डिंग', subtitle_en: 'Home-like stay', subtitle_hi: 'घर जैसा स्टे', is_active: true, sort_order: 20 },
  { section_key: 'feature_cards', item_key: 'ethical_adoption', icon_key: 'fas fa-heart', title_en: 'Ethical Adoption', title_hi: 'सही अडॉप्शन', subtitle_en: 'Happy, healthy pets', subtitle_hi: 'खुश और हेल्दी पेट्स', is_active: true, sort_order: 30 },
  { section_key: 'feature_cards', item_key: 'holistic_care', icon_key: 'fas fa-user-md', title_en: 'Holistic Care', title_hi: 'होलिस्टिक केयर', subtitle_en: 'Homeopathy & wellness', subtitle_hi: 'होम्योपैथी और वेलनेस', is_active: true, sort_order: 40 },
  { section_key: 'difference', item_key: 'no_cages', title_en: 'No Cages. Ever.', title_hi: 'कभी Cages नहीं।', description_en: 'Our boarding facility is 100% cage-free. Dogs sleep on beds and sofas, play freely, and are treated like family members.', description_hi: 'हमारी boarding facility 100% cage-free है। Dogs beds और sofas पर सोते हैं, freely play करते हैं और family members जैसे care पाते हैं।', is_active: true, sort_order: 10 },
  { section_key: 'difference', item_key: 'real_food', title_en: 'Real Food, Real Health', title_hi: 'Real Food, Real Health', description_en: 'We feed pets fresh meat, eggs, and vegetables — the diet they evolved to eat. No preservatives, no fillers.', description_hi: 'हम pets को fresh meat, eggs और vegetables देते हैं — वही diet जिसके लिए वे naturally बने हैं। No preservatives, no fillers.', is_active: true, sort_order: 20 },
  { section_key: 'difference', item_key: 'trust', title_en: 'Knowledge You Can Trust', title_hi: 'भरोसेमंद Knowledge', description_en: "Our founder has 15+ years of hands-on experience with dog behavior, nutrition, and holistic healing. We don't just sell — we educate.", description_hi: 'हमारे founder के पास dog behavior, nutrition और holistic healing का 15+ years hands-on experience है। हम सिर्फ sell नहीं करते — educate करते हैं।', is_active: true, sort_order: 30 },
  { section_key: 'services', item_key: 'boarding', image_url: founderImage, title_en: 'Cage-Free Boarding', title_hi: 'केज-फ्री बोर्डिंग', description_en: 'Leave your dog with us while you travel. Daily videos, natural food, playtime, and a real home environment.', description_hi: 'Travel के दौरान अपना dog हमारे साथ छोड़ें। Daily videos, natural food, playtime और real home environment.', button_text_en: 'Book Now', button_text_hi: 'अभी बुक करें', button_link: '/boarding', metadata_json: { image_alt_en: 'Dog boarding in a home-style Way2Pets environment', image_alt_hi: 'Way2Pets के home-style environment में dog boarding' }, is_active: true, sort_order: 10 },
  { section_key: 'services', item_key: 'find_pet', image_url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', title_en: 'Find Your Pet', title_hi: 'अपना पेट खोजें', description_en: 'Adopt a healthy, socialized puppy or kitten. Breed guidance, diet plans, and lifetime support included.', description_hi: 'Healthy, socialized puppy या kitten adopt करें। Breed guidance, diet plans और lifetime support included.', button_text_en: 'Browse Pets', button_text_hi: 'Pets देखें', button_link: '/find-a-pet', metadata_json: { image_alt_en: 'Healthy puppy and kitten guidance at Way2Pets Lucknow', image_alt_hi: 'Way2Pets Lucknow में healthy puppy और kitten guidance' }, is_active: true, sort_order: 20 },
  { section_key: 'services', item_key: 'natural_pet_food', image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', title_en: 'Natural Pet Food', title_hi: 'नेचुरल पेट फूड', description_en: 'Fresh, species-appropriate food for dogs and cats. Made with real ingredients and zero preservatives.', description_hi: 'Dogs और cats के लिए fresh, species-appropriate food. Real ingredients और zero preservatives के साथ।', button_text_en: 'Enquire Now', button_text_hi: 'अभी पूछें', button_link: '/contact', metadata_json: { image_alt_en: 'Natural pet food guidance for dogs and cats in Lucknow', image_alt_hi: 'Lucknow में dogs और cats के लिए natural pet food guidance' }, is_active: true, sort_order: 30 },
  { section_key: 'testimonials', item_key: 'manvi_raj', title_en: 'Advocate Manvi Raj', title_hi: 'Advocate Manvi Raj', description_en: 'Best pet shop in Lucknow. I got a golden retriever puppy who is very healthy and lovely.', description_hi: 'Lucknow की best pet shop. मुझे golden retriever puppy मिला जो बहुत healthy और प्यारा है।', metadata_json: { rating: 5 }, is_active: true, sort_order: 10 },
  { section_key: 'testimonials', item_key: 'ramita', title_en: 'Ramita', title_hi: 'Ramita', description_en: 'An amazing place like home for your dogs. I always fall back on Way2Pets if I ever need anything.', description_hi: 'आपके dogs के लिए home जैसा amazing place. मुझे कुछ भी चाहिए हो तो मैं हमेशा Way2Pets पर भरोसा करती हूं।', metadata_json: { rating: 5 }, is_active: true, sort_order: 20 },
  { section_key: 'testimonials', item_key: 'varun_garg', title_en: 'Varun Garg', title_hi: 'Varun Garg', description_en: 'Ashish is very nice. He has in-depth knowledge about dogs and takes care of your pets like his own.', description_hi: 'Ashish बहुत अच्छे हैं। उन्हें dogs की deep knowledge है और वे आपके pets को अपने जैसा care करते हैं।', metadata_json: { rating: 5 }, is_active: true, sort_order: 30 },
  { section_key: 'floating_buttons', item_key: 'call_now', title_en: 'Call Now', title_hi: 'कॉल करें', button_link: 'tel:+917376126261', is_active: true, sort_order: 10 },
  { section_key: 'floating_buttons', item_key: 'whatsapp', title_en: 'WhatsApp', title_hi: 'WhatsApp', button_link: 'https://wa.me/917376126261', is_active: true, sort_order: 20 },
  { section_key: 'floating_buttons', item_key: 'book_boarding', title_en: 'Book Boarding', title_hi: 'बोर्डिंग बुक करें', button_link: '/pet-boarding-for-cat-and-dog-in-lucknow', is_active: true, sort_order: 30 },
]

function contentFromRows(sections: WebsiteSection[], items: WebsiteSectionItem[]): WebsiteContent {
  return {
    sections: Object.fromEntries(sections.map((section) => [section.section_key, section])),
    items: items.reduce<Record<string, WebsiteSectionItem[]>>((acc, item) => {
      acc[item.section_key] ||= []
      acc[item.section_key].push(item)
      return acc
    }, {}),
  }
}

export const defaultWebsiteContent = contentFromRows(defaultWebsiteSections, defaultWebsiteItems)

function sortByOrder<T extends { sort_order?: number | null }>(rows: T[]) {
  return [...rows].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
}

export function mergeWebsiteContent(rows: { sections?: WebsiteSection[] | null; items?: WebsiteSectionItem[] | null }, includeInactive = false): WebsiteContent {
  const sectionMap = new Map(defaultWebsiteSections.map((section) => [section.section_key, { ...section }]))
  for (const section of rows.sections || []) {
    if (!includeInactive && section.is_active === false) continue
    sectionMap.set(section.section_key, { ...(sectionMap.get(section.section_key) || {}), ...section })
  }

  const itemMap = new Map(defaultWebsiteItems.map((item) => [`${item.section_key}:${item.item_key}`, { ...item }]))
  for (const item of rows.items || []) {
    if (!includeInactive && item.is_active === false) continue
    itemMap.set(`${item.section_key}:${item.item_key}`, { ...(itemMap.get(`${item.section_key}:${item.item_key}`) || {}), ...item })
  }

  return contentFromRows(sortByOrder([...sectionMap.values()]), sortByOrder([...itemMap.values()]))
}

export async function getWebsiteContent(options: { admin?: boolean; includeInactive?: boolean } = {}) {
  try {
    const serviceRole = Boolean(options.admin)
    const activeFilter = options.includeInactive ? '' : '&is_active=eq.true'
    const [sections, items] = await Promise.all([
      getRows<WebsiteSection>(`website_sections?select=*&order=sort_order.asc${activeFilter}`, serviceRole),
      getRows<WebsiteSectionItem>(`website_section_items?select=*&order=sort_order.asc${activeFilter}`, serviceRole),
    ])
    return mergeWebsiteContent({ sections, items }, options.includeInactive)
  } catch (error) {
    console.error('Website content fetch failed; using fallback content.', error)
    return defaultWebsiteContent
  }
}

export function localized(row: WebsiteSection | WebsiteSectionItem | undefined, field: 'title' | 'subtitle' | 'description' | 'button_text', language: 'en' | 'hi', fallback = '') {
  if (!row) return fallback
  const primary = row[`${field}_${language}` as keyof typeof row]
  const secondary = row[`${field}_${language === 'hi' ? 'en' : 'hi'}` as keyof typeof row]
  return String(primary || secondary || fallback)
}

export function metadataText(row: WebsiteSection | WebsiteSectionItem | undefined, key: string, fallback = '') {
  const value = row?.metadata_json?.[key]
  return typeof value === 'string' && value ? value : fallback
}

export function metadataNumber(row: WebsiteSection | WebsiteSectionItem | undefined, key: string, fallback = 0) {
  const value = row?.metadata_json?.[key]
  return typeof value === 'number' ? value : typeof value === 'string' && value ? Number(value) || fallback : fallback
}
