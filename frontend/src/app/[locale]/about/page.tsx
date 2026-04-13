import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Users, Building2, Award, TrendingUp } from 'lucide-react';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.locale === 'vi' ? 'Giới thiệu - VietMy SSU' : 'About Us - VietMy SSU',
    description: params.locale === 'vi'
      ? 'Tìm hiểu về VietMy SSU - Đơn vị cung cấp giải pháp Call Center hàng đầu Việt Nam'
      : 'Learn about VietMy SSU - Vietnam\'s leading Call Center solutions provider',
  };
}

export default function AboutPage({ params }: Props) {
  const { locale } = params;
  const isVi = locale === 'vi';

  const stats = [
    { icon: <TrendingUp size={28} />, value: '10+', label: isVi ? 'Năm kinh nghiệm' : 'Years of experience' },
    { icon: <Users size={28} />, value: '500+', label: isVi ? 'Khách hàng tin tưởng' : 'Trusted clients' },
    { icon: <Building2 size={28} />, value: '3', label: isVi ? 'Chi nhánh toàn quốc' : 'National branches' },
    { icon: <Award size={28} />, value: '50+', label: isVi ? 'Giải thưởng ngành' : 'Industry awards' },
  ];

  const values = isVi
    ? ['Chất lượng dịch vụ hàng đầu', 'Công nghệ tiên tiến', 'Đội ngũ chuyên nghiệp', 'Hỗ trợ 24/7', 'Cam kết bảo mật', 'Linh hoạt & Tùy chỉnh']
    : ['Top-quality service', 'Advanced technology', 'Professional team', '24/7 support', 'Security commitment', 'Flexible & Customizable'];

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            {isVi ? 'Về VietMy SSU' : 'About VietMy SSU'}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            {isVi
              ? 'VietMy SSU là đơn vị tiên phong trong lĩnh vực Call Center và BPO tại Việt Nam, với hơn 10 năm kinh nghiệm phục vụ hơn 500 doanh nghiệp trong và ngoài nước.'
              : 'VietMy SSU is a pioneer in Call Center and BPO services in Vietnam, with over 10 years of experience serving more than 500 domestic and international businesses.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-[var(--primary)] flex justify-center mb-3">{stat.icon}</div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{isVi ? 'Sứ mệnh' : 'Mission'}</h2>
            <p className="text-blue-100 leading-relaxed">
              {isVi
                ? 'Cung cấp giải pháp Call Center và BPO chất lượng cao, giúp doanh nghiệp Việt Nam nâng cao trải nghiệm khách hàng và tối ưu hóa chi phí vận hành.'
                : 'Provide high-quality Call Center and BPO solutions, helping Vietnamese businesses enhance customer experience and optimize operational costs.'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{isVi ? 'Tầm nhìn' : 'Vision'}</h2>
            <p className="text-gray-500 leading-relaxed">
              {isVi
                ? 'Trở thành đối tác Call Center & BPO số 1 tại Đông Nam Á vào năm 2030, ứng dụng công nghệ AI tiên tiến để mang lại dịch vụ vượt trội.'
                : 'Become the #1 Call Center & BPO partner in Southeast Asia by 2030, applying advanced AI technology to deliver superior services.'}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            {isVi ? 'Giá trị cốt lõi' : 'Core Values'}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {values.map((value, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                <span className="font-medium text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            {isVi ? 'Hợp tác cùng chúng tôi' : 'Partner With Us'}
          </h2>
          <p className="text-gray-500 mb-8">
            {isVi ? 'Liên hệ để nhận tư vấn miễn phí từ đội ngũ chuyên gia' : 'Contact us for a free consultation from our expert team'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-[var(--primary)] text-white font-bold px-10 py-3.5 rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
          >
            {isVi ? 'Liên hệ ngay' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </div>
  );
}
