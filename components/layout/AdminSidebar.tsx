'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '🍃' },
  { label: 'Categories', href: '/admin/categories', icon: '📁' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Payments', href: '/admin/payments', icon: '💳' },
  { label: 'Support', href: '/admin/support', icon: '🎫' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary min-h-screen text-white flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
              <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M6 28 Q20 36 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="text-accent font-bold text-sm font-serif">Sardar Ji</div>
            <div className="text-white/50 text-xs">Admin Panel</div>
          </div>
        </Link>
      </div>
      <nav className="p-4 space-y-1">
        {adminLinks.map(link => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-accent text-dark shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
