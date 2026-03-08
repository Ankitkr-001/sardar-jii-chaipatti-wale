import React from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import Badge from '@/components/ui/Badge';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  let badgeVariant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
  if (order.status === 'delivered') badgeVariant = 'success';
  else if (order.status === 'cancelled' || order.status === 'refunded') badgeVariant = 'error';
  else if (order.status === 'pending') badgeVariant = 'warning';
  else badgeVariant = 'info';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-bold text-dark text-sm">#{order.id.slice(-8).toUpperCase()}</div>
          <div className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</div>
        </div>
        <Badge variant={badgeVariant}>{ORDER_STATUSES[order.status]}</Badge>
      </div>
      
      <div className="space-y-1.5 mb-4">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-accent">•</span>
            <span className="line-clamp-1">{item.product.name}</span>
            <span className="text-gray-400">× {item.quantity}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="text-xs text-gray-400">+{order.items.length - 2} more items</div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="font-bold text-primary">{formatPrice(order.total)}</div>
        <Link href={`/account/orders/${order.id}`} className="text-sm text-primary hover:text-accent transition-colors font-medium">
          View Details →
        </Link>
      </div>
    </div>
  );
}
