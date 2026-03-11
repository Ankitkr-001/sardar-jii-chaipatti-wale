/**
 * Simple in-memory sliding window rate limiter.
 *
 * Each instance tracks request timestamps per key (typically the client IP).
 * Expired entries are lazily cleaned up on every `check()` call so the Map
 * does not grow unbounded.
 */

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms when the oldest tracked request expires
}

export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private store = new Map<string, number[]>();

  /**
   * @param maxRequests  Maximum number of requests allowed inside the window.
   * @param windowMs     Duration of the sliding window in milliseconds.
   */
  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check whether a request from `key` is allowed and record the attempt.
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing timestamps and drop any that fell outside the window
    const timestamps = (this.store.get(key) ?? []).filter(
      (t) => t > windowStart,
    );

    if (timestamps.length >= this.maxRequests) {
      // Rate limit exceeded – do NOT record this attempt
      const resetAt = timestamps[0] + this.windowMs;
      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Record this request
    timestamps.push(now);
    this.store.set(key, timestamps);

    return {
      allowed: true,
      remaining: this.maxRequests - timestamps.length,
      resetAt: timestamps[0] + this.windowMs,
    };
  }
}

/*
 * Pre-configured limiters for the different API route groups.
 * Because middleware runs in a single long-lived process (Edge or Node)
 * the Map persists across requests.
 */

/** /api/admin-setup – strict: 5 requests per 60 s */
export const adminSetupLimiter = new RateLimiter(5, 60_000);

/** /api/razorpay/create-order – moderate: 10 requests per 60 s */
export const createOrderLimiter = new RateLimiter(10, 60_000);

/** /api/razorpay/verify – moderate: 10 requests per 60 s */
export const verifyPaymentLimiter = new RateLimiter(10, 60_000);

/** /api/webhooks/* – lenient: 30 requests per 60 s */
export const webhookLimiter = new RateLimiter(30, 60_000);

/** /api/notifications/* – moderate: 10 requests per 60 s */
export const notificationLimiter = new RateLimiter(10, 60_000);
