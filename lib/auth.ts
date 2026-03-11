'use client';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

let confirmationResult: ConfirmationResult | null = null;

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://sardarjichaipattiwale.com';

export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  });
  return recaptchaVerifier;
}

export async function sendOTP(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<void> {
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error) {
    throw error;
  }
}

export async function verifyOTP(otp: string): Promise<FirebaseUser> {
  if (!confirmationResult) {
    throw new Error('No OTP request found. Please request OTP first.');
  }
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    throw error;
  }
}

function getActionCodeSettings() {
  return {
    url: `${SITE_URL}/auth?verified=true`,
    handleCodeInApp: false,
  };
}

export async function signUpWithEmail(email: string, password: string, displayName?: string): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  await sendEmailVerification(result.user, getActionCodeSettings());
  // Sign out after signup so the account is inactive until verified
  await firebaseSignOut(auth);
  return result.user;
}

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (!result.user.emailVerified) {
    // Resend verification email before redirecting to verify page
    await sendEmailVerification(result.user, getActionCodeSettings());
    await firebaseSignOut(auth);
    const error = new Error('Please verify your email before logging in. A new verification email has been sent.');
    (error as Error & { code: string }).code = 'auth/email-not-verified';
    throw error;
  }
  return result.user;
}

export async function resendVerificationEmail(): Promise<void> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await sendEmailVerification(currentUser, getActionCodeSettings());
  } else {
    throw new Error('No user is currently signed in.');
  }
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
