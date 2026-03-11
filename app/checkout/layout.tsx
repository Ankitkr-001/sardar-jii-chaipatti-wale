import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase securely with multiple payment options including UPI, credit/debit cards, and net banking.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
