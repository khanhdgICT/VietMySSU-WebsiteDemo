'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

const stats = [
  { value: '10+', labelVi: 'Năm kinh nghiệm', labelEn: 'Years experience' },
  { value: '500+', labelVi: 'Khách hàng', labelEn: 'Clients' },
  { value: '5,000+', labelVi: 'Nhân viên', labelEn: 'Agents' },
  { value: '99.8%', labelVi: 'Uptime SLA', labelEn: 'Uptime SLA' },
];

const features = [
  { vi: 'Công nghệ AI tiên tiến', en: 'Advanced AI Technology' },
  { vi: 'Hoạt động 24/7/365', en: '24/7/365 Operations' },
  { vi: 'Đa ngôn ngữ (VI/EN/JP)', en: 'Multi-language (VI/EN/JP)' },
];

export default function HeroSection() {
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1a4e] to-[#0056b3]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-cyan-300 text-sm font-semibold mb-6 border border-cyan-500/30"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {locale === 'vi' ? 'Đối tác tin cậy hàng đầu' : 'Vietnam\'s #1 Trusted Partner'}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {locale === 'vi' ? (
                <>
                  Giải pháp{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Call Center
                  </span>{' '}
                  <br />hàng đầu Việt Nam
                </>
              ) : (
                <>
                  Vietnam&apos;s Leading{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Call Center
                  </span>{' '}
                  Solutions
                </>
              )}
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {locale === 'vi'
                ? 'Chúng tôi cung cấp dịch vụ Call Center và BPO chuyên nghiệp, giúp doanh nghiệp nâng cao chất lượng dịch vụ khách hàng với công nghệ AI tiên tiến.'
                : 'We provide professional Call Center and BPO services, helping businesses improve customer service quality with advanced AI technology.'}
            </p>

            <ul className="space-y-2 mb-8">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                  {locale === 'vi' ? f.vi : f.en}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/contact`}
                className="group flex items-center gap-2 px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40"
              >
                {locale === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Play size={14} className="ml-0.5" />
                </div>
                {locale === 'vi' ? 'Xem demo' : 'Watch Demo'}
              </button>
            </div>
          </motion.div>

          {/* Stats / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white/10 rounded-2xl p-5 text-center hover:bg-white/20 transition-colors"
                    >
                      <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                      <div className="text-cyan-300 text-sm font-medium">
                        {locale === 'vi' ? stat.labelVi : stat.labelEn}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Live indicator */}
                <div className="mt-6 flex items-center justify-between bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">
                        {locale === 'vi' ? 'Đang hoạt động' : 'Currently Active'}
                      </div>
                      <div className="text-gray-400 text-xs">1,247 agents online</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">98.7%</div>
                    <div className="text-gray-400 text-xs">SLA</div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-8 -right-8 bg-white rounded-2xl p-4 shadow-2xl"
              >
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xs font-bold text-gray-800">Top 10 Call Center</div>
                <div className="text-xs text-gray-500">Vietnam 2024</div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl"
              >
                <div className="text-2xl mb-1">🤖</div>
                <div className="text-xs font-bold text-gray-800">AI-Powered</div>
                <div className="text-xs text-gray-500">Smart Routing</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
