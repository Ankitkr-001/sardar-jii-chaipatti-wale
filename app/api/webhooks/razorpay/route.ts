import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrderByRazorpayOrderId, updateOrderStatus } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    const event = JSON.parse(body);
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      console.log('Payment captured:', payment.id, payment.order_id);

      // Update order status in Firestore
      try {
        const order = await getOrderByRazorpayOrderId(payment.order_id);
        if (order) {
          // Only update if order is still in pending state
          if (order.status === 'pending') {
            await updateOrderStatus(order.id, 'confirmed');
            console.log(`Order ${order.id} status updated to confirmed via webhook`);
          }
        } else {
          console.warn(`No order found for Razorpay order ID: ${payment.order_id}`);
        }
      } catch (dbError) {
        console.error('Error updating order from webhook:', dbError);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
