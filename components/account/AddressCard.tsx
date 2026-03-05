'use client';
import React from 'react';
import { Address } from '@/types';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {address.isDefault && (
            <span className="text-xs bg-accent/20 text-chai px-2 py-0.5 rounded-full font-medium">Default</span>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={() => onEdit(address)} className="text-primary hover:text-accent text-xs font-medium transition-colors">Edit</button>
          )}
          {onDelete && !address.isDefault && (
            <button onClick={() => onDelete(address.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
          )}
        </div>
      </div>
      <div className="font-semibold text-dark">{address.name}</div>
      <div className="text-sm text-gray-500 mt-0.5">{address.phone}</div>
      <div className="text-sm text-gray-600 mt-2 leading-relaxed">
        {address.line1}{address.line2 ? `, ${address.line2}` : ''},<br />
        {address.city}, {address.state} - {address.pincode}
      </div>
    </div>
  );
}
