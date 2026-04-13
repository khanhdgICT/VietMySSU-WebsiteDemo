'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Eye, Filter, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { postsApi, categoriesApi } from '@/lib/api';
import { formatDate, slugify } from '@/lib/utils';
import ImageUpload from '@/components/admin/ImageUpload';

// TipTap must be client-side only
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface Category { id: string; name: string; }
interface Post {
  id: string; title: string; slug: string; status: string;
  viewCount: number; createdAt: string; isFeatured: boolean;
  category?: { id: string; name: string };
  author?: { fullName: string };
}

const EMPTY_FORM = {
  title: '', titleEn: '', slug: '', excerpt: '', excerptEn: '',
  content: '', contentEn: '', thumbnail: '', status: 'draft',
  isFeatured: false, categoryId: '',
  metaTitle: '', metaDescription: '', metaKeywords: '',
};

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-600',
};
const statusLabels: Record<string, string> = {
  published: 'Đã đăng', draft: 'Nháp', archived: 'Lưu trữ',
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<'vi' | 'en' | 'seo'>('vi');

  const fetchPosts = () => {
    setLoading(true);
    postsApi
      .adminGetAll({ page, limit: 15, search: search || undefined, status: statusFilter || undefined })
      .then((res) => { setPosts(res.data.data || []); setTotal(res.data.total || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [page, search, statusFilter]);
  useEffect(() => {
    categoriesApi.getAll().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setActiveTab('vi');
    setShowModal(true);
  };

  const openEdit = async (post: Post) => {
    try {
      const res = await postsApi.getById(post.id);
      const full = res.data;
      setForm({
        title: full.title || '', titleEn: full.titleEn || '',
        slug: full.slug || '', excerpt: full.excerpt || '',
        excerptEn: full.excerptEn || '', content: full.content || '',
        contentEn: full.contentEn || '', thumbnail: full.thumbnail || '',
        status: full.status || 'draft', isFeatured: full.isFeatured || false,
        categoryId: full.category?.id || '',
        metaTitle: full.metaTitle || '', metaDescription: full.metaDescription || '',
        metaKeywords: full.metaKeywords || '',
      });
      setEditId(post.id);
      setActiveTab('vi');
      setShowModal(true);
    } catch { toast.error('Không tải được dữ liệu bài viết'); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Vui lòng nhập tiêu đề');
    if (!form.content || form.content === '<p></p>') return toast.error('Vui lòng nhập nội dung');
    if (!form.slug.trim()) return toast.error('Vui lòng nhập slug');
    setSaving(true);
    try {
      const payload = { ...form, categoryId: form.categoryId || undefined };
      if (editId) {
        await postsApi.update(editId, payload);
        toast.success('Đã cập nhật bài viết');
      } else {
        await postsApi.create(payload);
        toast.success('Đã tạo bài viết mới');
      }
      setShowModal(false);
      fetchPosts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa bài viết này?')) return;
    try { await postsApi.delete(id); toast.success('Đã xóa'); fetchPosts(); }
    catch { toast.error('Có lỗi xảy ra'); }
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Tin tức</h1>
          <p className="text-gray-400 text-sm mt-1">{total} bài viết</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} /> Thêm bài viết
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Nháp</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 h-12 rounded-lg" />)}</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">📭</div><p>Không có bài viết nào</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Tiêu đề</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Danh mục</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Trạng thái</th>
                  <th className="text-right px-4 py-4 font-semibold text-gray-600">Lượt xem</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Ngày tạo</th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 max-w-xs truncate">{post.title}</p>
                      {post.isFeatured && <span className="text-xs text-yellow-600">⭐ Nổi bật</span>}
                      {post.author && <p className="text-xs text-gray-400">{post.author.fullName}</p>}
                    </td>
                    <td className="px-4 py-4 text-gray-500">{post.category?.name || '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[post.status]}`}>{statusLabels[post.status]}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="flex items-center justify-end gap-1 text-gray-500"><Eye size={14} />{post.viewCount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">{formatDate(post.createdAt, 'vi-VN')}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(post)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
          <span>Hiển thị {posts.length}/{total} bài viết</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Trước</button>
            <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl">{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={posts.length < 15} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Sau</button>
          </div>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl my-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 bg-white">
              {(['vi', 'en', 'seo'] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  {t === 'vi' ? '🇻🇳 Tiếng Việt' : t === 'en' ? '🇬🇧 English' : '🔍 SEO'}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {/* ── Tiếng Việt ── */}
              {activeTab === 'vi' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề <span className="text-red-500">*</span></label>
                      <input value={form.title}
                        onChange={(e) => { set('title', e.target.value); if (!editId) set('slug', slugify(e.target.value)); }}
                        placeholder="Nhập tiêu đề bài viết"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
                      <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
                        placeholder="duong-dan-url"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tóm tắt</label>
                    <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)}
                      rows={2} placeholder="Mô tả ngắn hiển thị trong danh sách..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung <span className="text-red-500">*</span></label>
                    <RichTextEditor value={form.content} onChange={(v) => set('content', v)} placeholder="Nhập nội dung bài viết..." />
                  </div>
                </>
              )}

              {/* ── English ── */}
              {activeTab === 'en' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title (English)</label>
                    <input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)}
                      placeholder="Post title in English"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt (English)</label>
                    <textarea value={form.excerptEn} onChange={(e) => set('excerptEn', e.target.value)}
                      rows={2} placeholder="Short description in English..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Content (English)</label>
                    <RichTextEditor value={form.contentEn} onChange={(v) => set('contentEn', v)} placeholder="Post content in English..." />
                  </div>
                </>
              )}

              {/* ── SEO ── */}
              {activeTab === 'seo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                    <input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                    <textarea value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)}
                      rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Keywords</label>
                    <input value={form.metaKeywords} onChange={(e) => set('metaKeywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </>
              )}

              {/* ── Common (always visible) ── */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                  <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                  <select value={form.status} onChange={(e) => set('status', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="draft">Nháp</option>
                    <option value="published">Đã đăng</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>
              </div>

              <ImageUpload value={form.thumbnail} onChange={(url) => set('thumbnail', url)} label="Ảnh đại diện" />

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm font-medium text-gray-700">Bài viết nổi bật</span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-60 transition-colors">
                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Tạo bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
