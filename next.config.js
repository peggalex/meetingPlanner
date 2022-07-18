/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: isProd ? 'https://alexpegg.com/meetingPlanner' : '',
  async redirects() {
    return [];
  },
}

module.exports = nextConfig;