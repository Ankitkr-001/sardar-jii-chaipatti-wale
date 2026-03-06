import React from 'react';
import { TrackingStep, OrderStatus } from '@/types';
import { ORDER_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface OrderTimelineProps {
  steps: TrackingStep[];
  currentStatus: OrderStatus;
}

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderTimeline({ steps, currentStatus }: OrderTimelineProps) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">✕</div>
        <div>
          <div className="font-semibold text-red-700">Order {ORDER_STATUSES[currentStatus]}</div>
          <div className="text-sm text-red-600">This order has been {currentStatus}.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STATUS_ORDER.map((status, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const step = steps?.find(s => s.status === status);

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 transition-all ${
                isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-300'
              } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
              {idx < STATUS_ORDER.length - 1 && (
                <div className={`w-0.5 h-10 ${isCompleted && idx < currentIdx ? 'bg-primary' : 'bg-gray-100'}`} />
              )}
            </div>
            <div className="pb-8 pt-1">
              <div className={`font-semibold text-sm ${isCompleted ? 'text-dark' : 'text-gray-400'}`}>
                {ORDER_STATUSES[status]}
              </div>
              {step?.timestamp && (
                <div className="text-xs text-gray-400 mt-0.5">{formatDate(step.timestamp)}</div>
              )}
              {isCurrent && (
                <div className="text-xs text-primary font-medium mt-1">Current Status</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
