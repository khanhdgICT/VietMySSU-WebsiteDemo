'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  items: { key: string; href: string; icon: string }[];
  locale: string;
  t: (key: string) => string;
}

const serviceDescriptions: Record<string, { vi: string; en: string }> = {
  inbound: {
    vi: 'Xử lý cuộc gọi đến, hỗ trợ khách hàng 24/7',
    en: 'Handle inbound calls, 24/7 customer support',
  },
  outbound: {
    vi: 'Telesales, khảo sát thị trường, nhắc nhở',
    en: 'Telesales, market research, reminders',
  },
  bpo: {
    vi: 'Thuê ngoài quy trình kinh doanh toàn diện',
    en: 'Comprehensive business process outsourcing',
  },
  ai: {
    vi: 'Chatbot AI, phân tích giọng nói, tự động hóa',
    en: 'AI chatbot, voice analytics, automation',
  },
};

export default function MegaMenu({ items, locale, t }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="p-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          {locale === 'vi' ? 'Dịch vụ của chúng tôi' : 'Our Services'}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const desc = serviceDescriptions[item.key];
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <div className="flex items-center gap-1 font-semibold text-sm text-gray-800 group-hover:text-[var(--primary)]">
                    {t(`services.${item.key}`)}
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {desc ? (locale === 'vi' ? desc.vi : desc.en) : ''}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/${locale}/services`}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
          >
            {locale === 'vi' ? 'Xem tất cả dịch vụ' : 'View all services'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
