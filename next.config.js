/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [{
        source: "/__auth/:path*",
        destination: "https://youshouldwatch-77a46.firebaseapp.com/__auth/:path*",

    }]
  }
}

module.exports = nextConfig
