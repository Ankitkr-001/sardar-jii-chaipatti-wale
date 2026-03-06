'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { setupRecaptcha, sendOTP, verifyOTP, loginWithEmail, resetPassword } from '@/lib/auth';
import type { RecaptchaVerifier } from 'firebase/auth';

export default function AuthPage() {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email');
  const [step, setStep] = useState<'input' | 'otp' | 'forgot'>('input');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push('/account');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset link sent to your email.');
    } catch {
      setError('Failed to send reset email. Please check the email address.');
    } finally { setLoading(false); }
  };

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
          <h1 className="text-xl sm:text-2xl font-bold text-dark font-serif">Sardar Ji Chaipatti Wale</h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'forgot' ? 'Reset your password' : 'Sign in to your account'}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100" role="alert">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4 border border-green-100" role="status">{success}</div>}

        {step === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                placeholder="Enter your email" required autoComplete="email" />
            </div>
            <button type="submit" disabled={loading || !email.trim()}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => { setStep('input'); setError(''); setSuccess(''); }}
              className="w-full text-primary text-sm font-medium hover:text-accent transition-colors min-h-[44px]">
              ← Back to login
            </button>
          </form>
        ) : step === 'otp' ? (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
              <input id="otp-input" type="text" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-center text-2xl tracking-[0.5em] font-bold"
                placeholder="• • • • • •" maxLength={6} required autoComplete="one-time-code" />
              <p className="text-xs text-gray-400 mt-1.5 text-center">OTP sent to +91 {phone}</p>
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => { setStep('input'); setOtp(''); setError(''); }}
              className="w-full text-primary text-sm font-medium hover:text-accent transition-colors min-h-[44px]">
              ← Change phone number
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
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                    placeholder="Enter your email" required autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                      placeholder="Enter your password" required autoComplete="current-password" />
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
                <button type="button" onClick={() => { setStep('forgot'); setError(''); setSuccess(''); }}
                  className="text-sm text-primary hover:text-accent font-medium transition-colors">
                  Forgot password?
                </button>
                <button type="submit" disabled={loading || !email.trim() || !password.trim()}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label htmlFor="login-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="flex">
                    <span className="flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-medium">+91</span>
                    <input id="login-phone" type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base"
                      placeholder="10-digit mobile number" maxLength={10} required autoComplete="tel" />
                  </div>
                </div>
                <div id="recaptcha-container" />
                <button type="submit" disabled={loading || phone.length !== 10}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[48px]">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              New here?{' '}
              <Link href="/auth/signup" className="text-primary font-medium hover:text-accent transition-colors">
                Create an account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
