'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import AddressCard from '@/components/account/AddressCard';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh'];

type FormState = Omit<Address, 'id'>;

const emptyForm: FormState = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

export default function AddressesPage() {
  const { user, updateUserProfile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Sync addresses when user data changes (e.g., after login)
  React.useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user?.addresses]);

  const openAdd = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (address: Address) => {
    setEditingAddress(address);
    setForm({ name: address.name, phone: address.phone, line1: address.line1, line2: address.line2 || '', city: address.city, state: address.state, pincode: address.pincode, isDefault: address.isDefault });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    await updateUserProfile({ addresses: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let updated: Address[];
    if (editingAddress) {
      updated = addresses.map(a => a.id === editingAddress.id ? { ...form, id: a.id } : (form.isDefault ? { ...a, isDefault: false } : a));
    } else {
      const newAddr: Address = { ...form, id: `addr-${Date.now()}` };
      updated = form.isDefault ? [...addresses.map(a => ({ ...a, isDefault: false })), newAddr] : [...addresses, newAddr];
    }
    setAddresses(updated);
    await updateUserProfile({ addresses: updated });
    setShowForm(false);
    setEditingAddress(null);
    setForm(emptyForm);
    setSaving(false);
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white text-sm";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">My Addresses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Address
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-dark mb-5">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={fieldClass} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={fieldClass} placeholder="10-digit mobile" maxLength={10} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
              <input required value={form.line1} onChange={e => setForm(p => ({ ...p, line1: e.target.value }))} className={fieldClass} placeholder="House no, Street name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input value={form.line2 || ''} onChange={e => setForm(p => ({ ...p, line2: e.target.value }))} className={fieldClass} placeholder="Landmark, Colony (optional)" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="addr-pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <div className="relative">
                  <input id="addr-pincode" required value={form.pincode} onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))} className={fieldClass} placeholder="6-digit pincode" maxLength={6} inputMode="numeric" />
                  {pincodeLoading && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Loading...</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className={fieldClass} placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select required value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className={fieldClass}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} className="accent-primary" />
              <span className="text-sm text-gray-600">Set as default address</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingAddress(null); }} className="px-8 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="text-lg font-bold text-dark mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-6">Add your delivery address to checkout faster.</p>
          <button onClick={openAdd} className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(address => (
            <AddressCard key={address.id} address={address} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
