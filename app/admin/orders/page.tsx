'use client';
import React, { useState } from 'react';
import { Order, OrderItem, OrderStatus } from '@/types';
import { PRODUCTS } from '@/lib/constants';
import OrderTable from '@/components/admin/OrderTable';
import { ORDER_STATUSES } from '@/lib/constants';

const mockOrders: Order[] = [
  {
    id: 'ORD-1716000000-AB123', userId: 'user-1',
    items: [{ product: PRODUCTS[0], quantity: 2, price: PRODUCTS[0].price }, { product: PRODUCTS[2], quantity: 1, price: PRODUCTS[2].price }] as OrderItem[],
    subtotal: PRODUCTS[0].price * 2 + PRODUCTS[2].price, shipping: 0,
    tax: Math.round((PRODUCTS[0].price * 2 + PRODUCTS[2].price) * 0.18),
    total: Math.round((PRODUCTS[0].price * 2 + PRODUCTS[2].price) * 1.18),
    status: 'delivered', paymentId: 'pay_001',
    address: { id: 'a1', name: 'Priya Sharma', phone: '9876543210', line1: '123 Tea St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(), trackingSteps: [],
  },
  {
    id: 'ORD-1716100000-CD456', userId: 'user-2',
    items: [{ product: PRODUCTS[4], quantity: 1, price: PRODUCTS[4].price }] as OrderItem[],
    subtotal: PRODUCTS[4].price, shipping: 99, tax: Math.round(PRODUCTS[4].price * 0.18),
    total: PRODUCTS[4].price + 99 + Math.round(PRODUCTS[4].price * 0.18),
    status: 'shipped', paymentId: 'pay_002',
    address: { id: 'a2', name: 'Rajesh Patel', phone: '9876543211', line1: '456 Spice Ln', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', isDefault: true },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(), trackingSteps: [],
  },
  {
    id: 'ORD-1716200000-EF789', userId: 'user-3',
    items: [{ product: PRODUCTS[7], quantity: 2, price: PRODUCTS[7].price }] as OrderItem[],
    subtotal: PRODUCTS[7].price * 2, shipping: 0, tax: Math.round(PRODUCTS[7].price * 2 * 0.18),
    total: Math.round(PRODUCTS[7].price * 2 * 1.18),
    status: 'confirmed', paymentId: 'pay_003',
    address: { id: 'a3', name: 'Ananya K', phone: '9876543212', line1: '789 Garden Rd', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isDefault: true },
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(), trackingSteps: [],
  },
  {
    id: 'ORD-1716300000-GH012', userId: 'user-4',
    items: [{ product: PRODUCTS[1], quantity: 3, price: PRODUCTS[1].price }] as OrderItem[],
    subtotal: PRODUCTS[1].price * 3, shipping: 0, tax: Math.round(PRODUCTS[1].price * 3 * 0.18),
    total: Math.round(PRODUCTS[1].price * 3 * 1.18),
    status: 'pending', paymentId: 'pay_004',
    address: { id: 'a4', name: 'Vikram Singh', phone: '9876543213', line1: '12 Main Mkt', city: 'Delhi', state: 'Delhi', pincode: '110001', isDefault: true },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(), trackingSteps: [],
  },
  {
    id: 'ORD-1716400000-IJ345', userId: 'user-5',
    items: [{ product: PRODUCTS[3], quantity: 1, price: PRODUCTS[3].price }] as OrderItem[],
    subtotal: PRODUCTS[3].price, shipping: 99, tax: Math.round(PRODUCTS[3].price * 0.18),
    total: PRODUCTS[3].price + 99 + Math.round(PRODUCTS[3].price * 0.18),
    status: 'processing', paymentId: 'pay_005',
    address: { id: 'a5', name: 'Meera Iyer', phone: '9876543214', line1: '56 Beach Rd', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', isDefault: true },
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), updatedAt: new Date(Date.now() - 6 * 3600000).toISOString(), trackingSteps: [],
  },
  {
    id: 'ORD-1716500000-KL678', userId: 'user-6',
    items: [{ product: PRODUCTS[5], quantity: 1, price: PRODUCTS[5].price }, { product: PRODUCTS[6], quantity: 1, price: PRODUCTS[6].price }] as OrderItem[],
    subtotal: PRODUCTS[5].price + PRODUCTS[6].price, shipping: 0, tax: Math.round((PRODUCTS[5].price + PRODUCTS[6].price) * 0.18),
    total: Math.round((PRODUCTS[5].price + PRODUCTS[6].price) * 1.18),
    status: 'cancelled', paymentId: 'pay_006',
    address: { id: 'a6', name: 'Amit Gupta', phone: '9876543215', line1: '89 Park Ave', city: 'Kolkata', state: 'West Bengal', pincode: '700001', isDefault: true },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(), trackingSteps: [],
  },
];

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  ...Object.entries(ORDER_STATUSES).map(([value, label]) => ({ value, label })),
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4">
          <OrderTable orders={filtered} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}
