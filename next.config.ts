import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,

  turbopack: {
    root: __dirname,
  },

  output: 'standalone',

  serverExternalPackages: ['@prisma/client', 'bcryptjs'],

  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
    ],
  },

  experimental: {
    optimizeServerReact: true,
    turbopackFileSystemCacheForDev: true,
  },

  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
      {
        source: '/icon-:size.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
{
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'; worker-src 'self' blob:; style-src 'self'; img-src 'self' ui-avatars.com data: raw.githubusercontent.com cdn.jsdelivr.net; connect-src 'self' api.mercadopago.com api.resend.com viacep.com.br *.ingest.us.sentry.io raw.githubusercontent.com cdn.jsdelivr.net ui-avatars.com; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; font-src 'self' data:" },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          {
            key: 'Permissions-Policy',
            value: 'bluetooth=(self), camera=(), microphone=(), geolocation=(), payment=(), midi=(), sync-xhr=()',
          },
        ],
      },
    ];
  },
};

export default process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })(nextConfig)
  : nextConfig;
