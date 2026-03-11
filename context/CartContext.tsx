'use client';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD, TAX_RATE } from '@/lib/constants';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartSubtotal: number;
  shippingCost: number;
  tax: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  loading: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  cartSubtotal: 0,
  shippingCost: 0,
  tax: 0,
});

const CART_STORAGE_KEY = 'sardarji_cart';

function getCartKey(userId?: string): string {
  return userId ? `${CART_STORAGE_KEY}_${userId}` : CART_STORAGE_KEY;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const prevUserIdRef = useRef<string | null>(null);
  const firestoreSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load cart when user changes (login/logout)
  useEffect(() => {
    const currentUserId = user?.id || null;
    const prevUserId = prevUserIdRef.current;

    // Save current cart for the previous user before switching
    if (prevUserId && prevUserId !== currentUserId && cartItems.length > 0) {
      try {
        localStorage.setItem(getCartKey(prevUserId), JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart for previous user:', error);
      }
    }

    // Load cart for the current user
    try {
      const stored = localStorage.getItem(getCartKey(currentUserId || undefined));
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else if (currentUserId && currentUserId !== prevUserId) {
        // New user logged in with no cart - load from Firestore
        loadCartFromFirestore(currentUserId);
      } else if (!currentUserId) {
        // Logged out - load guest cart
        const guestCart = localStorage.getItem(CART_STORAGE_KEY);
        setCartItems(guestCart ? JSON.parse(guestCart) : []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }

    prevUserIdRef.current = currentUserId;
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Save cart to localStorage and sync to Firestore whenever it changes
  useEffect(() => {
    if (loading) return;
    try {
      const key = getCartKey(user?.id);
      localStorage.setItem(key, JSON.stringify(cartItems));
      // Also save to guest key as fallback
      if (user?.id) {
        // Debounced Firestore sync for logged-in users
        if (firestoreSyncRef.current) clearTimeout(firestoreSyncRef.current);
        firestoreSyncRef.current = setTimeout(() => {
          saveCartToFirestore(user.id, cartItems);
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems, user?.id, loading]);

  async function loadCartFromFirestore(userId: string) {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const cartDoc = await getDoc(doc(db, 'carts', userId));
      if (cartDoc.exists()) {
        const data = cartDoc.data();
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setCartItems(data.items);
          localStorage.setItem(getCartKey(userId), JSON.stringify(data.items));
        }
      }
    } catch (error) {
      console.error('Error loading cart from Firestore:', error);
    }
  }

  async function saveCartToFirestore(userId: string, items: CartItem[]) {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await setDoc(doc(db, 'carts', userId), {
        items,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  }

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    const key = getCartKey(user?.id);
    localStorage.removeItem(key);
    if (user?.id) {
      saveCartToFirestore(user.id, []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(cartSubtotal * TAX_RATE);
  const cartTotal = cartSubtotal + shippingCost + tax;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartSubtotal,
        shippingCost,
        tax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
