'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { setAccessToken } from '@/services';

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const getAccesToken = async () => {
    try {
      const response = await fetch('/api/auth/cookie');
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
    } catch (error) {
      router.push('/signin');
    }
  };

  useEffect(() => {
    // 마운트시 토큰 fetch
    getAccesToken();
  }, []);

  return <> {children} </>;
};

export default SessionProvider;
