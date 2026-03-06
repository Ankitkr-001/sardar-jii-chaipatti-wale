'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const AUTH_POPUP_DELAY = 25000; // 25 seconds
const SESSION_KEY = 'sardarji_auth_popup_shown';

export default function AuthPopup() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) return;

    // Don't show on auth pages
    if (pathname?.startsWith('/auth')) return;

    // Check if already shown this session
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        setIsOpen(true);
        sessionStorage.setItem(SESSION_KEY, 'true');
      }
    }, AUTH_POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [user, loading, pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-primary px-6 py-8 text-center">
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
              <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M6 28 Q20 36 34 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white font-serif">Welcome to Sardar Ji</h2>
          <p className="text-white/70 text-sm mt-1">Sign in for the best tea experience</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-6 space-y-3">
          <Link
            href="/auth"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-center min-h-[48px]"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-accent text-dark py-3.5 rounded-xl font-semibold hover:bg-accent/90 transition-colors text-center min-h-[48px]"
          >
            Create Account
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="block w-full text-gray-500 py-3 text-sm font-medium hover:text-gray-700 transition-colors text-center min-h-[44px]"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
