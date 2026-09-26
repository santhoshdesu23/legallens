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
  // NOTE: Content-Security-Policy is intentionally NOT set here.
  // It is emitted by `src/middleware.ts`, which generates a per-request nonce and
  // forwards it to Next.js via the `x-nonce` request header so that inline
  // hydration scripts actually receive the matching `nonce` attribute.
  // Declaring CSP here as well would emit a second, conflicting CSP header;
  // browsers enforce the intersection of every CSP they receive, which blocks
  // the hydration scripts and leaves the page blank.
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
