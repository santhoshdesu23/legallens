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

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
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
