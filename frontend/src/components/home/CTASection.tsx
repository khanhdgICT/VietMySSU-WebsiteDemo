'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Phone, Mail, ArrowRight, MessageCircle } from 'lucide-react';

export default function CTASection() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      <div className="container-custom relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-cyan-200 text-sm font-semibold mb-6">
            <MessageCircle size={16} />
            {locale === 'vi' ? 'Sẵn sàng hợp tác?' : 'Ready to partner?'}
          </span>

          <h2 className="text-3xl md:text-5xl font-black mb-6">
            {locale === 'vi' ? (
              <>Bắt đầu hành trình<br />nâng cao dịch vụ khách hàng</>
            ) : (
              <>Start your journey<br />to better customer service</>
            )}
          </h2>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            {locale === 'vi'
              ? 'Liên hệ ngay để được tư vấn miễn phí. Chúng tôi cam kết tư vấn và đưa ra giải pháp phù hợp nhất trong vòng 24 giờ.'
              : 'Contact us now for a free consultation. We commit to advising and providing the most suitable solution within 24 hours.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="group flex items-center gap-3 bg-white text-[var(--primary)] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-xl"
            >
              <Mail size={20} />
              {locale === 'vi' ? 'Gửi yêu cầu tư vấn' : 'Send Consultation Request'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:19001234"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/30"
            >
              <Phone size={20} />
              1900 1234
            </a>
          </div>

          <p className="mt-6 text-blue-200 text-sm">
            {locale === 'vi'
              ? '⏰ Hỗ trợ 24/7 · 🔒 Miễn phí tư vấn · ⚡ Phản hồi trong 24h'
              : '⏰ 24/7 Support · 🔒 Free consultation · ⚡ Response within 24h'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
