'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Order, TrackingStep, OrderStatus } from '@/types';
import { getOrderById } from '@/lib/firestore';
import { formatDate, getOrderStatusColor } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import OrderTimeline from '@/components/account/OrderTimeline';
import Spinner from '@/components/ui/Spinner';

export default function OrderTrackingPage() {
  const params = useParams();
  const { user } = useAuth();
  const orderId = typeof params.id === 'string' ? params.id : '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(o => {
        setOrder(o);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order || (user && order.userId !== user.id)) {
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
