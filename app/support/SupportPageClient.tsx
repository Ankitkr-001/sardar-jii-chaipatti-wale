'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import FAQ from '@/components/support/FAQ';
import TicketForm from '@/components/support/TicketForm';
import TicketList from '@/components/support/TicketList';
import { SupportTicket } from '@/types';

const mockTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    userId: 'demo',
    subject: 'Order not received after 7 days',
    message: 'My order ORD-1716000000-AB123 was placed 7 days ago but I have not received it yet.',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    responses: [{ id: 'r1', message: 'We have investigated and your order has been delivered. Please check with your building security.', isAdmin: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() }],
  },
  {
    id: 'ticket-2',
    userId: 'demo',
    subject: 'Wrong tea variety sent',
    message: 'I ordered Kashmiri Kahwa but received Darjeeling First Flush.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    responses: [],
  },
];

const contactInfo = [
  { icon: '📧', title: 'Email Support', value: 'support@sardarjicha.com', desc: 'Get response within 24 hours' },
  { icon: '📞', title: 'Phone Support', value: '+91 98765 43210', desc: 'Mon–Sat, 9 AM – 6 PM IST' },
  { icon: '💬', title: 'Live Chat', value: 'Available on website', desc: 'Instant help during working hours' },
];

export default function SupportPageClient() {
  const { user } = useAuth();

  const handleTicketSubmit = async (data: { subject: string; message: string; priority: 'low' | 'medium' | 'high' }) => {
    // In production, this would call Firestore to create a ticket
    console.log('Ticket submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🎫</div>
          <h1 className="text-4xl font-bold font-serif mb-4">How Can We Help You?</h1>
          <p className="text-white/70 text-lg">
            Our support team is ready to assist you with orders, products, and anything else you need.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactInfo.map(info => (
            <div key={info.title} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center">
              <div className="text-3xl mb-3">{info.icon}</div>
              <div className="font-bold text-dark text-sm mb-1">{info.title}</div>
              <div className="text-primary font-semibold text-sm mb-1">{info.value}</div>
              <div className="text-gray-400 text-xs">{info.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* FAQ */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark font-serif mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Find answers to the most common questions about our products and services.</p>
          </div>
          <FAQ />
        </section>

        {/* Submit ticket */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-dark font-serif mb-2">Submit a Support Ticket</h2>
              <p className="text-gray-500 mb-6">
                Can&apos;t find your answer in the FAQs? Submit a ticket and our team will get back to you within 24 hours.
              </p>
              {!user && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-700">
                  💡 <strong>Tip:</strong> Sign in to track your support tickets and get faster responses.
                </div>
              )}
              <TicketForm onSubmit={handleTicketSubmit} />
            </div>
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <span>⏱️</span> Response Times
              </h3>
              <div className="space-y-3">
                {[
                  { priority: 'High Priority', time: '2-4 hours', color: 'text-red-600 bg-red-50' },
                  { priority: 'Medium Priority', time: '12-24 hours', color: 'text-orange-600 bg-orange-50' },
                  { priority: 'Low Priority', time: '1-3 business days', color: 'text-gray-600 bg-gray-100' },
                ].map(item => (
                  <div key={item.priority} className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.color}`}>{item.priority}</span>
                    <span className="text-sm text-gray-600">{item.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-primary/10">
                <h4 className="font-semibold text-dark text-sm mb-2">Working Hours</h4>
                <p className="text-gray-500 text-sm">Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
                <p className="text-gray-400 text-xs mt-1">Closed on Sundays and national holidays</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket history (demo) */}
        {user && (
          <section>
            <h2 className="text-2xl font-bold text-dark font-serif mb-6">Your Support Tickets</h2>
            <TicketList tickets={mockTickets} />
          </section>
        )}
      </div>
    </div>
  );
}
