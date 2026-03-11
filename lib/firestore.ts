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
  Testimonial,
  FAQItem,
  AdminStats,
  AdminNotification,
} from '@/types';
import { appCache, CacheKeys } from './cache';

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
  const cached = appCache.get<Product[]>(CacheKeys.PRODUCTS);
  if (cached) return cached;
  try {
    const q = query(collection(db, 'products'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Product));
    appCache.set(CacheKeys.PRODUCTS, products, 300);
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  const cacheKey = CacheKeys.PRODUCT_DETAIL(productId);
  const cached = appCache.get<Product>(cacheKey);
  if (cached) return cached;
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const product = { id: docSnap.id, ...docSnap.data() } as Product;
      appCache.set(cacheKey, product, 300);
      return product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Check if the product is already in the products cache
  const cachedProducts = appCache.get<Product[]>(CacheKeys.PRODUCTS);
  if (cachedProducts) {
    const found = cachedProducts.find(p => p.slug === slug && p.isActive);
    if (found) return found;
  }
  try {
    const q = query(
      collection(db, 'products'),
      where('slug', '==', slug),
      where('isActive', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const product = { id: docSnap.id, ...docSnap.data() } as Product;
      appCache.set(CacheKeys.PRODUCT_DETAIL(product.id), product, 300);
      return product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product by slug:', error);
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
    appCache.invalidate(CacheKeys.PRODUCTS);
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
    appCache.invalidate(CacheKeys.PRODUCTS);
    appCache.invalidate(CacheKeys.PRODUCT_DETAIL(productId));
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
    appCache.invalidate(CacheKeys.PRODUCTS);
    appCache.invalidate(CacheKeys.PRODUCT_DETAIL(productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const cached = appCache.get<Category[]>(CacheKeys.CATEGORIES);
  if (cached) return cached;
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Category));
    appCache.set(CacheKeys.CATEGORIES, categories, 600);
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    appCache.invalidate(CacheKeys.CATEGORIES);
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
    appCache.invalidate(CacheKeys.CATEGORIES);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    appCache.invalidate(CacheKeys.CATEGORIES);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Orders
export async function getOrders(): Promise<Order[]> {
  const cached = appCache.get<Order[]>(CacheKeys.ALL_ORDERS);
  if (cached) return cached;
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order));
    appCache.set(CacheKeys.ALL_ORDERS, orders, 120);
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const cacheKey = CacheKeys.USER_ORDERS(userId);
  const cached = appCache.get<Order[]>(cacheKey);
  if (cached) return cached;
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order));
    appCache.set(cacheKey, orders, 120);
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const cacheKey = CacheKeys.ORDER_DETAIL(orderId);
  const cached = appCache.get<Order>(cacheKey);
  if (cached) return cached;
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const order = { id: docSnap.id, ...docSnap.data() } as Order;
      appCache.set(cacheKey, order, 120);
      return order;
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
    appCache.invalidate(CacheKeys.ALL_ORDERS);
    appCache.invalidatePattern('^orders_');
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
    appCache.invalidate(CacheKeys.ALL_ORDERS);
    appCache.invalidate(CacheKeys.ORDER_DETAIL(orderId));
    appCache.invalidatePattern('^orders_');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('razorpayOrderId', '==', razorpayOrderId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order by Razorpay order ID:', error);
    return null;
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
  const cached = appCache.get<SupportTicket[]>(CacheKeys.ALL_TICKETS);
  if (cached) return cached;
  try {
    const q = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map(
      docSnap => ({ id: docSnap.id, ...docSnap.data() } as SupportTicket)
    );
    appCache.set(CacheKeys.ALL_TICKETS, tickets, 120);
    return tickets;
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
    appCache.invalidate(CacheKeys.ALL_TICKETS);
    appCache.invalidatePattern('^tickets_');
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
    appCache.invalidate(CacheKeys.ALL_TICKETS);
    appCache.invalidatePattern('^tickets_');
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
  const cached = appCache.get<AdminStats>(CacheKeys.ADMIN_STATS);
  if (cached) return cached;
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

    const stats = {
      totalOrders: ordersSnapshot.size,
      totalRevenue,
      totalUsers: usersSnapshot.size,
      totalProducts: productsSnapshot.size,
      recentOrders,
    };
    appCache.set(CacheKeys.ADMIN_STATS, stats, 120);
    return stats;
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

// All Users (Admin)
export async function getAllUsers(): Promise<User[]> {
  const cached = appCache.get<User[]>(CacheKeys.ALL_USERS);
  if (cached) return cached;
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as User));
    appCache.set(CacheKeys.ALL_USERS, users, 120);
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const cached = appCache.get<Testimonial[]>(CacheKeys.TESTIMONIALS);
  if (cached) return cached;
  try {
    const querySnapshot = await getDocs(collection(db, 'testimonials'));
    const testimonials = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Testimonial));
    appCache.set(CacheKeys.TESTIMONIALS, testimonials, 600);
    return testimonials;
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
}

