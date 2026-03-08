import { NextRequest, NextResponse } from 'next/server';
import {
  adminSetupLimiter,
  createOrderLimiter,
  verifyPaymentLimiter,
  webhookLimiter,
} from '@/lib/rate-limit';

/**
 * Map each API path prefix to its dedicated rate limiter.
 * Order matters – the first match wins.
 */
const ROUTE_LIMITERS = [
  { prefix: '/api/admin-setup', limiter: adminSetupLimiter },
  { prefix: '/api/razorpay/create-order', limiter: createOrderLimiter },
  { prefix: '/api/razorpay/verify', limiter: verifyPaymentLimiter },
  { prefix: '/api/webhooks/', limiter: webhookLimiter },
] as const;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find the matching limiter for this route
  const match = ROUTE_LIMITERS.find((r) => pathname.startsWith(r.prefix));
  if (!match) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);
  const key = `${ip}:${match.prefix}`;
  const result = match.limiter.check(key);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.resetAt),
        },
      },
    );
  }

  // Attach rate-limit info headers to the response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(result.resetAt));
  return response;
}

/**
 * Only run the middleware for API routes.
 * Docs: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: '/api/:path*',
};
