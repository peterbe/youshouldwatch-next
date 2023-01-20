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
  },

  async headers() {
    return [
      {
        source: '/:all*(svg|ico)',
        locale: false,
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=86400, must-revalidate',
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
