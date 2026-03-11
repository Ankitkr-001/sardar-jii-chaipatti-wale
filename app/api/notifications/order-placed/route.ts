import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  total: number;
  itemCount: number;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: OrderNotificationPayload = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!adminEmail || !smtpHost || !smtpUser || !smtpPass) {
      console.warn('Email notification skipped: SMTP not configured. Set ADMIN_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS environment variables.');
      return NextResponse.json({ emailSent: false, reason: 'SMTP not configured' });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(payload.total);

    await transporter.sendMail({
      from: `"Sardar Ji Chaipatti Wale" <${smtpUser}>`,
      to: adminEmail,
      subject: `🛒 New Order Received - ${payload.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0F2E25; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Order Received!</h1>
          </div>
          <div style="padding: 20px; background-color: #F5F1E8;">
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <h2 style="color: #0F2E25; margin-top: 0;">Order Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666;">Order ID</td><td style="padding: 8px 0; font-weight: bold; text-align: right;">${payload.orderId}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0; font-weight: bold; text-align: right;">${payload.customerName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0; text-align: right;">${payload.customerPhone}</td></tr>
                ${payload.customerEmail ? `<tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; text-align: right;">${payload.customerEmail}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; color: #666;">Items</td><td style="padding: 8px 0; text-align: right;">${payload.itemCount} item(s)</td></tr>
                <tr style="border-top: 2px solid #C9A227;"><td style="padding: 12px 0; color: #0F2E25; font-weight: bold; font-size: 18px;">Total</td><td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #0F2E25; text-align: right;">${formattedTotal}</td></tr>
              </table>
            </div>
            <div style="background: white; border-radius: 12px; padding: 20px;">
              <h3 style="color: #0F2E25; margin-top: 0;">Delivery Address</h3>
              <p style="color: #444; line-height: 1.6; margin: 0;">
                ${payload.address.line1}<br>
                ${payload.address.city}, ${payload.address.state} - ${payload.address.pincode}
              </p>
            </div>
          </div>
          <div style="background-color: #0F2E25; color: #C9A227; padding: 16px; text-align: center; font-size: 14px;">
            Sardar Ji Chaipatti Wale - Admin Notification
          </div>
        </div>
      `,
    });

    return NextResponse.json({ emailSent: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ emailSent: false, error: 'Failed to send notification' }, { status: 500 });
  }
}
