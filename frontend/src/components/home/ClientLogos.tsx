'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Mock client logos (in production, load from CMS/API)
const clients = [
  { name: 'Viettel', logo: '🔴' },
  { name: 'Vingroup', logo: '🔵' },
  { name: 'FPT', logo: '🟠' },
  { name: 'VNPT', logo: '🟡' },
  { name: 'Masan Group', logo: '🟢' },
  { name: 'VPBank', logo: '🟣' },
  { name: 'Techcombank', logo: '🔵' },
  { name: 'Vinhomes', logo: '🟤' },
  { name: 'VinFast', logo: '🔴' },
  { name: 'MoMo', logo: '🟣' },
];

export default function ClientLogos() {
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center mb-8"
        >
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
            {locale === 'vi' ? 'Được tin dùng bởi hơn 500+ doanh nghiệp' : 'Trusted by 500+ businesses'}
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={32}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={3000}
          loop
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {[...clients, ...clients].map((client, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl group-hover:shadow-md transition-shadow">
                  {client.logo}
                </div>
                <span className="text-xs text-gray-400 font-medium">{client.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
