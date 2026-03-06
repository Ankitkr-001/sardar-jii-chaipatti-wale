'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { resendVerificationEmail } from '@/lib/auth';

export default function VerifyEmailPage() {
  const { firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await resendVerificationEmail();
      setSuccess('Verification email resent! Please check your inbox.');
      setCountdown(60);
    } catch {
      setError('Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-dark font-serif mb-3">Verification Email Sent</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-2">
          Please verify your email to activate your account.
        </p>
        {firebaseUser?.email && (
          <p className="text-primary font-medium text-sm mb-6">{firebaseUser.email}</p>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4 border border-green-100" role="status">
            {success}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={loading || countdown > 0}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]"
          >
            {loading
              ? 'Sending...'
              : countdown > 0
              ? `Resend in ${countdown}s`
              : 'Resend Verification Email'}
          </button>

          <Link
            href="/auth"
            className="block w-full border border-gray-200 text-gray-600 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors min-h-[48px] leading-[48px]"
          >
            Back to Login
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Didn&apos;t receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
