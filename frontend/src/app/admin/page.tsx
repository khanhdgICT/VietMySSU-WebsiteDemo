'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { FileText, Briefcase, Users, MessageSquare, TrendingUp, Eye, Clock } from 'lucide-react';
import { analyticsApi, auditApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface DashboardData {
  stats: {
    totalPosts: number;
    totalJobs: number;
    totalUsers: number;
    totalContacts: number;
    newContacts: number;
  };
  topPosts: Array<{ id: string; title: string; viewCount: number; category?: { name: string } }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [contactChart, setContactChart] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getDashboard(),
      analyticsApi.getContactChart(30),
      analyticsApi.getRecentActivity(),
    ]).then(([dashRes, chartRes, actRes]) => {
      setData(dashRes.data);
      setContactChart(chartRes.data.map((d: any) => ({
        date: new Date(d.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
        count: parseInt(d.count),
      })));
      setRecentActivity(actRes.data);
    }).catch(() => {
      // Fallback mock
      setData({
        stats: { totalPosts: 24, totalJobs: 12, totalUsers: 8, totalContacts: 156, newContacts: 7 },
        topPosts: [
          { id: '1', title: 'Xu hướng Call Center 2024', viewCount: 1200, category: { name: 'Tin tức ngành' } },
          { id: '2', title: 'VietMy SSU ra mắt dịch vụ mới', viewCount: 850, category: { name: 'Tin tức mới' } },
        ],
      });
      setContactChart(Array.from({ length: 7 }, (_, i) => ({
        date: `${i + 1}/4`,
        count: Math.floor(Math.random() * 20) + 5,
      })));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = data ? [
    { label: 'Bài viết', value: data.stats.totalPosts, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', change: '+5%' },
    { label: 'Tuyển dụng', value: data.stats.totalJobs, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-50', change: '+2' },
    { label: 'Người dùng', value: data.stats.totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', change: '+1' },
    { label: 'Liên hệ mới', value: data.stats.newContacts, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50', change: `/${data.stats.totalContacts}` },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Tổng quan hệ thống VietMy SSU CMS</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <card.icon size={22} className={card.color} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {card.change}
                </span>
              </div>
              <div className="text-2xl font-black text-gray-800">{card.value.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800">Liên hệ theo ngày</h3>
              <p className="text-xs text-gray-400">30 ngày gần nhất</p>
            </div>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={contactChart}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0056b3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0056b3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0056b3" fill="url(#colorCount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800">Bài viết nổi bật</h3>
              <p className="text-xs text-gray-400">Theo lượt xem</p>
            </div>
            <Eye size={20} className="text-purple-500" />
          </div>
          <div className="space-y-3">
            {data?.topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{post.title}</p>
                  <p className="text-xs text-gray-400">{post.category?.name}</p>
                </div>
                <span className="text-sm font-bold text-blue-600 shrink-0">{post.viewCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={20} className="text-gray-400" />
          <h3 className="font-bold text-gray-800">Hoạt động gần đây</h3>
        </div>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Chưa có hoạt động.</p>
          ) : (
            recentActivity.slice(0, 8).map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                  {log.user?.fullName?.[0] || 'S'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <strong>{log.user?.fullName || 'System'}</strong>{' '}
                    <span className="text-gray-400">{log.action.toLowerCase()}</span>{' '}
                    <span className="font-medium">{log.resource}</span>
                    {log.description && <span className="text-gray-400"> — {log.description}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(log.createdAt, 'vi-VN')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
