'use client';
import React, { useState } from 'react';
import { SupportTicket } from '@/types';
import TicketTable from '@/components/admin/TicketTable';

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001', userId: 'user-1', subject: 'Order not received after 7 days',
    message: 'My order was placed 7 days ago but I have not received it yet. Tracking shows it was dispatched.',
    status: 'resolved', priority: 'high',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    responses: [{ id: 'r1', message: 'We have investigated. Order delivered.', isAdmin: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() }],
  },
  {
    id: 'TKT-002', userId: 'user-2', subject: 'Wrong product received',
    message: 'I ordered Kashmiri Kahwa but received Darjeeling First Flush. Please send the correct item.',
    status: 'in_progress', priority: 'medium',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(),
    responses: [],
  },
  {
    id: 'TKT-003', userId: 'user-3', subject: 'Refund not processed',
    message: 'I cancelled my order 5 days ago but have not received my refund yet.',
    status: 'open', priority: 'high',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    responses: [],
  },
  {
    id: 'TKT-004', userId: 'user-4', subject: 'Tea quality issue',
    message: 'The Assam CTC Bold I received seems stale. It does not have the same aroma as before.',
    status: 'open', priority: 'medium',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    responses: [],
  },
  {
    id: 'TKT-005', userId: 'user-5', subject: 'How to brew Kashmiri Kahwa?',
    message: 'Can you please share the best way to brew Kashmiri Kahwa? Does it require any special equipment?',
    status: 'closed', priority: 'low',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    responses: [{ id: 'r2', message: 'Brew with 1 tsp per cup at 85°C for 4-5 minutes. Add saffron and honey to taste!', isAdmin: true, createdAt: new Date(Date.now() - 18 * 86400000).toISOString() }],
  },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Tickets' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const handleStatusChange = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Support Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">{tickets.length} total tickets</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATUS_FILTERS.slice(1).map(f => (
          <div key={f.value} className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-dark">{tickets.filter(t => t.status === f.value).length}</div>
            <div className="text-xs text-gray-500 mt-0.5">{f.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === f.value ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
            {f.value !== 'all' && <span className="ml-1.5 opacity-70">({tickets.filter(t => t.status === f.value).length})</span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4">
          <TicketTable tickets={filtered} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}
