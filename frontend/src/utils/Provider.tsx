'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import SessionProvider from '@/utils/SessionProvider';

const queryClient = new QueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};

export default Provider;
