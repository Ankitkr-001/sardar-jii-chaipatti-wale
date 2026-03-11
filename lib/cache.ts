interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTTL: number;

  constructor(defaultTTLSeconds = 300) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = (ttlSeconds ?? this.defaultTTL / 1000) * 1000;
    this.store.set(key, { data, expiresAt: Date.now() + ttl });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }
}

// Shared cache instance – 5 minute default TTL
export const appCache = new MemoryCache(300);

// Cache keys
export const CacheKeys = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  TESTIMONIALS: 'testimonials',
  FAQ_ITEMS: 'faq_items',
  ADMIN_STATS: 'admin_stats',
  ALL_ORDERS: 'all_orders',
  ALL_USERS: 'all_users',
  ALL_TICKETS: 'all_tickets',
  USER_ORDERS: (userId: string) => `orders_${userId}`,
  USER_TICKETS: (userId: string) => `tickets_${userId}`,
  ORDER_DETAIL: (orderId: string) => `order_${orderId}`,
  PRODUCT_DETAIL: (productId: string) => `product_${productId}`,
  REVENUE_DATA: 'revenue_data',
} as const;
