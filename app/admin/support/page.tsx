'use client';
import React, { useState, useEffect } from 'react';
import { SupportTicket } from '@/types';
import { getSupportTickets, updateTicketStatus } from '@/lib/firestore';
import TicketTable from '@/components/admin/TicketTable';
import Spinner from '@/components/ui/Spinner';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Tickets' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getSupportTickets().then(t => {
      setTickets(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const handleStatusChange = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      await updateTicketStatus(ticketId, status);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

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
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Support Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">{tickets.length} total tickets</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {STATUS_FILTERS.slice(1).map(f => (
          <div key={f.value} className="bg-white rounded-xl p-3 sm:p-4 text-center border border-gray-100 shadow-sm">
            <div className="text-lg sm:text-2xl font-bold text-dark">{tickets.filter(t => t.status === f.value).length}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{f.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === f.value ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
            {f.value !== 'all' && <span className="ml-1.5 opacity-70">({tickets.filter(t => t.status === f.value).length})</span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4">
          <TicketTable tickets={filtered} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}
