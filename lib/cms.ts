import { getRows, supabaseRest } from './supabase'

export type CmsRow = Record<string, unknown> & { id?: string; created_at?: string; updated_at?: string }

export async function countRows(table: string, query = '') {
  const count = await supabaseCount(table, query)
  return count ?? 0
}

export async function supabaseCount(table: string, query = '') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return 0
  const suffix = query ? `&${query.replace(/^&|^\?/, '')}` : ''
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=id${suffix}`, {
    method: 'HEAD',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'count=exact',
    },
    cache: 'no-store',
  })
  if (!res.ok) return 0
  const range = res.headers.get('content-range')
  const total = range?.split('/').pop()
  return total && total !== '*' ? Number(total) : 0
}

export async function listRows<T extends CmsRow>(table: string, select = '*', limit = 50, filters = '') {
  const query = `${table}?select=${encodeURIComponent(select)}${filters ? `&${filters}` : ''}&order=created_at.desc&limit=${limit}`
  return (await getRows<T>(query, true)) || []
}

export async function getRow<T extends CmsRow>(table: string, id: string, select = '*') {
  const rows = await getRows<T>(`${table}?select=${encodeURIComponent(select)}&id=eq.${encodeURIComponent(id)}&limit=1`, true)
  return rows?.[0] || null
}

export async function deleteRow(table: string, id: string) {
  return supabaseRest(`${table}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', serviceRole: true })
}

