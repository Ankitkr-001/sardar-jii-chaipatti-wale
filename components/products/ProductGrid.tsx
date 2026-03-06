'use client';
import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import Spinner from '@/components/ui/Spinner';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  wishlistedIds?: string[];
  onWishlistToggle?: (productId: string) => void;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  loading = false,
  wishlistedIds = [],
  onWishlistToggle,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <div className="text-6xl mb-4">🍃</div>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          wishlistedIds={wishlistedIds}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}
