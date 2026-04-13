import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsDetailClient from '@/components/news/NewsDetailClient';

interface Props {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.slug.replace(/-/g, ' '),
  };
}

export default function NewsDetailPage({ params }: Props) {
  return <NewsDetailClient slug={params.slug} locale={params.locale} />;
}
