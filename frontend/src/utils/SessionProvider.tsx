'use client';

import { useEffect } from 'react';

import useSession from '@/hooks/useSession';

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { getSession, session } = useSession();

  useEffect(() => {
    if (session) return;
    // 마운트시 토큰 fetch
    getSession();
  }, [getSession, session]);

  return <> {children} </>;
};

export default SessionProvider;
