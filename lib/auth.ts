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
} from 'firebase/auth';
import { auth } from './firebase';

let confirmationResult: ConfirmationResult | null = null;

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

export async function signUpWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  return result.user;
}

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (!result.user.emailVerified) {
    await firebaseSignOut(auth);
    throw { code: 'auth/email-not-verified', message: 'Please verify your email before logging in.' };
  }
  return result.user;
}

export async function resendVerificationEmail(): Promise<void> {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await sendEmailVerification(currentUser);
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
