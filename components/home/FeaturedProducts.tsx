'use client';
import React from 'react';
import { PRODUCTS } from '@/lib/constants';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  const { wishlistIds, handleWishlistToggle } = useWishlist();

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
