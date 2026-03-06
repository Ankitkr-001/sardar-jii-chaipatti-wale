'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS } from '@/lib/constants';
import { Order, OrderItem } from '@/types';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';

function getMockOrderById(id: string, userId: string): Order | undefined {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

  const orders: Order[] = [
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
      address: { id: 'addr-1', name: 'Demo User', phone: '9876543210', line1: '123 Tea Street', line2: 'Near Garden', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isDefault: true },
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

export default function OrderDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const orderId = typeof params.id === 'string' ? params.id : '';
  const order = user ? getMockOrderById(orderId, user.id) : undefined;

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-lg font-bold text-dark mb-2">Order not found</h3>
        <p className="text-gray-500 mb-6">This order doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/account/orders" className="text-primary font-medium hover:text-accent transition-colors">← Back to Orders</Link>
      </div>
    );
  }

  const statusColor = getOrderStatusColor(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/account/orders" className="text-sm text-primary hover:text-accent transition-colors flex items-center gap-1 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-dark">Order #{order.id.slice(-10).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColor}`}>
          {ORDER_STATUSES[order.status]}
        </span>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-dark mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={item.product.images[0] || `https://via.placeholder.com/64x64?text=${encodeURIComponent(item.product.name)}`}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-dark text-sm">{item.product.name}</div>
                <div className="text-xs text-gray-500">{item.product.category} • {item.product.weight}</div>
                <div className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</div>
              </div>
              <div className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="border-t border-gray-100 mt-5 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className={order.shipping === 0 ? 'text-green-600' : ''}>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST (18%)</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-dark text-base border-t border-gray-100 pt-2">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
            <span>📍</span> Shipping Address
          </h3>
          <div className="text-sm space-y-1">
            <div className="font-semibold text-dark">{order.address.name}</div>
            <div className="text-gray-500">{order.address.phone}</div>
            <div className="text-gray-600 leading-relaxed mt-1">
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''},{' '}
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
            <span>💳</span> Payment Details
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-dark">Razorpay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-600">Paid</span>
            </div>
            {order.paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-medium text-dark text-xs">{order.paymentId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Track order */}
      <div className="flex gap-3">
        <Link
          href={`/account/orders/${order.id}/tracking`}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          Track Order
        </Link>
        <Link
          href="/support"
          className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors text-sm"
        >
          Need Help?
        </Link>
      </div>
    </div>
  );
}
