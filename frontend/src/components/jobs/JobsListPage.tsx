'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Briefcase, ArrowRight } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import { getLocalizedField } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  location: string;
  salary?: string;
  jobType: string;
  deadline?: string;
  quantity: number;
  isFeatured: boolean;
}

const jobTypeMap: Record<string, { vi: string; en: string; color: string }> = {
  full_time: { vi: 'Toàn thời gian', en: 'Full Time', color: 'text-blue-600 bg-blue-50' },
  part_time: { vi: 'Bán thời gian', en: 'Part Time', color: 'text-orange-600 bg-orange-50' },
  contract: { vi: 'Hợp đồng', en: 'Contract', color: 'text-purple-600 bg-purple-50' },
  internship: { vi: 'Thực tập', en: 'Internship', color: 'text-green-600 bg-green-50' },
};

export default function JobsListPage() {
  const locale = useLocale();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    setLoading(true);
    jobsApi.getAll({ search: search || undefined, limit: 20 })
      .then((res) => setJobs(res.data.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [search]);

  const filtered = location
    ? jobs.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()))
    : jobs;

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {locale === 'vi' ? 'Cơ hội nghề nghiệp' : 'Career Opportunities'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {locale === 'vi'
              ? 'Tham gia đội ngũ VietMy SSU — nơi bạn phát triển sự nghiệp trong ngành Call Center hàng đầu.'
              : 'Join the VietMy SSU team — where you grow your career in the leading Call Center industry.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-gray-50 rounded-2xl p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={locale === 'vi' ? 'Tìm kiếm vị trí...' : 'Search positions...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[160px]"
            >
              <option value="">{locale === 'vi' ? 'Tất cả địa điểm' : 'All locations'}</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-32" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p>{locale === 'vi' ? 'Không tìm thấy vị trí phù hợp.' : 'No matching positions found.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job, i) => {
              const type = jobTypeMap[job.jobType];
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        {job.isFeatured && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
                            ⭐ {locale === 'vi' ? 'Nổi bật' : 'Featured'}
                          </span>
                        )}
                        {type && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type.color}`}>
                            {locale === 'vi' ? type.vi : type.en}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-[var(--primary)] transition-colors mb-3">
                        {getLocalizedField(job, 'title', locale)}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-red-400" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} className="text-green-500" />
                            {job.salary}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-orange-400" />
                            {locale === 'vi' ? 'Hạn nộp:' : 'Deadline:'}{' '}
                            {new Date(job.deadline).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} className="text-blue-400" />
                          {job.quantity} {locale === 'vi' ? 'vị trí' : 'positions'}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/jobs/${job.id}`}
                      className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[var(--primary-dark)] transition-colors whitespace-nowrap"
                    >
                      {locale === 'vi' ? 'Xem chi tiết' : 'View details'}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
