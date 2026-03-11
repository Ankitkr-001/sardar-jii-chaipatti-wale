'use client';
import React, { useEffect, useState } from 'react';
import { AdminStats } from '@/types';
import StatsCard from '@/components/admin/StatsCard';
import RevenueChart from '@/components/admin/RevenueChart';
import OrderTable from '@/components/admin/OrderTable';
import { formatPrice } from '@/lib/utils';
import { getStats, getRevenueData, RevenueDataPoint } from '@/lib/firestore';
import Spinner from '@/components/ui/Spinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getRevenueData()]).then(([s, r]) => {
      setStats(s);
      setRevenueData(r);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalRevenueFromChart = revenueData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard icon="💰" label="Total Revenue" value={formatPrice(stats.totalRevenue)} />
        <StatsCard icon="📦" label="Total Orders" value={stats.totalOrders.toLocaleString()} />
        <StatsCard icon="👥" label="Total Customers" value={stats.totalUsers.toLocaleString()} />
        <StatsCard icon="🍃" label="Total Products" value={stats.totalProducts} />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={revenueData} totalRevenue={totalRevenueFromChart} />

      {/* Recent Orders */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <h2 className="font-bold text-dark text-base sm:text-lg">Recent Orders</h2>
          <a href="/admin/orders" className="text-xs sm:text-sm text-primary hover:text-accent font-medium transition-colors">View All →</a>
        </div>
        <div className="p-3 sm:p-4">
          {stats.recentOrders.length > 0 ? (
            <OrderTable orders={stats.recentOrders} />
          ) : (
            <div className="text-center py-8 text-gray-400">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
