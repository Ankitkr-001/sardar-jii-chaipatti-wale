'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfileForm() {
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({ name: form.name, email: form.email });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          placeholder="Enter your full name" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
          placeholder="Enter your email" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
        <input type="tel" value={user?.phone || ''} disabled
          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" />
        <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
      </div>
      <button type="submit" disabled={saving}
        className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
        {saving ? (
          <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Saving...</>
        ) : saved ? <>✓ Saved!</> : 'Save Changes'}
      </button>
    </form>
  );
}
