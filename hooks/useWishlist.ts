'use client';
import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'sardarji_wishlist';

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setWishlistIds(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  const handleWishlistToggle = useCallback((productId: string) => {
    setWishlistIds(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated)); } catch { /* empty */ }
      return updated;
    });
  }, []);

  const saveWishlist = useCallback((ids: string[]) => {
    setWishlistIds(ids);
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids)); } catch { /* empty */ }
  }, []);

  return { wishlistIds, handleWishlistToggle, saveWishlist };
}
