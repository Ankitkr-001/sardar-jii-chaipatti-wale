'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminSetupPage() {
  const { user, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const [setupKey, setSetupKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const expectedKey = process.env.NEXT_PUBLIC_ADMIN_SETUP_KEY;
    if (!expectedKey) {
      setError('Admin setup is not configured. Please set NEXT_PUBLIC_ADMIN_SETUP_KEY in your environment variables.');
      setSubmitting(false);
      return;
    }

    if (setupKey !== expectedKey) {
      setError('Invalid setup key. Please check and try again.');
      setSubmitting(false);
      return;
    }

    try {
      await updateUserProfile({ role: 'admin' });
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 2000);
    } catch {
      setError('Failed to update role. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark font-serif mb-2">Sign In Required</h1>
          <p className="text-gray-500 text-sm mb-6">You need to sign in before setting up an admin account.</p>
          <Link
            href="/auth"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark font-serif mb-2">Already an Admin</h1>
          <p className="text-gray-500 text-sm mb-6">Your account already has admin privileges.</p>
          <Link
            href="/admin"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Go to Admin Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark font-serif">Admin Setup</h1>
          <p className="text-gray-500 text-sm mt-1">Enter the admin setup key to activate admin privileges for your account.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100">{error}</div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl border border-green-100 text-center">
            <p className="font-semibold mb-1">Admin role activated!</p>
            <p>Redirecting to admin panel…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Setup Key</label>
              <input
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Enter admin setup key"
                required
              />
              <p className="text-xs text-gray-400 mt-1.5">
                This key is defined in your environment variable <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_ADMIN_SETUP_KEY</code>.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting || !setupKey}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Activating…' : 'Activate Admin'}
            </button>
          </form>
        )}

        <p className="text-xs text-gray-400 mt-6 text-center">
          Signed in as {user.phone || user.email || 'user'}.{' '}
          <Link href="/account" className="text-primary hover:text-accent transition-colors">
            Back to Account
          </Link>
        </p>
      </div>
    </div>
  );
}
