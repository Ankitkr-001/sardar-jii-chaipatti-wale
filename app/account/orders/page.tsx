'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Order } from '@/types';
import { getOrdersByUser } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import OrderCard from '@/components/account/OrderCard';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      getOrdersByUser(user.id).then(o => {
        setOrders(o);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const filtered = useMemo(() =>
    filter === 'all' ? orders : orders.filter(o => o.status === filter),
    [orders, filter]
  );

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

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
