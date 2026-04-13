import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

interface Props {
  params: { locale: string };
}

const services = [
  {
    slug: 'inbound',
    icon: '📞',
    vi: { title: 'Call Center Inbound', desc: 'Dịch vụ tiếp nhận cuộc gọi đến chuyên nghiệp 24/7. Hỗ trợ kỹ thuật, chăm sóc khách hàng và giải đáp thắc mắc.' },
    en: { title: 'Inbound Call Center', desc: 'Professional inbound call handling 24/7. Technical support, customer care and FAQ.' },
  },
  {
    slug: 'outbound',
    icon: '📤',
    vi: { title: 'Call Center Outbound', desc: 'Dịch vụ gọi ra chuyên nghiệp: telesales, khảo sát, nhắc lịch, chăm sóc khách hàng chủ động.' },
    en: { title: 'Outbound Call Center', desc: 'Professional outbound calling: telesales, surveys, payment reminders, proactive customer care.' },
  },
  {
    slug: 'bpo',
    icon: '🏢',
    vi: { title: 'Dịch vụ BPO', desc: 'Thuê ngoài quy trình kinh doanh toàn diện: nhập liệu, xử lý đơn hàng, back-office, kế toán.' },
    en: { title: 'BPO Services', desc: 'Comprehensive business process outsourcing: data entry, order processing, back-office, accounting.' },
  },
  {
    slug: 'ai',
    icon: '🤖',
    vi: { title: 'Giải pháp AI', desc: 'Ứng dụng trí tuệ nhân tạo vào Call Center: chatbot, phân tích cảm xúc, voice bot, tự động hóa.' },
    en: { title: 'AI Solutions', desc: 'Apply AI to Call Centers: chatbot, sentiment analysis, voice bot, process automation.' },
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.locale === 'vi' ? 'Dịch vụ - VietMy SSU' : 'Services - VietMy SSU',
    description: params.locale === 'vi'
      ? 'Các giải pháp Call Center & BPO chuyên nghiệp của VietMy SSU'
      : 'Professional Call Center & BPO solutions by VietMy SSU',
  };
}

export default function ServicesPage({ params }: Props) {
  const { locale } = params;
  const isVi = locale === 'vi';

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {isVi ? 'Dịch vụ của chúng tôi' : 'Our Services'}
          </h1>
          <p className="text-gray-500 text-lg">
            {isVi
              ? 'Giải pháp Call Center & BPO toàn diện, được thiết kế riêng cho doanh nghiệp Việt Nam'
              : 'Comprehensive Call Center & BPO solutions designed for Vietnamese businesses'}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((svc) => {
            const s = isVi ? svc.vi : svc.en;
            return (
              <Link
                key={svc.slug}
                href={`/${locale}/services/${svc.slug}`}
                className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:border-[var(--primary)] transition-all duration-300"
              >
                <div className="text-5xl mb-5">{svc.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[var(--primary)] transition-colors">
                  {s.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-5">{s.desc}</p>
                <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold text-sm">
                  {isVi ? 'Tìm hiểu thêm' : 'Learn more'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-black mb-3">
            {isVi ? 'Bạn cần tư vấn?' : 'Need a consultation?'}
          </h2>
          <p className="text-blue-100 mb-8">
            {isVi
              ? 'Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7'
              : 'Our expert team is ready to support you 24/7'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="bg-white text-[var(--primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {isVi ? 'Liên hệ ngay' : 'Contact Us'}
            </Link>
            <a
              href="tel:19001234"
              className="flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Phone size={18} />
              1900 1234
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
