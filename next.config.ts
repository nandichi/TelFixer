import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Image optimization settings
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Compression
  compress: true,

  // Enable production source maps for debugging (optional)
  productionBrowserSourceMaps: false,

  // Map RFC well-known URLs to internal routes (folders starting with a dot
  // are not reliable route segments in the Next.js App Router).
  async rewrites() {
    return [
      { source: '/.well-known/api-catalog', destination: '/well-known/api-catalog' },
      { source: '/.well-known/openid-configuration', destination: '/well-known/openid-configuration' },
      { source: '/.well-known/oauth-authorization-server', destination: '/well-known/oauth-authorization-server' },
      { source: '/.well-known/oauth-protected-resource', destination: '/well-known/oauth-protected-resource' },
      { source: '/.well-known/mcp/server-card.json', destination: '/well-known/mcp/server-card.json' },
      { source: '/.well-known/agent-skills/index.json', destination: '/well-known/agent-skills/index.json' },
      { source: '/.well-known/agent-skills/:slug/SKILL.md', destination: '/well-known/agent-skills/:slug/SKILL.md' },
      { source: '/.well-known/ucp', destination: '/well-known/ucp' },
      { source: '/.well-known/acp.json', destination: '/well-known/acp.json' },
    ];
  },

  // Headers for caching static assets
  async headers() {
    return [
      {
        // Cache static assets (images, fonts, etc.)
        source:
          "/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache JS and CSS files
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Security headers
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
