'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const accountLinks = [
  { label: 'Dashboard', href: '/account', icon: '🏠' },
  { label: 'Profile', href: '/account/profile', icon: '👤' },
  { label: 'Orders', href: '/account/orders', icon: '📦' },
  { label: 'Addresses', href: '/account/addresses', icon: '📍' },
  { label: 'Wishlist', href: '/account/wishlist', icon: '❤️' },
  { label: 'Support', href: '/support', icon: '🎫' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* User info */}
            <div className="bg-primary rounded-2xl p-5 mb-4 text-white">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-dark font-bold text-xl mb-3">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="font-bold text-white text-lg leading-tight">{user.name || 'Tea Lover'}</div>
              <div className="text-white/60 text-sm mt-0.5">{user.email || user.phone}</div>
            </div>

            {/* Nav links */}
            <nav className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {accountLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/account' && link.href !== '/support' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
                      isActive ? 'bg-primary/5 text-primary border-l-2 border-l-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
              >
                <span>🚪</span>
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
