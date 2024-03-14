import type { Metadata, Viewport } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Co.Cody',
  description: 'Your AI Stylist',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
