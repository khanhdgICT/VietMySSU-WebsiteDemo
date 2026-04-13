'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Calendar, Eye, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { postsApi, categoriesApi } from '@/lib/api';
import { formatDate, getLocalizedField } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  thumbnail?: string;
  publishedAt?: string;
  viewCount: number;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function NewsListPage() {
  const locale = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    categoriesApi.getAll('news').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    postsApi.getAll({ page, limit, search: search || undefined, categoryId: categoryId || undefined })
      .then((res) => {
        setPosts(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, categoryId]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {locale === 'vi' ? 'Tin tức & Sự kiện' : 'News & Events'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {locale === 'vi'
              ? 'Cập nhật thông tin mới nhất về ngành Call Center, BPO và các hoạt động của VietMy SSU.'
              : 'Stay updated with the latest news about Call Center, BPO industry, and VietMy SSU activities.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={locale === 'vi' ? 'Tìm kiếm bài viết...' : 'Search articles...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategoryId(''); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${!categoryId ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {locale === 'vi' ? 'Tất cả' : 'All'}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategoryId(c.id); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${categoryId === c.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-80" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">📭</div>
            <p>{locale === 'vi' ? 'Không tìm thấy bài viết nào.' : 'No articles found.'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">📰</div>
                  )}
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-[var(--primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category.name}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.publishedAt, locale === 'vi' ? 'vi-VN' : 'en-US')}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <h2 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {getLocalizedField(post, 'title', locale)}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {getLocalizedField(post, 'excerpt', locale)}
                  </p>
                  <Link
                    href={`/${locale}/news/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] group-hover:gap-2 transition-all"
                  >
                    {locale === 'vi' ? 'Đọc tiếp' : 'Read more'}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors ${page === i + 1 ? 'bg-[var(--primary)] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
