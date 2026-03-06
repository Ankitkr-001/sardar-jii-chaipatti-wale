'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';

export default function CartPage() {
  const { cartItems, clearCart } = useCart();

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-dark font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-bold text-dark font-serif mb-8">
          Shopping Cart
          {cartItems.length > 0 && (
            <span className="ml-3 text-lg font-normal text-gray-400">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-dark mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Looks like you haven&apos;t added any teas yet. Explore our premium collection and find your perfect brew.
            </p>
            <Link
              href="/products"
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart</p>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
                >
                  Clear Cart
                </button>
              </div>
              {cartItems.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}

              {/* Continue Shopping */}
              <div className="pt-4">
                <Link
                  href="/products"
                  className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary showCheckoutButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