export function formatDate(value: unknown) {
  if (!value) return '-'
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function asText(value: unknown) {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'json' | 'hidden'
export type FieldConfig = {
  name: string
  label: string
  type?: FieldType
  required?: boolean
  options?: string[]
  placeholder?: string
  help?: string
}

export type ResourceConfig = {
  table: string
  title: string
  description: string
  newPath?: string
  editPath?: string
  columns: { key: string; label: string }[]
  fields: FieldConfig[]
  searchKeys?: string[]
  statusKey?: string
  statusOptions?: string[]
  select?: string
}

export const petTypes = ['dog', 'cat', 'both', 'general']
export const contentStatuses = ['draft', 'published', 'scheduled', 'archived']
export const leadStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost', 'spam']
export const bookingStatuses = ['new', 'contacted', 'confirmed', 'checked-in', 'checked-out', 'cancelled']
export const paymentStatuses = ['pending', 'advance-paid', 'full-paid', 'refunded', 'adjusted']

export const resources: Record<string, ResourceConfig> = {
  pages: {
    table: 'pages', title: 'Page Manager', description: 'Create and manage editable website pages with hero content and SEO fallback data.', newPath: '/admin/pages/new', editPath: '/admin/pages',
    columns: [{ key: 'title', label: 'Title' }, { key: 'route_path', label: 'Route Path' }, { key: 'status', label: 'Status' }, { key: 'updated_at', label: 'Updated At' }],
    fields: [
      { name: 'title', label: 'Page title', required: true }, { name: 'slug', label: 'Slug', required: true }, { name: 'route_path', label: 'Route path', required: true },
      { name: 'page_type', label: 'Page type' }, { name: 'status', label: 'Status', type: 'select', options: contentStatuses }, { name: 'hero_title', label: 'Hero title' },
      { name: 'hero_subtitle', label: 'Hero subtitle', type: 'textarea' }, { name: 'content_json', label: 'Sections/FAQ/CTA JSON', type: 'json', help: 'JSON for sections, FAQs, CTAs, gallery/review settings.' },
    ], searchKeys: ['title', 'route_path'], statusKey: 'status', statusOptions: contentStatuses,
  },
  blog: {
    table: 'blog_posts', title: 'Blog Manager', description: 'Manage dog, cat and general articles with markdown content and SEO-ready paths.', newPath: '/admin/blog/new', editPath: '/admin/blog',
    columns: [{ key: 'title', label: 'Title' }, { key: 'full_path', label: 'Full Path' }, { key: 'pet_type', label: 'Pet Type' }, { key: 'status', label: 'Status' }],
    fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'slug', label: 'Slug', required: true }, { name: 'full_path', label: 'Full path', required: true },
      { name: 'pet_type', label: 'Pet type', type: 'select', options: petTypes }, { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content_markdown', label: 'Markdown content', type: 'textarea' }, { name: 'status', label: 'Status', type: 'select', options: contentStatuses },
      { name: 'published_at', label: 'Published date', type: 'date' }, { name: 'faq_json', label: 'FAQ JSON', type: 'json' },
    ], searchKeys: ['title', 'full_path'], statusKey: 'status', statusOptions: contentStatuses,
  },
  pets: {
    table: 'pets', title: 'Pet Manager', description: 'Manage puppy, kitten, sale and adoption listings.', newPath: '/admin/pets/new', editPath: '/admin/pets',
    columns: [{ key: 'name', label: 'Name' }, { key: 'pet_type', label: 'Pet Type' }, { key: 'breed', label: 'Breed' }, { key: 'availability_status', label: 'Availability' }],
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'SEO slug', required: true }, { name: 'pet_type', label: 'Pet type', type: 'select', options: ['dog', 'cat'] },
      { name: 'listing_type', label: 'Listing type', type: 'select', options: ['sale', 'adoption'] }, { name: 'breed', label: 'Breed' }, { name: 'age', label: 'Age' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'unknown'] }, { name: 'price', label: 'Price', type: 'number' }, { name: 'location', label: 'City/location' },
      { name: 'vaccination_status', label: 'Vaccination status' }, { name: 'temperament', label: 'Temperament' }, { name: 'health_notes', label: 'Health notes', type: 'textarea' },
      { name: 'description', label: 'Description', type: 'textarea' }, { name: 'availability_status', label: 'Availability', type: 'select', options: ['available', 'reserved', 'sold', 'adopted', 'unavailable'] },
      { name: 'status', label: 'Status', type: 'select', options: contentStatuses },
    ], searchKeys: ['name', 'breed', 'location'], statusKey: 'availability_status', statusOptions: ['available', 'reserved', 'sold', 'adopted', 'unavailable'],
  },
  leads: {
    table: 'contact_leads', title: 'Lead Manager', description: 'Manage contact, find-a-pet and service enquiries with follow-up notes.', editPath: '/admin/leads',
    columns: [{ key: 'name', label: 'Name' }, { key: 'mobile', label: 'Mobile' }, { key: 'topic', label: 'Topic' }, { key: 'lead_status', label: 'Status' }],
    fields: [{ name: 'name', label: 'Name' }, { name: 'mobile', label: 'Mobile', required: true }, { name: 'email', label: 'Email' }, { name: 'topic', label: 'Topic' }, { name: 'message', label: 'Message', type: 'textarea' }, { name: 'lead_status', label: 'Status', type: 'select', options: leadStatuses }, { name: 'follow_up_notes', label: 'Follow-up notes', type: 'textarea' }],
    searchKeys: ['name', 'mobile', 'email', 'topic'], statusKey: 'lead_status', statusOptions: leadStatuses,
  },
  registrations: {
    table: 'pet_registrations', title: 'Pet Registrations', description: 'View registrations and update status/admin notes.', editPath: '/admin/pet-registrations',
    columns: [{ key: 'owner_name', label: 'Owner Name' }, { key: 'mobile', label: 'Mobile' }, { key: 'pet_name', label: 'Pet Name' }, { key: 'purpose', label: 'Purpose' }, { key: 'status', label: 'Status' }],
    fields: [{ name: 'owner_name', label: 'Owner name', required: true }, { name: 'mobile', label: 'Mobile', required: true }, { name: 'whatsapp', label: 'WhatsApp' }, { name: 'email', label: 'Email' }, { name: 'city', label: 'City' }, { name: 'pet_type', label: 'Pet type', type: 'select', options: ['dog', 'cat', 'other'] }, { name: 'breed', label: 'Breed' }, { name: 'pet_name', label: 'Pet name', required: true }, { name: 'age', label: 'Age' }, { name: 'gender', label: 'Gender' }, { name: 'vaccination_status', label: 'Vaccination status' }, { name: 'purpose', label: 'Purpose', type: 'select', options: ['boarding', 'sale', 'adoption', 'grooming', 'general'] }, { name: 'notes', label: 'Notes/admin notes', type: 'textarea' }, { name: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'approved', 'closed', 'spam'] }],
    searchKeys: ['owner_name', 'mobile', 'pet_name', 'city'], statusKey: 'status', statusOptions: ['new', 'contacted', 'approved', 'closed', 'spam'],
  },
  bookings: {
    table: 'boarding_bookings', title: 'Boarding Booking Manager', description: 'View and update boarding bookings, booking status and payment status.', editPath: '/admin/bookings',
    columns: [{ key: 'owner_name', label: 'Owner Name' }, { key: 'mobile', label: 'Mobile' }, { key: 'pet_name', label: 'Pet Name' }, { key: 'check_in_date', label: 'Check In' }, { key: 'booking_status', label: 'Status' }],
    fields: [{ name: 'owner_name', label: 'Owner name', required: true }, { name: 'mobile', label: 'Mobile', required: true }, { name: 'whatsapp', label: 'WhatsApp' }, { name: 'email', label: 'Email' }, { name: 'city', label: 'City' }, { name: 'pet_type', label: 'Pet type', type: 'select', options: ['dog', 'cat', 'other'] }, { name: 'breed', label: 'Breed' }, { name: 'pet_name', label: 'Pet name', required: true }, { name: 'check_in_date', label: 'Check-in date', type: 'date' }, { name: 'check_out_date', label: 'Check-out date', type: 'date' }, { name: 'number_of_days', label: 'Number of days', type: 'number' }, { name: 'food_preference', label: 'Food preference' }, { name: 'packaged_food_by_owner', label: 'Packaged food by owner', type: 'checkbox' }, { name: 'fresh_cooked_food_by_way2pets', label: 'Fresh cooked food by Way2Pets', type: 'checkbox' }, { name: 'medical_condition', label: 'Medical condition', type: 'textarea' }, { name: 'vaccination_status', label: 'Vaccination status' }, { name: 'aggression_status', label: 'Aggression status' }, { name: 'special_instructions', label: 'Special instructions/admin notes', type: 'textarea' }, { name: 'booking_status', label: 'Booking status', type: 'select', options: bookingStatuses }, { name: 'payment_status', label: 'Payment status', type: 'select', options: paymentStatuses }, { name: 'admin_notes', label: 'Admin notes', type: 'textarea' }],
    searchKeys: ['owner_name', 'mobile', 'pet_name', 'city'], statusKey: 'booking_status', statusOptions: bookingStatuses,
  },
  reviews: {
    table: 'reviews', title: 'Review Manager', description: 'Manage Google, Justdial, website and manual testimonials.', newPath: '/admin/reviews?new=1', editPath: '/admin/reviews',
    columns: [{ key: 'reviewer_name', label: 'Reviewer' }, { key: 'rating', label: 'Rating' }, { key: 'source', label: 'Source' }, { key: 'status', label: 'Status' }],
    fields: [{ name: 'reviewer_name', label: 'Reviewer name', required: true }, { name: 'rating', label: 'Rating', type: 'number', required: true }, { name: 'review_text', label: 'Review text', type: 'textarea', required: true }, { name: 'source', label: 'Source', type: 'select', options: ['Google', 'Justdial', 'Website', 'Manual'] }, { name: 'source_url', label: 'Source URL' }, { name: 'is_featured', label: 'Featured', type: 'checkbox' }, { name: 'status', label: 'Status', type: 'select', options: contentStatuses }, { name: 'reviewed_at', label: 'Reviewed at', type: 'date' }],
    searchKeys: ['reviewer_name', 'review_text', 'source'], statusKey: 'status', statusOptions: contentStatuses,
  },
  seo: {
    table: 'seo_metadata', title: 'SEO Manager', description: 'Manage route and entity metadata, Open Graph fields, schema JSON and robots status.', newPath: '/admin/seo?new=1', editPath: '/admin/seo',
    columns: [{ key: 'route_path', label: 'Route' }, { key: 'meta_title', label: 'Meta Title' }, { key: 'robots_index', label: 'Index' }, { key: 'schema_type', label: 'Schema Type' }],
    fields: [{ name: 'entity_type', label: 'Entity type', required: true }, { name: 'route_path', label: 'Route path' }, { name: 'meta_title', label: 'Meta title' }, { name: 'meta_description', label: 'Meta description', type: 'textarea' }, { name: 'canonical_url', label: 'Canonical URL' }, { name: 'og_title', label: 'OG title' }, { name: 'og_description', label: 'OG description', type: 'textarea' }, { name: 'schema_type', label: 'Schema type' }, { name: 'schema_json', label: 'Schema JSON', type: 'json' }, { name: 'robots_index', label: 'Index page', type: 'checkbox' }, { name: 'robots_follow', label: 'Follow links', type: 'checkbox' }],
    searchKeys: ['route_path', 'meta_title', 'entity_type'], statusKey: 'robots_index', statusOptions: ['true', 'false'],
  },
  redirects: {
    table: 'redirects', title: 'Redirect Manager', description: 'Manage active 301/302 redirects from legacy SEO URLs.', newPath: '/admin/redirects?new=1', editPath: '/admin/redirects',
    columns: [{ key: 'source_path', label: 'Source Path' }, { key: 'destination_path', label: 'Destination Path' }, { key: 'status_code', label: 'Status Code' }, { key: 'is_active', label: 'Active' }],
    fields: [{ name: 'source_path', label: 'Source path', required: true }, { name: 'destination_path', label: 'Destination path', required: true }, { name: 'status_code', label: 'Status code', type: 'select', options: ['301', '302', '307', '308'] }, { name: 'is_active', label: 'Active', type: 'checkbox' }],
    searchKeys: ['source_path', 'destination_path'], statusKey: 'is_active', statusOptions: ['true', 'false'],
  },
  settings: {
    table: 'site_settings', title: 'Site Settings', description: 'Manage NAP, social, map, default SEO and notification email values.', newPath: '/admin/settings?new=1', editPath: '/admin/settings',
    columns: [{ key: 'key', label: 'Key' }, { key: 'group_name', label: 'Group' }, { key: 'value_json', label: 'Value' }, { key: 'updated_at', label: 'Updated At' }],
    fields: [{ name: 'key', label: 'Key', required: true }, { name: 'group_name', label: 'Group' }, { name: 'value_json', label: 'Value JSON', type: 'json', help: 'Example: {"value":"way2pets.com@gmail.com"}' }],
    searchKeys: ['key', 'group_name'],
  },
  gallery: {
    table: 'gallery_images', title: 'Gallery Manager', description: 'Upload Cloudinary images and control public gallery visibility.', newPath: '/admin/gallery?new=1', editPath: '/admin/gallery',
    columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'is_visible', label: 'Visible' }, { key: 'is_featured', label: 'Featured' }],
    fields: [{ name: 'media_asset_id', label: 'Media asset ID', required: true }, { name: 'title', label: 'Title' }, { name: 'caption', label: 'Caption', type: 'textarea' }, { name: 'alt_text', label: 'Alt text' }, { name: 'category', label: 'Category', type: 'select', options: ['boarding', 'grooming', 'puppies', 'kittens', 'happy-pets', 'facility', 'reviews', 'blog', 'hero', 'gallery'] }, { name: 'pet_type', label: 'Pet type', type: 'select', options: petTypes }, { name: 'is_visible', label: 'Visible', type: 'checkbox' }, { name: 'is_featured', label: 'Featured', type: 'checkbox' }, { name: 'sort_order', label: 'Sort order', type: 'number' }],
    searchKeys: ['title', 'caption', 'category'], statusKey: 'is_visible', statusOptions: ['true', 'false'],
  },
}
