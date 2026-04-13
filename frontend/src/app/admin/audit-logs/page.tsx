'use client';

import { useState, useEffect } from 'react';
import { Filter, ClipboardList, User, Clock, Server } from 'lucide-react';
import { auditApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  description?: string;
  ipAddress?: string;
  createdAt: string;
  user?: { fullName: string; email: string };
}

const actionColors: Record<string, string> = {
  CREATE: 'text-green-600 bg-green-50',
  UPDATE: 'text-blue-600 bg-blue-50',
  DELETE: 'text-red-600 bg-red-50',
  LOGIN: 'text-purple-600 bg-purple-50',
  LOGOUT: 'text-gray-600 bg-gray-100',
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [resource, setResource] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    auditApi.getAll({ page, limit: 20, action: action || undefined, resource: resource || undefined })
      .then((res) => {
        setLogs(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [page, action, resource]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Audit Logs</h1>
        <p className="text-gray-400 text-sm mt-1">{total} bản ghi</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className="py-2 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="">Tất cả hành động</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
          </select>
        </div>
        <div>
          <select
            value={resource}
            onChange={(e) => { setResource(e.target.value); setPage(1); }}
            className="py-2 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="">Tất cả tài nguyên</option>
            <option value="posts">Bài viết</option>
            <option value="jobs">Tuyển dụng</option>
            <option value="users">Người dùng</option>
            <option value="roles">Vai trò</option>
            <option value="contact">Liên hệ</option>
            <option value="menu">Menu</option>
            <option value="auth">Đăng nhập</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 h-14 rounded-lg" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
            <p>Không có log nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Hành động</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Tài nguyên</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Người dùng</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Mô tả</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">IP</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${actionColors[log.action] || 'text-gray-600 bg-gray-100'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Server size={13} />
                        <span className="font-medium">{log.resource}</span>
                        {log.resourceId && <span className="text-gray-400 text-xs">#{log.resourceId.slice(0, 8)}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {log.user ? (
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-gray-400" />
                          <span className="text-gray-700">{log.user.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">System</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{log.description || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">{log.ipAddress || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(log.createdAt, 'vi-VN')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Hiển thị {logs.length}/{total}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Trước</button>
            <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl">{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={logs.length < 20} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Sau</button>
          </div>
        </div>
      )}
    </div>
  );
}
