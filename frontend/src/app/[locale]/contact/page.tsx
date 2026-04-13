import type { Metadata } from 'next';
import ContactPageClient from '@/components/contact/ContactPageClient';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: locale === 'vi' ? 'Liên hệ - VietMy SSU' : 'Contact - VietMy SSU',
    description: locale === 'vi' ? 'Liên hệ với VietMy SSU để được tư vấn dịch vụ Call Center và BPO.' : 'Contact VietMy SSU for Call Center and BPO service consultation.',
  };
}

export default function ContactPage() {
  return <ContactPageClient />;
}
