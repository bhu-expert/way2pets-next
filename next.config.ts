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
      {
        source: '/boarding',
        destination: '/pet-boarding-for-cat-and-dog-in-lucknow',
        permanent: true,
      },
      {
        source: '/pet-dog-cat-boarding-lucknow',
        destination: '/pet-boarding-for-cat-and-dog-in-lucknow',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
