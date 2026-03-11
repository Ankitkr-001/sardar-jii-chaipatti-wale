'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/types';
import { getAllUsers } from '@/lib/firestore';
import UserTable from '@/components/admin/UserTable';
import Spinner from '@/components/ui/Spinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    getAllUsers().then(u => {
      setUsers(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      u.phone.includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  }), [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
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
          <div className="text-2xl font-bold text-dark">{users.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Users</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-dark">{users.filter(u => u.role === 'customer').length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Customers</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
          <div className="text-2xl font-bold text-dark">{users.filter(u => u.role === 'admin').length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Admins</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4">
          {filtered.length > 0 ? (
            <UserTable users={filtered} />
          ) : (
            <div className="text-center py-12 text-gray-400">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
