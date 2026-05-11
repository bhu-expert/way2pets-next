import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/boarding', destination: '/pet-boarding-for-cat-and-dog-in-lucknow', permanent: true },
      { source: '/pet-dog-cat-boarding-lucknow', destination: '/pet-boarding-for-cat-and-dog-in-lucknow', permanent: true },
      { source: '/contactus', destination: '/contact', permanent: true },
      { source: '/lucknow-dog-boarding.html', destination: '/dog-boarding-in-lucknow', permanent: true },
      { source: '/dog-boarding-lucknow', destination: '/dog-boarding-in-lucknow', permanent: true },
      { source: '/cat-boarding-lucknow', destination: '/cat-boarding-in-lucknow', permanent: true },
      { source: '/pet-shop-lucknow', destination: '/pet-shop-in-lucknow', permanent: true },
      { source: '/pet-store-lucknow', destination: '/pet-store-in-lucknow', permanent: true },
    ]
  },
}

export default nextConfig
