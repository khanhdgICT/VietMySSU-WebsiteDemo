'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, GripVertical, ExternalLink, ChevronRight, X } from 'lucide-react';
import { menuApi } from '@/lib/api';

interface MenuItem {
  id: string; label: string; labelEn?: string; url: string;
  location: string; sortOrder: number; isActive: boolean;
  openInNewTab?: boolean; icon?: string;
  children?: MenuItem[]; parent?: { id: string; label: string };
}

const EMPTY_FORM = {
  label: '', labelEn: '', url: '', location: 'header',
  sortOrder: 0, isActive: true, openInNewTab: false, parentId: '',
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);

  const fetchMenu = () => {
    setLoading(true);
    menuApi.getAll()
      .then((res) => setMenuItems(res.data || []))
      .catch(() => setMenuItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMenu(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, location: activeTab });
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setForm({
      label: item.label, labelEn: item.labelEn || '', url: item.url || '',
      location: item.location, sortOrder: item.sortOrder, isActive: item.isActive,
      openInNewTab: item.openInNewTab || false, parentId: item.parent?.id || '',
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.label.trim()) return toast.error('Vui lòng nhập nhãn menu');
    if (!form.url.trim()) return toast.error('Vui lòng nhập đường dẫn URL');
    setSaving(true);
    try {
      const payload: any = {
        label: form.label, labelEn: form.labelEn || undefined,
        url: form.url, location: form.location,
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive, openInNewTab: form.openInNewTab,
        parentId: form.parentId || null,
      };
      if (editId) {
        await menuApi.update(editId, payload);
        toast.success('Đã cập nhật mục menu');
      } else {
        await menuApi.create(payload);
        toast.success('Đã tạo mục menu mới');
      }
      setShowModal(false);
      fetchMenu();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Xóa mục menu "${label}"?`)) return;
    try { await menuApi.delete(id); toast.success('Đã xóa mục menu'); fetchMenu(); }
    catch { toast.error('Có lỗi xảy ra'); }
  };

  const handleToggleActive = async (item: MenuItem) => {
    try {
      await menuApi.update(item.id, { isActive: !item.isActive });
      toast.success(item.isActive ? 'Đã ẩn mục menu' : 'Đã hiện mục menu');
      fetchMenu();
    } catch { toast.error('Lỗi cập nhật'); }
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  // Filter & group
  const filtered = menuItems.filter((m) => m.location === activeTab);
  const topLevel = filtered.filter((m) => !m.parent).sort((a, b) => a.sortOrder - b.sortOrder);
  const childrenMap = filtered.reduce<Record<string, MenuItem[]>>((acc, m) => {
    if (m.parent) {
      if (!acc[m.parent.id]) acc[m.parent.id] = [];
      acc[m.parent.id].push(m);
    }
    return acc;
  }, {});
  // Top-level items for parent selection (excluding current editId)
  const parentOptions = menuItems.filter((m) => !m.parent && m.id !== editId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Menu</h1>
          <p className="text-gray-400 text-sm mt-1">{menuItems.length} mục menu</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} /> Thêm mục menu
        </button>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {(['header', 'footer'] as const).map((loc) => (
          <button key={loc} onClick={() => setActiveTab(loc)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === loc ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
            {loc === 'header' ? 'Header' : 'Footer'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 h-12 rounded-lg" />)}</div>
        ) : topLevel.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">🗂️</div><p>Chưa có mục menu nào</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {topLevel.map((item) => (
              <div key={item.id}>
                <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                  <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      {item.labelEn && <span className="text-xs text-gray-400">/ {item.labelEn}</span>}
                      {childrenMap[item.id]?.length > 0 && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">+{childrenMap[item.id].length} sub</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-500">
                        <ExternalLink size={10} />{item.url}
                      </a>
                      <span>· thứ tự: {item.sortOrder}</span>
                    </div>
                  </div>
                  <button onClick={() => handleToggleActive(item)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-80 ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isActive ? 'Hiện' : 'Ẩn'}
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(item.id, item.label)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>

                {/* Children */}
                {childrenMap[item.id]?.sort((a, b) => a.sortOrder - b.sortOrder).map((child) => (
                  <div key={child.id} className="flex items-center gap-3 px-5 py-3 pl-14 bg-gray-50/60 hover:bg-gray-100/60 transition-colors group border-t border-gray-50">
                    <GripVertical size={14} className="text-gray-200 cursor-grab shrink-0" />
                    <ChevronRight size={12} className="text-gray-300 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{child.label}</span>
                        {child.labelEn && <span className="text-xs text-gray-400">/ {child.labelEn}</span>}
                      </div>
                      <span className="text-xs text-gray-400">{child.url}</span>
                    </div>
                    <button onClick={() => handleToggleActive(child)}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${child.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {child.isActive ? 'Hiện' : 'Ẩn'}
                    </button>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(child)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(child.id, child.label)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Chỉnh sửa mục menu' : 'Thêm mục menu mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhãn (Tiếng Việt) <span className="text-red-500">*</span></label>
                  <input value={form.label} onChange={(e) => set('label', e.target.value)}
                    placeholder="Trang chủ"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Label (English)</label>
                  <input value={form.labelEn} onChange={(e) => set('labelEn', e.target.value)}
                    placeholder="Home"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Đường dẫn URL <span className="text-red-500">*</span></label>
                <input value={form.url} onChange={(e) => set('url', e.target.value)}
                  placeholder="/about hoặc https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vị trí</label>
                  <select value={form.location} onChange={(e) => set('location', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label>
                  <input type="number" min="0" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Menu cha</label>
                  <select value={form.parentId} onChange={(e) => set('parentId', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Không có</option>
                    {parentOptions.filter((o) => o.location === form.location).map((o) => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">Hiển thị</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.openInNewTab} onChange={(e) => set('openInNewTab', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">Mở tab mới</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-60 transition-colors">
                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm vào menu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
