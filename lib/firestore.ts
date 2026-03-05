import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  Product,
  Category,
  Order,
  OrderStatus,
  Address,
  SupportTicket,
  WishlistItem,
  Review,
  AdminStats,
} from '@/types';

// Users
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(userId: string, userData: Partial<User>): Promise<void> {
  try {
    const { setDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        ...userData,
        role: userData.role ?? 'customer',
        addresses: userData.addresses ?? [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Products
export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Product));
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Product));
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
}

export async function createProduct(productData: Omit<Product, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(
  productId: string,
  productData: Partial<Product>
): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { ...productData, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Category));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(
  categoryId: string,
  categoryData: Partial<Category>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'categories', categoryId), categoryData);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Orders
export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order));
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order));
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Addresses
export async function getAddressesByUser(userId: string): Promise<Address[]> {
  try {
    const user = await getUserById(userId);
    return user?.addresses || [];
  } catch (error) {
    console.error('Error getting addresses:', error);
    return [];
  }
}

export async function addAddress(userId: string, address: Omit<Address, 'id'>): Promise<void> {
  try {
    const user = await getUserById(userId);
    const newAddress = { ...address, id: `addr-${Date.now()}` };
    const addresses = [...(user?.addresses || []), newAddress];
    await updateUser(userId, { addresses });
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
}

export async function updateAddress(
  userId: string,
  addressId: string,
  addressData: Partial<Address>
): Promise<void> {
  try {
    const user = await getUserById(userId);
    const addresses = (user?.addresses || []).map(addr =>
      addr.id === addressId ? { ...addr, ...addressData } : addr
    );
    await updateUser(userId, { addresses });
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}

export async function deleteAddress(userId: string, addressId: string): Promise<void> {
  try {
    const user = await getUserById(userId);
    const addresses = (user?.addresses || []).filter(addr => addr.id !== addressId);
    await updateUser(userId, { addresses });
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

// Support Tickets
export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const q = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      docSnap => ({ id: docSnap.id, ...docSnap.data() } as SupportTicket)
    );
  } catch (error) {
    console.error('Error getting support tickets:', error);
    return [];
  }
}

export async function createSupportTicket(
  ticketData: Omit<SupportTicket, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'support_tickets'), {
      ...ticketData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: SupportTicket['status']
): Promise<void> {
  try {
    await updateDoc(doc(db, 'support_tickets', ticketId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
}

// Wishlist
export async function getWishlistByUser(userId: string): Promise<WishlistItem[]> {
  try {
    const q = query(collection(db, 'wishlists'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => docSnap.data() as WishlistItem);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  try {
    await addDoc(collection(db, 'wishlists'), {
      userId,
      productId,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, 'wishlists', docSnap.id));
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
}

// Reviews
export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Review));
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export async function addReview(reviewData: Omit<Review, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

// Admin Stats
export async function getStats(): Promise<AdminStats> {
  try {
    const [ordersSnapshot, usersSnapshot, productsSnapshot] = await Promise.all([
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'products')),
    ]);

    const orders = ordersSnapshot.docs.map(
      docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order)
    );
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, o) => sum + o.total, 0);

    const recentOrdersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const recentOrdersSnap = await getDocs(recentOrdersQuery);
    const recentOrders = recentOrdersSnap.docs.map(
      docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order)
    );

    return {
      totalOrders: ordersSnapshot.size,
      totalRevenue,
      totalUsers: usersSnapshot.size,
      totalProducts: productsSnapshot.size,
      recentOrders,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalUsers: 0,
      totalProducts: 0,
      recentOrders: [],
    };
  }
}
