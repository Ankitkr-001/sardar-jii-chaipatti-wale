'use client';
import React, { useState } from 'react';
import { Payment } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

const mockPayments: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-1716000000-AB123', amount: 1648, currency: 'INR', status: 'paid', method: 'UPI', razorpayOrderId: 'order_demo1', razorpayPaymentId: 'pay_demo_001' },
  { id: 'PAY-002', orderId: 'ORD-1716100000-CD456', amount: 919, currency: 'INR', status: 'paid', method: 'Credit Card', razorpayOrderId: 'order_demo2', razorpayPaymentId: 'pay_demo_002' },
  { id: 'PAY-003', orderId: 'ORD-1716200000-EF789', amount: 824, currency: 'INR', status: 'paid', method: 'Net Banking', razorpayOrderId: 'order_demo3', razorpayPaymentId: 'pay_demo_003' },
  { id: 'PAY-004', orderId: 'ORD-1716300000-GH012', amount: 1060, currency: 'INR', status: 'created', method: 'UPI', razorpayOrderId: 'order_demo4', razorpayPaymentId: '' },
  { id: 'PAY-005', orderId: 'ORD-1716400000-IJ345', amount: 688, currency: 'INR', status: 'paid', method: 'Debit Card', razorpayOrderId: 'order_demo5', razorpayPaymentId: 'pay_demo_005' },
  { id: 'PAY-006', orderId: 'ORD-1716500000-KL678', amount: 1537, currency: 'INR', status: 'failed', method: 'UPI', razorpayOrderId: 'order_demo6', razorpayPaymentId: '' },
];

const statusColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  created: 'bg-yellow-100 text-yellow-700',
  attempted: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminPaymentsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockPayments : mockPayments.filter(p => p.status === filter);
  const totalPaid = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">{mockPayments.length} payment records</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Collected</div>
          <div className="text-2xl font-bold text-primary">{formatPrice(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Successful Payments</div>
          <div className="text-2xl font-bold text-green-600">{mockPayments.filter(p => p.status === 'paid').length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Failed Payments</div>
          <div className="text-2xl font-bold text-red-500">{mockPayments.filter(p => p.status === 'failed').length}</div>
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
