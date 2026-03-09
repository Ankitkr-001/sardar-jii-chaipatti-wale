'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { setupRecaptcha, sendOTP, verifyOTP, signUpWithEmail } from '@/lib/auth';
import type { RecaptchaVerifier } from 'firebase/auth';

export default function SignUpPage() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();

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
      // After OTP verification, AuthContext auto-creates the user in Firestore.
      // Store name/email so the effect below can update the profile once user is ready.
      pendingProfileRef.current = { name, email };
    } catch {
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    try {
      await signUpWithEmail(email, password, name);
      // After signup, Firebase sends verification email automatically.
      // Store profile data for when user verifies and logs in.
      pendingProfileRef.current = { name, email };
      router.push('/auth/verify-email');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  // Once AuthContext sets the user after auth, update profile with collected name/email
  const pendingProfileRef = useRef<{ name: string; email: string } | null>(null);
  useEffect(() => {
    if (user && pendingProfileRef.current) {
      const profileData = pendingProfileRef.current;
      pendingProfileRef.current = null;
      updateUserProfile(profileData)
        .catch(() => { /* user can complete profile later */ })
        .finally(() => router.push('/account'));
    }
  }, [user, updateUserProfile, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9" fill="none" aria-hidden="true">
              <path d="M8 28 C8 28 10 16 20 14 C30 12 32 22 32 22" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M6 28 Q20 36 34 28" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark font-serif">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'otp'
              ? 'Enter the OTP sent to your phone'
              : 'Join Sardar Ji Chaipatti Wale'}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100" role="alert">{error}</div>}

        {step === 'otp' ? (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="signup-otp" className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <input
                id="signup-otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-[0.5em] font-bold"
                placeholder="• • • • • •"
                maxLength={6}
                required
                autoComplete="one-time-code"
              />
              <p className="text-xs text-gray-400 mt-1.5 text-center">OTP sent to +91 {phone}</p>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]"
            >
              {loading ? 'Creating account...' : 'Verify & Create Account'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('details'); setOtp(''); setError(''); }}
              className="w-full text-primary text-sm font-medium hover:text-accent transition-colors min-h-[44px]"
            >
              ← Back to details
            </button>
            {countdown > 0 ? (
              <p className="text-center text-sm text-gray-400">Resend OTP in {countdown}s</p>
            ) : (
              <button type="button" onClick={handleSendOTP} className="w-full text-primary text-sm font-medium hover:text-accent min-h-[44px]">Resend OTP</button>
            )}
          </form>
        ) : (
          <>
            {/* Auth method toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6" role="tablist">
              <button
                role="tab"
                aria-selected={authMethod === 'email'}
                onClick={() => { setAuthMethod('email'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                  authMethod === 'email' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Email
              </button>
              <button
                role="tab"
                aria-selected={authMethod === 'phone'}
                onClick={() => { setAuthMethod('phone'); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                  authMethod === 'phone' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Phone
              </button>
            </div>

            {authMethod === 'email' ? (
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label htmlFor="signup-name-email" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    id="signup-name-email"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !email.trim() || password.length < 6}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label htmlFor="signup-name-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    id="signup-name-phone"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email-optional" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    id="signup-email-optional"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-medium">+91</span>
                    <input
                      id="signup-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div id="recaptcha-container" />
                <button
                  type="submit"
                  disabled={loading || phone.length !== 10 || !name.trim()}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? 'Sending OTP...' : 'Sign Up & Send OTP'}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/auth" className="text-primary font-medium hover:text-accent transition-colors">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
