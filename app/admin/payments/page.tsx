'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Payment } from '@/types';
import { getOrders } from '@/lib/firestore';
import { formatPrice } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';

const statusColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  created: 'bg-yellow-100 text-yellow-700',
  attempted: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getOrders().then(orders => {
      const derived: Payment[] = orders
        .filter(o => o.paymentId)
        .map(o => ({
          id: o.paymentId || o.id,
          orderId: o.id,
          amount: o.total,
          currency: 'INR',
          status: (o.status === 'cancelled' || o.status === 'refunded') ? 'failed' as const : 'paid' as const,
          method: '',
          razorpayOrderId: '',
          razorpayPaymentId: o.paymentId || '',
        }));
      setPayments(derived);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    filter === 'all' ? payments : payments.filter(p => p.status === filter),
    [payments, filter]
  );
  const totalPaid = useMemo(() =>
    payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">{payments.length} payment records</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Collected</div>
          <div className="text-2xl font-bold text-primary">{formatPrice(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Successful Payments</div>
          <div className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'paid').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Failed Payments</div>
          <div className="text-2xl font-bold text-red-500">{payments.filter(p => p.status === 'failed').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'paid', 'created', 'attempted', 'failed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Payments - Mobile card view + Desktop table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile card view */}
        <div className="lg:hidden divide-y divide-gray-50">
          {filtered.map(payment => (
            <div key={payment.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-dark truncate max-w-[120px]">{payment.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[payment.status]}`}>
                  {payment.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Order: {payment.orderId.slice(-10).toUpperCase()}</span>
                <span className="font-semibold text-primary text-sm">{formatPrice(payment.amount)}</span>
              </div>
              {(payment.method || payment.razorpayPaymentId) && (
                <div className="text-xs text-gray-400 pt-1 border-t border-gray-50">
                  {payment.method && <span>Method: {payment.method}</span>}
                  {payment.razorpayPaymentId && <span className="ml-2 font-mono">{payment.razorpayPaymentId}</span>}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No payments found.</div>
          )}
        </div>

        {/* Desktop table view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Payment ID</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Method</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Razorpay Payment ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-mono text-xs text-dark">{payment.id}</td>
                  <td className="py-4 px-4 text-gray-600 text-xs">{payment.orderId.slice(-10).toUpperCase()}</td>
                  <td className="py-4 px-4 font-semibold text-primary">{formatPrice(payment.amount)}</td>
                  <td className="py-4 px-4 text-gray-600">{payment.method || '—'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs text-gray-400">
                    {payment.razorpayPaymentId || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No payments found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
