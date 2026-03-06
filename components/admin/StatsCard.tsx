import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}

export default function StatsCard({ icon, label, value, change, positive }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">{icon}</div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-dark mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
