'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, Users, Award } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    vi: 'Uy tín & Bảo mật',
    en: 'Trust & Security',
    descVi: 'Bảo mật dữ liệu khách hàng theo tiêu chuẩn ISO 27001',
    descEn: 'ISO 27001 certified data security for all client data',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    vi: 'Công nghệ tiên tiến',
    en: 'Advanced Technology',
    descVi: 'Nền tảng Cloud + AI, tích hợp omnichannel',
    descEn: 'Cloud + AI platform, omnichannel integration',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: Users,
    vi: 'Đội ngũ chuyên nghiệp',
    en: 'Professional Team',
    descVi: 'Hơn 5,000 nhân viên được đào tạo chuyên sâu',
    descEn: 'Over 5,000 professionally trained agents',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Award,
    vi: 'Chất lượng đảm bảo',
    en: 'Quality Assured',
    descVi: 'SLA cam kết 99.8% uptime, CSAT trên 95%',
    descEn: '99.8% uptime SLA guaranteed, CSAT above 95%',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
];

export default function AboutSection() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
              {locale === 'vi' ? 'Về chúng tôi' : 'About Us'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-2 mb-6 text-gray-900">
              {locale === 'vi'
                ? 'Đơn vị cung cấp dịch vụ Call Center hàng đầu Việt Nam'
                : "Vietnam's Leading Call Center Service Provider"}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {locale === 'vi'
                ? 'VietMy SSU được thành lập năm 2014, chúng tôi tự hào là đối tác tin cậy của hơn 500 doanh nghiệp trong và ngoài nước. Với hơn 10 năm kinh nghiệm trong lĩnh vực Call Center và BPO, chúng tôi cung cấp các giải pháp toàn diện, linh hoạt và hiệu quả.'
                : 'Established in 2014, VietMy SSU is proud to be a trusted partner of over 500 domestic and international businesses. With over 10 years of experience in Call Center and BPO, we provide comprehensive, flexible, and effective solutions.'}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {locale === 'vi'
                ? 'Chúng tôi không chỉ cung cấp dịch vụ — chúng tôi xây dựng quan hệ đối tác lâu dài, giúp doanh nghiệp của bạn phát triển bền vững.'
                : "We don't just provide services — we build long-term partnerships, helping your business grow sustainably."}
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--primary)]">500+</div>
                <div className="text-sm text-gray-500">{locale === 'vi' ? 'Khách hàng' : 'Clients'}</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--primary)]">3</div>
                <div className="text-sm text-gray-500">{locale === 'vi' ? 'Chi nhánh' : 'Branches'}</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-[var(--primary)]">10+</div>
                <div className="text-sm text-gray-500">{locale === 'vi' ? 'Năm KN' : 'Years Exp.'}</div>
              </div>
            </div>
          </motion.div>

          {/* Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${p.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <p.icon size={24} className={p.color} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {locale === 'vi' ? p.vi : p.en}
                </h4>
                <p className="text-sm text-gray-500">
                  {locale === 'vi' ? p.descVi : p.descEn}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
