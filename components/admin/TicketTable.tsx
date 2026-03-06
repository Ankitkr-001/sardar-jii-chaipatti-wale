'use client';
import React from 'react';
import { SupportTicket } from '@/types';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface TicketTableProps {
  tickets: SupportTicket[];
  onStatusChange?: (ticketId: string, status: SupportTicket['status']) => void;
}

export default function TicketTable({ tickets, onStatusChange }: TicketTableProps) {
  if (tickets.length === 0) {
    return <div className="text-center py-12 text-gray-400">No support tickets found.</div>;
  }

  const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'default'> = {
    open: 'info', in_progress: 'warning', resolved: 'success', closed: 'default',
  };
  const priorityVariant: Record<string, 'error' | 'warning' | 'default'> = {
    high: 'error', medium: 'warning', low: 'default',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Subject</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Priority</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Created</th>
            {onStatusChange && <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <div className="font-medium text-dark">{ticket.subject}</div>
                <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ticket.message}</div>
              </td>
              <td className="py-4 px-4"><Badge variant={priorityVariant[ticket.priority]} size="sm">{ticket.priority}</Badge></td>
              <td className="py-4 px-4"><Badge variant={statusVariant[ticket.status]} size="sm">{ticket.status.replace('_', ' ')}</Badge></td>
              <td className="py-4 px-4 text-gray-500">{formatDate(ticket.createdAt)}</td>
              {onStatusChange && (
                <td className="py-4 px-4">
                  <select value={ticket.status} onChange={e => onStatusChange(ticket.id, e.target.value as SupportTicket['status'])}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary bg-white">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
