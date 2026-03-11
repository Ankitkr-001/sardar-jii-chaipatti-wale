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
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl">{icon}</div>
        {change && (
          <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="text-xl sm:text-3xl font-bold text-dark mb-0.5 sm:mb-1 truncate">{value}</div>
      <div className="text-xs sm:text-sm text-gray-500">{label}</div>
    </div>
  );
}
