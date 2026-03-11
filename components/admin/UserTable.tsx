import React from 'react';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return <div className="text-center py-12 text-gray-400">No users found.</div>;
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="lg:hidden space-y-3">
        {users.map(user => (
          <div key={user.id} className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-dark text-sm truncate">{user.name || 'No Name'}</div>
                {user.email && <div className="text-xs text-gray-400 truncate">{user.email}</div>}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${user.role === 'admin' ? 'bg-accent/20 text-chai' : 'bg-gray-100 text-gray-600'}`}>
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
              <span>{user.phone}</span>
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">User</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-dark">{user.name || 'No Name'}</div>
                      {user.email && <div className="text-xs text-gray-400">{user.email}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{user.phone}</td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-accent/20 text-chai' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-500">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
