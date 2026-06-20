import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchSanityRedirects } from './features/site/redirects'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  async rewrites() {
    return [{ source: '/studio/:path*', destination: '/sanity-studio/:path*' }]
  },
  async redirects() {
    return fetchSanityRedirects()
  },
}

export default nextConfig
