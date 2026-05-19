/**
 * Upstash Redis Rate Limiter
 * Uses a sliding window algorithm to limit request rates globally across
 * all serverless instances — solves the distributed cache problem.
 *
 * Different limiters are configured for different route sensitivity levels:
 * - `authLimiter`:    10 requests / 15 minutes (protects login brute-force)
 * - `apiLimiter`:     60 requests / 1 minute   (general admin API calls)
 * - `publicLimiter`:  200 requests / 1 minute  (public-facing endpoints)
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://placeholder.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'placeholder',
});

/** Strict limiter for authentication endpoints */
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  analytics: true,
  prefix: 'dk:ratelimit:auth',
});

/** Standard limiter for protected admin API routes */
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: 'dk:ratelimit:api',
});

/** Lenient limiter for public-facing read-only endpoints */
export const publicLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, '1 m'),
  analytics: true,
  prefix: 'dk:ratelimit:public',
});

/**
 * Extracts the best available IP identifier from request headers.
 * Vercel provides the real IP in `x-real-ip`.
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'anonymous'
  );
}
