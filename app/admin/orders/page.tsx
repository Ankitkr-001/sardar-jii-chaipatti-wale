'use client';
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, AdminNotification } from '@/types';
import { getOrders, updateOrderStatus, getAdminNotifications, markNotificationRead } from '@/lib/firestore';
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
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    getOrders().then(o => {
      setOrders(o);
      setLoading(false);
    }).catch(() => setLoading(false));

    getAdminNotifications(20).then(n => {
      setNotifications(n);
    }).catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n => markNotificationRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <span className="font-semibold text-dark text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary hover:text-accent transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">No notifications</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-gray-50 last:border-0 ${!n.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5">
                        {n.type === 'new_order' ? '🛒' : n.type === 'payment_captured' ? '💳' : '❌'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                        {n.createdAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(typeof n.createdAt === 'string' ? n.createdAt : n.createdAt).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
