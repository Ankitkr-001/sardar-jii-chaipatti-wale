'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types';
import { onAuthStateChange, signOut as firebaseSignOut } from '@/lib/auth';
import { getUserById, createUser } from '@/lib/firestore';
import {
  getAccessToken as fetchAccessToken,
  getRefreshToken as fetchRefreshToken,
  clearStoredToken,
  setupTokenRefreshListener,
} from '@/lib/tokens';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  getAccessToken: (forceRefresh?: boolean) => Promise<string | null>;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signOut: async () => {},
  updateUserProfile: async () => {},
  getAccessToken: async () => null,
  getRefreshToken: () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshUnsub = useRef<(() => void) | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChange(async (fbUser) => {
        setFirebaseUser(fbUser);

        // Clean up previous token listener
        tokenRefreshUnsub.current?.();
        tokenRefreshUnsub.current = null;

        if (fbUser) {
          // For email/password users who haven't verified their email,
          // don't create Firestore user or set user state
          const isEmailProvider = fbUser.providerData.some(p => p.providerId === 'password');
          if (isEmailProvider && !fbUser.emailVerified) {
            setUser(null);
            setLoading(false);
            return;
          }

          // Set up token refresh listener for authenticated users
          tokenRefreshUnsub.current = setupTokenRefreshListener();

          try {
            let userData = await getUserById(fbUser.uid);
            if (!userData) {
              const newUser: Partial<User> = {
                id: fbUser.uid,
                phone: fbUser.phoneNumber || '',
                name: fbUser.displayName || '',
                email: fbUser.email || '',
                role: 'customer',
                addresses: [],
              };
              await createUser(fbUser.uid, newUser);
              userData = await getUserById(fbUser.uid);
            }
            setUser(userData);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          setUser(null);
          clearStoredToken();
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
    return () => {
      unsubscribe?.();
      tokenRefreshUnsub.current?.();
    };
  }, []);

  const signOut = useCallback(async () => {
    clearStoredToken();
    await firebaseSignOut();
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    const { updateUser } = await import('@/lib/firestore');
    await updateUser(user.id, data);
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, [user]);

  const getAccessToken = useCallback(async (forceRefresh = false) => {
    return fetchAccessToken(forceRefresh);
  }, []);

  const getRefreshToken = useCallback(() => {
    return fetchRefreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signOut,
        updateUserProfile,
        getAccessToken,
        getRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
