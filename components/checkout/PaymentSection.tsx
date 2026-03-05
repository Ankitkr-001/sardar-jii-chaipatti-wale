'use client';
import React from 'react';
import { formatPrice } from '@/lib/utils';

interface PaymentSectionProps {
  total: number;
  onPay: () => void;
  loading?: boolean;
}

export default function PaymentSection({ total, onPay, loading = false }: PaymentSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-dark text-lg mb-6">Payment</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💳</div>
          <div>
            <div className="text-sm font-medium text-dark">Razorpay Secure Payment</div>
            <div className="text-xs text-gray-500">Credit/Debit Card, UPI, Net Banking, EMI</div>
          </div>
          <div className="ml-auto">
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['UPI', 'Card', 'Net Banking', 'EMI'].map(method => (
            <div key={method} className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 font-medium">{method}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <div>
          <div className="text-sm text-gray-600">Amount to Pay</div>
          <div className="text-2xl font-bold text-primary">{formatPrice(total)}</div>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Secured</span>
        </div>
      </div>

      <button
        onClick={onPay}
        disabled={loading}
        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>Pay {formatPrice(total)} →</>
        )}
      </button>
      
      <p className="text-xs text-gray-400 text-center mt-3">
        By placing this order, you agree to our Terms &amp; Conditions
      </p>
    </div>
  );
}
