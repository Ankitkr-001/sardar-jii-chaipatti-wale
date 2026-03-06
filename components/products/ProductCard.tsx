'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  wishlistedIds?: string[];
  onWishlistToggle?: (productId: string) => void;
}

export default function ProductCard({ product, wishlistedIds = [], onWishlistToggle }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const [adding, setAdding] = useState(false);
  const isInCart = cartItems.some(item => item.product.id === product.id);
  const isWishlisted = wishlistedIds.includes(product.id);
  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(product.id);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer border border-gray-100">
        {/* Image */}
        <div className="relative h-56 bg-gray-50 overflow-hidden">
          <Image
            src={product.images[0] || `https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.bestSeller && (
            <span className="absolute top-3 right-3 bg-accent text-dark text-xs font-bold px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <svg
              className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-0.5 rounded-full">{product.category}</span>
            <span className="text-xs text-gray-400">• {product.origin}</span>
          </div>
          <h3 className="font-semibold text-dark text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-accent text-sm">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isInCart
                  ? 'bg-primary text-white'
                  : adding
                  ? 'bg-accent/80 text-dark scale-95'
                  : 'bg-accent text-dark hover:bg-accent/90 hover:shadow-md'
              }`}
            >
              {adding ? '✓' : isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
