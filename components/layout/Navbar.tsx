'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', href: '/', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  )},
  { label: 'Shop', href: '/products', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
  )},
  { label: 'Collections', href: '/products?view=collections', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  )},
  { label: 'About', href: '/about', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { label: 'Contact', href: '/support', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  )},
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const desktopLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Support', href: '/support' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-xl' : 'bg-primary'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Hamburger (left on mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-white/80 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 40 40" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
                  <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M6 28 Q20 36 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M32 18 C36 14 38 10 34 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="text-accent font-bold text-lg leading-tight font-serif">Sardar Ji</div>
                <div className="text-white/70 text-xs tracking-widest uppercase">Chaipatti Wale</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {desktopLinks.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-accent bg-white/10'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 text-white/80 hover:text-accent transition-colors" aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu - Desktop */}
              {user ? (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-dark text-xs font-bold">
                      {user.name?.charAt(0) || user.phone?.slice(-2, -1) || 'U'}
                    </div>
                    <span className="text-sm hidden lg:block max-w-[100px] truncate">{user.name || 'Account'}</span>
                    <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth" className="text-white/80 hover:text-accent px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="bg-accent text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors shadow-md">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        {/* Slide-in Panel */}
        <div className={`absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-primary">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                  <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M6 28 Q20 36 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-accent font-bold text-base leading-tight font-serif">Sardar Ji</div>
                <div className="text-white/60 text-[10px] tracking-widest uppercase">Chaipatti Wale</div>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white/70 hover:text-white transition-colors rounded-lg"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-5 py-4 border-b border-gray-100 bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email || user.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href.split('?')[0]));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-0.5 transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <span className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {link.icon}
                  </span>
                  <span className="font-medium text-[15px]">{link.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}

            {/* Profile & Cart in mobile menu */}
            <div className="border-t border-gray-100 mt-3 pt-3">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-0.5 transition-all duration-200 group ${
                  pathname === '/account' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <span className={`transition-colors ${pathname === '/account' ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <span className="font-medium text-[15px]">Profile</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-0.5 transition-all duration-200 group ${
                  pathname === '/cart' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <span className={`transition-colors ${pathname === '/cart' ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </span>
                <span className="font-medium text-[15px]">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 py-4 border-t border-gray-100">
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full px-4 py-3 rounded-xl bg-primary text-white font-semibold text-center hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full px-4 py-3 rounded-xl border border-primary text-primary font-semibold text-center hover:bg-primary/5 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
