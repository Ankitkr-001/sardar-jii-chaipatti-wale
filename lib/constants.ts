import { NavLink, OrderStatus } from '@/types';

export const SHIPPING_COST = 99;
export const FREE_SHIPPING_THRESHOLD = 999;
export const TAX_RATE = 0.18; // 18% GST

export const ORDER_STATUSES: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Support', href: '/support' },
];
