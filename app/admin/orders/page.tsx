'use client';
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { getOrders, updateOrderStatus } from '@/lib/firestore';
import OrderTable from '@/components/admin/OrderTable';
import { ORDER_STATUSES } from '@/lib/constants';
import Spinner from '@/components/ui/Spinner';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  ...Object.entries(ORDER_STATUSES).map(([value, label]) => ({ value, label })),
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getOrders().then(o => {
      setOrders(o);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

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
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === f.value ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">({orders.filter(o => o.status === f.value).length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4">
          {filtered.length > 0 ? (
            <OrderTable orders={filtered} onStatusChange={handleStatusChange} />
          ) : (
            <div className="text-center py-12 text-gray-400">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
