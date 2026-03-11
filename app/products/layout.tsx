import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Premium Indian Teas',
  description: 'Browse our collection of premium Indian teas - Darjeeling, Assam, Nilgiri, Masala Chai, Green Tea and more. Free shipping on orders above ₹999.',
  openGraph: {
    title: 'Shop Premium Indian Teas | Sardar Ji Chaipatti Wale',
    description: 'Browse our collection of premium Indian teas - Darjeeling, Assam, Nilgiri, Masala Chai, Green Tea and more.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