// FAQ Items
export async function getFAQItems(): Promise<FAQItem[]> {
  const cached = appCache.get<FAQItem[]>(CacheKeys.FAQ_ITEMS);
  if (cached) return cached;
  try {
    const querySnapshot = await getDocs(collection(db, 'faq_items'));
    const items = querySnapshot.docs.map(docSnap => ({ ...docSnap.data() } as FAQItem));
    appCache.set(CacheKeys.FAQ_ITEMS, items, 600);
    return items;
  } catch (error) {
    console.error('Error getting FAQ items:', error);
    return [];
  }
}

// Support Tickets by User
export async function getSupportTicketsByUser(userId: string): Promise<SupportTicket[]> {
  const cacheKey = CacheKeys.USER_TICKETS(userId);
  const cached = appCache.get<SupportTicket[]>(cacheKey);
  if (cached) return cached;
  try {
    const q = query(
      collection(db, 'support_tickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map(
      docSnap => ({ id: docSnap.id, ...docSnap.data() } as SupportTicket)
    );
    appCache.set(cacheKey, tickets, 120);
    return tickets;
  } catch (error) {
    console.error('Error getting user support tickets:', error);
    return [];
  }
}

// Revenue Data (for admin chart)
export interface RevenueDataPoint {
  day: string;
  revenue: number;
}

export async function getRevenueData(days = 7): Promise<RevenueDataPoint[]> {
  const cached = appCache.get<RevenueDataPoint[]>(CacheKeys.REVENUE_DATA);
  if (cached) return cached;
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      collection(db, 'orders'),
      where('status', 'not-in', ['cancelled', 'refunded']),
      orderBy('status'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Order));

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueMap = new Map<string, number>();

    // Initialize last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = dayNames[date.getDay()];
      revenueMap.set(`${dayKey}_${i}`, 0);
    }

    // Aggregate revenue by day
    for (const order of orders) {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startDate) {
        const daysDiff = Math.floor((Date.now() - orderDate.getTime()) / 86400000);
        if (daysDiff < days) {
          const dayKey = dayNames[orderDate.getDay()];
          const mapKey = `${dayKey}_${daysDiff}`;
          revenueMap.set(mapKey, (revenueMap.get(mapKey) || 0) + order.total);
        }
      }
    }

    const result: RevenueDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = dayNames[date.getDay()];
      const mapKey = `${dayKey}_${i}`;
      result.push({ day: dayKey, revenue: revenueMap.get(mapKey) || 0 });
    }

    appCache.set(CacheKeys.REVENUE_DATA, result, 300);
    return result;
  } catch (error) {
    console.error('Error getting revenue data:', error);
    return [];
  }
}

// Admin Notifications
export async function createNotification(
  notification: Omit<AdminNotification, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function getAdminNotifications(limitCount = 20): Promise<AdminNotification[]> {
  try {
    const q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as AdminNotification));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}
