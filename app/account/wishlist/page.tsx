'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/lib/constants';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';

const WISHLIST_KEY = 'sardarji_wishlist';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setWishlistIds(JSON.parse(stored));
    } catch { /* empty */ }
    setMounted(true);
  }, []);

  const saveWishlist = (ids: string[]) => {
    setWishlistIds(ids);
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    } catch { /* empty */ }
  };

  const handleToggle = (productId: string) => {
    const updated = wishlistIds.includes(productId)
      ? wishlistIds.filter(id => id !== productId)
      : [...wishlistIds, productId];
    saveWishlist(updated);
  };

  const handleRemove = (productId: string) => {
    saveWishlist(wishlistIds.filter(id => id !== productId));
  };

  const wishlisted: Product[] = PRODUCTS.filter(p => wishlistIds.includes(p.id));

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Wishlist</h1>
        <p className="text-gray-500 text-sm mt-1">
          {wishlisted.length > 0 ? `${wishlisted.length} ${wishlisted.length === 1 ? 'item' : 'items'} saved` : 'Your saved products appear here'}
        </p>
      </div>

      {wishlisted.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-lg font-bold text-dark mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save products you love by clicking the heart icon on any product card.</p>
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Bulk actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{wishlisted.length} saved items</p>
            <button
              onClick={() => {
                wishlisted.forEach(p => addToCart(p));
                alert('All items added to cart!');
              }}
              className="text-sm bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Add All to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlisted.map(product => (
              <div key={product.id} className="relative">
                <ProductCard product={product} wishlistedIds={wishlistIds} onWishlistToggle={handleToggle} />
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-red-500 hover:text-red-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all text-sm font-bold"
                  title="Remove from wishlist"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
