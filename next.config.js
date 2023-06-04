/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    stripe_public_key: process.env.STRIPE_PUBLISHABLE_KEY,
  }
}

module.exports = nextConfig
