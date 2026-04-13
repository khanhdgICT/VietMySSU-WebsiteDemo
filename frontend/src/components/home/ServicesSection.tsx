'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowRight, Phone, PhoneOutgoing, Building2, Bot } from 'lucide-react';

const services = [
  {
    icon: Phone,
    slug: 'inbound',
    vi: 'Call Center Inbound',
    en: 'Inbound Call Center',
    descVi: 'Tiếp nhận và xử lý cuộc gọi đến từ khách hàng. Hỗ trợ kỹ thuật, giải đáp thắc mắc và chăm sóc khách hàng 24/7.',
    descEn: 'Receive and handle inbound calls from customers. Technical support, FAQ, and customer care 24/7.',
    features: { vi: ['Hotline 24/7', 'ACD thông minh', 'Ghi âm & QA', 'Báo cáo real-time'], en: ['24/7 Hotline', 'Smart ACD', 'Recording & QA', 'Real-time Reports'] },
    gradient: 'from-blue-500 to-blue-700',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-600',
  },
  {
    icon: PhoneOutgoing,
    slug: 'outbound',
    vi: 'Call Center Outbound',
    en: 'Outbound Call Center',
    descVi: 'Gọi ra để tiếp thị, khảo sát, nhắc nhở thanh toán và chăm sóc khách hàng chủ động.',
    descEn: 'Outbound calls for marketing, surveys, payment reminders, and proactive customer care.',
    features: { vi: ['Telesales B2B/B2C', 'Auto-dialer', 'Lead generation', 'Khảo sát thị trường'], en: ['B2B/B2C Telesales', 'Auto-dialer', 'Lead generation', 'Market surveys'] },
    gradient: 'from-orange-500 to-orange-700',
    lightBg: 'bg-orange-50',
    lightText: 'text-orange-600',
  },
  {
    icon: Building2,
    slug: 'bpo',
    vi: 'Dịch vụ BPO',
    en: 'BPO Services',
    descVi: 'Thuê ngoài quy trình kinh doanh toàn diện: nhập liệu, xử lý đơn hàng, kế toán, HR.',
    descEn: 'Comprehensive business process outsourcing: data entry, order processing, accounting, HR.',
    features: { vi: ['Nhập liệu', 'Xử lý đơn hàng', 'Back-office', 'Tuân thủ & Báo cáo'], en: ['Data entry', 'Order processing', 'Back-office', 'Compliance & Reporting'] },
    gradient: 'from-green-500 to-green-700',
    lightBg: 'bg-green-50',
    lightText: 'text-green-600',
  },
  {
    icon: Bot,
    slug: 'ai',
    vi: 'Giải pháp AI',
    en: 'AI Solutions',
    descVi: 'Ứng dụng AI vào Call Center: chatbot, phân tích cảm xúc, tự động hóa quy trình, voice bot.',
    descEn: 'AI in Call Center: chatbot, sentiment analysis, process automation, voice bot.',
    features: { vi: ['AI Chatbot', 'Voice Analytics', 'Auto-IVR', 'Sentiment Analysis'], en: ['AI Chatbot', 'Voice Analytics', 'Auto-IVR', 'Sentiment Analysis'] },
    gradient: 'from-purple-500 to-purple-700',
    lightBg: 'bg-purple-50',
    lightText: 'text-purple-600',
  },
];

export default function ServicesSection() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
            {locale === 'vi' ? 'Dịch vụ' : 'Services'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-2 mb-4 text-gray-900">
            {locale === 'vi' ? 'Giải pháp toàn diện cho doanh nghiệp' : 'Comprehensive Business Solutions'}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {locale === 'vi'
              ? 'Chúng tôi cung cấp đầy đủ các dịch vụ Call Center và BPO, được tùy chỉnh theo nhu cầu riêng của từng doanh nghiệp.'
              : 'We offer a full range of Call Center and BPO services, customized to each business\'s specific needs.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group card-hover"
            >
              <div className={`bg-gradient-to-r ${s.gradient} p-6`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <s.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {locale === 'vi' ? s.vi : s.en}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {locale === 'vi' ? s.descVi : s.descEn}
                </p>
                <ul className="grid grid-cols-2 gap-2 mb-5">
                  {(locale === 'vi' ? s.features.vi : s.features.en).map((f, j) => (
                    <li key={j} className={`text-sm font-medium ${s.lightText} ${s.lightBg} px-3 py-1.5 rounded-lg`}>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/services/${s.slug}`}
                  className={`inline-flex items-center gap-2 font-semibold text-sm ${s.lightText} group-hover:gap-3 transition-all`}
                >
                  {locale === 'vi' ? 'Tìm hiểu thêm' : 'Learn more'}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
