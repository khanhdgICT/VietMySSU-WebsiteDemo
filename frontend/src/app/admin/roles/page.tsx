'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Shield, Key, ChevronDown, ChevronUp, X } from 'lucide-react';
import { rolesApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Permission { id: string; name: string; resource: string; action: string; }
interface Role { id: string; name: string; description?: string; createdAt: string; permissions?: Permission[]; }

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-700', read: 'bg-blue-100 text-blue-700',
  update: 'bg-yellow-100 text-yellow-700', delete: 'bg-red-100 text-red-700',
};

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());

  const fetchData = () => {
    setLoading(true);
    Promise.all([rolesApi.getAll(), rolesApi.getPermissions()])
      .then(([r, p]) => { setRoles(r.data || []); setAllPermissions(p.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ name: '', description: '' });
    setSelectedPerms(new Set());
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setForm({ name: role.name, description: role.description || '' });
    setSelectedPerms(new Set(role.permissions?.map((p) => p.id) || []));
    setEditId(role.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Vui lòng nhập tên vai trò');
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, permissionIds: Array.from(selectedPerms) };
      if (editId) {
        await rolesApi.update(editId, payload);
        toast.success('Đã cập nhật vai trò');
      } else {
        await rolesApi.create(payload);
        toast.success('Đã tạo vai trò mới');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa vai trò "${name}"?`)) return;
    try { await rolesApi.delete(id); toast.success('Đã xóa vai trò'); fetchData(); }
    catch { toast.error('Không thể xóa vai trò này'); }
  };

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleResource = (resource: string) => {
    const resourcePerms = allPermissions.filter((p) => p.resource === resource).map((p) => p.id);
    const allSelected = resourcePerms.every((id) => selectedPerms.has(id));
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (allSelected) resourcePerms.forEach((id) => next.delete(id));
      else resourcePerms.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedPerms.size === allPermissions.length) setSelectedPerms(new Set());
    else setSelectedPerms(new Set(allPermissions.map((p) => p.id)));
  };

  const groupedPermissions = allPermissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Roles & Quyền hạn</h1>
          <p className="text-gray-400 text-sm mt-1">{roles.length} vai trò — {allPermissions.length} quyền hạn</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} /> Thêm vai trò
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 h-20 rounded-2xl" />)
        ) : roles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <div className="text-4xl mb-3">🛡️</div><p>Chưa có vai trò nào</p>
          </div>
        ) : (
          roles.map((role) => (
            <div key={role.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{role.name}</h3>
                    <p className="text-sm text-gray-400">{role.description || 'Không có mô tả'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{formatDate(role.createdAt, 'vi-VN')}</span>
                  {role.permissions && (
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                      {role.permissions.length} quyền
                    </span>
                  )}
                  <button onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    {expandedRole === role.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => openEdit(role)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(role.id, role.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              {expandedRole === role.id && role.permissions && (
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3"><Key size={14} className="text-gray-500" /><span className="text-sm font-semibold text-gray-600">Quyền hạn được gán</span></div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm) => (
                      <span key={perm.id} className={`text-xs font-medium px-2.5 py-1 rounded-full ${actionColors[perm.action] || 'bg-gray-100 text-gray-600'}`}>{perm.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên vai trò <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="editor, moderator..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả về vai trò này..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Quyền hạn ({selectedPerms.size}/{allPermissions.length})</label>
                  <button onClick={toggleAll} className="text-xs text-blue-600 hover:underline">
                    {selectedPerms.size === allPermissions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  {Object.entries(groupedPermissions).map(([resource, perms]) => {
                    const allSel = perms.every((p) => selectedPerms.has(p.id));
                    const someSel = perms.some((p) => selectedPerms.has(p.id));
                    return (
                      <div key={resource} className="border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleResource(resource)}>
                          <input type="checkbox" checked={allSel} ref={(el) => { if (el) el.indeterminate = someSel && !allSel; }}
                            onChange={() => toggleResource(resource)} className="w-4 h-4 accent-blue-600" onClick={(e) => e.stopPropagation()} />
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{resource}</span>
                          <span className="text-xs text-gray-400 ml-auto">{perms.filter((p) => selectedPerms.has(p.id)).length}/{perms.length}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-0">
                          {perms.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50/50 cursor-pointer transition-colors">
                              <input type="checkbox" checked={selectedPerms.has(perm.id)} onChange={() => togglePerm(perm.id)} className="w-3.5 h-3.5 accent-blue-600" />
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColors[perm.action] || 'bg-gray-100 text-gray-600'}`}>{perm.action}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-60 transition-colors">
                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Tạo vai trò'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
