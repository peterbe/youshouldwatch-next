/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [{
        source: "/__/auth/:path*",
        destination: "https://youshouldwatch-77a46.firebaseapp.com/__/auth/:path*",

    }]
  }
}

module.exports = nextConfig
