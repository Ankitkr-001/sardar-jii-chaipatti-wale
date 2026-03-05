'use client';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
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

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
