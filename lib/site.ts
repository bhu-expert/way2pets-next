export const siteConfig = {
  name: 'Way2Pets',
  legalName: 'Way2Pets',
  phone: '+91 73761 26261',
  whatsapp: '917376126261',
  email: 'care@way2pets.com',
  address: '1/673, Vishal Khand 1, Vishal Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India',
  shortAddress: '1/673, Vishal Khand 1, Gomti Nagar, Lucknow, UP 226010',
  city: 'Lucknow',
  region: 'Uttar Pradesh',
  postalCode: '226010',
  country: 'IN',
  latitude: 26.8505,
  longitude: 80.9965,
  hours: 'Mon–Sun: 10:00 AM – 8:00 PM',
  facebook: 'https://www.facebook.com/way2pets/',
  instagram: 'https://www.instagram.com/way2petslko/',
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://way2pets.com').replace(/\/$/, '')
}

export function absoluteUrl(path = '/') {
  const safePath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${safePath}`
}
