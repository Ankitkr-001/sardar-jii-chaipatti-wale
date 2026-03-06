'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { setupRecaptcha, sendOTP, verifyOTP } from '@/lib/auth';
import type { RecaptchaVerifier } from 'firebase/auth';

export default function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => { if (user) router.push('/account'); }, [user, router]);

  useEffect(() => {
    if (countdown > 0) { const t = setTimeout(() => setCountdown(c => c - 1), 1000); return () => clearTimeout(t); }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (!recaptchaRef.current) recaptchaRef.current = setupRecaptcha('recaptcha-container');
      await sendOTP(`+91${phone}`, recaptchaRef.current);
      setStep('otp'); setCountdown(30);
    } catch {
      setError('Failed to send OTP. Please check the phone number and try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await verifyOTP(otp);
      router.push('/account');
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
              <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M6 28 Q20 36 34 28" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark font-serif">Sardar Ji Chaipatti Wale</h1>
          <p className="text-gray-500 text-sm mt-1">{step === 'phone' ? 'Sign in with your phone number' : 'Enter the OTP sent to your phone'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100">{error}</div>}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="flex">
                <span className="flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-medium">+91</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="10-digit mobile number" maxLength={10} required />
              </div>
            </div>
            <div id="recaptcha-container" />
            <button type="submit" disabled={loading || phone.length !== 10}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <p className="text-center text-sm text-gray-500">
              New here?{' '}
              <Link href="/auth/signup" className="text-primary font-medium hover:text-accent transition-colors">
                Create an account
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-[0.5em] font-bold"
                placeholder="• • • • • •" maxLength={6} required />
              <p className="text-xs text-gray-400 mt-1.5 text-center">OTP sent to +91 {phone}</p>
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
              className="w-full text-primary text-sm font-medium hover:text-accent transition-colors">
              ← Change phone number
            </button>
            {countdown > 0 ? (
              <p className="text-center text-sm text-gray-400">Resend OTP in {countdown}s</p>
            ) : (
              <button type="button" onClick={handleSendOTP} className="w-full text-primary text-sm font-medium hover:text-accent">Resend OTP</button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
