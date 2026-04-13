import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import ClientLogos from '@/components/home/ClientLogos';
import NewsSection from '@/components/home/NewsSection';
import CTASection from '@/components/home/CTASection';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <FeaturedJobs />
      <ClientLogos />
      <NewsSection />
      <CTASection />
    </>
  );
}
