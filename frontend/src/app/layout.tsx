import '@/styles/globals.scss';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Co.Cody',
  description: 'Your AI Stylist',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
