import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');
    const isValid = expectedSignature === razorpay_signature;
    if (isValid) {
      return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
    }
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
