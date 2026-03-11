import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your cart items and proceed to checkout. Free shipping on orders above ₹999.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
