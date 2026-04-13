import JobDetailClient from '@/components/jobs/JobDetailClient';

interface Props {
  params: { locale: string; id: string };
}

export default function JobDetailPage({ params }: Props) {
  return <JobDetailClient id={params.id} locale={params.locale} />;
}
