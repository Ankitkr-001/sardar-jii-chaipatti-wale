'use client';
import React, { useState, useMemo } from 'react';
import { Order, OrderItem } from '@/types';
import { PRODUCTS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import OrderCard from '@/components/account/OrderCard';
import Link from 'next/link';

// Mock orders using actual products for demo
function getMockOrders(userId: string): Order[] {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  return [
    {
      id: 'ORD-1716000000-AB123',
      userId,
      items: [
        { product: PRODUCTS[0], quantity: 2, price: PRODUCTS[0].price },
        { product: PRODUCTS[2], quantity: 1, price: PRODUCTS[2].price },
      ] as OrderItem[],
      subtotal: PRODUCTS[0].price * 2 + PRODUCTS[2].price,
      shipping: 0,
      tax: Math.round((PRODUCTS[0].price * 2 + PRODUCTS[2].price) * 0.18),
      total: Math.round((PRODUCTS[0].price * 2 + PRODUCTS[2].price) * 1.18),
      status: 'delivered',
      paymentId: 'pay_demo_001',
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
      createdAt: daysAgo(15),
      updatedAt: daysAgo(10),
      trackingSteps: [],
    },
    {
      id: 'ORD-1716100000-CD456',
      userId,
      items: [
        { product: PRODUCTS[4], quantity: 1, price: PRODUCTS[4].price },
      ] as OrderItem[],
      subtotal: PRODUCTS[4].price,
      shipping: 99,
      tax: Math.round(PRODUCTS[4].price * 0.18),
      total: PRODUCTS[4].price + 99 + Math.round(PRODUCTS[4].price * 0.18),
      status: 'shipped',
      paymentId: 'pay_demo_002',
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      trackingSteps: [],
    },
    {
      id: 'ORD-1716200000-EF789',
      userId,
      items: [
        { product: PRODUCTS[7], quantity: 2, price: PRODUCTS[7].price },
        { product: PRODUCTS[8], quantity: 1, price: PRODUCTS[8].price },
      ] as OrderItem[],
      subtotal: PRODUCTS[7].price * 2 + PRODUCTS[8].price,
      shipping: 0,
      tax: Math.round((PRODUCTS[7].price * 2 + PRODUCTS[8].price) * 0.18),
      total: Math.round((PRODUCTS[7].price * 2 + PRODUCTS[8].price) * 1.18),
      status: 'confirmed',
      paymentId: 'pay_demo_003',
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      trackingSteps: [],
    },
  ];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('all');

  const orders = useMemo(() => user ? getMockOrders(user.id) : [], [user]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage all your orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-dark mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders found.`}
          </p>
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
