import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import NewsListPage from '@/components/news/NewsListPage';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: locale === 'vi' ? 'Tin tức - VietMy SSU' : 'News - VietMy SSU',
    description: locale === 'vi' ? 'Tin tức mới nhất về ngành Call Center và BPO từ VietMy SSU.' : 'Latest news about Call Center and BPO industry from VietMy SSU.',
  };
}

export default function NewsPage() {
  return <NewsListPage />;
}
