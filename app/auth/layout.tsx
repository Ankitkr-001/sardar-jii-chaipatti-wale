import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Sardar Ji Chaipatti Wale account to manage orders, addresses, and more.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
