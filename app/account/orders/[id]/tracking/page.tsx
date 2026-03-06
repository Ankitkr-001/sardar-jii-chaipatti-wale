'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderItem, TrackingStep, OrderStatus } from '@/types';
import { PRODUCTS } from '@/lib/constants';
import { formatDate, getOrderStatusColor } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import OrderTimeline from '@/components/account/OrderTimeline';

function getMockOrderById(id: string, userId: string): Order | undefined {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  const orders: Order[] = [
    {
      id: 'ORD-1716000000-AB123',
      userId,
      items: [{ product: PRODUCTS[0], quantity: 2, price: PRODUCTS[0].price }] as OrderItem[],
      subtotal: PRODUCTS[0].price * 2,
      shipping: 0,
      tax: Math.round(PRODUCTS[0].price * 2 * 0.18),
      total: Math.round(PRODUCTS[0].price * 2 * 1.18),
      status: 'delivered',
      paymentId: 'pay_demo_001',
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
      createdAt: daysAgo(15),
      updatedAt: daysAgo(10),
      trackingSteps: [
        { status: 'pending', label: 'Order Placed', timestamp: daysAgo(15), completed: true },
        { status: 'confirmed', label: 'Order Confirmed', timestamp: daysAgo(14), completed: true },
        { status: 'processing', label: 'Processing', timestamp: daysAgo(13), completed: true },
        { status: 'shipped', label: 'Shipped', timestamp: daysAgo(11), completed: true },
        { status: 'out_for_delivery', label: 'Out for Delivery', timestamp: daysAgo(10), completed: true },
        { status: 'delivered', label: 'Delivered', timestamp: daysAgo(10), completed: true },
      ],
    },
    {
      id: 'ORD-1716100000-CD456',
      userId,
      items: [{ product: PRODUCTS[4], quantity: 1, price: PRODUCTS[4].price }] as OrderItem[],
      subtotal: PRODUCTS[4].price,
      shipping: 99,
      tax: Math.round(PRODUCTS[4].price * 0.18),
      total: PRODUCTS[4].price + 99 + Math.round(PRODUCTS[4].price * 0.18),
      status: 'shipped',
      paymentId: 'pay_demo_002',
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      trackingSteps: [
        { status: 'pending', label: 'Order Placed', timestamp: daysAgo(3), completed: true },
        { status: 'confirmed', label: 'Order Confirmed', timestamp: daysAgo(2), completed: true },
        { status: 'processing', label: 'Processing', timestamp: daysAgo(2), completed: true },
        { status: 'shipped', label: 'Shipped', timestamp: daysAgo(1), completed: true },
        { status: 'out_for_delivery', label: 'Out for Delivery', completed: false },
        { status: 'delivered', label: 'Delivered', completed: false },
      ],
    },
    {
      id: 'ORD-1716200000-EF789',
      userId,
      items: [{ product: PRODUCTS[7], quantity: 2, price: PRODUCTS[7].price }] as OrderItem[],
      subtotal: PRODUCTS[7].price * 2,
      shipping: 0,
      tax: Math.round(PRODUCTS[7].price * 2 * 0.18),
      total: Math.round(PRODUCTS[7].price * 2 * 1.18),
      status: 'confirmed',
      paymentId: 'pay_demo_003',
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      trackingSteps: [
        { status: 'pending', label: 'Order Placed', timestamp: daysAgo(1), completed: true },
        { status: 'confirmed', label: 'Order Confirmed', timestamp: daysAgo(1), completed: true },
        { status: 'processing', label: 'Processing', completed: false },
        { status: 'shipped', label: 'Shipped', completed: false },
        { status: 'out_for_delivery', label: 'Out for Delivery', completed: false },
        { status: 'delivered', label: 'Delivered', completed: false },
      ],
    },
  ];

  return orders.find(o => o.id === id);
}

export default function OrderTrackingPage() {
  const params = useParams();
  const { user } = useAuth();
  const orderId = typeof params.id === 'string' ? params.id : '';
  const order = user ? getMockOrderById(orderId, user.id) : undefined;

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-lg font-bold text-dark mb-2">Order not found</h3>
        <Link href="/account/orders" className="text-primary font-medium hover:text-accent transition-colors">← Back to Orders</Link>
      </div>
    );
  }

  const statusColor = getOrderStatusColor(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/account/orders/${order.id}`} className="text-sm text-primary hover:text-accent transition-colors flex items-center gap-1 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Order
        </Link>
        <h1 className="text-2xl font-bold text-dark">Order Tracking</h1>
        <p className="text-sm text-gray-500 mt-1">#{order.id.slice(-10).toUpperCase()}</p>
      </div>

      {/* Status banner */}
      <div className={`flex items-center justify-between p-4 rounded-2xl border ${statusColor.includes('green') ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
        <div>
          <div className="text-sm text-gray-600">Current Status</div>
          <div className={`font-bold text-lg ${statusColor.split(' ')[1]}`}>{ORDER_STATUSES[order.status]}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
          {ORDER_STATUSES[order.status]}
        </span>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-dark mb-6">Tracking Timeline</h2>
        <OrderTimeline steps={order.trackingSteps as TrackingStep[]} currentStatus={order.status as OrderStatus} />
      </div>

      {/* Delivery info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-dark mb-3">Delivery Information</h3>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-medium text-dark">3-5 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Order Date</span>
            <span className="font-medium text-dark">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivering to</span>
            <span className="font-medium text-dark">{order.address.city}, {order.address.state}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/account/orders" className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors text-sm">
          All Orders
        </Link>
        <Link href="/support" className="text-primary border border-primary/30 px-6 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors text-sm">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
