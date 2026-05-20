/**
 * Next.js Proxy (formerly Middleware)
 * Runs at the CDN edge before every request — provides the first line of defense.
 * Renamed from middleware.ts → proxy.ts as required by Next.js 16.
 *
 * Responsibilities:
 * 1. CORS Enforcement: Only whitelisted origins can reach API routes.
 * 2. Rate Limiting: IP-based sliding windows via Upstash Redis.
 * 3. Security Headers: Hardened HTTP response headers on every route.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── Allowed Origins ────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://dalailulkhairath.com',
  'https://www.dalailulkhairath.com',
  'https://dalailulkhairath.vercel.app',
].filter((o): o is string => !!o);

function isOriginAllowed(origin: string, nextUrlOrigin: string): boolean {
  if (!origin) return false;
  if (origin === nextUrlOrigin) return true;
  if (origin.endsWith('.vercel.app')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

// ─── Admin IP Whitelist ──────────────────────────────────────────────────────
// Comma-separated list of allowed IPs for /hq (admin panel) routes.
// Example in .env.local: ADMIN_ALLOWED_IPS=203.0.113.10,198.51.100.5
// Leave empty or unset to allow all IPs (useful during initial setup).
function getAdminAllowedIPs(): string[] {
  const raw = process.env.ADMIN_ALLOWED_IPS || '';
  return raw
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);
}

function isAdminIPAllowed(ip: string): boolean {
  // In development, always allow
  if (process.env.NODE_ENV === 'development') return true;
  const allowedIPs = getAdminAllowedIPs();
  // If no IPs are configured, allow all (open mode)
  if (allowedIPs.length === 0) return true;
  return allowedIPs.includes(ip);
}

// ─── Upstash Rate Limiters ───────────────────────────────────────────────────
// These are lazily instantiated so they don't fail at build time
let authLimiter: Ratelimit | null = null;
let apiLimiter: Ratelimit | null = null;

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

function getAuthLimiter() {
  if (!authLimiter) {
    authLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(50, '10 m'),
      analytics: true,
      prefix: 'dk:ratelimit:auth:v2',
    });
  }
  return authLimiter;
}

function getApiLimiter() {
  if (!apiLimiter) {
    apiLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      analytics: true,
      prefix: 'dk:ratelimit:api',
    });
  }
  return apiLimiter;
}

// ─── Security Headers ────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development';

const SECURITY_HEADERS: Record<string, string> = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://js.stripe.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://www.jamiamadeenathunnoor.org https://images.unsplash.com",
    "connect-src 'self' https://api.stripe.com https://*.upstash.io",
    "frame-src https://js.stripe.com https://www.google.com https://maps.google.com",
  ]
    .filter(Boolean)
    .join('; '),
};

// ─── Proxy (formerly Middleware) ──────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin') ?? '';
  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'anonymous';

  // ── Admin IP Whitelist — /hq routes only ──
  if (pathname.startsWith('/hq')) {
    if (!isAdminIPAllowed(ip)) {
      console.warn(`[Proxy] Admin access BLOCKED for IP: ${ip} on ${pathname}`);
      return new NextResponse(
        `<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style="font-family:sans-serif;text-align:center;padding:4rem;background:#0f172a;color:#fff">
          <h1 style="font-size:5rem;margin:0;color:#ef4444">403</h1>
          <h2>Access Denied</h2>
          <p style="color:#94a3b8">Your IP address (<code style="color:#f97316">${ip}</code>) is not authorised to access the admin panel.</p>
          <p style="color:#64748b;font-size:0.85rem">If you believe this is a mistake, contact your system administrator.</p>
        </body></html>`,
        {
          status: 403,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      );
    }
  }

  // ── Preflight (OPTIONS) ──
  if (request.method === 'OPTIONS') {
    const isAllowed = isOriginAllowed(origin, request.nextUrl.origin);
    return new NextResponse(null, {
      status: isAllowed ? 204 : 403,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // ── CORS for actual requests ──
  const isApiRoute = pathname.startsWith('/api/');
  if (isApiRoute && origin && !isOriginAllowed(origin, request.nextUrl.origin)) {
    console.warn(`[Proxy] Blocked Origin: ${origin} (Not in ALLOWED_ORIGINS)`);
    return new NextResponse(
      JSON.stringify({ 
        error: 'CORS: Origin not allowed',
        origin,
        allowed: ALLOWED_ORIGINS 
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Rate Limiting ──
  if (isApiRoute && process.env.UPSTASH_REDIS_REST_URL) {
    const isAuthRoute = pathname.startsWith('/api/auth');

    try {
      const limiter = isAuthRoute ? getAuthLimiter() : getApiLimiter();
      const identifier = `${ip}:${pathname}`;
      const { success, limit, remaining, reset } = await limiter.limit(identifier);

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': String(limit),
              'X-RateLimit-Remaining': String(remaining),
              'X-RateLimit-Reset': String(reset),
              'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            },
          }
        );
      }

      // Pass rate limit info to downstream handlers via headers
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', String(limit));
      response.headers.set('X-RateLimit-Remaining', String(remaining));

      // Apply security headers
      Object.entries(SECURITY_HEADERS).forEach(([key, val]) => {
        response.headers.set(key, val);
      });

      // Apply CORS header
      if (origin && isOriginAllowed(origin, request.nextUrl.origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Vary', 'Origin');
      }

      return response;
    } catch (e) {
      // If Upstash is unreachable, degrade gracefully — don't block traffic
      console.warn('Rate limiter unavailable, allowing request:', e);
    }
  }

  // ── Apply headers to all other responses ──
  const response = NextResponse.next();
  Object.entries(SECURITY_HEADERS).forEach(([key, val]) => {
    response.headers.set(key, val);
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
