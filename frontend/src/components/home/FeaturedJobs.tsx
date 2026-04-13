'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import 'swiper/css';
import 'swiper/css/pagination';

interface Job {
  id: string;
  title: string;
  titleEn?: string;
  location: string;
  salary?: string;
  jobType: string;
  deadline?: string;
}

export default function FeaturedJobs() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobsApi.getAll({ featured: true, limit: 6 })
      .then((res) => setJobs(res.data.data || []))
      .catch(() => {
        // Fallback mock data
        setJobs([
          { id: '1', title: 'Nhân viên Tư vấn Khách hàng', titleEn: 'Customer Service Agent', location: 'Hà Nội', salary: '8-12 triệu', jobType: 'full_time' },
          { id: '2', title: 'Trưởng nhóm Call Center', titleEn: 'Call Center Team Leader', location: 'TP.HCM', salary: '15-20 triệu', jobType: 'full_time' },
          { id: '3', title: 'Kỹ sư Hệ thống Call Center', titleEn: 'Call Center System Engineer', location: 'Đà Nẵng', salary: '18-25 triệu', jobType: 'full_time' },
        ]);
      });
  }, []);

  const jobTypeLabel: Record<string, { vi: string; en: string }> = {
    full_time: { vi: 'Toàn thời gian', en: 'Full Time' },
    part_time: { vi: 'Bán thời gian', en: 'Part Time' },
    contract: { vi: 'Hợp đồng', en: 'Contract' },
    internship: { vi: 'Thực tập', en: 'Internship' },
  };

  return (
    <section ref={ref} className="section-padding bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-blue-300 blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10"
        >
          <div>
            <span className="text-cyan-300 font-semibold text-sm uppercase tracking-wider">
              {locale === 'vi' ? 'Tuyển dụng nổi bật' : 'Featured Jobs'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">
              {locale === 'vi' ? 'Cơ hội nghề nghiệp hấp dẫn' : 'Exciting Career Opportunities'}
            </h2>
          </div>
          <Link
            href={`/${locale}/jobs`}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors border border-white/20 whitespace-nowrap"
          >
            {locale === 'vi' ? 'Xem tất cả' : 'View all'}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {jobs.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {jobs.map((job, i) => (
              <SwiperSlide key={job.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Briefcase size={24} />
                    </div>
                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                      {jobTypeLabel[job.jobType]?.[locale as 'vi' | 'en'] || job.jobType}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-3 line-clamp-2">
                    {locale === 'vi' ? job.title : (job.titleEn || job.title)}
                  </h3>
                  <div className="space-y-2 mb-5 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="shrink-0 text-cyan-400" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="shrink-0 text-green-400" />
                        {job.salary}
                      </div>
                    )}
                    {job.deadline && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="shrink-0 text-yellow-400" />
                        {new Date(job.deadline).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/${locale}/jobs/${job.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-white transition-colors"
                  >
                    {locale === 'vi' ? 'Xem chi tiết' : 'View details'}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-300 py-12">
            {locale === 'vi' ? 'Đang tải...' : 'Loading...'}
          </div>
        )}
      </div>
    </section>
  );
}
