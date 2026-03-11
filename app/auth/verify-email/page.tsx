'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { resendVerificationEmail } from '@/lib/auth';

function VerifyEmailContent() {
  const { firebaseUser } = useAuth();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';
  const displayEmail = firebaseUser?.email || emailFromParams;
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
      if (firebaseUser) {
        await resendVerificationEmail();
      } else {
        throw new Error('Please go back to login and try again to resend the verification email.');
      }
      setSuccess('Verification email resent! Please check your inbox and spam folder.');
      setCountdown(60);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification email. Please try again later.';
      setError(errorMessage);
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
          We&apos;ve sent a verification link to your email. Please click the link to activate your account.
        </p>
        {displayEmail && (
          <p className="text-primary font-medium text-sm mb-4">{displayEmail}</p>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-left">
          <p className="text-amber-800 text-sm font-medium mb-1">📌 Can&apos;t find the email?</p>
          <ul className="text-amber-700 text-xs space-y-1">
            <li>• Check your <strong>Spam</strong> or <strong>Junk</strong> folder</li>
            <li>• Look for an email from <strong>noreply@</strong> your Firebase project</li>
            <li>• The link in the email is clickable — tap or click it to verify</li>
          </ul>
        </div>

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
          {firebaseUser && (
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
          )}

          <Link
            href="/auth"
            className="block w-full border border-gray-200 text-gray-600 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors min-h-[48px] leading-[48px]"
          >
            Back to Login
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          After verifying your email, come back and sign in to access your account.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
