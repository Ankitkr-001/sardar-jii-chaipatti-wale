'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export default function OrderSummary({ showCheckoutButton = true, onCheckout }: OrderSummaryProps) {
  const { cartSubtotal, shippingCost, tax, cartTotal } = useCart();
  const remaining = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <h3 className="font-bold text-dark text-lg mb-6">Order Summary</h3>

      {/* Free shipping progress */}
      {remaining > 0 && (
        <div className="mb-5 p-3 bg-green-50 rounded-xl border border-green-100">
          <p className="text-xs text-green-700 font-medium">
            Add {formatPrice(remaining)} more for <strong>FREE shipping!</strong>
          </p>
          <div className="mt-2 bg-green-100 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
      {remaining <= 0 && (
        <div className="mb-5 p-3 bg-green-50 rounded-xl border border-green-100">
          <p className="text-xs text-green-700 font-medium">🎉 You get FREE shipping!</p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-dark">{formatPrice(cartSubtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-dark'}`}>
            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>GST (18%)</span>
          <span className="font-medium text-dark">{formatPrice(tax)}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="font-bold text-dark text-base">Total</span>
          <span className="font-bold text-primary text-xl">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <div className="mt-6 space-y-3">
          {onCheckout ? (
            <button
              onClick={onCheckout}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              href="/checkout"
              className="block w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md text-center"
            >
              Proceed to Checkout
            </Link>
          )}
          <Link href="/products" className="block text-center text-sm text-primary hover:text-accent transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
