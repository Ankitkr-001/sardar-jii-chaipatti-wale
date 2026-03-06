'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const quickLinks = [
  { label: 'My Orders', href: '/account/orders', icon: '📦', desc: 'Track and view your orders' },
  { label: 'Profile', href: '/account/profile', icon: '👤', desc: 'Manage your personal info' },
  { label: 'Addresses', href: '/account/addresses', icon: '📍', desc: 'Manage delivery addresses' },
  { label: 'Wishlist', href: '/account/wishlist', icon: '❤️', desc: 'Your saved products' },
];

export default function AccountPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      {/* Greeting banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
        <div className="text-white/70 text-sm mb-1">{greeting},</div>
        <h1 className="text-2xl font-bold">{user?.name || 'Tea Lover'}! 👋</h1>
        <p className="text-white/70 text-sm mt-2">Welcome to your Sardar Ji account. Manage your orders, addresses, and more.</p>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-bold text-dark mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
                  {link.icon}
                </div>
                <div>
                  <div className="font-semibold text-dark group-hover:text-primary transition-colors">{link.label}</div>
                  <div className="text-sm text-gray-500">{link.desc}</div>
                </div>
                <svg className="w-5 h-5 text-gray-300 ml-auto group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-dark mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Name</span>
            <span className="font-medium text-dark">{user?.name || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-dark">{user?.email || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium text-dark">{user?.phone || '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500">Saved Addresses</span>
            <span className="font-medium text-dark">{user?.addresses?.length || 0}</span>
          </div>
        </div>
        <Link
          href="/account/profile"
          className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:text-accent font-medium transition-colors"
        >
          Edit Profile →
        </Link>
      </div>
    </div>
  );
}
