import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the page from being embedded in an iframe on other origins (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stop browsers from MIME-sniffing the response away from the declared Content-Type
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limit referrer information sent to third-party sites
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Opt out of browser features that are not needed
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Basic Content Security Policy — restricts resource origins to self and required CDNs.
  // Script and style src default to 'self'; unsafe-inline is allowed for styles because
  // Next.js injects critical CSS inline. Adjust as the UI matures.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js injects inline scripts for hydration; nonce-based CSP requires additional
      // configuration, so we start with strict-dynamic as a stepping-stone.
      "script-src 'self' 'unsafe-inline'",
      // Tailwind + Next.js inject inline styles
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs (used by some Next.js optimised images)
      "img-src 'self' data:",
      // Fonts served from the same origin
      "font-src 'self'",
      // API calls go only to self; Gemini/Groq are called server-side, never from the browser
      "connect-src 'self'",
      // No plugins / object embeds
      "object-src 'none'",
      // Iframes restricted to same origin
      "frame-src 'self'",
      // Blocks mixed content upgrades for HTTPS deployments
      "upgrade-insecure-requests",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
