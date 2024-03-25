'use client';

import { useEffect } from 'react';

import useSession from '@/hooks/useSession';

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { getSession } = useSession();

  useEffect(() => {
    // 마운트시 토큰 fetch
    getSession();
  }, []);

  return <> {children} </>;
};

export default SessionProvider;
