'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Filter, MapPin, DollarSign, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { jobsApi } from '@/lib/api';
import { formatDate, slugify } from '@/lib/utils';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface Job {
  id: string; title: string; location: string; salary: string;
  jobType: string; status: string; isFeatured: boolean;
  quantity: number; deadline?: string; createdAt: string;
}

const EMPTY_FORM = {
  title: '', titleEn: '', slug: '', location: '',
  salary: '', jobType: 'full_time',
  description: '', descriptionEn: '',
  requirements: '', requirementsEn: '',
  benefits: '', benefitsEn: '',
  status: 'draft', isFeatured: false, deadline: '', quantity: 1,
};

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-700', closed: 'bg-red-100 text-red-700', draft: 'bg-yellow-100 text-yellow-700',
};
const statusLabels: Record<string, string> = { open: 'Đang tuyển', closed: 'Đã đóng', draft: 'Nháp' };
const jobTypeLabels: Record<string, string> = {
  full_time: 'Toàn thời gian', part_time: 'Bán thời gian', contract: 'Hợp đồng', internship: 'Thực tập',
};

// Sub-tabs for the rich content section
type ContentTab = 'description' | 'requirements' | 'benefits';
type LangTab = 'vi' | 'en';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [langTab, setLangTab] = useState<LangTab>('vi');
  const [contentTab, setContentTab] = useState<ContentTab>('description');

  const fetchJobs = () => {
    setLoading(true);
    jobsApi
      .adminGetAll({ page, limit: 15, search: search || undefined, status: statusFilter || undefined })
      .then((res) => { setJobs(res.data.data || []); setTotal(res.data.total || 0); })
      .catch(() => { setJobs([]); setTotal(0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [page, search, statusFilter]);

  const openCreate = () => {
    setEditId(null); setForm(EMPTY_FORM);
    setLangTab('vi'); setContentTab('description');
    setShowModal(true);
  };

  const openEdit = async (job: Job) => {
    try {
      const res = await jobsApi.getById(job.id);
      const found = res.data;
      setForm({
        title: found.title || '', titleEn: found.titleEn || '',
        slug: found.slug || '', location: found.location || '',
        salary: found.salary || '', jobType: found.jobType || 'full_time',
        description: found.description || '', descriptionEn: found.descriptionEn || '',
        requirements: found.requirements || '', requirementsEn: found.requirementsEn || '',
        benefits: found.benefits || '', benefitsEn: found.benefitsEn || '',
        status: found.status || 'draft', isFeatured: found.isFeatured || false,
        deadline: found.deadline ? found.deadline.split('T')[0] : '',
        quantity: found.quantity || 1,
      });
      setEditId(job.id); setLangTab('vi'); setContentTab('description');
      setShowModal(true);
    } catch { toast.error('Không tải được dữ liệu'); }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Vui lòng nhập tên vị trí');
    if (!form.location.trim()) return toast.error('Vui lòng nhập địa điểm');
    if (!form.description || form.description === '<p></p>') return toast.error('Vui lòng nhập mô tả công việc');
    if (!form.requirements || form.requirements === '<p></p>') return toast.error('Vui lòng nhập yêu cầu');
    if (!form.slug.trim()) return toast.error('Vui lòng nhập slug');
    setSaving(true);
    try {
      const payload = {
        ...form, quantity: Number(form.quantity),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      };
      if (editId) {
        await jobsApi.update(editId, payload);
        toast.success('Đã cập nhật tin tuyển dụng');
      } else {
        await jobsApi.create(payload);
        toast.success('Đã tạo tin tuyển dụng mới');
      }
      setShowModal(false); fetchJobs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tin tuyển dụng này?')) return;
    try { await jobsApi.delete(id); toast.success('Đã xóa'); fetchJobs(); }
    catch { toast.error('Có lỗi xảy ra'); }
  };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  // Which field to show in editor based on lang + content tab
  const editorKey = langTab === 'vi'
    ? contentTab
    : `${contentTab}En` as keyof typeof EMPTY_FORM;

  const contentTabs: { key: ContentTab; label: string }[] = [
    { key: 'description', label: 'Mô tả công việc' },
    { key: 'requirements', label: 'Yêu cầu' },
    { key: 'benefits', label: 'Quyền lợi' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản lý Tuyển dụng</h1>
          <p className="text-gray-400 text-sm mt-1">{total} tin tuyển dụng</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors">
          <Plus size={18} /> Thêm tin tuyển dụng
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm tin tuyển dụng..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="open">Đang tuyển</option>
            <option value="closed">Đã đóng</option>
            <option value="draft">Nháp</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 h-12 rounded-lg" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><div className="text-4xl mb-3">💼</div><p>Không có tin tuyển dụng nào</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Vị trí</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Địa điểm</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Lương</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Loại</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Trạng thái</th>
                  <th className="text-right px-4 py-4 font-semibold text-gray-600">SL</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Hạn nộp</th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 max-w-xs truncate">{job.title}</p>
                      {job.isFeatured && <span className="text-xs text-yellow-600">⭐ Nổi bật</span>}
                    </td>
                    <td className="px-4 py-4"><span className="flex items-center gap-1 text-gray-500"><MapPin size={12} />{job.location}</span></td>
                    <td className="px-4 py-4 text-gray-600 text-xs whitespace-nowrap"><span className="flex items-center gap-1"><DollarSign size={12} />{job.salary}</span></td>
                    <td className="px-4 py-4 text-gray-500 text-xs">{jobTypeLabels[job.jobType] || job.jobType}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[job.status]}`}>{statusLabels[job.status]}</span>
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-600">{job.quantity}</td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{job.deadline ? formatDate(job.deadline, 'vi-VN') : '—'}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(job)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
          <span>Hiển thị {jobs.length}/{total}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Trước</button>
            <span className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl">{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={jobs.length < 15} className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50">Sau</button>
          </div>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl my-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-800">{editId ? 'Chỉnh sửa tin tuyển dụng' : 'Thêm tin tuyển dụng mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Thông tin cơ bản */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên vị trí (VI) <span className="text-red-500">*</span></label>
                    <input value={form.title}
                      onChange={(e) => { set('title', e.target.value); if (!editId) set('slug', slugify(e.target.value)); }}
                      placeholder="Nhân viên Tư vấn Khách hàng"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title (EN)</label>
                    <input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)}
                      placeholder="Customer Service Agent"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
                    <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa điểm <span className="text-red-500">*</span></label>
                    <input value={form.location} onChange={(e) => set('location', e.target.value)}
                      placeholder="Hà Nội / TP. HCM / Đà Nẵng"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mức lương</label>
                    <input value={form.salary} onChange={(e) => set('salary', e.target.value)}
                      placeholder="10,000,000 - 15,000,000 VNĐ"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại hình</label>
                    <select value={form.jobType} onChange={(e) => set('jobType', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="full_time">Toàn thời gian</option>
                      <option value="part_time">Bán thời gian</option>
                      <option value="contract">Hợp đồng</option>
                      <option value="internship">Thực tập</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                    <select value={form.status} onChange={(e) => set('status', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="draft">Nháp</option>
                      <option value="open">Đang tuyển</option>
                      <option value="closed">Đã đóng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng tuyển</label>
                    <input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Hạn nộp hồ sơ</label>
                    <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer pb-2.5">
                      <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Tin nổi bật</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Nội dung */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Nội dung mô tả</h3>

                {/* Language toggle */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {(['vi', 'en'] as const).map((l) => (
                      <button key={l} type="button" onClick={() => setLangTab(l)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${langTab === l ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
                        {l === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {contentTabs.map((t) => (
                      <button key={t.key} type="button" onClick={() => setContentTab(t.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${contentTab === t.key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {t.label}
                        {t.key === 'description' && langTab === 'vi' && <span className="text-red-500 ml-0.5">*</span>}
                        {t.key === 'requirements' && langTab === 'vi' && <span className="text-red-500 ml-0.5">*</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <RichTextEditor
                  key={`${editorKey}`}
                  value={(form as any)[editorKey] || ''}
                  onChange={(v) => set(editorKey as string, v)}
                  placeholder={
                    contentTab === 'description' ? 'Mô tả công việc, trách nhiệm...' :
                    contentTab === 'requirements' ? 'Yêu cầu về bằng cấp, kinh nghiệm...' :
                    'Quyền lợi, chế độ đãi ngộ...'
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-60 transition-colors">
                {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Tạo tin tuyển dụng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
