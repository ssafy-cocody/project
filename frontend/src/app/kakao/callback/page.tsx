'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { setAccessToken } from '@/services';
import * as auth from '@/services/auth';
import { userRole } from '@/services/auth';

const Page = () => {
  const router = useRouter();

  const signin = async () => {
    try {
      const data = await auth.fetchUserInfo();
      const role = data.role!;
      const accessToken = data.accessToken!;

      setAccessToken(accessToken);

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
    signin();
  }, []);

  return <>로그인 중입니다...</>;
};

export default Page;
