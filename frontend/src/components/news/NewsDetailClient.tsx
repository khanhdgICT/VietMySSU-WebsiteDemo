'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react';
import { postsApi } from '@/lib/api';
import { formatDate, getLocalizedField } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  thumbnail?: string;
  publishedAt?: string;
  viewCount: number;
  category?: { name: string };
  author?: { fullName: string };
  metaTitle?: string;
  metaDescription?: string;
}

export default function NewsDetailClient({ slug, locale }: { slug: string; locale: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    postsApi.getBySlug(slug)
      .then((res) => setPost(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <div className="animate-pulse max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4" />
          <div className="h-64 bg-gray-200 rounded-2xl mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) return notFound();

  const title = getLocalizedField(post, 'title', locale);
  const content = getLocalizedField(post, 'content', locale);

  return (
    <article className="pt-32 pb-20">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href={`/${locale}`} className="hover:text-[var(--primary)]">
            {locale === 'vi' ? 'Trang chủ' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/news`} className="hover:text-[var(--primary)]">
            {locale === 'vi' ? 'Tin tức' : 'News'}
          </Link>
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">{title}</span>
        </div>

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {post.category && (
            <span className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full">
              <Tag size={14} />
              {post.category.name}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <Calendar size={14} />
              {formatDate(post.publishedAt, locale === 'vi' ? 'vi-VN' : 'en-US')}
            </span>
          )}
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Eye size={14} />
            {post.viewCount.toLocaleString()} {locale === 'vi' ? 'lượt xem' : 'views'}
          </span>
          {post.author && (
            <span className="text-sm text-gray-400">
              by <strong className="text-gray-600">{post.author.fullName}</strong>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">{title}</h1>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10">
            <Image
              src={post.thumbnail}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose-content max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Back button */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} />
            {locale === 'vi' ? 'Quay lại danh sách tin tức' : 'Back to news list'}
          </Link>
        </div>
      </div>
    </article>
  );
}
