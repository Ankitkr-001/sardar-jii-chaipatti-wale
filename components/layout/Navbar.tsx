'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Support', href: '/support' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-xl' : 'bg-primary'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M6 28 Q20 36 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M32 18 C36 14 38 10 34 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-accent font-bold text-lg leading-tight font-serif">Sardar Ji</div>
              <div className="text-white/70 text-xs tracking-widest uppercase">Chaipatti Wale</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-accent transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-white/80 hover:text-accent transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-once">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-dark text-xs font-bold">
                    {user.name?.charAt(0) || user.phone?.charAt(-2) || 'U'}
                  </div>
                  <span className="text-sm hidden sm:block">{user.name || 'Account'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-background transition-colors">My Account</Link>
                    <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-background transition-colors">My Orders</Link>
                    <Link href="/account/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-background transition-colors">Wishlist</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-accent font-medium hover:bg-background transition-colors">Admin Panel</Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="bg-accent text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors shadow-md">
                Login
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-white/80 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
