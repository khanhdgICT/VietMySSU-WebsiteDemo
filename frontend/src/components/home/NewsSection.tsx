'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ArrowRight, Calendar, Eye } from 'lucide-react';
import { postsApi } from '@/lib/api';
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
  category?: { name: string };
}

export default function NewsSection() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    postsApi.getAll({ limit: 3, status: 'published' })
      .then((res) => setPosts(res.data.data || []))
      .catch(() => {
        setPosts([
          { id: '1', title: 'Xu hướng Call Center 2024: AI và Automation', slug: 'xu-huong-2024', excerpt: 'Tìm hiểu về các xu hướng công nghệ mới nhất...', viewCount: 1200, category: { name: 'Tin tức ngành' } },
          { id: '2', title: 'VietMy SSU ra mắt dịch vụ mới', slug: 'dich-vu-moi', excerpt: 'Giới thiệu nền tảng Call Center thế hệ mới...', viewCount: 850, category: { name: 'Tin tức mới' } },
          { id: '3', title: 'Hội thảo Call Center Summit 2024', slug: 'hoi-thao-2024', excerpt: 'VietMy SSU tham dự và đạt giải thưởng...', viewCount: 630, category: { name: 'Tin tức ngành' } },
        ]);
      });
  }, []);

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10"
        >
          <div>
            <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
              {locale === 'vi' ? 'Tin tức' : 'News'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">
              {locale === 'vi' ? 'Tin tức & Sự kiện' : 'News & Events'}
            </h2>
          </div>
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all"
          >
            {locale === 'vi' ? 'Xem tất cả' : 'View all'}
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-30">📰</span>
                  </div>
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
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                  {getLocalizedField(post, 'title', locale)}
                </h3>
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
      </div>
    </section>
  );
}
