'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Facebook, Linkedin, Youtube, ExternalLink } from 'lucide-react';

const branches = [
  {
    id: 'hanoi',
    name: 'Hà Nội',
    nameEn: 'Hanoi',
    address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    addressEn: '123 Nguyen Trai, Thanh Xuan, Hanoi',
    phone: '(024) 3456 7890',
    email: 'hanoi@vietmy.com',
    mapUrl: 'https://maps.google.com/?q=Hanoi+Vietnam',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59587.97785522965!2d105.80419!3d21.02278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lp!5e0!3m2!1svi!2svn',
  },
  {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    nameEn: 'Ho Chi Minh City',
    address: '456 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    addressEn: '456 Dien Bien Phu, Binh Thanh, Ho Chi Minh City',
    phone: '(028) 3456 7890',
    email: 'hcm@vietmy.com',
    mapUrl: 'https://maps.google.com/?q=Ho+Chi+Minh+City+Vietnam',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125412.45!2d106.629664!3d10.8230989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2svn',
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    nameEn: 'Da Nang',
    address: '789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    addressEn: '789 Nguyen Van Linh, Hai Chau, Da Nang',
    phone: '(0236) 3456 7890',
    email: 'danang@vietmy.com',
    mapUrl: 'https://maps.google.com/?q=Da+Nang+Vietnam',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61096.50!2d108.17!3d16.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252229%3A0xb70c0f0ec50d3cff!2zxJDDoCBO4bq1bmc!5e0!3m2!1svi!2svn',
  },
];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const [activeBranch, setActiveBranch] = useState(branches[0]);

  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      {/* Map Section */}
      <div className="border-b border-gray-700">
        <div className="container-custom py-10">
          <h3 className="text-white font-bold text-xl mb-6 text-center">
            {locale === 'vi' ? 'Hệ thống chi nhánh' : 'Our Branch Network'}
          </h3>

          {/* Branch Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => setActiveBranch(branch)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                  activeBranch.id === branch.id
                    ? 'bg-[var(--primary)] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <MapPin size={14} />
                {locale === 'vi' ? branch.name : branch.nameEn}
              </button>
            ))}
          </div>

          {/* Branch Info + Map */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">
                {locale === 'vi' ? activeBranch.name : activeBranch.nameEn}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <span className="text-sm">
                    {locale === 'vi' ? activeBranch.address : activeBranch.addressEn}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[var(--accent)] shrink-0" />
                  <a href={`tel:${activeBranch.phone}`} className="text-sm hover:text-white transition-colors">
                    {activeBranch.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[var(--accent)] shrink-0" />
                  <a href={`mailto:${activeBranch.email}`} className="text-sm hover:text-white transition-colors">
                    {activeBranch.email}
                  </a>
                </div>
              </div>
              <a
                href={activeBranch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] text-sm font-semibold hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                {locale === 'vi' ? 'Xem trên Google Maps' : 'View on Google Maps'}
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden h-[250px]">
              <iframe
                src={activeBranch.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${activeBranch.name}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">V</span>
              </div>
              <div>
                <span className="font-black text-lg text-white">VietMy SSU</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {locale === 'vi'
                ? 'Giải pháp Call Center & BPO hàng đầu Việt Nam với hơn 10 năm kinh nghiệm.'
                : "Vietnam's leading Call Center & BPO solutions with over 10 years of experience."}
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[var(--primary)] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-white font-bold mb-4">
              {locale === 'vi' ? 'Dịch vụ' : 'Services'}
            </h5>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Call Center Inbound', href: '/services/inbound' },
                { label: 'Call Center Outbound', href: '/services/outbound' },
                { label: 'BPO Services', href: '/services/bpo' },
                { label: 'AI Solutions', href: '/services/ai' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="hover:text-white transition-colors hover:pl-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-white font-bold mb-4">
              {locale === 'vi' ? 'Công ty' : 'Company'}
            </h5>
            <ul className="space-y-2 text-sm">
              {[
                { labelVi: 'Giới thiệu', labelEn: 'About Us', href: '/about' },
                { labelVi: 'Tin tức', labelEn: 'News', href: '/news' },
                { labelVi: 'Tuyển dụng', labelEn: 'Careers', href: '/jobs' },
                { labelVi: 'Liên hệ', labelEn: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="hover:text-white transition-colors hover:pl-1 inline-block"
                  >
                    {locale === 'vi' ? item.labelVi : item.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-bold mb-4">
              {locale === 'vi' ? 'Liên hệ' : 'Contact'}
            </h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--accent)] shrink-0" />
                <a href="tel:19001234" className="hover:text-white transition-colors">1900 1234</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--accent)] shrink-0" />
                <a href="mailto:info@vietmy.com" className="hover:text-white transition-colors">info@vietmy.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <span>© 2024 VietMy SSU. {locale === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}</span>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
              {locale === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
              {locale === 'vi' ? 'Điều khoản sử dụng' : 'Terms of Service'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
