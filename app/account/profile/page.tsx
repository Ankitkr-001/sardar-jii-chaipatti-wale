'use client';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileForm from '@/components/account/ProfileForm';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-bold text-dark text-lg">{user?.name || 'Tea Lover'}</div>
            <div className="text-gray-500 text-sm">{user?.phone}</div>
            <div className="inline-block mt-1 text-xs bg-accent/20 text-chai px-2 py-0.5 rounded-full font-medium capitalize">
              {user?.role || 'customer'}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-dark mb-4">Edit Information</h3>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
