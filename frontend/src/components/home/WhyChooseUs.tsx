'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const reasons = [
  {
    emoji: '🏆',
    vi: 'Kinh nghiệm hàng đầu',
    en: 'Industry-Leading Experience',
    descVi: 'Hơn 10 năm hoạt động trong ngành, chúng tôi hiểu sâu sắc nhu cầu của từng lĩnh vực kinh doanh.',
    descEn: 'Over 10 years in the industry, we deeply understand the needs of each business sector.',
  },
  {
    emoji: '⚡',
    vi: 'Triển khai nhanh chóng',
    en: 'Rapid Deployment',
    descVi: 'Hệ thống có thể đi vào hoạt động trong 48 giờ. Không cần đầu tư hạ tầng phức tạp.',
    descEn: 'System can go live within 48 hours. No complex infrastructure investment required.',
  },
  {
    emoji: '📊',
    vi: 'Báo cáo minh bạch',
    en: 'Transparent Reporting',
    descVi: 'Dashboard real-time, báo cáo chi tiết hàng ngày/tuần/tháng. Toàn quyền kiểm soát.',
    descEn: 'Real-time dashboard, detailed daily/weekly/monthly reports. Full control.',
  },
  {
    emoji: '🌐',
    vi: 'Đa ngôn ngữ',
    en: 'Multi-language Support',
    descVi: 'Hỗ trợ Tiếng Việt, Tiếng Anh, Tiếng Nhật và nhiều ngôn ngữ khác.',
    descEn: 'Support for Vietnamese, English, Japanese, and many other languages.',
  },
  {
    emoji: '🔒',
    vi: 'Bảo mật cao',
    en: 'High Security',
    descVi: 'Tuân thủ ISO 27001, GDPR. Dữ liệu được mã hóa và lưu trữ an toàn.',
    descEn: 'ISO 27001, GDPR compliant. Data is encrypted and securely stored.',
  },
  {
    emoji: '💰',
    vi: 'Chi phí tối ưu',
    en: 'Cost Optimization',
    descVi: 'Tiết kiệm 30-60% chi phí so với tự vận hành. Mô hình linh hoạt theo quy mô.',
    descEn: 'Save 30-60% costs vs. in-house operations. Flexible scale-based model.',
  },
];

export default function WhyChooseUs() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
            {locale === 'vi' ? 'Vì sao chọn chúng tôi' : 'Why Choose Us'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-2 mb-4">
            {locale === 'vi' ? 'Lý do doanh nghiệp tin tưởng VietMy SSU' : 'Why Businesses Trust VietMy SSU'}
          </h2>
        </motion.div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reasons.map((r, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 h-full border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div className="text-5xl mb-4">{r.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {locale === 'vi' ? r.vi : r.en}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {locale === 'vi' ? r.descVi : r.descEn}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
