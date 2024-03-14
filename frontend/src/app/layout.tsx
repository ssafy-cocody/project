import type { Metadata } from 'next';
import type { Viewport } from 'next';
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
    <html>
      <body>{children}</body>
    </html>
  );
}
