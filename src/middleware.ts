// Middleware to set a Content Security Policy (CSP)
// Allows 'unsafe-eval' only in development for React Fast Refresh.
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  // Generate a nonce for inline scripts/styles (optional but recommended)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Build script-src directive
  const scriptSrcParts = ["'self'", `'nonce-${nonce}'`];
  if (isDev) scriptSrcParts.push("'unsafe-eval'");
  const scriptSrc = scriptSrcParts.join(" ");

  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  // Forward the nonce to Next.js on the REQUEST headers. Next.js reads the
  // `x-nonce` request header and stamps the matching `nonce` attribute onto the
  // inline scripts/styles it injects during SSR. Without this, the nonce in the
  // CSP below would not match any script and the browser would block them all.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js also reads the CSP itself to decide which scripts need the nonce.
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  // A per-request nonce is only meaningful for the HTML produced by that same
  // request. If the Vercel Edge Network serves a cached HTML body while the
  // middleware re-runs and emits a *fresh* CSP header, the cached body carries
  // the old nonce, every hydration script is rejected, and the page goes blank
  // on refresh. Keeping the response uncached guarantees the body and the CSP
  // header always come from the same render, so the nonce can never go stale.
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  // expose the nonce if you need it in the app (optional)
  response.headers.set("x-nonce", nonce);
  return response;
}

// Apply to all routes except static assets and API routes
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
