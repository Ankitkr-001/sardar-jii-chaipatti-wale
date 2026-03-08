'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '@/lib/constants';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

const WISHLIST_KEY = 'sardarji_wishlist';

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);

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

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Handpicked For You</span>
            <h2 className="text-4xl font-bold text-dark mt-2 font-serif">Featured Teas</h2>
          </div>
          <Link href="/products" className="text-primary hover:text-accent transition-colors font-medium text-sm hidden sm:block">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} wishlistedIds={wishlistIds} onWishlistToggle={handleWishlistToggle} />
          ))}
        </div>
        <div className="sm:hidden text-center mt-8">
          <Link href="/products" className="text-primary hover:text-accent transition-colors font-medium">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
