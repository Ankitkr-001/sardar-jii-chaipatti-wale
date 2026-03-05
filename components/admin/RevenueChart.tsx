'use client';
import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const sampleData = [
  { day: 'Mon', revenue: 12400 },
  { day: 'Tue', revenue: 8600 },
  { day: 'Wed', revenue: 18900 },
  { day: 'Thu', revenue: 14200 },
  { day: 'Fri', revenue: 22100 },
  { day: 'Sat', revenue: 31500 },
  { day: 'Sun', revenue: 27800 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-dark text-lg">Revenue Overview</h3>
          <p className="text-sm text-gray-400">Last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">₹1,35,500</div>
          <div className="text-xs text-green-600 font-medium">↑ 12.5% vs last week</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sampleData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F2E25" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0F2E25" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#0F2E25" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ fill: '#C9A227', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#C9A227' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
