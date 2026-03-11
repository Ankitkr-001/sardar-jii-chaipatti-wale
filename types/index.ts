export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  categoryId: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  weight: string;
  origin: string;
  brewingTime: string;
  waterTemp: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  timestamp?: Date | string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  address: Address;
  createdAt: Date | string;
  updatedAt: Date | string;
  trackingSteps: TrackingStep[];
}

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'payment_captured' | 'order_cancelled';
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: Date | string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  method?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface SupportTicketResponse {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date | string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date | string;
  updatedAt: Date | string;
  responses: SupportTicketResponse[];
}

export interface WishlistItem {
  productId: string;
  addedAt: Date | string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  userName?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: Order[];
}
