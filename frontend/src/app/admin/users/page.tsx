'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Shield, X, Eye, EyeOff } from 'lucide-react';
import { usersApi, rolesApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface User {
  id: string; fullName: string; email: string; phone?: string;
  status: string; isTwoFaEnabled: boolean; createdAt: string;
  role?: { id: string; name: string };
}
interface Role { id: string; name: string; description?: string; }

const EMPTY_FORM = { fullName: '', email: '', password: '', phone: '', roleId: '', status: 'active' };

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', suspended: 'bg-red-100 text-red-700',
};
const statusLabels: Record<string, string> = { active: 'Hoạt động', inactive: 'Không hoạt động', suspended: 'Bị khóa' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPwd, setShowPwd] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    usersApi.getAll({ page, limit: 15, search: search || undefined })
      .then((res) => {
        const d = res.data;
        setUsers(d.data || d || []);
        setTotal(d.total || d?.length || 0);
      })
      .catch(() => { setUsers([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, search]);
  useEffect(() => { rolesApi.getAll().then((r) => setRoles(r.data || [])).catch(() => {}); }, []);

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setShowPwd(false); setShowModal(true); };
  const openEdit = (user: User) => {
    setForm({ fullName: user.fullName, email: user.email, password: '', phone: user.phone || '', roleId: user.role?.id || '', status: user.status });
    setEditId(user.id);
    setShowPwd(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) return toast.error('Vui lòng nhập họ tên');
    if (!form.email.trim()) return toast.error('Vui lòng nhập email');
    if (!editId && !form.password) return toast.error('Vui lòng nhập mật khẩu');
    setSaving(true);
    try {
      const payload: any = { fullName: form.fullName, email: form.email, phone: form.phone || undefined, roleId: form.roleId || undefined, status: form.status };
      if (!editId) payload.password = form.password;
      if (editId) {
        await usersApi.update(editId, payload);
        toast.success('Đã cập nhật người dùng');
      } else {
        await usersApi.create(payload);
        toast.success('Đã tạo người dùng mới');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa người dùng này?')) return;
    try { await usersApi.delete(id); toast.success('Đã xóa người dùng'); fetchUsers(); }
    catch { toast.error('Có lỗi xảy ra'); }
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Người dùng</h1>
          <p className="text-gray-400 text-sm mt-1">{total} người dùng</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} /> Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 h-12 rounded-lg" />)}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">👤</div><p>Không có người dùng nào</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Người dùng</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Vai trò</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Trạng thái</th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">2FA</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Ngày tạo</th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {user.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.fullName}</p>
                          {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{user.email}</td>
                    <td className="px-4 py-4">
                      {user.role ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full w-fit">
                          <Shield size={12} />{user.role.name}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[user.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[user.status] || user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-medium ${user.isTwoFaEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.isTwoFaEnabled ? '✓ Bật' : '✗ Tắt'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">{formatDate(user.createdAt, 'vi-VN')}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(user)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 15 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Hiển thị {users.length}/{total} người dùng</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Trước</button>
            <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl">{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={users.length < 15} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Sau</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                  placeholder="user@vietmy.com" disabled={!!editId}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400" />
              </div>
              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)}
                      placeholder="Tối thiểu 8 ký tự"
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
                  placeholder="0901234567"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò</label>
                  <select value={form.roleId} onChange={(e) => set('roleId', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Không có --</option>
                    {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                  <select value={form.status} onChange={(e) => set('status', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Bị khóa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-60 transition-colors">
                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Tạo người dùng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
