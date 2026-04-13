'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Globe, ChevronDown } from 'lucide-react';
import MegaMenu from './MegaMenu';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  {
    key: 'services',
    href: '/services',
    children: [
      { key: 'inbound', href: '/services/inbound', icon: '📞' },
      { key: 'outbound', href: '/services/outbound', icon: '📤' },
      { key: 'bpo', href: '/services/bpo', icon: '🏢' },
      { key: 'ai', href: '/services/ai', icon: '🤖' },
    ],
  },
  { key: 'news', href: '/news' },
  { key: 'jobs', href: '/jobs' },
  { key: 'contact', href: '/contact' },
];

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const otherLocale = locale === 'vi' ? 'en' : 'vi';
  const switchLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const isActive = (href: string) => {
    const fullHref = `/${locale}${href}`;
    return pathname === fullHref || (href !== '/' && pathname.startsWith(fullHref));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div className="bg-[var(--primary)] text-white py-1.5 text-sm hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Phone size={14} />
            <a href="tel:19001234" className="hover:text-yellow-300 transition-colors">
              1900 1234
            </a>
            <span className="mx-2">|</span>
            <a href="mailto:info@vietmy.com" className="hover:text-yellow-300 transition-colors">
              info@vietmy.com
            </a>
          </span>
          <Link
            href={switchLocalePath}
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Globe size={14} />
            {otherLocale.toUpperCase()}
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container-custom flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">V</span>
          </div>
          <div>
            <span className="font-black text-xl text-[var(--primary)]">VietMy</span>
            <span className="font-light text-sm text-gray-500 block leading-none">SSU Call Center</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li
              key={item.key}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.key)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={`/${locale}${item.href}`}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-[var(--primary)] bg-blue-50'
                    : isScrolled
                    ? 'text-gray-700 hover:text-[var(--primary)] hover:bg-blue-50'
                    : 'text-gray-700 hover:text-[var(--primary)] hover:bg-white/20'
                }`}
              >
                {item.children ? t(`${item.key}.label`) : t(item.key)}
                {item.children && <ChevronDown size={14} className={`transition-transform ${openDropdown === item.key ? 'rotate-180' : ''}`} />}
              </Link>
              {item.children && openDropdown === item.key && (
                <MegaMenu items={item.children} locale={locale} t={t} />
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={`/${locale}/contact`}
            className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors"
          >
            {t('getStarted')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="container-custom py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.key}>
                  <Link
                    href={`/${locale}${item.href}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[var(--primary)] bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.children ? t(`${item.key}.label`) : t(item.key)}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          href={`/${locale}${child.href}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[var(--primary)] rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <span>{child.icon}</span>
                          {t(`services.${child.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <Link
                  href={switchLocalePath}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-[var(--primary)]"
                >
                  <Globe size={16} />
                  {otherLocale.toUpperCase()}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-semibold text-sm"
                >
                  {t('getStarted')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
