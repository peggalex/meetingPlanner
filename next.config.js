/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/meetingPlanner' : '';

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: basePath,
  basePath,
  env: {
    basePath,
  },
  async redirects() {
    return [];
  },
}

module.exports = nextConfig;