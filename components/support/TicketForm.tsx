'use client';
import React, { useState } from 'react';

interface TicketFormProps {
  onSubmit: (data: { subject: string; message: string; priority: 'low' | 'medium' | 'high' }) => Promise<void>;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [form, setForm] = useState({ subject: '', message: '', priority: 'medium' as 'low' | 'medium' | 'high' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      setSubmitted(true);
      setForm({ subject: '', message: '', priority: 'medium' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-100">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-green-700 mb-2">Ticket Submitted!</h3>
        <p className="text-sm text-green-600 mb-4">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="text-primary text-sm font-medium hover:text-accent transition-colors">
          Submit Another Ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
        <input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          placeholder="Brief description of your issue" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
        <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as 'low' | 'medium' | 'high' }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white">
          <option value="low">Low - General inquiry</option>
          <option value="medium">Medium - Need help soon</option>
          <option value="high">High - Urgent issue</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
        <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white resize-none"
          placeholder="Describe your issue in detail..." />
      </div>
      <button type="submit" disabled={submitting}
        className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
        {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Submitting...</> : 'Submit Ticket'}
      </button>
    </form>
  );
}
