'use client';
import React, { useState, useEffect } from 'react';
import { getProducts } from '@/lib/firestore';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlistIds, handleWishlistToggle } = useWishlist();

  useEffect(() => {
    getProducts()
      .then(products => setFeatured(products.filter(p => p.featured).slice(0, 4)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Handpicked For You</span>
            <h2 className="text-4xl font-bold text-dark mt-2 font-serif">Featured Teas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 sm:h-56 bg-gray-200" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

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
