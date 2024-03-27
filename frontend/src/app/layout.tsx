import '@/styles/globals.scss';

import type { Metadata, Viewport } from 'next';

import Provider from '@/utils/Provider';

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
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
};

export default RootLayout;
