'use client';
import React from 'react';
import { PRODUCTS } from '@/lib/constants';
import { Order, OrderItem } from '@/types';
import StatsCard from '@/components/admin/StatsCard';
import RevenueChart from '@/components/admin/RevenueChart';
import OrderTable from '@/components/admin/OrderTable';
import { formatPrice } from '@/lib/utils';

const mockRecentOrders: Order[] = [
  {
    id: 'ORD-1716000000-AB123',
    userId: 'user-1',
    items: [{ product: PRODUCTS[0], quantity: 2, price: PRODUCTS[0].price }, { product: PRODUCTS[2], quantity: 1, price: PRODUCTS[2].price }] as OrderItem[],
    subtotal: PRODUCTS[0].price * 2 + PRODUCTS[2].price,
    shipping: 0,
    tax: Math.round((PRODUCTS[0].price * 2 + PRODUCTS[2].price) * 0.18),
    total: Math.round((PRODUCTS[0].price * 2 + PRODUCTS[2].price) * 1.18),
    status: 'delivered',
    paymentId: 'pay_demo_001',
    address: { id: 'addr-1', name: 'Priya Sharma', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    trackingSteps: [],
  },
  {
    id: 'ORD-1716100000-CD456',
    userId: 'user-2',
    items: [{ product: PRODUCTS[4], quantity: 1, price: PRODUCTS[4].price }] as OrderItem[],
    subtotal: PRODUCTS[4].price,
    shipping: 99,
    tax: Math.round(PRODUCTS[4].price * 0.18),
    total: PRODUCTS[4].price + 99 + Math.round(PRODUCTS[4].price * 0.18),
    status: 'shipped',
    paymentId: 'pay_demo_002',
    address: { id: 'addr-2', name: 'Rajesh Patel', phone: '9876543211', line1: '456 Spice Lane', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', isDefault: true },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    trackingSteps: [],
  },
  {
    id: 'ORD-1716200000-EF789',
    userId: 'user-3',
    items: [{ product: PRODUCTS[7], quantity: 2, price: PRODUCTS[7].price }] as OrderItem[],
    subtotal: PRODUCTS[7].price * 2,
    shipping: 0,
    tax: Math.round(PRODUCTS[7].price * 2 * 0.18),
    total: Math.round(PRODUCTS[7].price * 2 * 1.18),
    status: 'confirmed',
    paymentId: 'pay_demo_003',
    address: { id: 'addr-3', name: 'Ananya K', phone: '9876543212', line1: '789 Garden Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', isDefault: true },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    trackingSteps: [],
  },
  {
    id: 'ORD-1716300000-GH012',
    userId: 'user-4',
    items: [{ product: PRODUCTS[1], quantity: 3, price: PRODUCTS[1].price }] as OrderItem[],
    subtotal: PRODUCTS[1].price * 3,
    shipping: 0,
    tax: Math.round(PRODUCTS[1].price * 3 * 0.18),
    total: Math.round(PRODUCTS[1].price * 3 * 1.18),
    status: 'pending',
    paymentId: 'pay_demo_004',
    address: { id: 'addr-4', name: 'Vikram Singh', phone: '9876543213', line1: '12 Main Market', city: 'Delhi', state: 'Delhi', pincode: '110001', isDefault: true },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    trackingSteps: [],
  },
  {
    id: 'ORD-1716400000-IJ345',
    userId: 'user-5',
    items: [{ product: PRODUCTS[3], quantity: 1, price: PRODUCTS[3].price }, { product: PRODUCTS[9], quantity: 2, price: PRODUCTS[9].price }] as OrderItem[],
    subtotal: PRODUCTS[3].price + PRODUCTS[9].price * 2,
    shipping: 99,
    tax: Math.round((PRODUCTS[3].price + PRODUCTS[9].price * 2) * 0.18),
    total: PRODUCTS[3].price + PRODUCTS[9].price * 2 + 99 + Math.round((PRODUCTS[3].price + PRODUCTS[9].price * 2) * 0.18),
    status: 'processing',
    paymentId: 'pay_demo_005',
    address: { id: 'addr-5', name: 'Meera Iyer', phone: '9876543214', line1: '56 Beach Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', isDefault: true },
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    trackingSteps: [],
  },
];

const totalRevenue = mockRecentOrders.reduce((sum, o) => sum + o.total, 0);

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon="💰" label="Total Revenue (Demo)" value={formatPrice(totalRevenue * 30)} change="12.5%" positive />
        <StatsCard icon="📦" label="Total Orders (Demo)" value="1,248" change="8.2%" positive />
        <StatsCard icon="👥" label="Total Customers" value="843" change="3.1%" positive />
        <StatsCard icon="🍃" label="Total Products" value={PRODUCTS.length} />
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-dark text-lg">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-primary hover:text-accent font-medium transition-colors">View All →</a>
        </div>
        <div className="p-4">
          <OrderTable orders={mockRecentOrders} />
        </div>
      </div>
    </div>
  );
}
