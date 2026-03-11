'use client';

import { getIdToken, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';

const TOKEN_STORAGE_KEY = 'sardarji_access_token';
const TOKEN_EXPIRY_KEY = 'sardarji_token_expiry';

/**
 * Get a fresh Firebase ID token (access token).
 * Firebase SDK automatically refreshes the token using the refresh token
 * when the current ID token is expired.
 */
export async function getAccessToken(forceRefresh = false): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    // Check if cached token is still valid (with 5 min buffer)
    if (!forceRefresh) {
      const cached = getStoredToken();
      if (cached) return cached;
    }

    // Get a fresh token (Firebase handles refresh token internally)
    const token = await getIdToken(user, forceRefresh);
    storeToken(token);
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    clearStoredToken();
    return null;
  }
}

/**
 * Get the refresh token from the current Firebase user.
 * Firebase manages refresh tokens internally - this exposes it for reference.
 */
export function getRefreshToken(): string | null {
  const user = auth.currentUser;
  if (!user) return null;
  return user.refreshToken || null;
}

/**
 * Store the access token with expiry in sessionStorage.
 * Firebase ID tokens are valid for 1 hour; we cache for 55 minutes.
 */
function storeToken(token: string): void {
  try {
    const expiresAt = Date.now() + 55 * 60 * 1000; // 55 minutes
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
  } catch {
    // sessionStorage not available (SSR)
  }
}

/**
 * Get the stored access token if it hasn't expired.
 */
function getStoredToken(): string | null {
  try {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!token || !expiry) return null;
    if (Date.now() > parseInt(expiry, 10)) {
      clearStoredToken();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

/**
 * Clear stored tokens on logout.
 */
export function clearStoredToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch {
    // sessionStorage not available
  }
}

/**
 * Create an Authorization header with the access token.
 * Use this when making authenticated API calls.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Listen for token changes and keep the stored token fresh.
 */
export function setupTokenRefreshListener(user: FirebaseUser): () => void {
  // Firebase auth emits ID token changes automatically
  const unsubscribe = auth.onIdTokenChanged(async (fbUser) => {
    if (fbUser) {
      const token = await getIdToken(fbUser);
      storeToken(token);
    } else {
      clearStoredToken();
    }
  });
  return unsubscribe;
}
