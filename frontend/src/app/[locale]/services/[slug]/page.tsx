import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Phone } from 'lucide-react';

const services: Record<string, {
  vi: { title: string; desc: string; features: string[]; process: string[] };
  en: { title: string; desc: string; features: string[]; process: string[] };
}> = {
  inbound: {
    vi: {
      title: 'Call Center Inbound',
      desc: 'Dịch vụ tiếp nhận cuộc gọi đến chuyên nghiệp, 24/7. Hỗ trợ kỹ thuật, chăm sóc khách hàng và giải đáp thắc mắc.',
      features: ['Hotline 24/7', 'ACD thông minh', 'IVR tùy chỉnh', 'Ghi âm cuộc gọi', 'Báo cáo real-time', 'Tích hợp CRM'],
      process: ['Tiếp nhận cuộc gọi', 'Phân loại & Routing', 'Xử lý yêu cầu', 'Ghi nhận & Báo cáo'],
    },
    en: {
      title: 'Inbound Call Center',
      desc: 'Professional inbound call handling service, 24/7. Technical support, customer care and FAQ.',
      features: ['24/7 Hotline', 'Smart ACD', 'Custom IVR', 'Call Recording', 'Real-time Reports', 'CRM Integration'],
      process: ['Receive Call', 'Classification & Routing', 'Handle Request', 'Log & Report'],
    },
  },
  outbound: {
    vi: {
      title: 'Call Center Outbound',
      desc: 'Dịch vụ gọi ra chuyên nghiệp: telesales, khảo sát, nhắc lịch, chăm sóc khách hàng chủ động.',
      features: ['Auto-dialer', 'Telesales B2B/B2C', 'Khảo sát thị trường', 'Nhắc nhở thanh toán', 'Chăm sóc sau bán', 'Lead Generation'],
      process: ['Lập danh sách', 'Gọi ra tự động', 'Xử lý phản hồi', 'Báo cáo kết quả'],
    },
    en: {
      title: 'Outbound Call Center',
      desc: 'Professional outbound calling: telesales, surveys, payment reminders, proactive customer care.',
      features: ['Auto-dialer', 'B2B/B2C Telesales', 'Market Surveys', 'Payment Reminders', 'After-sales Care', 'Lead Generation'],
      process: ['Build Contact List', 'Auto Dialing', 'Handle Responses', 'Report Results'],
    },
  },
  bpo: {
    vi: {
      title: 'Dịch vụ BPO',
      desc: 'Thuê ngoài quy trình kinh doanh toàn diện: nhập liệu, xử lý đơn hàng, back-office, kế toán.',
      features: ['Nhập liệu', 'Xử lý đơn hàng', 'Dịch vụ back-office', 'Kế toán thuê ngoài', 'HR outsourcing', 'Tuân thủ & Báo cáo'],
      process: ['Tiếp nhận quy trình', 'Chuẩn hóa & Đào tạo', 'Vận hành', 'Kiểm soát chất lượng'],
    },
    en: {
      title: 'BPO Services',
      desc: 'Comprehensive business process outsourcing: data entry, order processing, back-office, accounting.',
      features: ['Data Entry', 'Order Processing', 'Back-office Services', 'Accounting Outsourcing', 'HR Outsourcing', 'Compliance & Reporting'],
      process: ['Process Intake', 'Standardize & Train', 'Operations', 'Quality Control'],
    },
  },
  ai: {
    vi: {
      title: 'Giải pháp AI',
      desc: 'Ứng dụng trí tuệ nhân tạo vào Call Center: chatbot, phân tích cảm xúc, voice bot, tự động hóa.',
      features: ['AI Chatbot', 'Voice Bot', 'Phân tích cảm xúc', 'Auto-IVR AI', 'Predictive Analytics', 'Quality Monitoring AI'],
      process: ['Phân tích nhu cầu', 'Triển khai AI', 'Huấn luyện mô hình', 'Tối ưu liên tục'],
    },
    en: {
      title: 'AI Solutions',
      desc: 'Apply AI to Call Centers: chatbot, sentiment analysis, voice bot, process automation.',
      features: ['AI Chatbot', 'Voice Bot', 'Sentiment Analysis', 'AI Auto-IVR', 'Predictive Analytics', 'AI Quality Monitoring'],
      process: ['Analyze Needs', 'Deploy AI', 'Model Training', 'Continuous Optimization'],
    },
  },
};

interface Props {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = services[params.slug];
  if (!s) return { title: 'Service Not Found' };
  return { title: `${params.locale === 'vi' ? s.vi.title : s.en.title} - VietMy SSU` };
}

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export default function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const service = services[slug];
  if (!service) return notFound();

  const s = locale === 'vi' ? service.vi : service.en;

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom max-w-4xl">
        <Link href={`/${locale}/services`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--primary)] mb-8 transition-colors text-sm">
          <ArrowLeft size={16} />
          {locale === 'vi' ? 'Quay lại dịch vụ' : 'Back to services'}
        </Link>

        <div className="bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] rounded-3xl p-10 text-white mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-4">{s.title}</h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">{s.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              {locale === 'vi' ? 'Tính năng nổi bật' : 'Key Features'}
            </h2>
            <ul className="space-y-3">
              {s.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              {locale === 'vi' ? 'Quy trình triển khai' : 'Implementation Process'}
            </h2>
            <ol className="space-y-4">
              {s.process.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-[var(--primary)] font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-gray-600 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {locale === 'vi' ? 'Sẵn sàng bắt đầu?' : 'Ready to get started?'}
          </h3>
          <p className="text-gray-500 mb-6">
            {locale === 'vi' ? 'Liên hệ với chúng tôi để được tư vấn miễn phí.' : 'Contact us for a free consultation.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-2 bg-[var(--primary)] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
            >
              {locale === 'vi' ? 'Liên hệ tư vấn' : 'Contact for consultation'}
            </Link>
            <a
              href="tel:19001234"
              className="flex items-center gap-2 border-2 border-[var(--primary)] text-[var(--primary)] font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
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
