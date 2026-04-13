'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, Mail, Phone, Filter, Trash2, CheckCircle, MessageCircle, Eye } from 'lucide-react';
import { contactApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface ContactSubmission {
  id: string; fullName: string; email: string; phone?: string;
  subject?: string; message: string; status: string; notes?: string; createdAt: string;
}
interface ContactStats { total: number; new: number; read: number; replied: number; }

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-600', replied: 'bg-green-100 text-green-700',
};
const statusLabels: Record<string, string> = { new: 'Mới', read: 'Đã đọc', replied: 'Đã trả lời' };

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchContacts = () => {
    setLoading(true);
    contactApi.adminGetAll({ page, limit: 15, search: search || undefined, status: status || undefined })
      .then((res) => {
        const d = res.data;
        setContacts(d.data || d || []);
        setTotal(d.total || 0);
      })
      .catch(() => { setContacts([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  const fetchStats = () => {
    contactApi.getStats().then((res) => setStats(res.data)).catch(() => {});
  };

  useEffect(() => { fetchContacts(); }, [page, search, status]);
  useEffect(() => { fetchStats(); }, []);

  const handleSelect = async (contact: ContactSubmission) => {
    setSelected(contact);
    // Mark as read if new
    if (contact.status === 'new') {
      try {
        await contactApi.updateStatus(contact.id, 'read');
        setContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, status: 'read' } : c));
        setSelected((prev) => prev?.id === contact.id ? { ...prev, status: 'read' } : prev);
        fetchStats();
      } catch {}
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await contactApi.updateStatus(id, newStatus);
      toast.success(`Đã chuyển sang "${statusLabels[newStatus]}"`);
      setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
      setSelected((prev) => prev?.id === id ? { ...prev, status: newStatus } : prev);
      fetchStats();
    } catch {
      toast.error('Có lỗi xảy ra');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa liên hệ này?')) return;
    try {
      await contactApi.delete(id);
      toast.success('Đã xóa liên hệ');
      if (selected?.id === id) setSelected(null);
      fetchContacts();
      fetchStats();
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Quản lý Liên hệ</h1>
        <p className="text-gray-400 text-sm mt-1">{total} liên hệ</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Tổng liên hệ', value: stats.total, color: 'text-gray-700', bg: 'bg-white border border-gray-100' },
            { label: 'Mới', value: stats.new, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Đã đọc', value: stats.read, color: 'text-gray-600', bg: 'bg-gray-100' },
            { label: 'Đã trả lời', value: stats.replied, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm liên hệ..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="read">Đã đọc</option>
            <option value="replied">Đã trả lời</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg" />)}</div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">📭</div><p>Không có liên hệ nào</p></div>
          ) : (
            <div>
              {contacts.map((contact) => (
                <div key={contact.id}
                  onClick={() => handleSelect(contact)}
                  className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500 pl-4' : ''} ${contact.status === 'new' ? 'font-medium' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${contact.status === 'new' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {contact.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${contact.status === 'new' ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{contact.fullName}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColors[contact.status] || 'bg-gray-100 text-gray-500'}`}>
                        {statusLabels[contact.status] || contact.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{contact.subject || contact.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(contact.createdAt, 'vi-VN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 15 && (
            <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
              <span>{contacts.length}/{total}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-xs">Trước</button>
                <span className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs">{page}</span>
                <button onClick={() => setPage(page + 1)} disabled={contacts.length < 15} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 text-xs">Sau</button>
              </div>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 sticky top-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Chi tiết liên hệ</h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[selected.status]}`}>
                  {statusLabels[selected.status]}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Họ tên</p>
                  <p className="font-semibold text-gray-800">{selected.fullName}</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                      <Mail size={12} />{selected.email}
                    </a>
                  </div>
                  {selected.phone && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Điện thoại</p>
                      <a href={`tel:${selected.phone}`} className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                        <Phone size={12} />{selected.phone}
                      </a>
                    </div>
                  )}
                </div>
                {selected.subject && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Chủ đề</p>
                    <p className="text-sm font-medium text-gray-700">{selected.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Nội dung</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">{selected.message}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Thời gian</p>
                  <p className="text-sm text-gray-600">{formatDate(selected.createdAt, 'vi-VN')}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Liên hệ từ website'}`}
                  onClick={() => selected.status !== 'replied' && handleUpdateStatus(selected.id, 'replied')}
                  className="flex items-center justify-center gap-2 w-full bg-[var(--primary)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--primary-dark)] transition-colors">
                  <Mail size={15} />Trả lời qua Email
                </a>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selected.id, 'read')}
                    disabled={selected.status === 'read' || updating === selected.id}
                    className="flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                    <Eye size={13} />Đã đọc
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selected.id, 'replied')}
                    disabled={selected.status === 'replied' || updating === selected.id}
                    className="flex items-center justify-center gap-1 py-2 border border-green-200 rounded-xl text-xs font-medium text-green-600 hover:bg-green-50 disabled:opacity-40 transition-colors">
                    <CheckCircle size={13} />Đã trả lời
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="flex items-center justify-center gap-1 py-2 border border-red-200 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} />Xóa
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Chọn một liên hệ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
