'use client';
import React, { useState } from 'react';
import { User } from '@/types';
import UserTable from '@/components/admin/UserTable';

const mockUsers: User[] = [
  {
    id: 'user-1', phone: '+91 98765 43210', name: 'Priya Sharma', email: 'priya@example.com',
    role: 'customer', addresses: [], createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-2', phone: '+91 98765 43211', name: 'Rajesh Patel', email: 'rajesh@example.com',
    role: 'customer', addresses: [], createdAt: new Date(Date.now() - 25 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-3', phone: '+91 98765 43212', name: 'Ananya Krishnamurthy', email: 'ananya@example.com',
    role: 'customer', addresses: [], createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-4', phone: '+91 98765 43213', name: 'Vikram Singh', email: 'vikram@example.com',
    role: 'customer', addresses: [], createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-5', phone: '+91 98765 43214', name: 'Meera Iyer', email: 'meera@example.com',
    role: 'customer', addresses: [], createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'user-6', phone: '+91 98765 43215', name: 'Amit Gupta', email: 'amit@example.com',
    role: 'customer', addresses: [], createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-1', phone: '+91 98765 43299', name: 'Admin User', email: 'admin@sardarjicha.com',
    role: 'admin', addresses: [], createdAt: new Date(Date.now() - 90 * 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      u.phone.includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{mockUsers.length} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white text-sm"
        />
        <div className="flex gap-2">
          {['all', 'customer', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                roleFilter === role ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {role === 'all' ? 'All Users' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-dark">{mockUsers.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Users</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-dark">{mockUsers.filter(u => u.role === 'customer').length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Customers</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-dark">{mockUsers.filter(u => u.role === 'admin').length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Admins</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4">
          <UserTable users={filtered} />
        </div>
      </div>
    </div>
  );
}
