'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { Address, Order } from '@/types';
import { RazorpayOptions, RazorpayResponse } from '@/lib/razorpay';
import AddressSelector from '@/components/checkout/AddressSelector';
import PaymentSection from '@/components/checkout/PaymentSection';
import OrderSummary from '@/components/cart/OrderSummary';
import { formatPrice, generateOrderId } from '@/lib/utils';

type Step = 'address' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, cartSubtotal, shippingCost, tax, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Partial<Order> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
      const def = user.addresses.find(a => a.isDefault);
      if (def) setSelectedAddress(def);
    }
  }, [user]);

  useEffect(() => {
    // Load Razorpay checkout.js
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  if (cartItems.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-dark mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some teas before checking out.</p>
          <Link href="/products" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Browse Teas
          </Link>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = (newAddr: Omit<Address, 'id'>) => {
    const addr: Address = { ...newAddr, id: `addr-${Date.now()}` };
    const updated = newAddr.isDefault
      ? [...addresses.map(a => ({ ...a, isDefault: false })), addr]
      : [...addresses, addr];
    setAddresses(updated);
    setSelectedAddress(addr);
  };

  const handlePay = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address.', 'warning');
      return;
    }
    setPaymentLoading(true);
    try {
      // Create Razorpay order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal, receipt: generateOrderId() }),
      });
      const data = await res.json();
      if (!data.orderId) throw new Error('Failed to create payment order');

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: data.currency,
        name: 'Sardar Ji Chaipatti Wale',
        description: `Order for ${cartItems.length} item(s)`,
        order_id: data.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const order: Partial<Order> = {
                id: generateOrderId(),
                userId: user.id,
                items: cartItems.map(i => ({ product: i.product, quantity: i.quantity, price: i.product.price })),
                subtotal: cartSubtotal,
                shipping: shippingCost,
                tax,
                total: cartTotal,
                status: 'confirmed',
                paymentId: verifyData.paymentId,
                address: selectedAddress,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                trackingSteps: [],
              };
              setConfirmedOrder(order);
              clearCart();
              setStep('confirmation');
            } else {
              showToast('Payment verification failed. Please contact support.', 'error');
            }
          } catch {
            showToast('An error occurred during payment verification.', 'error');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || '',
        },
        theme: { color: '#0F2E25' },
        modal: { ondismiss: () => setPaymentLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Failed to initiate payment. Please try again.', 'error');
      setPaymentLoading(false);
    } finally {
      setPaymentLoading(false);
    }
  };

  const STEPS: { key: Step; label: string; num: number }[] = [
    { key: 'address', label: 'Address', num: 1 },
    { key: 'payment', label: 'Payment', num: 2 },
    { key: 'confirmation', label: 'Confirmation', num: 3 },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-dark font-medium">Checkout</span>
        </nav>

        {/* Step Indicator */}
        {step !== 'confirmation' && (
          <div className="flex items-center justify-center mb-10">
            {STEPS.slice(0, 2).map((s, idx) => (
              <React.Fragment key={s.key}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step === s.key ? 'bg-primary text-white' : s.num < STEPS.findIndex(x => x.key === step) + 1 ? 'bg-accent text-dark' : 'bg-gray-200 text-gray-500'
                  }`}>{s.num}</div>
                  <span className={`text-sm font-medium ${step === s.key ? 'text-dark' : 'text-gray-400'}`}>{s.label}</span>
                </div>
                {idx < 1 && <div className="w-16 h-0.5 bg-gray-200 mx-3" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {step === 'address' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-dark text-xl mb-6">Delivery Address</h2>
                <AddressSelector
                  addresses={addresses}
                  selectedId={selectedAddress?.id || ''}
                  onSelect={setSelectedAddress}
                  onAddNew={handleAddNewAddress}
                />
                <button
                  onClick={() => {
                    if (!selectedAddress) { showToast('Please select or add an address.', 'warning'); return; }
                    setStep('payment');
                  }}
                  className="mt-6 w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <OrderSummary showCheckoutButton={false} />
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery info */}
              {selectedAddress && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Delivering to</div>
                    <div className="font-semibold text-dark">{selectedAddress.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </div>
                  </div>
                  <button onClick={() => setStep('address')} className="text-primary text-sm font-medium hover:text-accent transition-colors">Change</button>
                </div>
              )}
              <PaymentSection total={cartTotal} onPay={handlePay} loading={paymentLoading} />
            </div>
            <div className="lg:col-span-1">
              <OrderSummary showCheckoutButton={false} />
            </div>
          </div>
        )}

        {step === 'confirmation' && confirmedOrder && (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">Order Confirmed! 🎉</h2>
              <p className="text-gray-500 mb-6">
                Thank you for your order. Your premium teas are on their way!
              </p>
              <div className="bg-background rounded-2xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-semibold text-dark">#{confirmedOrder.id?.slice(-10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-bold text-primary">{formatPrice(confirmedOrder.total || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-medium text-dark text-xs">{confirmedOrder.paymentId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Delivery</span>
                  <span className="font-medium text-dark">3-5 Business Days</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/account/orders"
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-center"
                >
                  Track Order
                </Link>
                <Link
                  href="/products"
                  className="flex-1 border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors text-center"
                >
                  Shop More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
