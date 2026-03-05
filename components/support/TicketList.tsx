import React from 'react';
import { SupportTicket } from '@/types';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface TicketListProps {
  tickets: SupportTicket[];
}

const statusVariant: Record<string, 'info' | 'warning' | 'success' | 'default'> = {
  open: 'info', in_progress: 'warning', resolved: 'success', closed: 'default',
};

const priorityVariant: Record<string, 'error' | 'warning' | 'default'> = {
  high: 'error', medium: 'warning', low: 'default',
};

export default function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-5xl mb-3">🎫</div>
        <p>No support tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map(ticket => (
        <div key={ticket.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-dark text-sm">{ticket.subject}</h4>
            <div className="flex gap-2">
              <Badge variant={priorityVariant[ticket.priority]} size="sm">{ticket.priority}</Badge>
              <Badge variant={statusVariant[ticket.status]} size="sm">{ticket.status.replace('_', ' ')}</Badge>
            </div>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2">{ticket.message}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{formatDate(ticket.createdAt)}</span>
            {ticket.responses?.length > 0 && (
              <span className="text-xs text-primary font-medium">{ticket.responses.length} response(s)</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
