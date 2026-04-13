import type { Metadata } from 'next';
import JobsListPage from '@/components/jobs/JobsListPage';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: locale === 'vi' ? 'Tuyển dụng - VietMy SSU' : 'Careers - VietMy SSU',
    description: locale === 'vi' ? 'Cơ hội việc làm hấp dẫn tại VietMy SSU Call Center.' : 'Exciting career opportunities at VietMy SSU Call Center.',
  };
}

export default function JobsPage() {
  return <JobsListPage />;
}
