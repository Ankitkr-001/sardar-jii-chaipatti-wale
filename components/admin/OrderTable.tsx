'use client';
import React from 'react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';

interface OrderTableProps {
  orders: Order[];
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  if (orders.length === 0) {
    return <div className="text-center py-12 text-gray-400">No orders found.</div>;
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="lg:hidden space-y-3">
        {orders.map(order => {
          const colorClasses = getOrderStatusColor(order.status);
          return (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-dark text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}>{ORDER_STATUSES[order.status]}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.address?.name || order.userId.slice(0, 8)}</span>
                <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                {onStatusChange && (
                  <select value={order.status} onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary bg-white">
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUSES[s]}</option>)}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Order</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              {onStatusChange && <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => {
              const colorClasses = getOrderStatusColor(order.status);
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-dark">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="py-4 px-4 text-gray-600">{order.address?.name || order.userId.slice(0, 8)}</td>
                  <td className="py-4 px-4 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="py-4 px-4 font-semibold text-primary">{formatPrice(order.total)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}>{ORDER_STATUSES[order.status]}</span>
                  </td>
                  {onStatusChange && (
                    <td className="py-4 px-4">
                      <select value={order.status} onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary bg-white">
                        {ALL_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUSES[s]}</option>)}
                      </select>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
