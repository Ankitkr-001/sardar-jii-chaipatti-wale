'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types';
import { onAuthStateChange, signOut as firebaseSignOut } from '@/lib/auth';
import { getUserById, createUser } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChange(async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
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
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
    return () => unsubscribe?.();
  }, []);

  const signOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setFirebaseUser(null);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    const { updateUser } = await import('@/lib/firestore');
    await updateUser(user.id, data);
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
