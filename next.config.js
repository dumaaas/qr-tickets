/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    stripe_public_key: process.env.STRIPE_PUBLISHABLE_KEY,
    web_url: process.env.WEB_URL,
  }
}

module.exports = nextConfig
