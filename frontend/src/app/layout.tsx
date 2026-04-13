import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VietMy SSU - Call Center Solutions',
    template: '%s | VietMy SSU',
  },
  description:
    'VietMy SSU - Giải pháp Call Center và BPO hàng đầu Việt Nam. Dịch vụ chuyên nghiệp, công nghệ tiên tiến.',
  keywords: 'call center, BPO, VietMy, contact center, outsourcing',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'VietMy SSU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
