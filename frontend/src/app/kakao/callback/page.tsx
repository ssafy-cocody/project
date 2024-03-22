'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { setAccessToken } from '@/services';
import * as auth from '@/services/auth';

enum userRole {
  GUEST = 'guest',
}

const Page = () => {
  const router = useRouter();

  const login = async () => {
    try {
      const data = await auth.fetchUserInfo();
      const role = 'guest';

      setAccessToken(data.accesstoken);
      if (role === userRole.GUEST) {
        router.push('/signup');
        return;
      }

      router.push('/');
    } catch (e) {
      // TODO 로그인 실패
      window.alert('로그인에 실패했습니다.');
      console.log(e);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return <>로그인 중입니다...</>;
};

export default Page;
