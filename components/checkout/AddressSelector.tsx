'use client';
import React, { useState } from 'react';
import { Address } from '@/types';

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: string;
  onSelect: (address: Address) => void;
  onAddNew: (address: Omit<Address, 'id'>) => void;
}

export default function AddressSelector({ addresses, selectedId, onSelect, onAddNew }: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false,
  });

  const handlePincodeChange = async (pincode: string) => {
    setForm(p => ({ ...p, pincode }));
    if (pincode.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setForm(p => ({
            ...p,
            city: postOffice.District || p.city,
            state: postOffice.State || p.state,
          }));
        }
      } catch {
        // Silently fail - user can still enter manually
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNew(form);
    setShowForm(false);
    setForm({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
  };

  const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh'];

  return (
    <div>
      {addresses.length > 0 && (
        <div className="space-y-3 mb-6">
          {addresses.map(address => (
            <div
              key={address.id}
              onClick={() => onSelect(address)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedId === address.id
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  selectedId === address.id ? 'border-primary bg-primary' : 'border-gray-300'
                }`} />
                <div>
                  <div className="font-semibold text-dark text-sm">{address.name}</div>
                  <div className="text-gray-500 text-sm">{address.phone}</div>
                  <div className="text-gray-600 text-sm mt-1">
                    {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} - {address.pincode}
                  </div>
                  {address.isDefault && (
                    <span className="inline-block mt-1 text-xs text-accent font-medium">Default Address</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 text-primary font-medium text-sm hover:text-accent transition-colors mb-4"
      >
        <span className="text-lg">{showForm ? '−' : '+'}</span>
        {showForm ? 'Cancel' : 'Add New Address'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" placeholder="Enter full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" placeholder="10-digit mobile" maxLength={10} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
            <input required value={form.line1} onChange={e => setForm(p => ({ ...p, line1: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" placeholder="House no, Street name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input value={form.line2} onChange={e => setForm(p => ({ ...p, line2: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" placeholder="Landmark, Colony (optional)" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
              <div className="relative">
                <input required value={form.pincode} onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" placeholder="6-digit pincode" maxLength={6} inputMode="numeric" />
                {pincodeLoading && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Loading...</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white" placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select required value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white">
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} className="accent-primary" />
            <span className="text-sm text-gray-600">Set as default address</span>
          </label>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Save Address
          </button>
        </form>
      )}
    </div>
  );
}
